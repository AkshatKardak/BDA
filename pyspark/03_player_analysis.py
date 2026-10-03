#!/usr/bin/env python3
"""
pyspark/03_player_analysis.py
=============================
Computes comprehensive player performance analytics using PySpark and Spark SQL:
  - Batting: Total runs, Strike Rate, Batting Average, Fours, Sixes, Innings
  - Bowling: Wickets, Economy Rate, Dot balls, Overs bowled
  - Window Functions: All-Time Rankings & Season-wise Orange/Purple Cap races

Demonstrates:
  - Window.partitionBy() and Window.orderBy()
  - dense_rank(), row_number()
  - Complex aggregations with join on player dismissals
  - Output persistence to output/player_performance/
"""

import os
import sys
from pyspark.sql import functions as F
from pyspark.sql.window import Window

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, save_analytics_output


def run_player_analysis():
    print("=" * 70)
    print(" PySpark Stage 3: Player Performance & Window Analytics")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage3_PlayerAnalysis")

    deliv_parquet = os.path.join(BASE_DIR, "data", "cleaned", "deliveries.parquet")
    if not os.path.exists(deliv_parquet):
        deliv_parquet = os.path.join(BASE_DIR, "data", "normalized", "deliveries.csv")
        df_deliv = spark.read.option("header", "true").option("inferSchema", "true").csv(deliv_parquet)
        df_deliv = df_deliv.withColumn("is_bowler_wicket", F.when(
            (F.col("is_wicket") == 1) & 
            (~F.col("dismissal_kind").isin("run out", "retired hurt", "retired out", "obstructing the field")),
            1
        ).otherwise(0))
        df_deliv = df_deliv.withColumn("is_four", F.when(F.col("batter_runs") == 4, 1).otherwise(0))
        df_deliv = df_deliv.withColumn("is_six", F.when(F.col("batter_runs") == 6, 1).otherwise(0))
        df_deliv = df_deliv.withColumn("is_dot", F.when((F.col("total_runs") == 0) & (F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0))
        df_deliv = df_deliv.withColumn("is_legal_ball", F.when((F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0))
    else:
        df_deliv = spark.read.parquet(deliv_parquet)

    if "is_bowler_wicket" not in df_deliv.columns:
        df_deliv = df_deliv.withColumn("is_bowler_wicket", F.when(
            (F.col("is_wicket") == 1) & 
            (~F.col("dismissal_kind").isin("run out", "retired hurt", "retired out", "obstructing the field")),
            1
        ).otherwise(0))
    if "is_legal_ball" not in df_deliv.columns:
        df_deliv = df_deliv.withColumn("is_legal_ball", F.when((F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0))
    if "is_four" not in df_deliv.columns:
        df_deliv = df_deliv.withColumn("is_four", F.when(F.col("batter_runs") == 4, 1).otherwise(0))
    if "is_six" not in df_deliv.columns:
        df_deliv = df_deliv.withColumn("is_six", F.when(F.col("batter_runs") == 6, 1).otherwise(0))
    if "is_dot" not in df_deliv.columns:
        df_deliv = df_deliv.withColumn("is_dot", F.when((F.col("total_runs") == 0) & (F.col("wides") == 0) & (F.col("noballs") == 0), 1).otherwise(0))

    df_deliv.createOrReplaceTempView("deliveries")

    # -------------------------------------------------------------------------
    # 1. Batting Analysis
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Batting Statistics...")
    # Calculate dismissals per batsman
    df_dismissals = (
        df_deliv.filter(F.col("player_out").isNotNull() & (F.col("player_out") != ""))
        .groupBy("player_out")
        .agg(F.count("*").alias("dismissals"))
    )

    df_bat = (
        df_deliv.groupBy("batter")
        .agg(
            F.countDistinct("match_id").alias("innings"),
            F.sum("batter_runs").alias("total_runs"),
            F.sum(F.when(F.col("wides") == 0, 1).otherwise(0)).alias("balls_faced"),
            F.sum("is_four").alias("fours"),
            F.sum("is_six").alias("sixes"),
            F.max("batter_runs").alias("max_ball_score")
        )
        .join(df_dismissals, F.col("batter") == F.col("player_out"), "left")
        .withColumn("dismissals", F.coalesce(F.col("dismissals"), F.lit(0)))
        .withColumn(
            "strike_rate",
            F.round((F.col("total_runs") * 100.0) / F.when(F.col("balls_faced") > 0, F.col("balls_faced")).otherwise(1), 2)
        )
        .withColumn(
            "batting_average",
            F.round(
                (F.col("total_runs") * 1.0) / F.when(F.col("dismissals") > 0, F.col("dismissals")).otherwise(1.0),
                2
            )
        )
        .drop("player_out")
    )

    # Window function to rank batsmen all-time
    bat_rank_win = Window.orderBy(F.col("total_runs").desc())
    df_bat_ranked = df_bat.withColumn("all_time_rank", F.dense_rank().over(bat_rank_win))

    print("\n[TOP 10 ALL-TIME RUN SCORERS]:")
    df_bat_ranked.select("all_time_rank", "batter", "innings", "total_runs", "strike_rate", "batting_average", "fours", "sixes").show(10, truncate=False)

    save_analytics_output(df_bat_ranked, "player_performance", "top_batsmen")

    # -------------------------------------------------------------------------
    # 2. Bowling Analysis
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Bowling Statistics...")
    df_bowl = (
        df_deliv.groupBy("bowler")
        .agg(
            F.countDistinct("match_id").alias("matches"),
            F.sum("is_legal_ball").alias("legal_balls"),
            F.sum("total_runs").alias("runs_conceded"),
            F.sum("is_bowler_wicket").alias("wickets"),
            F.sum("is_dot").alias("dot_balls")
        )
        .withColumn("overs", F.round(F.col("legal_balls") / 6.0, 1))
        .withColumn(
            "economy_rate",
            F.round((F.col("runs_conceded") * 6.0) / F.when(F.col("legal_balls") > 0, F.col("legal_balls")).otherwise(1), 2)
        )
        .withColumn(
            "bowling_strike_rate",
            F.round((F.col("legal_balls") * 1.0) / F.when(F.col("wickets") > 0, F.col("wickets")).otherwise(1), 2)
        )
    )

    bowl_rank_win = Window.orderBy(F.col("wickets").desc(), F.col("economy_rate").asc())
    df_bowl_ranked = df_bowl.withColumn("all_time_rank", F.dense_rank().over(bowl_rank_win))

    print("\n[TOP 10 ALL-TIME WICKET TAKERS]:")
    df_bowl_ranked.select("all_time_rank", "bowler", "matches", "wickets", "economy_rate", "overs", "dot_balls").show(10, truncate=False)

    save_analytics_output(df_bowl_ranked, "player_performance", "top_bowlers")

    # -------------------------------------------------------------------------
    # 3. Season-wise Player Leaders (Window partitionBy season)
    # -------------------------------------------------------------------------
    print("\n[INFO] Computing Season-wise Leaderboards (Orange Cap & Purple Cap)...")
    season_bat = (
        df_deliv.groupBy("season", "batter")
        .agg(
            F.sum("batter_runs").alias("season_runs"),
            F.sum(F.when(F.col("wides") == 0, 1).otherwise(0)).alias("balls_faced")
        )
        .withColumn("season_rank", F.row_number().over(Window.partitionBy("season").orderBy(F.col("season_runs").desc())))
        .filter(F.col("season_rank") <= 3)
    )

    print("\n[SEASON TOP 3 BATTERS SAMPLE]:")
    season_bat.show(12, truncate=False)
    save_analytics_output(season_bat, "player_performance", "season_player_stats")

    # Season Bowling Aggregation (Purple Cap)
    season_bowl = (
        df_deliv.groupBy("season", "bowler")
        .agg(
            F.sum("is_bowler_wicket").alias("season_wickets"),
            F.sum("is_legal_ball").alias("legal_balls"),
            F.sum("total_runs").alias("runs_conceded"),
            F.countDistinct("match_id").alias("matches"),
        )
        .withColumn(
            "economy_rate",
            F.round((F.col("runs_conceded") * 6.0) /
                    F.when(F.col("legal_balls") > 0, F.col("legal_balls")).otherwise(1), 2)
        )
        .withColumn(
            "season_rank",
            F.row_number().over(
                Window.partitionBy("season")
                      .orderBy(F.col("season_wickets").desc(), F.col("economy_rate").asc())
            )
        )
        .filter(F.col("season_rank") <= 3)
    )
    print("\n[SEASON TOP 3 BOWLERS SAMPLE]:")
    season_bowl.show(12, truncate=False)
    save_analytics_output(season_bowl, "player_performance", "season_bowler_stats")

    # 4. Cap Winners Table (Rank 1 Orange & Rank 1 Purple)
    # Tally derived from ball-by-ball dismissal attribution from Cricsheet
    orange = (
        season_bat.filter(F.col("season_rank") == 1)
        .select("season",
                F.col("batter").alias("orange_cap_player"),
                F.col("season_runs").alias("orange_cap_runs"))
    )

    purple = (
        season_bowl.filter(F.col("season_rank") == 1)
        .select("season",
                F.col("bowler").alias("purple_cap_player"),
                F.col("season_wickets").alias("purple_cap_wickets"),
                F.col("economy_rate").alias("purple_cap_economy"))
    )

    cap_winners = orange.join(purple, "season", "outer").orderBy("season")
    print("\n[CAP WINNERS PER SEASON]:")
    cap_winners.show(20, truncate=False)
    save_analytics_output(cap_winners, "player_performance", "cap_winners")

    print("\n[SUCCESS] Stage 3 Player Analysis completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_player_analysis()
