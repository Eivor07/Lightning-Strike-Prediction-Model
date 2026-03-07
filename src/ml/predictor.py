import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib
import os

class LightningPredictor:
    def __init__(self, model_path, dataset_path=None):
        self.model = tf.keras.models.load_model(model_path)
        self.scaler = StandardScaler()
        self.kmeans = None
        self.zone_map = {}
        
        if dataset_path:
            self._fit_preprocessors(dataset_path)

    def _fit_preprocessors(self, dataset_path):
        """Fit KMeans and Scaler based on historical dataset."""
        df = pd.read_csv(dataset_path)
        df = df.dropna()
        
        # Preprocessing matching the training script
        df.rename(columns={'lat': 'latitude', 'lon': 'longitude'}, inplace=True)
        
        # Fit KMeans for spatial clustering
        coords = df[['latitude', 'longitude']]
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        df['zone'] = self.kmeans.fit_predict(coords)
        
        # Map zones by density (Red = High count)
        zone_counts = df['zone'].value_counts().sort_values(ascending=False)
        self.zone_map = {
            zone_counts.index[0]: 'Red', 
            zone_counts.index[1]: 'Orange', 
            zone_counts.index[2]: 'Yellow'
        }
        
        # Prepare features for scaling
        features = ['latitude', 'longitude', 'year', 'month']
        
        # Add year/month if missing in input
        if 'year' not in df.columns: df['year'] = 2026
        if 'month' not in df.columns: df['month'] = 3
            
        X = df[features]
        self.scaler.fit(X)

    def predict_risk(self, data):
        """
        Predict risk for a single location or batch.
        """
        df = pd.DataFrame(data)
        
        # Spatial Clustering
        coords = df[['latitude', 'longitude']]
        df['zone'] = self.kmeans.predict(coords)
        df['zone_label'] = df['zone'].map(self.zone_map)
        
        # CNN Inference
        features = ['latitude', 'longitude', 'year', 'month']
        if 'year' not in df.columns: df['year'] = 2026
        if 'month' not in df.columns: df['month'] = 3

        X_scaled = self.scaler.transform(df[features])
        X_reshaped = X_scaled.reshape(-1, len(features), 1, 1)
        
        probabilities = self.model.predict(X_reshaped).flatten()
        
        results = []
        for i, prob in enumerate(probabilities):
            results.append({
                'latitude': float(df.iloc[i]['latitude']),
                'longitude': float(df.iloc[i]['longitude']),
                'zone_risk': df.iloc[i]['zone_label'],
                'cnn_probability': float(prob),
                'risk_level': 'High' if prob > 0.5 or df.iloc[i]['zone_label'] == 'Red' else 'Moderate' if prob > 0.2 else 'Low'
            })
            
        return results

    def get_cluster_centers(self):
        """Returns the geographical centers of the risk zones."""
        centers = []
        for i, center in enumerate(self.kmeans.cluster_centers_):
            label = self.zone_map.get(i, 'Unknown')
            centers.append({
                'latitude': float(center[0]),
                'longitude': float(center[1]),
                'label': label
            })
        return centers
