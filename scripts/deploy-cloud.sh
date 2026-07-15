#!/bin/bash
# ============================================
#  LUNA CloudBase Deployment Script
#  部署所有云函数到微信云开发环境
# ============================================
set -e

echo "🌙 LUNA CloudBase Deploy"
echo "========================"

# Configuration
ENV_ID="${LUNA_ENV_ID:-luna-prod}"

echo ""
echo "[1/4] Checking CloudBase CLI..."
if ! command -v cloudbase &> /dev/null; then
  echo "  Installing @cloudbase/cli..."
  npm install -g @cloudbase/cli
fi

echo ""
echo "[2/4] Login to CloudBase..."
cloudbase login

echo ""
echo "[3/4] Deploying cloud functions to env: $ENV_ID..."

FUNCTIONS=("uploadMusic" "analyzeAudio" "aiChat" "saveMemory" "userProfile")

for func in "${FUNCTIONS[@]}"; do
  echo "  Deploying $func..."
  cloudbase functions:deploy "$func" --envId "$ENV_ID" --path "cloudfunctions/$func"
done

echo ""
echo "[4/4] Deploy complete!"
echo ""
echo "  Functions deployed:"
for func in "${FUNCTIONS[@]}"; do
  echo "    ✅ $func"
done
echo ""
echo "  Environment: $ENV_ID"
echo "  LUNA Cloud is ready 🌙"
echo ""
