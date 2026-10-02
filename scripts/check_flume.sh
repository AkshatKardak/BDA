#!/usr/bin/env bash
# ==============================================================================
# scripts/check_flume.sh
# Checks status of Apache Flume agent and reviews recent ingestion logs
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$DIR/flume/logs/flume.pid"
LOG_FILE="$DIR/flume/logs/flume.log"

echo "============================================================"
echo " Apache Flume Agent Status Check"
echo "============================================================"

if pgrep -f "flume-ng" > /dev/null; then
    echo "  [STATUS] Flume agent is RUNNING."
else
    echo "  [STATUS] Flume agent is NOT RUNNING."
fi

if [ -f "$LOG_FILE" ]; then
    echo ""
    echo "[INFO] Recent Log Entries (Tail 15 lines):"
    tail -n 15 "$LOG_FILE"
fi

echo ""
echo "[INFO] Ingestion HDFS Sink Check:"
if command -v hdfs &> /dev/null; then
    hdfs dfs -ls -R /ipl/raw/stream/ 2>/dev/null || echo "No stream files in /ipl/raw/stream/ yet."
fi
echo "============================================================"
