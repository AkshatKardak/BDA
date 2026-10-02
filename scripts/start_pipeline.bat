@echo off
REM ==============================================================================
REM scripts/start_pipeline.bat
REM Master runner for Windows environments
REM ==============================================================================

echo ======================================================================
echo  IPL Big Data Analytics Pipeline (Windows Runner)
echo ======================================================================

echo.
echo >>> [1/6] Running Data Acquisition...
python scripts\download_data.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo >>> [2/6] Running Data Normalization...
python scripts\normalize_data.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo >>> [3/6] Running Data Integrity Validation...
python scripts\validate_data.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo >>> [4/6] Demonstrating Streaming Replay Event Emission...
python streaming\replay_ipl.py --limit 10 --delay 0.01

echo.
echo >>> [5/6] Executing Distributed PySpark Analytics Engine...
python pyspark\run_all_analytics.py
python pyspark\08_match_prediction.py

echo.
echo >>> [6/6] Verifying Pipeline Audit...
call scripts\verify_pipeline.bat

echo.
echo ======================================================================
echo  PIPELINE EXECUTION COMPLETE!
echo  To start dashboard: streamlit run dashboard\app.py
echo ======================================================================
pause
