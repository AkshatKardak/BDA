#!/usr/bin/env python3
"""
pyspark/01_ingestion.py
=======================
Ingests raw/normalized IPL matches and deliveries into PySpark.
Defines explicit StructType schemas, validates types, and persists processed baseline Parquet.

Demonstrates:
  - StructType & StructField schema definition
  - spark.read.schema(...)
  - DataFrame caching & partition auditing
  - Parquet data lake writing
"""

import os
import sys
from pyspark.sql.types import (
    StructType, StructField, StringType, IntegerType, LongType, DoubleType
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from spark_common import get_spark_session, resolve_input_paths

# Explicit Schema Definition for Matches
MATCHES_SCHEMA = StructType([
    StructField("match_id", LongType(), False),
    StructField("season", StringType(), False),
    StructField("date", StringType(), True),
    StructField("team1", StringType(), False),
    StructField("team2", StringType(), False),
    StructField("city", StringType(), True),
    StructField("venue", StringType(), False),
    StructField("toss_winner", StringType(), True),
    StructField("toss_decision", StringType(), True),
    StructField("winner", StringType(), True),
    StructField("win_type", StringType(), True),
    StructField("win_margin", DoubleType(), True),
    StructField("result", StringType(), True),
    StructField("player_of_match", StringType(), True)
])

# Explicit Schema Definition for Deliveries
DELIVERIES_SCHEMA = StructType([
    StructField("match_id", LongType(), False),
    StructField("season", StringType(), False),
    StructField("date", StringType(), True),
    StructField("venue", StringType(), True),
    StructField("city", StringType(), True),
    StructField("innings", IntegerType(), False),
    StructField("over", IntegerType(), False),
    StructField("ball", IntegerType(), False),
    StructField("batting_team", StringType(), False),
    StructField("bowling_team", StringType(), False),
    StructField("batter", StringType(), False),
    StructField("bowler", StringType(), False),
    StructField("non_striker", StringType(), True),
    StructField("batter_runs", IntegerType(), False),
    StructField("extras_total", IntegerType(), False),
    StructField("total_runs", IntegerType(), False),
    StructField("wides", IntegerType(), True),
    StructField("noballs", IntegerType(), True),
    StructField("byes", IntegerType(), True),
    StructField("legbyes", IntegerType(), True),
    StructField("penalty", IntegerType(), True),
    StructField("is_wicket", IntegerType(), False),
    StructField("player_out", StringType(), True),
    StructField("dismissal_kind", StringType(), True),
    StructField("fielder", StringType(), True)
])


def run_ingestion():
    print("=" * 70)
    print(" PySpark Stage 1: Distributed Dataset Ingestion")
    print("=" * 70)

    spark = get_spark_session("IPL_Stage1_Ingestion")
    paths = resolve_input_paths()

    print(f"[INFO] Ingesting Matches from: {paths['matches']}")
    df_matches = (
        spark.read.format("csv")
        .option("header", "true")
        .schema(MATCHES_SCHEMA)
        .load(paths["matches"])
    )

    print(f"[INFO] Ingesting Deliveries from: {paths['deliveries']}")
    df_deliveries = (
        spark.read.format("csv")
        .option("header", "true")
        .schema(DELIVERIES_SCHEMA)
        .load(paths["deliveries"])
    )

    # Auditing row counts and schema validation
    matches_count = df_matches.count()
    deliveries_count = df_deliveries.count()

    print(f"\n[AUDIT] Ingested Matches:    {matches_count:,} rows across {df_matches.rdd.getNumPartitions()} partitions")
    print(f"[AUDIT] Ingested Deliveries: {deliveries_count:,} rows across {df_deliveries.rdd.getNumPartitions()} partitions")

    print("\n[MATCHES SCHEMA]:")
    df_matches.printSchema()

    print("\n[DELIVERIES SAMPLE]:")
    df_deliveries.select("match_id", "innings", "over", "ball", "batter", "bowler", "total_runs").show(5)

    # Persist processed Parquet to lake
    processed_dir = os.path.join(BASE_DIR, "data", "processed")
    matches_parquet = os.path.join(processed_dir, "matches.parquet")
    deliveries_parquet = os.path.join(processed_dir, "deliveries.parquet")

    print(f"[INFO] Writing partitioned Parquet: {matches_parquet}")
    df_matches.write.mode("overwrite").parquet(matches_parquet)

    print(f"[INFO] Writing partitioned Parquet: {deliveries_parquet}")
    df_deliveries.write.mode("overwrite").parquet(deliveries_parquet)

    print("\n[SUCCESS] Stage 1 Ingestion completed successfully.")
    print("=" * 70)
    spark.stop()


if __name__ == "__main__":
    run_ingestion()
