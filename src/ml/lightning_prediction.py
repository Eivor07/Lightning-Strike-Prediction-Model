# -*- coding: utf-8 -*-
"""
Lightning Strike Prediction & Hot Zone Detection using CNN + Clustering
Refactored for local execution.
"""

import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
import tensorflow as tf
from tensorflow.keras import layers, models

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_PATH = os.path.join(BASE_DIR, 'data', 'lightning-strikes-20012016.csv')
MODEL_SAVE_PATH = os.path.join(BASE_DIR, 'src', 'ml', 'lightning_zone_model.h5')

# STEP 1: Load Data
if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

print(f"✅ Loading dataset from {DATASET_PATH}...")
df = pd.read_csv(DATASET_PATH)

# STEP 2: Preprocessing
print("\n🔄 Preprocessing data...")
df = df.dropna()
# Dataset has: lon,lat,year,month
df.rename(columns={'lat': 'latitude', 'lon': 'longitude'}, inplace=True)

# STEP 3: Clustering
print("\n📍 Performing KMeans clustering...")
coords = df[['latitude', 'longitude']]
kmeans = KMeans(n_clusters=3, random_state=42)
df['zone'] = kmeans.fit_predict(coords)

# Label zones by density
zone_counts = df['zone'].value_counts().sort_values(ascending=False)
zone_map = {zone_counts.index[0]: 'Red', zone_counts.index[1]: 'Orange', zone_counts.index[2]: 'Yellow'}
df['zone_label'] = df['zone'].map(zone_map)

print("\n📍 Zone Summary:")
print(df.groupby('zone_label').size())

# STEP 4: Feature Scaling & Data Prep
print("\n⚙️ Scaling features...")
# Using available features
features = ['latitude', 'longitude', 'year', 'month']
X = df[features]
y = (df['zone_label'] == 'Red').astype(int)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_reshaped = X_scaled.reshape(-1, len(features), 1, 1)
X_train, X_test, y_train, y_test = train_test_split(X_reshaped, y, test_size=0.2, random_state=42)

# STEP 5: CNN Model
print("\n🧠 Training CNN model...")
model = models.Sequential([
    layers.Conv2D(32, (2, 1), activation='relu', input_shape=(len(features), 1, 1)),
    layers.MaxPooling2D((1, 1)),
    layers.Conv2D(64, (2, 1), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Faster training for simplified model
model.fit(X_train, y_train, epochs=3, batch_size=1024, validation_split=0.2)

test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"\n✅ Final Accuracy: {test_acc * 100:.2f}%")

# STEP 6: Save Model
model.save(MODEL_SAVE_PATH)
print(f"\n💾 CNN Model saved as '{MODEL_SAVE_PATH}'")

print("\n✅ TRAINING COMPLETE")