
from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from src.inference.model_loader import load_model

DEVICE = torch.device("cpu")

# Threshold selected using the validation dataset
FAKE_THRESHOLD = 0.6783

# Same ImageNet normalization used during model training
TRANSFORM = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

MODEL = None


def get_model():
    global MODEL

    if MODEL is None:
        MODEL = load_model()

    return MODEL


def predict_face(image_path):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Face image not found: {image_path}")

    image = Image.open(image_path).convert("RGB")
    tensor = TRANSFORM(image).unsqueeze(0).to(DEVICE)

    model = get_model()

    with torch.inference_mode():
        logits = model(tensor)
        probability = torch.sigmoid(logits).item()

    return float(probability)


def predict_video(face_image_paths):
    if not face_image_paths:
        raise ValueError("No face crops available for prediction.")

    predictions = []

    for image_path in face_image_paths:
        probability = predict_face(image_path)

        predictions.append({
            "image_path": str(image_path),
            "fake_probability": probability
        })

    probabilities = sorted(
        [item["fake_probability"] for item in predictions],
        reverse=True
    )

    # Average the highest three frame probabilities
    top_predictions = probabilities[:3]
    video_probability = sum(top_predictions) / len(top_predictions)

    label = (
        "FAKE"
        if video_probability >= FAKE_THRESHOLD
        else "REAL"
    )

    return {
        "prediction": label,
        "fake_probability": round(video_probability, 4),
        "threshold": FAKE_THRESHOLD,
        "frames_analyzed": len(predictions),
        "frame_predictions": predictions
    }
