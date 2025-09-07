from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Load YOLO model from relative path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "best.pt")
model = YOLO(MODEL_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Save file temporarily in memory
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes))

    # Run YOLO prediction
    results = model.predict(img, conf=0.4)

    # Draw results on image
    res_plotted = results[0].plot()  # numpy array (BGR)
    res_rgb = cv2.cvtColor(res_plotted, cv2.COLOR_BGR2RGB)

    # Convert to bytes for sending back
    _, buffer = cv2.imencode(".jpg", res_rgb)
    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype="image/jpeg",
        as_attachment=False,
        download_name="result.jpg"
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
