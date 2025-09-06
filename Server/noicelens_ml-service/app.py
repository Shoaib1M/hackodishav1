# noicelens_ml-service/app.py

from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from audio_classifier import classify_audio
from utils import save_uploaded_file, plot_pie_chart
import uuid

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        filepath = save_uploaded_file(file)
        top_classes, decibel = classify_audio(filepath)

        chart_filename = f"{uuid.uuid4().hex}.png"
        chart_path = plot_pie_chart(top_classes, chart_filename)

        chart_url = request.host_url.rstrip(
            '/') + url_for('static', filename=f'charts/{chart_filename}') if chart_path else None

        safety = []
        if decibel > 85:
            safety.append(
                f"DANGER ({decibel} dB): High noise! Can cause hearing damage.")
            safety.append("Recommendation: Use hearing protection.")
        elif decibel > 70:
            safety.append(f"CAUTION ({decibel} dB): Moderate noise.")
            safety.append("Recommendation: Take breaks in quiet areas.")
        else:
            safety.append(f"SAFE ({decibel} dB): Low noise level.")

        return jsonify({
            "results": top_classes,
            "decibel": decibel,
            "chart_url": chart_url,
            "safety_tips": safety
        })
    except Exception as e:
        import traceback
        traceback.print_exc()   # <--- full error details in your terminal
        return jsonify({"error": str(e)}), 500  # <--- returns actual error in response


if __name__ == "__main__":
    app.run(debug=True, port=5000)
