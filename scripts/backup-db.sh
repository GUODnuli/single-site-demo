#!/bin/bash
set -e

# ===========================================
# Database Backup Script
# ===========================================

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/vendure_backup_$TIMESTAMP.sql"

# Load environment variables
if [ -f .env.production ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

DB_NAME=${DB_NAME:-vendure}
DB_USERNAME=${DB_USERNAME:-vendure}

echo "🗄️ Backing up database..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
docker compose -f docker-compose.prod.yml exec -T postgres \
    pg_dump -U $DB_USERNAME $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t *.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo "🧹 Old backups cleaned (keeping last 7)"
