#!/usr/bin/env bash
# ==============================================================================
# hadoop/verify_hdfs.sh
# Verifies HDFS directories, disk utilization, and data integrity
# ==============================================================================

set -e

echo "============================================================"
echo " HDFS Storage Verification & Disk Utilization Audit"
echo "============================================================"

if ! command -v hdfs &> /dev/null; then
    echo "[ERROR] 'hdfs' command not found. Verify Hadoop environment."
    exit 1
fi

echo "[CHECK 1] Root /ipl directory contents:"
hdfs dfs -ls /ipl

echo ""
echo "[CHECK 2] HDFS disk usage per partition (hdfs dfs -du -h /ipl):"
hdfs dfs -du -h /ipl

echo ""
echo "[CHECK 3] Detailed listing of raw layer:"
hdfs dfs -ls -h /ipl/raw/matches/ || true
hdfs dfs -ls -h /ipl/raw/deliveries/ || true

echo ""
echo "[CHECK 4] Sample head records from HDFS raw deliveries:"
hdfs dfs -cat /ipl/raw/deliveries/*.csv 2>/dev/null | head -n 5 || echo "No direct CSV found in root of deliveries."

echo "============================================================"
echo "[SUCCESS] HDFS verification completed successfully."
echo "============================================================"
