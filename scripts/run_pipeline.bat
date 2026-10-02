@echo off
REM =========================================================================
REM scripts/run_pipeline.bat
REM =========================================================================
REM One-click automated end-to-end execution of the IPL Big Data Analytics Pipeline.
REM Runs on Windows via cmd or PowerShell.

echo =========================================================================
echo  IPL LARGE-SCALE CRICKET BIG DATA ANALYTICS PIPELINE
echo  Apache Flume - Hadoop HDFS - Apache Hive - Apache PySpark
echo =========================================================================

REM Detect Python executable
set PYTHON_EXE=python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set PYTHON_EXE="C:\Users\AJIT KARDAK\AppData\Local\Programs\Python\Python311\python.exe"
)

echo [STEP 1/5] Inspecting and Normalizing Genuine IPL Dataset...
%PYTHON_EXE% scripts\normalize_data.py
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Dataset normalization failed.
    exit /b %ERRORLEVEL%
)

echo [STEP 2/5] Validating Data Integrity Constraints...
%PYTHON_EXE% scripts\validate_data.py
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Data validation failed.
    exit /b %ERRORLEVEL%
)

echo [STEP 3/5] Executing Apache PySpark Distributed Analytics Suite...
%PYTHON_EXE% pyspark\run_all_analytics.py
if %ERRORLEVEL% neq 0 (
    echo [ERROR] PySpark analytics failed.
    exit /b %ERRORLEVEL%
)

echo [STEP 4/5] Exporting Analytics Marts to Web Lake (web_data/)...
%PYTHON_EXE% pyspark\export_web_data.py
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Web data export failed.
    exit /b %ERRORLEVEL%
)

echo [STEP 5/5] Performing End-to-End Pipeline Integrity Audit...
%PYTHON_EXE% scripts\verify_pipeline.py
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Pipeline audit failed.
    exit /b %ERRORLEVEL%
)

echo =========================================================================
echo  PIPELINE EXECUTION COMPLETED SUCCESSFULLY!
echo =========================================================================
echo To start the web servers, run:
echo   scripts\start_servers.bat
