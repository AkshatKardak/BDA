#!/usr/bin/env bash
# ==============================================================================
# scripts/stop_pipeline.sh
# Safely stops background streaming, Flume agents, and Hadoop daemons
# ==============================================================================

echo "======================================================================"
echo " Stopping IPL Big Data Analytics Pipeline & Services"
echo "======================================================================"

# Stop Python replay processes
echo "[INFO] Terminating active streaming replay processes..."
pkill -f "replay_ipl.py" || true

# Stop Flume agent
echo "[INFO] Terminating Apache Flume agent..."
pkill -f "flume-ng" || true

# Stop Streamlit
echo "[INFO] Terminating active Streamlit servers..."
pkill -f "streamlit run" || true

# Stop Hadoop daemons if script exists
if [ -f "hadoop/stop_hadoop.sh" ]; then
    echo "[INFO] Stopping Hadoop HDFS and YARN daemons..."
    bash hadoop/stop_hadoop.sh || true
fi

echo "[SUCCESS] All pipeline background services stopped successfully."
echo "======================================================================"
