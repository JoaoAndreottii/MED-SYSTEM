#!/bin/bash

# Med-System Deployment Script
# Simplifies Railway deployment process

set -e

echo "🚀 Med-System Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
  echo -e "${RED}❌ Railway CLI not found${NC}"
  echo "Install from: https://docs.railway.app/cli/install"
  exit 1
fi

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
  echo -e "${YELLOW}⚠️ Uncommitted changes detected${NC}"
  echo "Please commit your changes before deploying"
  exit 1
fi

echo -e "${GREEN}✓ Checks passed${NC}"
echo ""

# Get deployment environment
read -p "Enter environment (development/staging/production): " ENVIRONMENT

if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
  echo -e "${RED}❌ Invalid environment${NC}"
  exit 1
fi

echo ""
echo "Deploying to: $ENVIRONMENT"
echo ""

# Build locally first
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Run tests
echo "🧪 Running tests..."
npm run test

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️ Tests failed (continuing anyway)${NC}"
fi

echo ""

# Trigger Railway deployment
echo "🚀 Triggering Railway deployment..."
railway trigger

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Deployment trigger failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Deployment triggered${NC}"
echo ""

# Show deployment status
echo "📊 Monitoring deployment..."
sleep 5
railway logs -f &
LOGS_PID=$!

# Wait for deployment to complete (check every 10 seconds)
while true; do
  STATUS=$(railway status 2>/dev/null || echo "unknown")

  if echo "$STATUS" | grep -q "online\|running"; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    break
  elif echo "$STATUS" | grep -q "failed\|error"; then
    echo -e "${RED}❌ Deployment failed${NC}"
    kill $LOGS_PID 2>/dev/null || true
    exit 1
  fi

  sleep 10
done

kill $LOGS_PID 2>/dev/null || true

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Verify logs: railway logs"
echo "2. Run migrations if needed: railway run npm run prisma:migrate"
echo "3. Check health: railway status"
echo ""

# Optional: Run migrations
read -p "Run database migrations? (y/n): " RUN_MIGRATIONS

if [[ "$RUN_MIGRATIONS" == "y" ]]; then
  echo "🔄 Running migrations..."
  railway run npm run prisma:migrate -- --skip-generate
  echo -e "${GREEN}✓ Migrations complete${NC}"
fi

echo ""
echo "🎉 All done!"
