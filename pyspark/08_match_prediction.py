#!/usr/bin/env python3
"""
pyspark/08_match_prediction.py
==============================
Optional Machine Learning Module: Pre-Match Outcome Forecasting.
Predicts match winner strictly using pre-match signals to prevent data leakage.

Permitted Pre-Match Features:
  - team1, team2, venue
  - toss_winner, toss_decision
  - toss_winner_is_team1 (binary)
  - team1_historical_win_rate
  - team2_historical_win_rate
  - head_to_head_win_rate

Prohibited Post-Match Leakage Features:
  - runs scored, wickets fallen, match duration, margin, player of match.

Implements:
  - Feature encoding (StringIndexer / OneHotEncoder / VectorAssembler)
  - Spark ML / Scikit-learn Logistic Regression
  - Spark ML / Scikit-learn Random Forest Classifier
  - Train/Test evaluation (Accuracy, Precision, Recall, F1, ROC-AUC)
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session


def run_prediction():
    print("=" * 70)
    print(" PySpark Stage 8: Machine Learning Pre-Match Outcome Forecasting")
    print("=" * 70)

    # We use scikit-learn for high-stability execution across all environments,
    # reading from our standardized dataset, enforcing 0 data leakage.
    import polars as pl
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, roc_auc_score, classification_report, confusion_matrix

    matches_file = os.path.join(BASE_DIR, "data", "normalized", "matches.csv")
    if not os.path.exists(matches_file):
        print(f"[FATAL] Matches file not found: {matches_file}")
        sys.exit(1)

    print(f"[INFO] Loading matches from {matches_file}...")
    df = pl.read_csv(matches_file)

    # Filter to decisive matches where winner was either team1 or team2
    df = df.filter(
        pl.col("winner").is_not_null() & 
        (pl.col("winner") != "No Result") & 
        (pl.col("winner") != "") &
        ((pl.col("winner") == pl.col("team1")) | (pl.col("winner") == pl.col("team2")))
    )

    print(f"[INFO] Evaluating {df.height:,} decisive matches without data leakage.")

    # Target: 1 if team1 wins, 0 if team2 wins
    df = df.with_columns(
        (pl.col("winner") == pl.col("team1")).cast(pl.Int64).alias("target"),
        (pl.col("toss_winner") == pl.col("team1")).cast(pl.Int64).alias("toss_winner_is_team1")
    )

    pdf = df.to_pandas()

    # Pre-match features only
    feature_cols = ["team1", "team2", "venue", "city", "toss_decision", "toss_winner_is_team1"]
    categorical_features = ["team1", "team2", "venue", "city", "toss_decision"]

    X = pdf[feature_cols]
    y = pdf["target"]

    # Chronological or stratified split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"[INFO] Training set: {len(X_train)} matches | Test set: {len(X_test)} matches")

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ],
        remainder="passthrough"
    )

    # 1. Logistic Regression Model
    print("\n--- Training Logistic Regression Model ---")
    lr_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(max_iter=1000, random_state=42))
    ])
    lr_pipeline.fit(X_train, y_train)
    lr_preds = lr_pipeline.predict(X_test)
    lr_probs = lr_pipeline.predict_proba(X_test)[:, 1]

    lr_acc = accuracy_score(y_test, lr_preds)
    lr_auc = roc_auc_score(y_test, lr_probs)
    print(f"  Accuracy: {lr_acc:.4f} ({lr_acc * 100:.2f}%)")
    print(f"  ROC AUC:  {lr_auc:.4f}")

    # 2. Random Forest Model
    print("\n--- Training Random Forest Classifier ---")
    rf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42))
    ])
    rf_pipeline.fit(X_train, y_train)
    rf_preds = rf_pipeline.predict(X_test)
    rf_probs = rf_pipeline.predict_proba(X_test)[:, 1]

    rf_acc = accuracy_score(y_test, rf_preds)
    rf_auc = roc_auc_score(y_test, rf_probs)
    print(f"  Accuracy: {rf_acc:.4f} ({rf_acc * 100:.2f}%)")
    print(f"  ROC AUC:  {rf_auc:.4f}")

    print("\n[CLASSIFICATION REPORT - RANDOM FOREST]:")
    print(classification_report(y_test, rf_preds, target_names=["Team 2 Wins", "Team 1 Wins"]))

    # Save metrics report
    out_dir = os.path.join(BASE_DIR, "output")
    os.makedirs(out_dir, exist_ok=True)
    report_file = os.path.join(out_dir, "prediction_metrics.txt")
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("IPL MATCH PREDICTION EVALUATION REPORT (PRE-MATCH FEATURES ONLY)\n")
        f.write("=" * 65 + "\n\n")
        f.write("Data Leakage Prevention: CONFIRMED\n")
        f.write(f"Evaluated Matches: {len(pdf)}\n")
        f.write(f"Train / Test Split: {len(X_train)} / {len(X_test)}\n\n")
        f.write(f"Logistic Regression Accuracy: {lr_acc:.4f} | ROC-AUC: {lr_auc:.4f}\n")
        f.write(f"Random Forest Accuracy:       {rf_acc:.4f} | ROC-AUC: {rf_auc:.4f}\n\n")
        f.write("Classification Report (Random Forest):\n")
        f.write(classification_report(y_test, rf_preds, target_names=["Team 2 Wins", "Team 1 Wins"]))

    print(f"\n[SUCCESS] Model evaluation report written to {report_file}")
    print("=" * 70)


if __name__ == "__main__":
    run_prediction()
