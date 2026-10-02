#!/usr/bin/env python3
"""
run_pipeline.py
===============
Cross-platform Master Orchestrator for IPL Big Data Analytics.
Executes data ingestion, normalization, validation, streaming replay,
and distributed PySpark analytics stages with full progress tracking.

Works natively on Windows, macOS, Linux, and WSL2.
Automatically selects an available Python environment with PySpark support (e.g. Python 3.11).
"""

import os
import sys
import subprocess
import time
import platform

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def check_pyspark_valid(cmd_prefix):
    """Executes a probe to confirm real Apache PySpark (with pyspark.sql) is available."""
    try:
        probe_code = "import pyspark; from pyspark.sql.types import StructType; assert hasattr(pyspark, '__version__')"
        # Run probe from a neutral temp/parent directory to avoid colliding with local pyspark/ directory
        neutral_dir = os.path.dirname(BASE_DIR)
        res = subprocess.run(cmd_prefix + ["-c", probe_code], cwd=neutral_dir, capture_output=True)
        return res.returncode == 0
    except Exception:
        return False


def get_pyspark_runner():
    """Detects and returns the command line list for a Python environment that has PySpark installed."""
    # 1. Does current host python have real pyspark?
    if check_pyspark_valid([sys.executable]):
        return [sys.executable]

    # 2. Check py -3.11 launcher (standard Windows Python Launcher)
    if check_pyspark_valid(["py", "-3.11"]):
        return ["py", "-3.11"]

    # 3. Check known Python 3.11 installations on Windows
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    candidates = [
        os.path.join(local_app_data, "Programs", "Python", "Python311", "python.exe"),
        r"C:\Users\AJIT KARDAK\AppData\Local\Programs\Python\Python311\python.exe",
        r"C:\Python311\python.exe",
        r"C:\Program Files\Python311\python.exe",
    ]
    for p in candidates:
        if p and os.path.isfile(p):
            if check_pyspark_valid([p]):
                return [p]

    # 4. Check py -3.12 or py -3.10
    for ver in ["-3.12", "-3.10", "-3.9"]:
        if check_pyspark_valid(["py", ver]):
            return ["py", ver]

    return [sys.executable]


PYTHON_RUNNER = get_pyspark_runner()


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
    print(f" OS Detected:    {platform.system()} {platform.release()} ({platform.machine()})")
    print(f" Host Python:    {sys.version.split()[0]} ({sys.executable})")
    print(f" PySpark Runner: {' '.join(PYTHON_RUNNER)}")
    print("*" * 70)

    # 1. Download genuine dataset
    print_step(1, "Data Acquisition (Genuine Cricsheet IPL Records)")
    run_command(PYTHON_RUNNER + [os.path.join("scripts", "download_data.py")], "Dataset Ingestion")

    # 2. Normalize Schema
    print_step(2, "Data Normalization & Franchise Aliasing")
    run_command(PYTHON_RUNNER + [os.path.join("scripts", "normalize_data.py")], "Schema Normalization")

    # 3. Validate Integrity
    print_step(3, "Dataset Integrity & Statistical Audit")
    run_command(PYTHON_RUNNER + [os.path.join("scripts", "validate_data.py")], "Data Validation")

    # 4. Demonstrate Streaming Replay (Flume Event Emission)
    print_step(4, "Demonstrating Streaming Replay (Flume Ingestion Source)")
    print("[INFO] Replaying 10 real historical deliveries as streaming events...")
    run_command(PYTHON_RUNNER + [os.path.join("streaming", "replay_ipl.py"), "--limit", "10", "--delay", "0.01"], "Streaming Replay")

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
        run_command(PYTHON_RUNNER + [os.path.join(BASE_DIR, script)], label)

    # Summary
    print("\n" + "*" * 70)
    print(" ALL PIPELINE STAGES COMPLETED SUCCESSFULLY!")
    print(" Analytical results stored in: output/")
    print(" 1. Launch FastAPI Backend: python -m uvicorn backend.main:app --port 8000 --reload")
    print(" 2. Launch Next.js Web UI:  cd frontend && npm run dev")
    print("*" * 70 + "\n")


if __name__ == "__main__":
    main()
