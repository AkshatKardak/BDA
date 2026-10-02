#!/usr/bin/env python3
"""
pyspark/07_season_analysis.py
=============================
Computes tournament macro-trends across 18 IPL seasons (2008-2026) using PySpark:
  - Matches held per tournament edition
  - Evolution of run rates (Runs per over)
  - Boundary dynamics: Sixes, Fours, and boundary run contribution
  - Average wickets per match
  - Chasing success rate evolution over time

Demonstrates:
  - Season-grouped multi-metric aggregations
  - Run rate formulations (`total_runs / (legal_deliveries / 6.0)`)
  - Integration of match-level outcomes and delivery-level totals
"""

import os
import sys
from pyspark.sql import functions as F

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, save_analytics_output


def run_season_analysis():
    print("=" * 70)
    print(" PySpark Stage 7: Macro-Temporal & Season Evolution Analytics")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage7_SeasonAnalysis")

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
    # 1. Delivery Aggregates per Season
    # -------------------------------------------------------------------------
    print("\n[INFO] Aggregating Season Scoring & Boundary Evolution...")
    season_deliv = (
        df_deliv.groupBy("season")
        .agg(
            F.countDistinct("match_id").alias("season_matches"),
            F.sum("total_runs").alias("total_runs"),
            F.sum(F.when((F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0)).alias("legal_balls"),
            F.sum(F.when(F.col("batter_runs") == 4, 1).otherwise(0)).alias("fours"),
            F.sum(F.when(F.col("batter_runs") == 6, 1).otherwise(0)).alias("sixes"),
            F.sum("is_wicket").alias("total_wickets")
        )
        .withColumn("run_rate", F.round(F.col("total_runs") / (F.col("legal_balls") / 6.0), 2))
        .withColumn("avg_match_runs", F.round(F.col("total_runs") / F.col("season_matches"), 1))
        .withColumn("avg_match_wickets", F.round(F.col("total_wickets") / F.col("season_matches"), 1))
        .withColumn("boundary_runs", (F.col("fours") * 4) + (F.col("sixes") * 6))
        .withColumn("boundary_run_pct", F.round((F.col("boundary_runs") * 100.0) / F.col("total_runs"), 2))
    )

    # -------------------------------------------------------------------------
    # 2. Match Outcome Trends per Season
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Season Chasing & Toss Win Rates...")
    season_outcomes = (
        df_matches.filter(F.col("win_type").isin("runs", "wickets"))
        .groupBy("season")
        .agg(
            F.count("*").alias("decisive_matches"),
            F.sum(F.when(F.col("win_type") == "wickets", 1).otherwise(0)).alias("chasing_wins"),
            F.sum(F.when(F.col("toss_winner") == F.col("winner"), 1).otherwise(0)).alias("toss_and_match_wins")
        )
        .withColumn("chasing_win_pct", F.round((F.col("chasing_wins") * 100.0) / F.col("decisive_matches"), 2))
        .withColumn("toss_win_pct", F.round((F.col("toss_and_match_wins") * 100.0) / F.col("decisive_matches"), 2))
    )

    # Join both
    season_summary = (
        season_deliv.join(season_outcomes.select("season", "chasing_win_pct", "toss_win_pct"), on="season", how="left")
        .orderBy("season")
    )

    print("\n[SEASON EVOLUTION OVERVIEW (2008 - 2026)]:")
    season_summary.select(
        "season", "season_matches", "run_rate", "avg_match_runs", "fours", "sixes", "boundary_run_pct", "chasing_win_pct"
    ).show(20, truncate=False)

    save_analytics_output(season_summary, "season_analysis", "season_scoring_trends")

    print("\n[SUCCESS] Stage 7 Season Analysis completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_season_analysis()
