#!/usr/bin/env bash
# ==============================================================================
# scripts/check_hadoop.sh
# Verifies health of Hadoop NameNode, DataNode, ResourceManager, and HDFS /ipl
# ==============================================================================

echo "============================================================"
echo " Checking Hadoop HDFS and YARN Status"
echo "============================================================"

# Check running daemons
echo "[INFO] Running Java Processes (jps):"
jps

echo ""
# Check HDFS responsiveness
if command -v hdfs &> /dev/null; then
    echo "[INFO] Testing HDFS connectivity..."
    if hdfs dfs -test -d /ipl 2>/dev/null; then
        echo "  [PASS] /ipl lake directory exists on HDFS."
        hdfs dfs -ls /ipl
        echo ""
        echo "[INFO] HDFS Disk Usage on /ipl:"
        hdfs dfs -du -h /ipl
    else
        echo "  [WARN] /ipl directory not found on HDFS. Run hadoop/create_ipl_dirs.sh"
    fi
else
    echo "  [INFO] 'hdfs' CLI not found in current path."
fi
echo "============================================================"
