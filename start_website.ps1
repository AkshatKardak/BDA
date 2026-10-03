# ============================================================
# BDA IPL Dashboard — Production Start Script
# ============================================================
# WHY: `next dev` compiles assets lazily in memory. After
# inactivity, in-memory chunks are evicted → browser gets 404
# for CSS/JS files. This script always uses next start
# (production mode) so assets are pre-compiled and stable.
#
# USAGE: Right-click → "Run with PowerShell"
#        Or in a terminal:  .\start_website.ps1
# ============================================================

Write-Host ""
Write-Host "=== BDA IPL Analytics — Production Start ===" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\frontend"

Write-Host "[1/2] Building Next.js (production)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build FAILED. Check errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/2] Starting production server on http://localhost:3000 ..." -ForegroundColor Green
Write-Host "      CSS and JS are pre-compiled. No more 404s after inactivity." -ForegroundColor Green
Write-Host "      Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""
npm run start
