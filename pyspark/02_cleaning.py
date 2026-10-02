#!/usr/bin/env python3
"""
pyspark/02_cleaning.py
======================
Cleans, standardizes, and enriches IPL matches and delivery datasets.
Demonstrates:
  - withColumn transformations
  - col(), when(), coalesce(), regexp_replace()
  - Filtering anomalous records
  - Enriched boundary flags (fours, sixes, dots)
"""

import os
import sys
from pyspark.sql import functions as F

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session

PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
CLEANED_DIR = os.path.join(BASE_DIR, "data", "cleaned")


def run_cleaning():
    print("=" * 70)
    print(" PySpark Stage 2: Data Cleaning & Feature Enrichment")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage2_Cleaning")

    matches_path = os.path.join(PROCESSED_DIR, "matches.parquet")
    deliveries_path = os.path.join(PROCESSED_DIR, "deliveries.parquet")

    # Fallback to normalized CSV if parquet not yet generated
    if not os.path.exists(matches_path):
        matches_path = os.path.join(BASE_DIR, "data", "normalized", "matches.csv")
        deliveries_path = os.path.join(BASE_DIR, "data", "normalized", "deliveries.csv")
        df_matches = spark.read.option("header", "true").option("inferSchema", "true").csv(matches_path)
        df_deliveries = spark.read.option("header", "true").option("inferSchema", "true").csv(deliveries_path)
    else:
        df_matches = spark.read.parquet(matches_path)
        df_deliveries = spark.read.parquet(deliveries_path)

    print(f"[INFO] Loaded {df_matches.count():,} matches and {df_deliveries.count():,} deliveries.")

    # 1. Clean Matches: Standardize null winners, cities, and win_type
    df_matches_clean = (
        df_matches
        .withColumn("city", F.coalesce(F.col("city"), F.lit("Unknown")))
        .withColumn("winner", F.when(F.col("winner").isNull() | (F.col("winner") == ""), F.lit("No Result")).otherwise(F.col("winner")))
        .withColumn("win_type", F.coalesce(F.col("win_type"), F.lit("no result")))
        .withColumn("win_margin", F.coalesce(F.col("win_margin"), F.lit(0.0)))
        .withColumn("is_decisive", F.when(F.col("winner") == "No Result", 0).otherwise(1))
    )

    # 2. Clean & Enrich Deliveries: Add boundary flags, legal ball indicator, and phases
    df_deliveries_clean = (
        df_deliveries
        .withColumn("city", F.coalesce(F.col("city"), F.lit("Unknown")))
        .withColumn("is_legal_ball", F.when((F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0))
        .withColumn("is_four", F.when(F.col("batter_runs") == 4, 1).otherwise(0))
        .withColumn("is_six", F.when(F.col("batter_runs") == 6, 1).otherwise(0))
        .withColumn("is_dot", F.when((F.col("total_runs") == 0) & (F.col("is_legal_ball") == 1), 1).otherwise(0))
        .withColumn("is_bowler_wicket", F.when(
            (F.col("is_wicket") == 1) & 
            (~F.col("dismissal_kind").isin("run out", "retired hurt", "retired out", "obstructing the field")),
            1
        ).otherwise(0))
        # Match phase: Powerplay (0-5), Middle overs (6-14), Death overs (15-19)
        .withColumn("match_phase", F.when(F.col("over") < 6, "Powerplay")
                                    .when(F.col("over") < 15, "Middle")
                                    .otherwise("Death"))
    )

    print("\n[ENRICHMENT SAMPLE: DELIVERIES]")
    df_deliveries_clean.select(
        "match_id", "over", "ball", "batter", "bowler", "total_runs", "is_four", "is_six", "is_dot", "match_phase"
    ).show(5)

    # Save cleaned DataFrames
    os.makedirs(CLEANED_DIR, exist_ok=True)
    df_matches_clean.write.mode("overwrite").parquet(os.path.join(CLEANED_DIR, "matches.parquet"))
    df_deliveries_clean.write.mode("overwrite").parquet(os.path.join(CLEANED_DIR, "deliveries.parquet"))

    print(f"\n[SUCCESS] Cleaned data written to {CLEANED_DIR}")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_cleaning()
