#!/usr/bin/env python3
"""
pipeline/normalize_data.py
==========================
Normalizes raw IPL Parquet datasets into clean, standardized analytical structures
and generates streaming event JSON Lines (deliveries.jsonl) for Apache Flume.

Outputs:
  - data/normalized/matches.csv
  - data/normalized/deliveries.csv
  - data/normalized/deliveries.jsonl
  - data/sample/deliveries_sample.jsonl

Rules:
  - Preserves 100% genuine historical IPL records. Zero synthetic records.
  - Standardizes franchise aliases (Delhi Daredevils -> Delhi Capitals, etc.).
  - Standardizes tournament seasons (2007/08 -> 2008).
"""

import os
import sys
import re
import json
import polars as pl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
NORM_DIR = os.path.join(BASE_DIR, "data", "normalized")
SAMPLE_DIR = os.path.join(BASE_DIR, "data", "sample")

MATCHES_RAW = os.path.join(RAW_DIR, "matches", "matches.parquet")
DELIVERIES_RAW = os.path.join(RAW_DIR, "deliveries", "deliveries.parquet")
TEAM_ALIASES_FILE = os.path.join(RAW_DIR, "dim_team_aliases.csv")
VENUE_ALIASES_FILE = os.path.join(RAW_DIR, "dim_venue_aliases.csv")


def load_aliases():
    team_map = {}
    if os.path.exists(TEAM_ALIASES_FILE):
        df = pl.read_csv(TEAM_ALIASES_FILE)
        for row in df.iter_rows(named=True):
            team_map[row["alias_name"].strip()] = row["canonical_name"].strip()

    venue_map = {}
    if os.path.exists(VENUE_ALIASES_FILE):
        df = pl.read_csv(VENUE_ALIASES_FILE)
        for row in df.iter_rows(named=True):
            venue_map[row["alias_city"].strip()] = row["canonical_city"].strip()

    return team_map, venue_map


def clean_season(val):
    if val is None:
        return "Unknown"
    val = str(val).strip()
    m = re.match(r"^(\d{4})/\d{2}$", val)
    if m:
        return str(int(m.group(1)) + 1)
    return val


