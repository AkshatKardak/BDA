#!/usr/bin/env python3
"""
run_pipeline.py
===============
Cross-platform Master Orchestrator for IPL Big Data Analytics.
Executes data ingestion, normalization, validation, streaming replay,
and distributed PySpark analytics stages with full progress tracking.

Works natively on Windows, macOS, Linux, and WSL2.
"""

import os
import sys
import subprocess
import time
import platform

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PYTHON_EXE = sys.executable


def print_step(step_num, title):
    print("\n" + "=" * 70)
    print(f" STEP {step_num}: {title}")
    print("=" * 70)


def run_command(cmd, desc):
    print(f"[RUN] {desc}")
    start = time.time()
    res = subprocess.run(cmd, cwd=BASE_DIR)
    elapsed = time.time() - start
    if res.returncode != 0:
        print(f"[FAIL] {desc} failed with exit code {res.returncode} ({elapsed:.2f}s)")
        sys.exit(res.returncode)
    print(f"[PASS] {desc} completed successfully in {elapsed:.2f}s")


def main():
    print("*" * 70)
    print(" IPL LARGE-SCALE BIG DATA ANALYTICS PIPELINE")
    print(" Technologies: Apache Flume | Hadoop HDFS | Apache Hive | PySpark")
    print(f" OS Detected:  {platform.system()} {platform.release()} ({platform.machine()})")
    print(f" Python:       {sys.version.split()[0]} ({PYTHON_EXE})")
    print("*" * 70)

    # 1. Download genuine dataset
    print_step(1, "Data Acquisition (Genuine Cricsheet IPL Records)")
    run_command([PYTHON_EXE, os.path.join("scripts", "download_data.py")], "Dataset Ingestion")

    # 2. Normalize Schema
    print_step(2, "Data Normalization & Franchise Aliasing")
    run_command([PYTHON_EXE, os.path.join("scripts", "normalize_data.py")], "Schema Normalization")

    # 3. Validate Integrity
    print_step(3, "Dataset Integrity & Statistical Audit")
    run_command([PYTHON_EXE, os.path.join("scripts", "validate_data.py")], "Data Validation")

    # 4. Demonstrate Streaming Replay (Flume Event Emission)
    print_step(4, "Demonstrating Streaming Replay (Flume Ingestion Source)")
    print("[INFO] Replaying 10 real historical deliveries as streaming events...")
    run_command([PYTHON_EXE, os.path.join("streaming", "replay_ipl.py"), "--limit", "10", "--delay", "0.01"], "Streaming Replay")

    # 5. Distributed PySpark Analytics Stages
    stages = [
        ("pyspark/01_ingestion.py", "Stage 1: Explicit StructType Ingestion & Lake Persistence"),
        ("pyspark/02_cleaning.py", "Stage 2: Feature Engineering & Phase Partitioning"),
        ("pyspark/03_player_analysis.py", "Stage 3: Player Leaderboards & Window Rankings"),
        ("pyspark/04_team_analysis.py", "Stage 4: Franchise Performance & Head-to-Head Rivalries"),
        ("pyspark/05_toss_analysis.py", "Stage 5: Toss Advantage & Decision Dynamics"),
        ("pyspark/06_venue_analysis.py", "Stage 6: Stadium Behavior & Pitch Characteristics"),
        ("pyspark/07_season_analysis.py", "Stage 7: Macro-Temporal Tournament Evolution (2008-2026)"),
        ("pyspark/08_match_prediction.py", "Stage 8: Optional ML Pre-Match Outcome Forecasting")
    ]

    for idx, (script, label) in enumerate(stages, start=5):
        print_step(idx, label)
        run_command([PYTHON_EXE, os.path.join(BASE_DIR, script)], label)

    # Summary
    print("\n" + "*" * 70)
    print(" ALL PIPELINE STAGES COMPLETED SUCCESSFULLY!")
    print(" Analytical results stored in: output/")
    print(" Launch Interactive Dashboard with: streamlit run dashboard/app.py")
    print("*" * 70 + "\n")


if __name__ == "__main__":
    main()
