#!/usr/bin/env python3
"""
scripts/normalize_data.py
=========================
Normalizes downloaded raw IPL dataset into clean, standardized CSV files:
  - data/normalized/matches.csv
  - data/normalized/deliveries.csv
  - data/sample/matches_sample.csv
  - data/sample/deliveries_sample.csv

Rules:
  - Preserves 100% genuine data (No synthetic records).
  - Standardizes team aliases (e.g., Delhi Daredevils -> Delhi Capitals).
  - Standardizes season representations (e.g., 2007/08 -> 2008).
  - Extracts clean integer match_id.
  - Cleans null values safely.
"""

import os
import sys
import re
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
    # If like 2007/08 -> 2008
    m = re.match(r"^(\d{4})/\d{2}$", val)
    if m:
        start_year = int(m.group(1))
        return str(start_year + 1)
    return val


def normalize():
    print("============================================================")
    print("IPL Big Data Analytics: Data Normalization Process")
    print("============================================================")
    
    if not (os.path.exists(MATCHES_RAW) and os.path.exists(DELIVERIES_RAW)):
        print("[FATAL] Raw data not found. Please run scripts/download_data.py first.")
        sys.exit(1)
        
    team_map, venue_map = load_aliases()
    print(f"[INFO] Loaded {len(team_map)} team aliases and {len(venue_map)} venue aliases.")
    
    # --- 1. Normalize Matches ---
    print(f"[INFO] Reading {MATCHES_RAW}...")
    m_df = pl.read_parquet(MATCHES_RAW)
    print(f"       Raw matches count: {m_df.height:,}")
    
    # Extract integer match_id from filename (e.g. 335982.yaml -> 335982)
    m_df = m_df.with_columns(
        pl.col("filename").str.replace(r"\.[a-zA-Z]+$", "").cast(pl.Int64).alias("match_id"),
        pl.col("season").map_elements(clean_season, return_dtype=pl.String).alias("season_norm")
    )
    
    # Map team names
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
    
    # Select clean standardized columns
    match_cols = [
        "match_id", "season", "date", "team1", "team2", "city_norm", "venue",
        "toss_winner", "toss_decision", "winner", "win_type", "win_margin",
        "result", "player_of_match"
    ]
    # Keep only columns that exist
    selected_m_cols = [c for c in match_cols if c in m_df.columns]
    m_clean = m_df.select(selected_m_cols).rename({"city_norm": "city"})
    m_clean = m_clean.sort("match_id")
    
    os.makedirs(NORM_DIR, exist_ok=True)
    out_matches = os.path.join(NORM_DIR, "matches.csv")
    m_clean.write_csv(out_matches)
    print(f"[SUCCESS] Normalized matches written to {out_matches} ({m_clean.height:,} rows).")
    
    # --- 2. Normalize Deliveries ---
    print(f"\n[INFO] Reading {DELIVERIES_RAW}...")
    d_df = pl.read_parquet(DELIVERIES_RAW)
    print(f"       Raw deliveries count: {d_df.height:,}")
    
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
        pl.col("over").cast(pl.Int64).alias("over"),
        pl.col("ball").cast(pl.Int64).alias("ball"),
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
    selected_d_cols = [c for c in deliv_cols if c in d_df.columns]
    d_clean = d_df.select(selected_d_cols)
    d_clean = d_clean.sort(["match_id", "innings", "over", "ball"])
    
    out_deliveries = os.path.join(NORM_DIR, "deliveries.csv")
    d_clean.write_csv(out_deliveries)
    print(f"[SUCCESS] Normalized deliveries written to {out_deliveries} ({d_clean.height:,} rows).")
    
    # --- 3. Create Sample Subset (Real data, first 5 matches) ---
    sample_match_ids = m_clean["match_id"].head(5).to_list()
    m_sample = m_clean.filter(pl.col("match_id").is_in(sample_match_ids))
    d_sample = d_clean.filter(pl.col("match_id").is_in(sample_match_ids))
    
    os.makedirs(SAMPLE_DIR, exist_ok=True)
    m_sample.write_csv(os.path.join(SAMPLE_DIR, "matches_sample.csv"))
    d_sample.write_csv(os.path.join(SAMPLE_DIR, "deliveries_sample.csv"))
    print(f"[SUCCESS] Sample real records saved to {SAMPLE_DIR} ({m_sample.height} matches, {d_sample.height:,} deliveries).")
    print("============================================================\n")


if __name__ == "__main__":
    normalize()
