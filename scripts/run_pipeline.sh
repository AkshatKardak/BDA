#!/usr/bin/env bash
# =========================================================================
# scripts/run_pipeline.sh
# =========================================================================
# One-command automated end-to-end execution of the IPL Big Data Pipeline.

set -e

echo "========================================================================="
echo " IPL LARGE-SCALE CRICKET BIG DATA ANALYTICS PIPELINE"
echo " Apache Flume - Hadoop HDFS - Apache Hive - Apache PySpark"
echo "========================================================================="

PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "[STEP 1/5] Inspecting and Normalizing Genuine IPL Dataset..."
$PYTHON_CMD scripts/normalize_data.py

echo "[STEP 2/5] Validating Data Integrity Constraints..."
$PYTHON_CMD scripts/validate_data.py

echo "[STEP 3/5] Executing Apache PySpark Distributed Analytics Suite..."
$PYTHON_CMD pyspark/run_all_analytics.py

echo "[STEP 4/5] Exporting Analytics Marts to Web Lake (web_data/)..."
$PYTHON_CMD pyspark/export_web_data.py

echo "[STEP 5/5] Performing End-to-End Pipeline Integrity Audit..."
$PYTHON_CMD scripts/verify_pipeline.py

echo "========================================================================="
echo " PIPELINE EXECUTION COMPLETED SUCCESSFULLY!"
echo "========================================================================="
echo "To start the web servers, execute:"
echo "  ./scripts/start_servers.sh"
