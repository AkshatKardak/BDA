#!/usr/bin/env bash
# ==============================================================================
# hadoop/start_hadoop.sh
# Starts Hadoop HDFS and YARN daemons
# ==============================================================================

set -e

if [ -z "$HADOOP_HOME" ]; then
    echo "[WARN] HADOOP_HOME is not set. Trying default /usr/local/hadoop..."
    export HADOOP_HOME=/usr/local/hadoop
fi

echo "[INFO] Starting HDFS NameNode, DataNode, SecondaryNameNode..."
"$HADOOP_HOME/sbin/start-dfs.sh"

echo "[INFO] Starting YARN ResourceManager and NodeManager..."
"$HADOOP_HOME/sbin/start-yarn.sh"

echo ""
echo "[INFO] Active Java Processes (jps):"
jps
echo "============================================================"
