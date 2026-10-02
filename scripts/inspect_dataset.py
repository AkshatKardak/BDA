#!/usr/bin/env python3
"""
scripts/inspect_dataset.py
==========================
Inspects the downloaded primary IPL Parquet dataset schema, column types,
null values, cardinality, and sample records directly from data/raw/.

Fulfills Section 11 of academic specifications.
"""

import os
import sys
import polars as pl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
MATCHES_RAW = os.path.join(RAW_DIR, "matches", "matches.parquet")
DELIVERIES_RAW = os.path.join(RAW_DIR, "deliveries", "deliveries.parquet")


def inspect():
    print("=" * 75)
    print(" IPL BIG DATASET SCHEMA & PHYSICAL AUDIT")
    print(" Source: https://github.com/aadi-jn/indian-premier-league (Cricsheet)")
    print("=" * 75)

    if not os.path.exists(MATCHES_RAW) or not os.path.exists(DELIVERIES_RAW):
        print("[ERROR] Raw dataset not found. Run scripts/download_data.py first.")
        sys.exit(1)

    print(f"\n[FILE 1] Matches File: {MATCHES_RAW} ({os.path.getsize(MATCHES_RAW):,} bytes)")
    df_m = pl.read_parquet(MATCHES_RAW)
    print(f"  Shape: {df_m.height:,} rows x {df_m.width} columns")
    print("\n  Columns & Data Types:")
    for col, dtype in zip(df_m.columns, df_m.dtypes):
        nulls = df_m[col].null_count()
        null_pct = (nulls / df_m.height) * 100
        print(f"    {col:<22} | {str(dtype):<15} | Nulls: {nulls:<6} ({null_pct:>5.1f}%)")

    print("\n  Distinct Values Overview:")
    if "season" in df_m.columns:
        seasons = sorted([str(s) for s in df_m["season"].unique().to_list()])
        print(f"    Seasons ({len(seasons)}): {seasons[0]} to {seasons[-1]}")
    if "team1" in df_m.columns and "team2" in df_m.columns:
        teams = sorted(list(set(df_m["team1"].drop_nulls().to_list() + df_m["team2"].drop_nulls().to_list())))
        print(f"    Franchises ({len(teams)}): {', '.join(teams[:6])}...")
    if "venue" in df_m.columns:
        venues = df_m["venue"].drop_nulls().unique().to_list()
        print(f"    Venues ({len(venues)} total)")

    print(f"\n[FILE 2] Deliveries File: {DELIVERIES_RAW} ({os.path.getsize(DELIVERIES_RAW):,} bytes)")
    df_d = pl.read_parquet(DELIVERIES_RAW)
    print(f"  Shape: {df_d.height:,} rows x {df_d.width} columns")
    print("\n  Columns & Data Types:")
    for col, dtype in zip(df_d.columns, df_d.dtypes):
        nulls = df_d[col].null_count()
        null_pct = (nulls / df_d.height) * 100
        print(f"    {col:<22} | {str(dtype):<15} | Nulls: {nulls:<6} ({null_pct:>5.1f}%)")

    print("\n  Sample Delivery Row:")
    first_row = df_d.head(1).to_dicts()[0]
    for k, v in list(first_row.items())[:12]:
        print(f"    {k}: {v}")

    print("\n" + "=" * 75)
    print(" DATASET INSPECTION COMPLETED SUCCESSFULLY")
    print("=" * 75)


if __name__ == "__main__":
    inspect()
