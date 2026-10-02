@echo off
REM =========================================================================
REM scripts/start_servers.bat
REM =========================================================================
REM Starts both FastAPI backend (port 8000) and Next.js frontend (port 3000).

echo =========================================================================
echo  STARTING IPL BIG DATA ANALYTICS SERVERS
echo =========================================================================

REM Detect Python executable
set PYTHON_EXE=python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set PYTHON_EXE="C:\Users\AJIT KARDAK\AppData\Local\Programs\Python\Python311\python.exe"
)

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "FastAPI Backend" cmd /k "%PYTHON_EXE% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Next.js Frontend on http://localhost:3000 ...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching:
echo   - Web Dashboard:  http://localhost:3000
echo   - Backend API:    http://127.0.0.1:8000
echo   - Interactive API Docs: http://127.0.0.1:8000/docs
echo =========================================================================
