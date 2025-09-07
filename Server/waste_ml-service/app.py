from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load YOLO model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "best.pt")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
model = YOLO(MODEL_PATH)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Waste ML Service is running ✅"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        # Run YOLO prediction
        results = model.predict(img, conf=0.4)

        # Draw results
        res_plotted = results[0].plot()  # numpy array (BGR)

        # Encode as JPEG
        _, buffer = cv2.imencode(".jpg", res_plotted)

        return send_file(
            io.BytesIO(buffer.tobytes()),
            mimetype="image/jpeg",
            as_attachment=False,
            download_name="result.jpg"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
