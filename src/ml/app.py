from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import LightningPredictor
import os

app = Flask(__name__)
CORS(app)

# Initialize predictor
# Note: In a real scenario, you'd load a pre-saved scaler/kmeans instead of refitting
# But for this implementation, we use the available dataset to initialize
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_PATH = os.path.join(BASE_DIR, 'data', 'lightning-strikes-20012016.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'src', 'ml', 'lightning_zone_model.h5')

# Global predictor instance
predictor = None

def load_predictor():
    global predictor
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        try:
            predictor = LightningPredictor(MODEL_PATH, DATASET_PATH if os.path.exists(DATASET_PATH) else None)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Failed to initialize predictor: {e}")
    else:
        print(f"Model file not found at {MODEL_PATH}!")

# Load immediately on startup
load_predictor()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ready", "model_loaded": predictor is not None})

@app.route('/predict', methods=['POST'])
def predict():
    if not predictor:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Expecting a list of observations or a single observation
        if isinstance(data, dict):
            data = [data]
            
        results = predictor.predict_risk(data)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/zones', methods=['GET'])
def get_zones():
    if not predictor or not predictor.kmeans:
        return jsonify({"error": "Clustering data not available"}), 500
    
    return jsonify(predictor.get_cluster_centers())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
