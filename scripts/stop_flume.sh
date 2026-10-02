#!/usr/bin/env bash
# ==============================================================================
# scripts/stop_flume.sh
# Gracefully stops Apache Flume agent
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$DIR/flume/logs/flume.pid"

echo "============================================================"
echo " Stopping Apache Flume Ingestion Agent"
echo "============================================================"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo "[INFO] Terminating Flume process PID $PID..."
    kill "$PID" 2>/dev/null || true
    rm -f "$PID_FILE"
fi

pkill -f "flume-ng" || true
echo "[SUCCESS] Flume agent stopped."
echo "============================================================"
