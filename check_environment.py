import sys
import cv2  # pyright: ignore[reportMissingImports]
import numpy as np  # pyright: ignore[reportMissingImports]
import pandas as pd  # pyright: ignore[reportMissingModuleSource]
import sklearn  # pyright: ignore[reportMissingModuleSource]
import streamlit as st  # pyright: ignore[reportMissingImports]

print("=" * 45)
print("DEEPFAKESHIELD ENVIRONMENT CHECK")
print("=" * 45)

print("Python:", sys.version)
print("OpenCV:", cv2.__version__)
print("NumPy:", np.__version__)
print("Pandas:", pd.__version__)
print("Scikit-learn:", sklearn.__version__)
print("Streamlit:", st.__version__)

try:
    import tensorflow as tf  # pyright: ignore[reportMissingImports, reportMissingModuleSource]

    print("TensorFlow:", tf.__version__)
    print("Available GPUs:", tf.config.list_physical_devices("GPU"))

except Exception as e:
    print("TensorFlow error:", e)

print("\nEnvironment verification completed.")