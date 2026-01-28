#!/bin/bash
set -e

# ===========================================
# Deployment Script for Linux VPS
# ===========================================

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please copy .env.production.example to .env.production and fill in values"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.production | xargs)

echo -e "${YELLOW}1. Pulling latest code...${NC}"
git pull origin main

echo -e "${YELLOW}2. Building Docker images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}3. Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "${YELLOW}4. Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}5. Waiting for services to be healthy...${NC}"
sleep 10

# Check if services are running
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "Services status:"
    docker compose -f docker-compose.prod.yml ps
    echo ""
    echo -e "${GREEN}Your site should be available at: ${PUBLIC_SITE_URL:-http://localhost}${NC}"
    echo -e "${GREEN}Admin panel: ${PUBLIC_VENDURE_URL:-http://localhost}/admin${NC}"
else
    echo -e "${RED}❌ Deployment may have failed. Check logs:${NC}"
    docker compose -f docker-compose.prod.yml logs --tail=50
    exit 1
fi
