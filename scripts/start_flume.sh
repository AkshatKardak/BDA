#!/usr/bin/env bash
# ==============================================================================
# scripts/start_flume.sh
# Starts Apache Flume ingestion agent with HDFS rolling sink
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "============================================================"
echo " Starting Apache Flume Ingestion Agent"
echo "============================================================"

if ! command -v flume-ng &> /dev/null; then
    echo "[ERROR] 'flume-ng' command not found in PATH."
    echo "Please ensure Apache Flume is installed and FLUME_HOME is configured."
    echo "Refer to flume/README.md for setup instructions."
    exit 1
fi

mkdir -p flume/logs

echo "[INFO] Launching Flume Agent 'agent'..."
flume-ng agent \
  --conf "$DIR/flume" \
  --conf-file "$DIR/flume/ipl-flume.conf" \
  --name agent \
  -Dflume.root.logger=INFO,console \
  > "$DIR/flume/logs/flume.log" 2>&1 &

FLUME_PID=$!
echo "$FLUME_PID" > "$DIR/flume/logs/flume.pid"
echo "[SUCCESS] Flume agent started with PID $FLUME_PID (logs: flume/logs/flume.log)"
echo "============================================================"
