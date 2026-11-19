
from pathlib import Path

from src.preprocessing.video_processor import extract_video_frames
from src.preprocessing.face_processor import detect_and_crop_face
from src.inference.predictor import predict_video

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def analyze_video(video_path):
    video_path = Path(video_path)

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    # Step 1: Extract 10 uniformly sampled frames
    frames = extract_video_frames(video_path, num_frames=10)

    # Step 2: Detect and crop faces
    face_output_dir = (
        PROJECT_ROOT / "outputs" / "faces" / video_path.stem
    )
    face_output_dir.mkdir(parents=True, exist_ok=True)

    face_paths = []

    for index, frame in enumerate(frames):
        output_path = face_output_dir / f"frame_{index:02d}.jpg"

        result = detect_and_crop_face(
            frame["image_path"],
            output_path
        )

        if result is not None:
            face_paths.append(result["image_path"])

    if not face_paths:
        raise ValueError(
            "No faces were detected in the video."
        )

    # Step 3: Predict video authenticity
    prediction = predict_video(face_paths)

    return {
        "video_name": video_path.name,
        "prediction": prediction["prediction"],
        "fake_probability": prediction["fake_probability"],
        "threshold": prediction["threshold"],
        "frames_extracted": len(frames),
        "faces_detected": len(face_paths),
        "frames_analyzed": prediction["frames_analyzed"],
        "frame_predictions": prediction["frame_predictions"]
    }


if __name__ == "__main__":
    sample_video = (
        PROJECT_ROOT
        / "uploads"
        / "WhatsApp Video 2026-11-17 at 12.34.35.mp4"
    )

    result = analyze_video(sample_video)

    print("\n========== DEEPFAKESHIELD ANALYSIS ==========")
    for key, value in result.items():
        print(f"{key}: {value}")