def main():
    print("=" * 75)
    print(" IPL DATA PIPELINE: DATA NORMALIZATION & STREAM EVENT ENCODING")
    print("=" * 75)

    if not (os.path.exists(MATCHES_RAW) and os.path.exists(DELIVERIES_RAW)):
        print("[FATAL] Raw data not found. Run scripts/download_data.py first.")
        sys.exit(1)

    team_map, venue_map = load_aliases()
    print(f"[INFO] Loaded {len(team_map)} team aliases and {len(venue_map)} venue aliases.")

    # 1. Normalize Matches
    print(f"[INFO] Processing {MATCHES_RAW}...")
    m_df = pl.read_parquet(MATCHES_RAW)

    m_df = m_df.with_columns([
        pl.col("filename").str.replace(r"\.[a-zA-Z]+$", "").cast(pl.Int64).alias("match_id"),
        pl.col("season").map_elements(clean_season, return_dtype=pl.String).alias("season_norm")
    ])

    def remap_team(col_name):
        return pl.col(col_name).map_elements(
            lambda x: team_map.get(str(x).strip(), str(x).strip()) if x is not None else None,
            return_dtype=pl.String
        )

    m_df = m_df.with_columns([
        remap_team("team1").alias("team1"),
        remap_team("team2").alias("team2"),
        remap_team("toss_winner").alias("toss_winner"),
        remap_team("winner").alias("winner"),
        pl.col("city").map_elements(
            lambda x: venue_map.get(str(x).strip(), str(x).strip()) if x is not None else "Unknown",
            return_dtype=pl.String
        ).alias("city_norm"),
        pl.col("season_norm").alias("season")
    ])

    match_cols = [
        "match_id", "season", "date", "team1", "team2", "city_norm", "venue",
        "toss_winner", "toss_decision", "winner", "win_type", "win_margin",
        "result", "player_of_match"
    ]
    m_clean = m_df.select([c for c in match_cols if c in m_df.columns]).rename({"city_norm": "city"}).sort("match_id")

    os.makedirs(NORM_DIR, exist_ok=True)
    out_matches_csv = os.path.join(NORM_DIR, "matches.csv")
    m_clean.write_csv(out_matches_csv)
    print(f"  [PASS] Saved {m_clean.height:,} normalized matches -> {out_matches_csv}")

    # 2. Normalize Deliveries
    print(f"[INFO] Processing {DELIVERIES_RAW}...")
    d_df = pl.read_parquet(DELIVERIES_RAW)

    d_df = d_df.with_columns([
        pl.col("season").map_elements(clean_season, return_dtype=pl.String).alias("season"),
        remap_team("team1").alias("team1"),
        remap_team("team2").alias("team2"),
        remap_team("batting_team").alias("batting_team"),
        remap_team("bowling_team").alias("bowling_team"),
        pl.col("city").map_elements(
            lambda x: venue_map.get(str(x).strip(), str(x).strip()) if x is not None else "Unknown",
            return_dtype=pl.String
        ).alias("city"),
        pl.col("batter_runs").fill_null(0).cast(pl.Int64).alias("batter_runs"),
        pl.col("extras_total").fill_null(0).cast(pl.Int64).alias("extras_total"),
        pl.col("total_runs").fill_null(0).cast(pl.Int64).alias("total_runs"),
        pl.col("is_wicket").fill_null(0).cast(pl.Int64).alias("is_wicket")
    ])

    deliv_cols = [
        "match_id", "season", "date", "venue", "city",
        "innings", "over", "ball", "batting_team", "bowling_team",
        "batter", "bowler", "non_striker",
        "batter_runs", "extras_total", "total_runs",
        "wides", "noballs", "byes", "legbyes", "penalty",
        "is_wicket", "player_out", "dismissal_kind", "fielder"
    ]
    d_clean = d_df.select([c for c in deliv_cols if c in d_df.columns]).sort(["match_id", "innings", "over", "ball"])

    out_deliv_csv = os.path.join(NORM_DIR, "deliveries.csv")
    d_clean.write_csv(out_deliv_csv)
    print(f"  [PASS] Saved {d_clean.height:,} normalized deliveries -> {out_deliv_csv}")

    # 3. Generate JSON Lines for Flume Streaming Replay (Section 12 specification)
    out_deliv_jsonl = os.path.join(NORM_DIR, "deliveries.jsonl")
    print(f"[INFO] Writing streaming JSON Lines to {out_deliv_jsonl}...")

    # Write first 50,000 to deliveries.jsonl (or all in streaming chunks) for instant Flume ingestion
    # and full sample
    sample_jsonl = os.path.join(SAMPLE_DIR, "deliveries_sample.jsonl")
    os.makedirs(SAMPLE_DIR, exist_ok=True)

    with open(out_deliv_jsonl, "w", encoding="utf-8") as f_full, open(sample_jsonl, "w", encoding="utf-8") as f_sample:
        for idx, row in enumerate(d_clean.iter_rows(named=True)):
            event = {
                "match_id": int(row["match_id"]),
                "season": str(row["season"]),
                "match_date": str(row["date"]),
                "venue": str(row["venue"]),
                "team1": str(row.get("batting_team", "")),
                "team2": str(row.get("bowling_team", "")),
                "innings": int(row["innings"]),
                "over": int(row["over"]),
                "ball": int(row["ball"]),
                "batter": str(row["batter"]),
                "bowler": str(row["bowler"]),
                "non_striker": str(row.get("non_striker", "") or ""),
                "runs_batter": int(row.get("batter_runs", 0)),
                "runs_extras": int(row.get("extras_total", 0)),
                "runs_total": int(row.get("total_runs", 0)),
                "is_wicket": bool(row.get("is_wicket", 0))
            }
            line = json.dumps(event) + "\n"
            f_full.write(line)
            if idx < 2000:
                f_sample.write(line)
            if idx >= 100000:  # write 100k events for rapid file size
                break

    print(f"  [PASS] Generated streaming event JSON Lines -> {out_deliv_jsonl}")
    print(f"  [PASS] Generated development sample JSON Lines -> {sample_jsonl}")
    print("=" * 75)


if __name__ == "__main__":
    main()
