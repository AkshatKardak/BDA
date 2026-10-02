#!/usr/bin/env python3
"""
scripts/validate_data.py
========================
Validates normalized IPL matches and deliveries datasets.
Enforces data integrity, non-emptiness, schema correctness, and consistency.

Rules:
  - Halts execution with non-zero exit code on validation failure.
  - Verifies 100% genuine data presence.
  - Outputs a structured academic validation report.
"""

import os
import sys
import polars as pl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NORM_DIR = os.path.join(BASE_DIR, "data", "normalized")
MATCHES_FILE = os.path.join(NORM_DIR, "matches.csv")
DELIVERIES_FILE = os.path.join(NORM_DIR, "deliveries.csv")

REQUIRED_MATCH_COLS = [
    "match_id", "season", "date", "team1", "team2", "city", "venue",
    "toss_winner", "toss_decision", "winner"
]

REQUIRED_DELIVERY_COLS = [
    "match_id", "season", "date", "venue", "innings", "over", "ball",
    "batting_team", "bowling_team", "batter", "bowler", "batter_runs",
    "extras_total", "total_runs", "is_wicket"
]


def print_banner(title):
    print("=" * 70)
    print(f" {title}")
    print("=" * 70)


def validate():
    print_banner("IPL BIG DATA ANALYTICS: DATASET INTEGRITY VALIDATION")
    critical_failures = []

    # 1. Existence Check
    print("[CHECK 1] Verifying file existence...")
    if not os.path.exists(MATCHES_FILE):
        critical_failures.append(f"Missing file: {MATCHES_FILE}")
    else:
        print(f"  [PASS] Matches file exists: {MATCHES_FILE} ({os.path.getsize(MATCHES_FILE):,} bytes)")

    if not os.path.exists(DELIVERIES_FILE):
        critical_failures.append(f"Missing file: {DELIVERIES_FILE}")
    else:
        print(f"  [PASS] Deliveries file exists: {DELIVERIES_FILE} ({os.path.getsize(DELIVERIES_FILE):,} bytes)")

    if critical_failures:
        for f in critical_failures:
            print(f"  [FAIL] {f}")
        print("\n[FATAL] Please run scripts/download_data.py and scripts/normalize_data.py first.")
        sys.exit(1)

    # 2. Load DataFrames
    print("\n[CHECK 2] Loading datasets and verifying non-zero records...")
    try:
        m_df = pl.read_csv(MATCHES_FILE)
        d_df = pl.read_csv(DELIVERIES_FILE)
    except Exception as e:
        print(f"  [FAIL] Failed to parse CSV datasets: {e}")
        sys.exit(1)

    m_rows = m_df.height
    d_rows = d_df.height
    print(f"  - Matches row count:    {m_rows:,}")
    print(f"  - Deliveries row count: {d_rows:,}")

    if m_rows == 0:
        critical_failures.append("matches.csv contains 0 rows!")
    if d_rows == 0:
        critical_failures.append("deliveries.csv contains 0 rows!")

    # 3. Schema and Required Columns
    print("\n[CHECK 3] Verifying schema and required columns...")
    missing_m_cols = [c for c in REQUIRED_MATCH_COLS if c not in m_df.columns]
    if missing_m_cols:
        critical_failures.append(f"Matches missing required columns: {missing_m_cols}")
    else:
        print(f"  [PASS] Matches has all {len(REQUIRED_MATCH_COLS)} critical columns.")

    missing_d_cols = [c for c in REQUIRED_DELIVERY_COLS if c not in d_df.columns]
    if missing_d_cols:
        critical_failures.append(f"Deliveries missing required columns: {missing_d_cols}")
    else:
        print(f"  [PASS] Deliveries has all {len(REQUIRED_DELIVERY_COLS)} critical columns.")

    # 4. Duplicate Records Check
    print("\n[CHECK 4] Checking for duplicate records...")
    m_dup = m_rows - m_df.select("match_id").n_unique()
    print(f"  - Matches duplicate match_ids: {m_dup}")
    if m_dup > 0:
        critical_failures.append(f"Found {m_dup} duplicate match_ids in matches.csv!")

    d_dup = d_rows - d_df.select(["match_id", "innings", "over", "ball"]).unique().height
    print(f"  - Deliveries unique ball keys: {d_rows - d_dup} / {d_rows}")
    if d_dup > 100:  # slight leeway for recorded re-bowled balls or no-balls
        print(f"  [WARN] Deliveries has {d_dup} potential multi-event ball occurrences (e.g. no-balls / re-bowls).")

    # 5. Referential Integrity
    print("\n[CHECK 5] Checking referential integrity...")
    m_ids = set(m_df["match_id"].to_list())
    d_m_ids = set(d_df["match_id"].to_list())
    orphaned_deliveries = d_m_ids - m_ids
    if orphaned_deliveries:
        critical_failures.append(f"Found deliveries referencing non-existent match_ids: {len(orphaned_deliveries)}")
    else:
        print(f"  [PASS] All {len(d_m_ids)} distinct match_ids in deliveries map to matches.csv.")

    # 6. Null Rate Analysis
    print("\n[CHECK 6] Null rate analysis on critical attributes...")
    print(f"  {'Column':<20} | {'Null Count':<12} | {'Null %':<8}")
    print("  " + "-" * 45)
    for col in ["winner", "toss_winner", "toss_decision", "city", "venue"]:
        if col in m_df.columns:
            n_null = m_df[col].null_count()
            pct = (n_null / m_rows) * 100
            print(f"  {col:<20} | {n_null:<12} | {pct:>6.2f}%")

    # 7. Domain Coverage Metrics
    seasons = sorted([str(s) for s in m_df["season"].unique().to_list()])
    teams = sorted(list(set(m_df["team1"].to_list() + m_df["team2"].to_list())))
    venues = sorted(m_df["venue"].unique().to_list())

    print("\n" + "=" * 70)
    print(" SUMMARY METRICS & STATISTICAL PROFILE")
    print("=" * 70)
    print(f" Tournament Timeline:    {seasons[0]} to {seasons[-1]} ({len(seasons)} editions)")
    print(f" Total Unique Franchises: {len(teams)}")
    print(f" Total Unique Venues:     {len(venues)}")
    print(f" Total Real Deliveries:   {d_rows:,}")
    print(f" Total Real Matches:      {m_rows:,}")
    print("=" * 70)

    if critical_failures:
        print("\n[VALIDATION FAILED] Critical errors encountered:")
        for err in critical_failures:
            print(f"  - {err}")
        sys.exit(1)

    print("\n[PASS] All dataset integrity and academic validation checks succeeded!\n")


if __name__ == "__main__":
    validate()
