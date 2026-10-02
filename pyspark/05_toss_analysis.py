#!/usr/bin/env python3
"""
pyspark/05_toss_analysis.py
===========================
Evaluates the statistical impact of the coin toss across IPL history using PySpark:
  - Overall Toss Decision Distribution (Bat vs Field)
  - Toss Winner Match Conversion Rate (Toss Winner = Match Winner)
  - Decision-specific win conversion (Bat First Win % vs Field First Win %)
  - Season-by-season evolution of toss dynamics
  - Venue-level toss advantage (ground-specific pitch behavior)

Demonstrates:
  - Conditional probabilities and win-ratio formulas
  - Multidimensional groupings (season x toss_decision, venue x toss_decision)
  - Pivot operations or conditional aggregations
"""

import os
import sys
from pyspark.sql import functions as F

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, save_analytics_output


def run_toss_analysis():
    print("=" * 70)
    print(" PySpark Stage 5: Toss Impact & Decision Dynamics")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage5_TossAnalysis")

    matches_path = os.path.join(BASE_DIR, "data", "cleaned", "matches.parquet")
    if not os.path.exists(matches_path):
        matches_path = os.path.join(BASE_DIR, "data", "normalized", "matches.csv")
        df_matches = spark.read.option("header", "true").option("inferSchema", "true").csv(matches_path)
    else:
        df_matches = spark.read.parquet(matches_path)

    # Filter decisive matches
    df_decisive = df_matches.filter(
        F.col("winner").isNotNull() & (F.col("winner") != "No Result") &
        F.col("toss_winner").isNotNull() & F.col("toss_decision").isNotNull()
    )

    total_matches = df_decisive.count()
    print(f"[INFO] Analyzing toss dynamics across {total_matches:,} decisive matches.")

    # -------------------------------------------------------------------------
    # 1. Overall Toss Advantage & Decision Distribution
    # -------------------------------------------------------------------------
    toss_summary = (
        df_decisive.groupBy("toss_decision")
        .agg(
            F.count("*").alias("decision_count"),
            F.sum(F.when(F.col("toss_winner") == F.col("winner"), 1).otherwise(0)).alias("toss_and_match_wins")
        )
        .withColumn("decision_share_pct", F.round((F.col("decision_count") * 100.0) / total_matches, 2))
        .withColumn("decision_win_pct", F.round((F.col("toss_and_match_wins") * 100.0) / F.col("decision_count"), 2))
    )

    print("\n[OVERALL TOSS DECISION DYNAMICS]:")
    toss_summary.show()
    save_analytics_output(toss_summary, "toss_analysis", "toss_overall_impact")

    # -------------------------------------------------------------------------
    # 2. Season-wise Toss Evolution
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Season-wise Toss Impact...")
    season_toss = (
        df_decisive.groupBy("season")
        .agg(
            F.count("*").alias("season_matches"),
            F.sum(F.when(F.col("toss_decision") == "field", 1).otherwise(0)).alias("field_first_decisions"),
            F.sum(F.when(F.col("toss_decision") == "bat", 1).otherwise(0)).alias("bat_first_decisions"),
            F.sum(F.when(F.col("toss_winner") == F.col("winner"), 1).otherwise(0)).alias("toss_winner_wins")
        )
        .withColumn("toss_advantage_pct", F.round((F.col("toss_winner_wins") * 100.0) / F.col("season_matches"), 2))
        .withColumn("field_first_pct", F.round((F.col("field_first_decisions") * 100.0) / F.col("season_matches"), 2))
        .orderBy("season")
    )

    print("\n[SEASON TOSS TRENDS]:")
    season_toss.show(18)
    save_analytics_output(season_toss, "toss_analysis", "toss_season_trends")

    # -------------------------------------------------------------------------
    # 3. Venue-wise Toss Impact
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Venue-wise Toss Impact...")
    venue_toss = (
        df_decisive.groupBy("venue")
        .agg(
            F.count("*").alias("venue_matches"),
            F.sum(F.when(F.col("toss_winner") == F.col("winner"), 1).otherwise(0)).alias("toss_winner_wins"),
            F.sum(F.when((F.col("toss_decision") == "field") & (F.col("toss_winner") == F.col("winner")), 1).otherwise(0)).alias("field_and_won"),
            F.sum(F.when((F.col("toss_decision") == "bat") & (F.col("toss_winner") == F.col("winner")), 1).otherwise(0)).alias("bat_and_won")
        )
        .withColumn("toss_win_pct", F.round((F.col("toss_winner_wins") * 100.0) / F.col("venue_matches"), 2))
        .filter(F.col("venue_matches") >= 15)
        .orderBy(F.col("venue_matches").desc())
    )

    print("\n[VENUE TOSS ADVANTAGE SAMPLE]:")
    venue_toss.show(10, truncate=False)
    save_analytics_output(venue_toss, "toss_analysis", "toss_venue_impact")

    print("\n[SUCCESS] Stage 5 Toss Analysis completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_toss_analysis()
