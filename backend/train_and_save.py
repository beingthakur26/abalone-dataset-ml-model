"""
Run this ONCE to train the model and save it as a pickle file.
Make sure abalone.csv is inside the backend/ folder before running.

Usage:
    python train_and_save.py
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score

# ── 1. Load dataset ──────────────────────────────────────────────────────────
df = pd.read_csv("abalone.csv")
print(f"✅  Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# ── 2. Encode Sex column (M=0, F=1, I=2) ────────────────────────────────────
df["Sex"] = df["Sex"].map({"M": 0, "F": 1, "I": 2})

# ── 3. Split features and target ─────────────────────────────────────────────
x = df.drop("Rings", axis=1)
y = df["Rings"]

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42
)
print(f"✅  Train size: {len(x_train)} | Test size: {len(x_test)}")

# ── 4. Train the model ───────────────────────────────────────────────────────
dtr = DecisionTreeRegressor()
dtr.fit(x_train, y_train)

# ── 5. Evaluate ──────────────────────────────────────────────────────────────
y_pred = dtr.predict(x_test)
mse = mean_squared_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)
print(f"✅  Decision Tree → MSE: {mse:.4f} | R²: {r2:.4f}")

# ── 6. Save pickle ───────────────────────────────────────────────────────────
os.makedirs("model", exist_ok=True)

with open("model/abalone_model.pkl", "wb") as f:
    pickle.dump(dtr, f)

print("✅  Model saved to model/abalone_model.pkl")
print("🎉  Done! Now run: python app.py")
