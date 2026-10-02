#!/usr/bin/env bash
# ==============================================================================
# hadoop/setup_hdfs.sh
# Sets up HDFS directories and copies normalized real IPL datasets into HDFS lake
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "============================================================"
echo " Initializing HDFS Ingestion for IPL Datasets"
echo "============================================================"

# Ensure directories exist
bash "$DIR/hadoop/create_ipl_dirs.sh"

echo "[INFO] Ingesting normalized matches into HDFS..."
if [ -f "$DIR/data/normalized/matches.csv" ]; then
    hdfs dfs -put -f "$DIR/data/normalized/matches.csv" /ipl/raw/matches/
    echo "  [PASS] Uploaded matches.csv -> /ipl/raw/matches/"
else
    echo "  [WARN] data/normalized/matches.csv not found locally."
fi

echo "[INFO] Ingesting baseline normalized deliveries into HDFS..."
if [ -f "$DIR/data/normalized/deliveries.csv" ]; then
    hdfs dfs -put -f "$DIR/data/normalized/deliveries.csv" /ipl/raw/deliveries/
    echo "  [PASS] Uploaded deliveries.csv -> /ipl/raw/deliveries/"
else
    echo "  [WARN] data/normalized/deliveries.csv not found locally."
fi

echo "[INFO] Verifying HDFS storage contents..."
hdfs dfs -ls -h /ipl/raw/matches/
hdfs dfs -ls -h /ipl/raw/deliveries/
echo "============================================================"
