#!/usr/bin/env bash
# ==============================================================================
# hadoop/create_ipl_dirs.sh
# Creates HDFS directory lake structure for IPL Big Data Analytics
# ==============================================================================

set -e

echo "============================================================"
echo " Creating HDFS IPL Data Lake Hierarchy"
echo "============================================================"

# Check if hdfs CLI is accessible
if ! command -v hdfs &> /dev/null; then
    echo "[ERROR] 'hdfs' command not found in PATH."
    echo "Please ensure Hadoop is installed and \$HADOOP_HOME/bin is in PATH."
    exit 1
fi

echo "[INFO] Creating Lake Directories..."
hdfs dfs -mkdir -p /ipl/raw/matches
hdfs dfs -mkdir -p /ipl/raw/deliveries
hdfs dfs -mkdir -p /ipl/processed/matches
hdfs dfs -mkdir -p /ipl/processed/deliveries
hdfs dfs -mkdir -p /ipl/analytics/players
hdfs dfs -mkdir -p /ipl/analytics/teams
hdfs dfs -mkdir -p /ipl/analytics/venues
hdfs dfs -mkdir -p /ipl/analytics/toss
hdfs dfs -mkdir -p /ipl/analytics/seasons
hdfs dfs -mkdir -p /ipl/output/player_performance
hdfs dfs -mkdir -p /ipl/output/team_performance
hdfs dfs -mkdir -p /ipl/output/toss_analysis
hdfs dfs -mkdir -p /ipl/output/venue_analysis
hdfs dfs -mkdir -p /ipl/output/season_analysis

echo "[INFO] Setting permissions (775) on /ipl..."
hdfs dfs -chmod -R 775 /ipl

echo "[SUCCESS] HDFS directories initialized successfully:"
hdfs dfs -ls -R /ipl
echo "============================================================"
