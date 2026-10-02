#!/usr/bin/env python3
"""
pyspark/06_venue_analysis.py
============================
Performs stadium and pitch behavior analytics using PySpark:
  - Total matches per venue
  - Average 1st innings score vs Average 2nd innings score
  - Batting-first vs Chasing win percentages
  - Stadium scoring extremes (All-time highest and lowest team totals)
  - City and geographical aggregations

Demonstrates:
  - Multi-level hierarchical aggregation (match-innings -> venue)
  - Conditional scoring averages (innings = 1 vs innings = 2)
  - Min/Max scoring boundary extraction
"""

import os
import sys
from pyspark.sql import functions as F

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, save_analytics_output


def run_venue_analysis():
    print("=" * 70)
    print(" PySpark Stage 6: Venue, Pitch & Stadium Analytics")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage6_VenueAnalysis")

    matches_path = os.path.join(BASE_DIR, "data", "cleaned", "matches.parquet")
    deliv_path = os.path.join(BASE_DIR, "data", "cleaned", "deliveries.parquet")

    if not os.path.exists(matches_path):
        matches_path = os.path.join(BASE_DIR, "data", "normalized", "matches.csv")
        deliv_path = os.path.join(BASE_DIR, "data", "normalized", "deliveries.csv")
        df_matches = spark.read.option("header", "true").option("inferSchema", "true").csv(matches_path)
        df_deliv = spark.read.option("header", "true").option("inferSchema", "true").csv(deliv_path)
    else:
        df_matches = spark.read.parquet(matches_path)
        df_deliv = spark.read.parquet(deliv_path)

    # -------------------------------------------------------------------------
    # 1. Innings Scores by Venue
    # -------------------------------------------------------------------------
    print("\n[INFO] Aggregating Team Innings Totals per Venue...")
    innings_scores = (
        df_deliv.filter(F.col("innings").isin(1, 2))
        .groupBy("match_id", "venue", "city", "innings", "batting_team")
        .agg(F.sum("total_runs").alias("innings_total"))
    )

    venue_scores = (
        innings_scores.groupBy("venue")
        .agg(
            F.round(F.avg(F.when(F.col("innings") == 1, F.col("innings_total"))), 1).alias("avg_1st_innings_score"),
            F.round(F.avg(F.when(F.col("innings") == 2, F.col("innings_total"))), 1).alias("avg_2nd_innings_score"),
            F.max("innings_total").alias("highest_score"),
            F.min("innings_total").alias("lowest_score")
        )
    )

    # -------------------------------------------------------------------------
    # 2. Match Outcomes by Venue
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Venue Win Ratios (Bat-First vs Chase)...")
    venue_matches = (
        df_matches.filter(F.col("win_type").isin("runs", "wickets"))
        .groupBy("venue")
        .agg(
            F.count("*").alias("total_matches"),
            F.first("city").alias("city"),
            F.sum(F.when(F.col("win_type") == "runs", 1).otherwise(0)).alias("bat_first_wins"),
            F.sum(F.when(F.col("win_type") == "wickets", 1).otherwise(0)).alias("chase_wins")
        )
        .withColumn("bat_first_win_pct", F.round((F.col("bat_first_wins") * 100.0) / F.col("total_matches"), 2))
        .withColumn("chase_win_pct", F.round((F.col("chase_wins") * 100.0) / F.col("total_matches"), 2))
    )

    # Combine metrics
    venue_profile = (
        venue_matches.join(venue_scores, on="venue", how="left")
        .orderBy(F.col("total_matches").desc())
    )

    print("\n[TOP 10 VENUES PROFILE]:")
    venue_profile.select(
        "venue", "city", "total_matches", "avg_1st_innings_score", "avg_2nd_innings_score", "bat_first_win_pct", "chase_win_pct", "highest_score"
    ).show(10, truncate=False)

    save_analytics_output(venue_profile, "venue_analysis", "venue_profile")

    print("\n[SUCCESS] Stage 6 Venue Analysis completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_venue_analysis()
