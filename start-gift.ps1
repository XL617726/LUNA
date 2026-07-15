<#
.SYNOPSIS
  LUNA — 一键礼物启动脚本
.DESCRIPTION
  构建项目 → 启动服务器 → 自动打开礼物页面
#>
Write-Host ""
Write-Host "  🌙 LUNA · 星光歌姬" -ForegroundColor Cyan
Write-Host "  正在准备你的礼物..." -ForegroundColor Gray
Write-Host ""

# Step 1: Build
Write-Host "  [1/3] 构建中..." -ForegroundColor Yellow
cd "$PSScriptRoot\apps\web"
$build = npx vite build 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "  ❌ 构建失败" -ForegroundColor Red
  exit 1
}
Write-Host "  ✅ 构建完成" -ForegroundColor Green

# Step 2: Start server
Write-Host "  [2/3] 启动服务器..." -ForegroundColor Yellow
$port = 3000
Start-Process -FilePath "node" -ArgumentList "server.cjs" -WindowStyle Minimized
Start-Sleep -Seconds 2

# Step 3: Open gift page
Write-Host "  [3/3] 打开礼物..." -ForegroundColor Yellow
Start-Process "http://localhost:$port/gift"

Write-Host ""
Write-Host "  ✨ 礼物已打开！" -ForegroundColor Green
Write-Host "  分享链接: http://localhost:$port/gift" -ForegroundColor Cyan
Write-Host ""
Write-Host "  按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""

# Keep script running
try { while ($true) { Start-Sleep -Seconds 60 } } catch {}
