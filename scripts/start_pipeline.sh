#!/usr/bin/env bash
# ==============================================================================
# scripts/start_pipeline.sh
# End-to-End Orchestrator: Downloads data, starts Hadoop, Flume, PySpark & Dashboard
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "======================================================================"
echo " Starting IPL Big Data Analytics Pipeline"
echo "======================================================================"

# Step 1: Download Real Data
echo "\n>>> [1/7] Ingesting genuine historical IPL dataset..."
python3 scripts/download_data.py || python scripts/download_data.py

# Step 2: Normalize Data
echo "\n>>> [2/7] Normalizing matches and deliveries..."
python3 scripts/normalize_data.py || python scripts/normalize_data.py

# Step 3: Validate Integrity
echo "\n>>> [3/7] Running strict data validation..."
python3 scripts/validate_data.py || python scripts/validate_data.py

# Step 4: Setup HDFS if Hadoop is active
if command -v hdfs &> /dev/null; then
    echo "\n>>> [4/7] Initializing HDFS Data Lake directories..."
    bash hadoop/setup_hdfs.sh
else
    echo "\n>>> [4/7] Hadoop HDFS CLI not detected in PATH; using local data lake."
fi

# Step 5: Execute PySpark Analytics Pipeline
echo "\n>>> [5/7] Executing PySpark Distributed Analytics..."
for stage in pyspark/01_ingestion.py pyspark/02_cleaning.py pyspark/03_player_analysis.py pyspark/04_team_analysis.py pyspark/05_toss_analysis.py pyspark/06_venue_analysis.py pyspark/07_season_analysis.py pyspark/08_match_prediction.py; do
    echo "  -> Running $stage..."
    python3 "$stage" || python "$stage"
done

# Step 6: Verify Pipeline Integrity
echo "\n>>> [6/7] Running Verification Audit..."
bash scripts/verify_pipeline.sh

# Step 7: Launch Dashboard
echo "\n>>> [7/7] Launching Streamlit Interactive Dashboard..."
echo "To view dashboard, execute: streamlit run dashboard/app.py"
echo "======================================================================"
