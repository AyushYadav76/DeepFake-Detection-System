
from pathlib import Path

import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]

CHECKPOINT_PATH = (
    PROJECT_ROOT / "models" / "efficientnet_b0_best.pth"
)

DEVICE = torch.device("cpu")


def load_model():
    """Reconstruct EfficientNet-B0 and load trained weights."""

    if not CHECKPOINT_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoint not found: {CHECKPOINT_PATH}"
        )

    # Reconstruct the original EfficientNet-B0 architecture
    model = efficientnet_b0(weights=None)

    input_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(input_features, 1)

    # Load our trusted, locally saved checkpoint
    checkpoint = torch.load(
        CHECKPOINT_PATH,
        map_location=DEVICE,
        weights_only=False
    )

    model.load_state_dict(checkpoint["model_state_dict"])

    model.to(DEVICE)
    model.eval()

    print("========== MODEL LOADED SUCCESSFULLY ==========")
    print("Architecture: EfficientNet-B0")
    print("Device:", DEVICE)
    print("Checkpoint epoch:", checkpoint["epoch"])
    print("Best validation loss:", checkpoint["best_val_loss"])
    print("Trainable parameters:", sum(
        p.numel() for p in model.parameters() if p.requires_grad
    ))

    return model


if __name__ == "__main__":
    model = load_model()
    print("Model is ready for inference.")
