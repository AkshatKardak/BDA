#!/usr/bin/env python3
"""
pyspark/run_all_analytics.py
============================
High-Performance Unified PySpark Pipeline Runner.
Executes all distributed analytics stages sequentially within a single cached SparkSession.
Maximizes throughput by caching cleaned data in memory and avoiding repeated JVM warmups.
"""

import os
import sys
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, resolve_input_paths, save_analytics_output
from pyspark.sql import functions as F
from pyspark.sql.window import Window


def main():
    print("=" * 75)
    print(" IPL BIG DATA ANALYTICS: UNIFIED DISTRIBUTED PYSPARK PIPELINE")
    print(" Engine: Apache Spark DataFrame & Spark SQL Analytics")
    print("=" * 75)
    start_total = time.time()

    spark = get_spark_session("IPL_Unified_Analytics_Pipeline")
    paths = resolve_input_paths()

    # -------------------------------------------------------------------------
    # Stage 1 & 2: Ingestion & Data Cleaning / Feature Engineering
    # -------------------------------------------------------------------------
    print("\n[STAGE 1 & 2] Ingesting and Cleaning Datasets...")
    df_matches_raw = spark.read.option("header", "true").option("inferSchema", "true").csv(paths["matches"])
    df_deliv_raw = spark.read.option("header", "true").option("inferSchema", "true").csv(paths["deliveries"])

    # Clean Matches
    df_matches = (
        df_matches_raw
        .withColumn("city", F.coalesce(F.col("city"), F.lit("Unknown")))
        .withColumn("winner", F.when(F.col("winner").isNull() | (F.col("winner") == ""), F.lit("No Result")).otherwise(F.col("winner")))
        .withColumn("win_type", F.coalesce(F.col("win_type"), F.lit("no result")))
        .withColumn("win_margin", F.coalesce(F.col("win_margin"), F.lit(0.0)))
        .cache()
    )

    # Clean & Enrich Deliveries
    df_deliv = (
        df_deliv_raw
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
        .withColumn("match_phase", F.when(F.col("over") < 6, "Powerplay")
                                    .when(F.col("over") < 15, "Middle")
                                    .otherwise("Death"))
        .cache()
    )

    m_cnt = df_matches.count()
    d_cnt = df_deliv.count()
    print(f"  [PASS] Cached {m_cnt:,} Matches and {d_cnt:,} Deliveries in memory.")

    # -------------------------------------------------------------------------
    # Stage 3: Player Analytics
    # -------------------------------------------------------------------------
    print("\n[STAGE 3] Computing Player Career Leaderboards & Window Rankings...")
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
        .withColumn("strike_rate", F.round((F.col("total_runs") * 100.0) / F.when(F.col("balls_faced") > 0, F.col("balls_faced")).otherwise(1), 2))
        .withColumn("batting_average", F.round((F.col("total_runs") * 1.0) / F.when(F.col("dismissals") > 0, F.col("dismissals")).otherwise(1.0), 2))
        .drop("player_out")
        .withColumn("all_time_rank", F.dense_rank().over(Window.orderBy(F.col("total_runs").desc())))
    )
    save_analytics_output(df_bat, "player_performance", "top_batsmen")

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
        .withColumn("economy_rate", F.round((F.col("runs_conceded") * 6.0) / F.when(F.col("legal_balls") > 0, F.col("legal_balls")).otherwise(1), 2))
        .withColumn("bowling_strike_rate", F.round((F.col("legal_balls") * 1.0) / F.when(F.col("wickets") > 0, F.col("wickets")).otherwise(1), 2))
        .withColumn("all_time_rank", F.dense_rank().over(Window.orderBy(F.col("wickets").desc(), F.col("economy_rate").asc())))
    )
    save_analytics_output(df_bowl, "player_performance", "top_bowlers")

    season_bat = (
        df_deliv.groupBy("season", "batter")
        .agg(
            F.sum("batter_runs").alias("season_runs"),
            F.sum(F.when(F.col("wides") == 0, 1).otherwise(0)).alias("balls_faced")
        )
        .withColumn("season_rank", F.row_number().over(Window.partitionBy("season").orderBy(F.col("season_runs").desc())))
        .filter(F.col("season_rank") <= 3)
    )
    save_analytics_output(season_bat, "player_performance", "season_player_stats")

    # -------------------------------------------------------------------------
    # Stage 4: Team Analytics
    # -------------------------------------------------------------------------
    print("\n[STAGE 4] Computing Franchise All-Time & Head-to-Head Analytics...")
    t1_df = df_matches.select(F.col("match_id"), F.col("season"), F.col("team1").alias("team"), F.col("winner"), F.col("win_type"))
    t2_df = df_matches.select(F.col("match_id"), F.col("season"), F.col("team2").alias("team"), F.col("winner"), F.col("win_type"))
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
    save_analytics_output(team_summary, "team_performance", "franchise_overall_records")

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
    save_analytics_output(h2h_summary, "team_performance", "head_to_head_records")

    # -------------------------------------------------------------------------
    # Stage 5: Toss Analytics
    # -------------------------------------------------------------------------
    print("\n[STAGE 5] Computing Toss Decision & Conversion Impact...")
    df_decisive = df_matches.filter(
        F.col("winner").isNotNull() & (F.col("winner") != "No Result") &
        F.col("toss_winner").isNotNull() & F.col("toss_decision").isNotNull()
    )
    tot_dec = df_decisive.count()

    toss_summary = (
        df_decisive.groupBy("toss_decision")
        .agg(
            F.count("*").alias("decision_count"),
            F.sum(F.when(F.col("toss_winner") == F.col("winner"), 1).otherwise(0)).alias("toss_and_match_wins")
        )
        .withColumn("decision_share_pct", F.round((F.col("decision_count") * 100.0) / tot_dec, 2))
        .withColumn("decision_win_pct", F.round((F.col("toss_and_match_wins") * 100.0) / F.col("decision_count"), 2))
    )
    save_analytics_output(toss_summary, "toss_analysis", "toss_overall_impact")

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
    save_analytics_output(season_toss, "toss_analysis", "toss_season_trends")

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
    save_analytics_output(venue_toss, "toss_analysis", "toss_venue_impact")

    # -------------------------------------------------------------------------
    # Stage 6: Venue Analytics
    # -------------------------------------------------------------------------
    print("\n[STAGE 6] Computing Stadium Characteristics & Pitch Insights...")
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

    venue_profile = (
        venue_matches.join(venue_scores, on="venue", how="left")
        .orderBy(F.col("total_matches").desc())
    )
    save_analytics_output(venue_profile, "venue_analysis", "venue_profile")

    # -------------------------------------------------------------------------
    # Stage 7: Season Analytics
    # -------------------------------------------------------------------------
    print("\n[STAGE 7] Computing Macro-Temporal Season Evolution (2008-2026)...")
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

    season_summary = (
        season_deliv.join(season_outcomes.select("season", "chasing_win_pct", "toss_win_pct"), on="season", how="left")
        .orderBy("season")
    )
    save_analytics_output(season_summary, "season_analysis", "season_scoring_trends")

    elapsed_total = time.time() - start_total
    print("\n" + "=" * 75)
    print(f" ALL PYSPARK ANALYTICAL MODULES EXECUTED IN {elapsed_total:.2f} SECONDS!")
    print(" Aggregated results stored in: output/")
    print("=" * 75)
    spark.stop()


if __name__ == "__main__":
    main()
