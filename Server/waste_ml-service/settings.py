from pathlib import Path
import sys

# Get the absolute path of the current file
file_path = Path(__file__).resolve()

# Root path = parent of this file (the project folder)
root_path = file_path.parent

# Add root path to sys.path
if root_path not in sys.path:
    sys.path.append(str(root_path))

# Define ROOT for relative paths
ROOT = root_path

# Sources
IMAGE = 'Image'
WEBCAM = 'Webcam'

SOURCES_LIST = [IMAGE, WEBCAM]

# Images config
IMAGES_DIR = ROOT / 'images'
DEFAULT_IMAGE = IMAGES_DIR / 'def.jfif'
DEFAULT_DETECT_IMAGE = IMAGES_DIR / 'def1.jpg'

# Videos config
VIDEO_DIR = ROOT / 'videos'
VIDEO_1_PATH = VIDEO_DIR / 'video_1.mp4'
VIDEO_2_PATH = VIDEO_DIR / 'video_2.mp4'
VIDEO_3_PATH = VIDEO_DIR / 'video_3.mp4'
VIDEO_4_PATH = VIDEO_DIR / 'video_4.mp4'
VIDEO_5_PATH = VIDEO_DIR / 'video_5.mp4'

VIDEOS_DICT = {
    'video_1': VIDEO_1_PATH,
    'video_2': VIDEO_2_PATH,
    'video_3': VIDEO_3_PATH,
    'video_4': VIDEO_4_PATH,
    'video_5': VIDEO_5_PATH,
}

# ML Model config (relative path to weights folder)
MODEL_DIR = ROOT / 'weights'
DETECTION_MODEL = MODEL_DIR / 'yolov8.pkl'

# Webcam (0 = default camera, but won’t work on Render)
WEBCAM_PATH = 0
