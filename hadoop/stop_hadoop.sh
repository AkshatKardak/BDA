#!/usr/bin/env bash
# ==============================================================================
# hadoop/stop_hadoop.sh
# Stops Hadoop HDFS and YARN daemons
# ==============================================================================

if [ -z "$HADOOP_HOME" ]; then
    export HADOOP_HOME=/usr/local/hadoop
fi

echo "[INFO] Stopping YARN daemons..."
"$HADOOP_HOME/sbin/stop-yarn.sh"

echo "[INFO] Stopping HDFS daemons..."
"$HADOOP_HOME/sbin/stop-dfs.sh"

echo "[INFO] Hadoop shutdown complete."
