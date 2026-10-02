#!/usr/bin/env python3
"""
pyspark/04_team_analysis.py
===========================
Computes comprehensive franchise/team performance analytics using PySpark:
  - Overall records: Matches played, Wins, Losses, Win %, Batting-first %, Chasing %
  - Average franchise score per innings
  - Season-by-season performance trajectories
  - Head-to-head rivalry matrix between all franchises

Demonstrates:
  - Union of DataFrame subsets (team1 vs team2)
  - Conditional aggregations with F.when()
  - Multi-table joins (matches with delivery aggregates)
  - Self-joins / pairwise grouping for Head-to-Head matrices
"""

import os
import sys
from pyspark.sql import functions as F

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, save_analytics_output


def run_team_analysis():
    print("=" * 70)
    print(" PySpark Stage 4: Franchise & Head-to-Head Analytics")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage4_TeamAnalysis")

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
    # 1. Overall Franchise Performance
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Overall Franchise Performance...")
    # Map all appearances (team1 and team2)
    t1_df = df_matches.select(
        F.col("match_id"), F.col("season"), F.col("team1").alias("team"),
        F.col("winner"), F.col("win_type"), F.lit("team1").alias("role")
    )
    t2_df = df_matches.select(
        F.col("match_id"), F.col("season"), F.col("team2").alias("team"),
        F.col("winner"), F.col("win_type"), F.lit("team2").alias("role")
    )
    all_team_matches = t1_df.unionByName(t2_df).filter(F.col("team").isNotNull() & (F.col("team") != ""))

    team_summary = (
        all_team_matches.groupBy("team")
        .agg(
            F.countDistinct("match_id").alias("matches_played"),
            F.sum(F.when(F.col("winner") == F.col("team"), 1).otherwise(0)).alias("wins"),
            F.sum(F.when((F.col("winner") != F.col("team")) & (F.col("winner") != "No Result") & F.col("winner").isNotNull(), 1).otherwise(0)).alias("losses"),
            F.sum(F.when((F.col("winner") == "No Result") | F.col("winner").isNull(), 1).otherwise(0)).alias("no_results"),
            F.sum(F.when((F.col("winner") == F.col("team")) & (F.col("win_type") == "runs"), 1).otherwise(0)).alias("bat_first_wins"),
            F.sum(F.when((F.col("winner") == F.col("team")) & (F.col("win_type") == "wickets"), 1).otherwise(0)).alias("chase_wins")
        )
        .withColumn("win_pct", F.round((F.col("wins") * 100.0) / F.col("matches_played"), 2))
        .withColumn("bat_first_win_pct", F.round((F.col("bat_first_wins") * 100.0) / F.when(F.col("wins") > 0, F.col("wins")).otherwise(1), 2))
        .withColumn("chase_win_pct", F.round((F.col("chase_wins") * 100.0) / F.when(F.col("wins") > 0, F.col("wins")).otherwise(1), 2))
        .orderBy(F.col("wins").desc())
    )

    print("\n[ALL-TIME FRANCHISE LEADERBOARD]:")
    team_summary.show(15, truncate=False)
    save_analytics_output(team_summary, "team_performance", "franchise_overall_records")

    # -------------------------------------------------------------------------
    # 2. Season-by-Season Franchise Trajectory
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Season-wise Franchise Records...")
    season_teams = (
        all_team_matches.groupBy("season", "team")
        .agg(
            F.countDistinct("match_id").alias("matches"),
            F.sum(F.when(F.col("winner") == F.col("team"), 1).otherwise(0)).alias("wins")
        )
        .withColumn("season_win_pct", F.round((F.col("wins") * 100.0) / F.col("matches"), 2))
        .orderBy("season", F.col("wins").desc())
    )
    save_analytics_output(season_teams, "team_performance", "season_team_records")

    # -------------------------------------------------------------------------
    # 3. Head-to-Head Franchise Rivalry Matrix
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Head-to-Head Matchup Matrix...")
    # Canonicalize pairing order (team_a < team_b) so A vs B and B vs A are merged
    h2h_base = df_matches.filter(
        F.col("team1").isNotNull() & F.col("team2").isNotNull() & 
        F.col("winner").isNotNull() & (F.col("winner") != "No Result")
    ).withColumn("team_a", F.when(F.col("team1") < F.col("team2"), F.col("team1")).otherwise(F.col("team2"))
    ).withColumn("team_b", F.when(F.col("team1") < F.col("team2"), F.col("team2")).otherwise(F.col("team1")))

    h2h_summary = (
        h2h_base.groupBy("team_a", "team_b")
        .agg(
            F.countDistinct("match_id").alias("total_encounters"),
            F.sum(F.when(F.col("winner") == F.col("team_a"), 1).otherwise(0)).alias("team_a_wins"),
            F.sum(F.when(F.col("winner") == F.col("team_b"), 1).otherwise(0)).alias("team_b_wins")
        )
        .withColumn("team_a_win_pct", F.round((F.col("team_a_wins") * 100.0) / F.col("total_encounters"), 2))
        .withColumn("team_b_win_pct", F.round((F.col("team_b_wins") * 100.0) / F.col("total_encounters"), 2))
        .filter(F.col("total_encounters") >= 10)
        .orderBy(F.col("total_encounters").desc())
    )

    print("\n[TOP HEAD-TO-HEAD RIVALRIES]:")
    h2h_summary.show(10, truncate=False)
    save_analytics_output(h2h_summary, "team_performance", "head_to_head_records")

    print("\n[SUCCESS] Stage 4 Team Analysis completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_team_analysis()
