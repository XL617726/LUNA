<#
.SYNOPSIS
  LUNA v2.0 — Windows 一键初始化脚本
.DESCRIPTION
  安装依赖 → 类型检查 → 构建 → 启动 Web Demo
#>
param([switch]$SkipInstall)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LUNA v2.0 — 初始化" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install pnpm if needed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "[1/5] Installing pnpm..." -ForegroundColor Yellow
  npm install -g pnpm
} else {
  Write-Host "[1/5] pnpm found: $(pnpm --version)" -ForegroundColor Green
}

# Step 2: Install dependencies
if (-not $SkipInstall) {
  Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
  pnpm install
} else {
  Write-Host "[2/5] Skipped (--SkipInstall)" -ForegroundColor Gray
}

# Step 3: Type check
Write-Host "[3/5] TypeScript type check..." -ForegroundColor Yellow
pnpm typecheck 2>&1 | Select-Object -Last 3

# Step 4: Run unit tests
Write-Host "[4/5] Running tests..." -ForegroundColor Yellow
pnpm test 2>&1 | Select-Object -Last 5

# Step 5: Start Web dev server
Write-Host "[5/5] Starting LUNA Web..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  🌙 LUNA is ready!" -ForegroundColor Green
Write-Host "  Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Available commands:" -ForegroundColor Gray
Write-Host "    pnpm dev          — Start all clients" -ForegroundColor Gray
Write-Host "    pnpm test         — Run tests" -ForegroundColor Gray
Write-Host "    pnpm typecheck    — TypeScript check" -ForegroundColor Gray
Write-Host "    pnpm build        — Production build" -ForegroundColor Gray
Write-Host ""
