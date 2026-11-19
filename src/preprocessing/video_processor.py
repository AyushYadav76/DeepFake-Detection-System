
import cv2
import numpy as np

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

UPLOAD_DIR = PROJECT_ROOT / "uploads"
FRAME_DIR = PROJECT_ROOT / "outputs" / "frames"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
FRAME_DIR.mkdir(parents=True, exist_ok=True)


def extract_video_frames(video_path, num_frames=10):
    """
    Extract uniformly sampled frames from a video.

    Returns:
        List of dictionaries containing frame index and saved path.
    """

    video_path = Path(video_path)

    if not video_path.exists():
        raise FileNotFoundError(
            f"Video not found: {video_path}"
        )

    cap = cv2.VideoCapture(str(video_path))

    if not cap.isOpened():
        raise ValueError("Unable to open the video file.")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames <= 0:
        cap.release()
        raise ValueError("Video contains no readable frames.")

    # Sample uniformly across the video
    frame_indices = np.linspace(
        0,
        total_frames - 1,
        num_frames,
        dtype=int
    )

    extracted_frames = []

    # Unique folder for this video's extracted frames
    video_output_dir = FRAME_DIR / video_path.stem
    video_output_dir.mkdir(parents=True, exist_ok=True)

    for position, frame_index in enumerate(frame_indices):

        cap.set(cv2.CAP_PROP_POS_FRAMES, int(frame_index))

        success, frame = cap.read()

        if not success:
            print(f"Warning: Could not read frame {frame_index}")
            continue

        frame_path = (
            video_output_dir / f"frame_{position:02d}.jpg"
        )

        saved = cv2.imwrite(str(frame_path), frame)

        if saved:
            extracted_frames.append({
                "frame_index": int(frame_index),
                "image_path": str(frame_path)
            })

    cap.release()

    if not extracted_frames:
        raise ValueError("No frames could be extracted.")

    print("========== VIDEO PROCESSING ==========")
    print("Video:", video_path.name)
    print("Total video frames:", total_frames)
    print("Requested frames:", num_frames)
    print("Successfully extracted:", len(extracted_frames))

    return extracted_frames


if __name__ == "__main__":
    print("Video processor module ready.")
    print("Upload directory:", UPLOAD_DIR)
    print("Frame output directory:", FRAME_DIR)
