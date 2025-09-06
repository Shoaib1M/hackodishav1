# noicelens_ml-service/audio_classifier.py

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv
from scipy.io import wavfile
import scipy.signal
import os

print("Loading YAMNet model from TensorFlow Hub...")
model = hub.load('https://tfhub.dev/google/yamnet/1')
print("YAMNet model loaded successfully.")


def load_class_names(class_map_csv_text):
    class_names = []
    with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            class_names.append(row['display_name'])
    return class_names


class_map_path = model.class_map_path().numpy()
class_names = load_class_names(class_map_path)


def ensure_sample_rate(original_rate, waveform, desired_rate=16000):
    if original_rate != desired_rate:
        desired_length = int(
            round(len(waveform) * (desired_rate / float(original_rate))))
        waveform = scipy.signal.resample(waveform, desired_length)
    return waveform


def classify_audio(filepath):
    sample_rate, waveform = wavfile.read(filepath, mmap=False)
    waveform = ensure_sample_rate(sample_rate, waveform)

    waveform_float = tf.cast(waveform, tf.float32)
    normal_waveform = waveform_float / tf.int16.max

    if len(normal_waveform.shape) > 1:
        normal_waveform = tf.reduce_mean(normal_waveform, axis=1)

    scores, _, _ = model(normal_waveform)
    mean_scores = np.mean(scores.numpy(), axis=0)

    class_scores = {class_names[i]: score for i,
                    score in enumerate(mean_scores)}
    sorted_class_scores = sorted(
        class_scores.items(), key=lambda item: item[1], reverse=True)

    filtered_classes = [(n, s) for n, s in sorted_class_scores if n not in [
        "Silence", "Sound effect"]]
    top_10_classes = filtered_classes[:10]

    total_score = sum(score for _, score in top_10_classes)
    top_classes_normalized = [
        (n, float((s / total_score) * 100)) for n, s in top_10_classes
    ] if total_score > 0 else []

    rms = np.sqrt(np.mean(waveform.astype(np.float64)**2))
    decibel_level = 20 * np.log10(rms + 1e-9) + 90

    return top_classes_normalized, float(round(decibel_level, 1))
