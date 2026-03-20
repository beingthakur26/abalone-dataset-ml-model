"""
Flask API for Abalone Age Prediction
Endpoint: POST /predict
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # allows React frontend to call this API

# ── Load model once at startup ───────────────────────────────────────────────
MODEL_PATH = os.path.join("model", "abalone_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Model not found! Run 'python train_and_save.py' first."
    )

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

print("✅  Model loaded successfully")


# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Abalone API is running 🐚"})


# ── Prediction endpoint ───────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate all fields are present
        required = [
            "sex", "length", "diameter", "height",
            "whole_weight", "shucked_weight", "viscera_weight", "shell_weight"
        ]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Build feature array — same order as training columns
        features = np.array([[
            float(data["sex"]),
            float(data["length"]),
            float(data["diameter"]),
            float(data["height"]),
            float(data["whole_weight"]),
            float(data["shucked_weight"]),
            float(data["viscera_weight"]),
            float(data["shell_weight"])
        ]])

        # Predict (no scaler — model was trained on raw features)
        rings = int(model.predict(features)[0])
        age   = round(rings + 1.5, 1)

        return jsonify({"rings": rings, "age": age})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
