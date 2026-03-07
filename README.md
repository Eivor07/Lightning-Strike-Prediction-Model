# ⚡ Lightning Strike Prediction Model (LPM)

LPM is a high-performance, machine learning-driven system designed to predict lightning occurrences using meteorological parameters. By analyzing spatio-temporal datasets and real-time weather indicators (temperature, humidity, air pressure), the system identifies high-risk "Hot Zones" and provides early warnings through a modern interactive dashboard.

## 🚀 Key Features

- **Advanced ML Pipeline**: Utilizes K-Means Clustering for spatial hot zone detection and a Convolutional Neural Network (CNN) for risk classification.
- **Real-time API**: A Flask-based backend that serves low-latency predictions and cluster data.
- **Interactive Geospatial Dashboard**: A premium Next.js 15 application featuring Leaflet-integrated maps, real-time alerts, and location-based risk assessment.
- **Legacy Support**: Maintains the original India-focused dashboard for historical reference.
- **Professional Architecture**: Clean, modular directory structure optimized for scalability and DevSecOps.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Leaflet.js, Framer Motion.
- **Backend**: Flask (Python), Flask-CORS.
- **Machine Learning**: TensorFlow/Keras, Scikit-learn, Pandas, NumPy.
- **Data**: Historical lightning strike telemetry (75MB dataset).

## 📁 Repository Structure

```text
/
├── data/               # Historical lightning strike datasets (CSV)
├── docs/               # Research papers, technical reports, and presentations
├── src/
│   ├── ml/             # ML core: Training scripts, models, and Flask API
│   │   ├── app.py              # Flask Backend entry point
│   │   ├── predictor.py        # Modular inference engine
│   │   ├── lightning_prediction.py # Model training pipeline
│   │   └── lightning_zone_model.h5 # Pre-trained CNN weights
│   ├── web-app/        # Advanced Dashboard (Next.js 15 + Tailwind)
│   └── frontend-legacy/# Original Vanilla HTML/JS Dashboard (India focus)
├── tests/              # Accuracy results and performance benchmarks
└── README.md           # Project documentation
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 2. Backend Setup
```bash
# Navigate to the ML directory
cd src/ml

# Install dependencies
pip install flask flask-cors tensorflow pandas scikit-learn

# Run the API server
python app.py
```

### 3. Frontend Setup
```bash
# Navigate to the web app directory
cd src/web-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔍 Usage

1.  **Start the Backend**: Ensure the Flask server is running on `http://localhost:5000`.
2.  **Launch the Dashboard**: Open `http://localhost:3000` in your browser.
3.  **Explore Risks**: Use the interactive map to view predicted lightning hot zones across New Zealand.
4.  **Prediction Lab**: (Coming Soon) Input custom coordinates for instant model-driven risk levels.

## 📊 Verification & Results
The CNN model currently achieves high accuracy in classifying "Red" (High Risk) zones based on meteorological telemetry. Detailed performance metrics and ROC curves are located in the `tests/accuracy_results/` directory.

---
*Developed with focus on meteorological data science and geospatial visualization.*
