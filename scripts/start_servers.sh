#!/usr/bin/env bash
# =========================================================================
# scripts/start_servers.sh
# =========================================================================
# Starts both FastAPI backend and Next.js frontend servers.

PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "Starting FastAPI Backend on http://127.0.0.1:8000 ..."
$PYTHON_CMD -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "Starting Next.js Frontend on http://localhost:3000 ..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Both servers active!"
echo "Dashboard: http://localhost:3000"
echo "API Docs:  http://127.0.0.1:8000/docs"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
