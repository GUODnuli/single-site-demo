#!/bin/bash
set -e

# ===========================================
# Database Migration Script
# ===========================================

echo "🗄️ Running database migrations..."

# Run migrations inside the vendure container
docker compose -f docker-compose.prod.yml exec -T vendure \
    npx typeorm migration:run -d dist/vendure-config.js

echo "✅ Migrations completed!"
