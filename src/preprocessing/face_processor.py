
import cv2
import numpy as np

from pathlib import Path
from deepface import DeepFace


CONFIDENCE_THRESHOLD = 0.90
CROP_SCALE = 1.7
IMAGE_SIZE = 224
JPEG_QUALITY = 95

PROJECT_ROOT = Path(__file__).resolve().parents[2]
FACE_DIR = PROJECT_ROOT / "outputs" / "faces"

FACE_DIR.mkdir(parents=True, exist_ok=True)


def detect_and_crop_face(image_path, output_path):
    """
    Detect faces using RetinaFace and save the largest
    valid face using the training preprocessing strategy.
    """

    image_path = Path(image_path)
    output_path = Path(output_path)

    image = cv2.imread(str(image_path))

    if image is None:
        raise ValueError(f"Unable to read image: {image_path}")

    # Detect faces using RetinaFace
    detections = DeepFace.extract_faces(
        img_path=str(image_path),
        detector_backend="retinaface",
        enforce_detection=False,
        align=False,
        expand_percentage=0,
        color_face="bgr",
        normalize_face=False
    )

    valid_faces = []

    for detection in detections:

        confidence = float(detection.get("confidence", 0))

        if confidence < CONFIDENCE_THRESHOLD:
            continue

        area = detection["facial_area"]

        x = int(area["x"])
        y = int(area["y"])
        width = int(area["w"])
        height = int(area["h"])

        if width <= 0 or height <= 0:
            continue

        valid_faces.append({
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "confidence": confidence,
            "area": width * height
        })

    if not valid_faces:
        return None

    # Select the largest valid detected face
    face = max(valid_faces, key=lambda item: item["area"])

    x = face["x"]
    y = face["y"]
    width = face["width"]
    height = face["height"]

    center_x = x + width / 2
    center_y = y + height / 2

    # Square crop with the same scale used during training
    side = int(round(CROP_SCALE * max(width, height)))

    x1 = int(round(center_x - side / 2))
    y1 = int(round(center_y - side / 2))
    x2 = x1 + side
    y2 = y1 + side

    # Black padding for boundaries outside the original frame
    crop = np.zeros((side, side, 3), dtype=np.uint8)

    frame_height, frame_width = image.shape[:2]

    src_x1 = max(0, x1)
    src_y1 = max(0, y1)
    src_x2 = min(frame_width, x2)
    src_y2 = min(frame_height, y2)

    dst_x1 = src_x1 - x1
    dst_y1 = src_y1 - y1
    dst_x2 = dst_x1 + (src_x2 - src_x1)
    dst_y2 = dst_y1 + (src_y2 - src_y1)

    if src_x2 <= src_x1 or src_y2 <= src_y1:
        return None

    crop[dst_y1:dst_y2, dst_x1:dst_x2] = (
        image[src_y1:src_y2, src_x1:src_x2]
    )

    # Resize to model input dimensions
    crop = cv2.resize(
        crop,
        (IMAGE_SIZE, IMAGE_SIZE),
        interpolation=cv2.INTER_AREA
    )

    # Convert BGR to RGB
    crop = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Save the extracted face
    success = cv2.imwrite(
        str(output_path),
        cv2.cvtColor(crop, cv2.COLOR_RGB2BGR),
        [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY]
    )

    if not success:
        raise IOError(f"Unable to save face crop: {output_path}")

    return {
        "image_path": str(output_path),
        "confidence": face["confidence"],
        "face_area": face["area"]
    }
