#!/bin/bash
##### Curtain Showcase Deploy Script
##### for ECS on Alibaba Cloud Linux 3.2104
##### Vendure (port 3000) + Next.js Storefront (port 3001) + PostgreSQL + Nginx

set -e

#####################################################################
# Configuration - Modify these before first deployment
#####################################################################
APP_NAME="curtain-showcase"
APP_DIR="/opt/${APP_NAME}"
NODE_VERSION="20"

# Database
DB_NAME="vendure"
DB_USERNAME="vendure"
DB_PASSWORD="${DB_PASSWORD:-vendure_prod_$(openssl rand -hex 8)}"

# Vendure
COOKIE_SECRET="${COOKIE_SECRET:-$(openssl rand -base64 32)}"
SUPERADMIN_USERNAME="${SUPERADMIN_USERNAME:-superadmin}"
SUPERADMIN_PASSWORD="${SUPERADMIN_PASSWORD:-Admin@2025}"

# Domain (change to your actual domain, used by Nginx)
DOMAIN="${DOMAIN:-_}"

# Ports
VENDURE_PORT=3000
STOREFRONT_PORT=3001

#####################################################################
# Helper Functions
#####################################################################
log_info()  { echo -e "\033[0;32m[INFO]\033[0m  $(date '+%H:%M:%S') $1"; }
log_warn()  { echo -e "\033[1;33m[WARN]\033[0m  $(date '+%H:%M:%S') $1"; }
log_error() { echo -e "\033[0;31m[ERROR]\033[0m $(date '+%H:%M:%S') $1"; }

check_cmd() {
  if ! command -v "$1" &> /dev/null; then
    return 1
  fi
  return 0
}

#####################################################################
# Step 1: Install System Dependencies
#####################################################################
install_dependencies() {
  log_info "Step 1: Installing system dependencies..."

  # Update system packages
  yum update -y -q

  # Install basic tools
  yum install -y -q git curl wget gcc-c++ make

  # --- Node.js ---
  if ! check_cmd node || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt ${NODE_VERSION} ]]; then
    log_info "Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
    yum install -y -q nodejs
  fi
  log_info "Node.js version: $(node -v)"

  # --- PM2 ---
  if ! check_cmd pm2; then
    log_info "Installing PM2..."
    npm install -g pm2
  fi

  # --- PostgreSQL ---
  if ! check_cmd psql; then
    log_info "Installing PostgreSQL 15..."
    yum install -y -q https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm || true
    yum install -y -q postgresql15-server postgresql15
    /usr/pgsql-15/bin/postgresql-15-setup initdb
    systemctl enable postgresql-15
    systemctl start postgresql-15
  fi

  # --- Nginx ---
  if ! check_cmd nginx; then
    log_info "Installing Nginx..."
    yum install -y -q nginx
    systemctl enable nginx
  fi

  log_info "All dependencies installed."
}

#####################################################################
# Step 2: Setup PostgreSQL Database
#####################################################################
setup_database() {
  log_info "Step 2: Setting up PostgreSQL database..."

  # Check if database user exists
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USERNAME}'" | grep -q 1; then
    log_info "Creating database user: ${DB_USERNAME}"
    sudo -u postgres psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';"
  fi

  # Check if database exists
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    log_info "Creating database: ${DB_NAME}"
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USERNAME};"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USERNAME};"
  fi

  # Ensure pg_hba.conf allows local password auth
  PG_HBA=$(sudo -u postgres psql -tAc "SHOW hba_file;")
  if ! grep -q "${DB_USERNAME}" "${PG_HBA}"; then
    log_info "Updating pg_hba.conf for password authentication..."
    sed -i '/^local.*all.*all/s/peer/md5/' "${PG_HBA}"
    sed -i '/^host.*all.*all.*127/s/ident/md5/' "${PG_HBA}"
    systemctl reload postgresql-15
  fi

  log_info "Database setup complete."
}

#####################################################################
# Step 3: Deploy Application Code
#####################################################################
deploy_code() {
  log_info "Step 3: Deploying application code..."

  # Create app directory if not exists
  mkdir -p "${APP_DIR}"

  # If running in CI/CD, code is already in working directory
  # Copy to deployment directory
  if [ "$(pwd)" != "${APP_DIR}" ]; then
    log_info "Copying code to ${APP_DIR}..."
    rsync -a --delete \
      --exclude='node_modules' \
      --exclude='.next' \
      --exclude='dist' \
      --exclude='.env' \
      --exclude='.env.production' \
      ./ "${APP_DIR}/"
  fi

  cd "${APP_DIR}"

  # Create necessary directories
  mkdir -p apps/server/static/assets
  mkdir -p apps/server/static/email/templates/partials
  mkdir -p apps/server/static/email/test-emails

  log_info "Code deployed to ${APP_DIR}"
}

#####################################################################
# Step 4: Configure Environment Variables
#####################################################################
setup_env() {
  log_info "Step 4: Configuring environment variables..."

  # --- Server .env ---
  cat > "${APP_DIR}/apps/server/.env" <<EOF
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

# Vendure
NODE_ENV=production
VENDURE_HOST=0.0.0.0
VENDURE_PORT=${VENDURE_PORT}
SUPERADMIN_USERNAME=${SUPERADMIN_USERNAME}
SUPERADMIN_PASSWORD=${SUPERADMIN_PASSWORD}

# Cookie Secret
COOKIE_SECRET=${COOKIE_SECRET}

# Asset Storage
ASSET_UPLOAD_DIR=./static/assets

# Email Notifications
EMAIL_NOTIFICATIONS_ENABLED=false
EOF

  # --- Storefront .env ---
  cat > "${APP_DIR}/apps/storefront/.env" <<EOF
NODE_ENV=production
VENDURE_API_URL=http://127.0.0.1:${VENDURE_PORT}/shop-api
NEXT_PUBLIC_SHOP_API_URL=http://127.0.0.1:${VENDURE_PORT}/shop-api
NEXT_PUBLIC_SITE_URL=http://${DOMAIN}
NEXT_TELEMETRY_DISABLED=1
EOF

  # Protect env files
  chmod 600 "${APP_DIR}/apps/server/.env"
  chmod 600 "${APP_DIR}/apps/storefront/.env"

  log_info "Environment files created."
}

#####################################################################
# Step 5: Install Dependencies & Build
#####################################################################
build_app() {
  log_info "Step 5: Installing npm dependencies and building..."

  cd "${APP_DIR}"

  # Install all dependencies
  log_info "Running npm install..."
  npm ci --prefer-offline 2>&1 | tail -5

  # Build server
  log_info "Building Vendure server..."
  npm run build -w apps/server

  # Build storefront
  log_info "Building Next.js storefront..."
  npm run build -w apps/storefront

  log_info "Build complete."
}

#####################################################################
# Step 6: Run Database Migrations
#####################################################################
run_migrations() {
  log_info "Step 6: Running database migrations..."

  cd "${APP_DIR}/apps/server"

  # For first-time setup, synchronize is enabled in dev mode
  # For production, run migrations
  npx ts-node ./src/migrate.ts run || {
    log_warn "Migration script failed. If this is first deploy, the server will auto-sync tables."
  }

  log_info "Migrations complete."
}

#####################################################################
# Step 7: Start/Restart Application with PM2
#####################################################################
start_app() {
  log_info "Step 7: Starting application with PM2..."

  cd "${APP_DIR}"

  # Create PM2 ecosystem file
  cat > "${APP_DIR}/ecosystem.config.js" <<'PMEOF'
module.exports = {
  apps: [
    {
      name: 'vendure-server',
      cwd: './apps/server',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      max_restarts: 10,
    },
    {
      name: 'storefront',
      cwd: './apps/storefront',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      max_memory_restart: '512M',
      error_file: './logs/storefront-error.log',
      out_file: './logs/storefront-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
PMEOF

  # Create logs directory
  mkdir -p "${APP_DIR}/logs"

  # Stop existing processes (if any)
  pm2 delete all 2>/dev/null || true

  # Start all applications
  pm2 start ecosystem.config.js

  # Wait for services to start
  log_info "Waiting for services to start..."
  sleep 10

  # Verify services are running
  if pm2 list | grep -q "online"; then
    log_info "PM2 processes started successfully."
  else
    log_error "Some processes failed to start. Check logs:"
    pm2 logs --lines 20
    exit 1
  fi

  # Save PM2 process list for auto-restart on reboot
  pm2 save
  pm2 startup systemd -u root --hp /root 2>/dev/null || true

  log_info "Application started."
}

#####################################################################
# Step 8: Configure Nginx Reverse Proxy
#####################################################################
setup_nginx() {
  log_info "Step 8: Configuring Nginx..."

  cat > /etc/nginx/conf.d/${APP_NAME}.conf <<NGINXEOF
# Upstream servers
upstream vendure_backend {
    server 127.0.0.1:${VENDURE_PORT};
    keepalive 32;
}

upstream storefront_frontend {
    server 127.0.0.1:${STOREFRONT_PORT};
    keepalive 32;
}

server {
    listen 80;
    server_name ${DOMAIN};

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript
               application/rss+xml application/atom+xml image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Vendure Admin UI
    location /admin {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Vendure Shop API
    location /shop-api {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Vendure Admin API
    location /admin-api {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Vendure Assets
    location /assets {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Vendure Health check
    location /health {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }

    # Vendure Mailbox (dev only, remove in production)
    location /mailbox {
        proxy_pass http://vendure_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://storefront_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://storefront_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    # Storefront (default - all other requests)
    location / {
        proxy_pass http://storefront_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXEOF

  # Remove default nginx config if exists
  rm -f /etc/nginx/conf.d/default.conf

  # Test and reload nginx
  nginx -t
  systemctl restart nginx

  log_info "Nginx configured and restarted."
}

#####################################################################
# Step 9: Verify Deployment
#####################################################################
verify() {
  log_info "Step 9: Verifying deployment..."

  local ok=true

  # Check Vendure server
  sleep 3
  if curl -sf http://127.0.0.1:${VENDURE_PORT}/health > /dev/null 2>&1; then
    log_info "[OK] Vendure server is running on port ${VENDURE_PORT}"
  else
    log_warn "[WAIT] Vendure server still starting, checking again in 15s..."
    sleep 15
    if curl -sf http://127.0.0.1:${VENDURE_PORT}/health > /dev/null 2>&1; then
      log_info "[OK] Vendure server is running on port ${VENDURE_PORT}"
    else
      log_error "[FAIL] Vendure server is NOT responding"
      ok=false
    fi
  fi

  # Check Storefront
  if curl -sf http://127.0.0.1:${STOREFRONT_PORT} > /dev/null 2>&1; then
    log_info "[OK] Storefront is running on port ${STOREFRONT_PORT}"
  else
    log_warn "[WAIT] Storefront still starting, checking again in 10s..."
    sleep 10
    if curl -sf http://127.0.0.1:${STOREFRONT_PORT} > /dev/null 2>&1; then
      log_info "[OK] Storefront is running on port ${STOREFRONT_PORT}"
    else
      log_error "[FAIL] Storefront is NOT responding"
      ok=false
    fi
  fi

  # Check Nginx
  if systemctl is-active --quiet nginx; then
    log_info "[OK] Nginx is running"
  else
    log_error "[FAIL] Nginx is NOT running"
    ok=false
  fi

  # Check PostgreSQL
  if systemctl is-active --quiet postgresql-15; then
    log_info "[OK] PostgreSQL is running"
  else
    log_error "[FAIL] PostgreSQL is NOT running"
    ok=false
  fi

  echo ""
  echo "=========================================="
  if [ "$ok" = true ]; then
    log_info "Deployment successful!"
  else
    log_error "Deployment has issues. Check logs above."
  fi
  echo "=========================================="
  echo ""
  echo "  Storefront:  http://${DOMAIN}"
  echo "  Admin Panel: http://${DOMAIN}/admin"
  echo "  Shop API:    http://${DOMAIN}/shop-api"
  echo "  Admin API:   http://${DOMAIN}/admin-api"
  echo ""
  echo "  Admin Login: ${SUPERADMIN_USERNAME} / ${SUPERADMIN_PASSWORD}"
  echo ""
  echo "  PM2 Status:  pm2 status"
  echo "  PM2 Logs:    pm2 logs"
  echo ""
  echo "=========================================="
}

#####################################################################
# Main Execution
#####################################################################
main() {
  echo ""
  echo "=========================================="
  echo "  ${APP_NAME} Deployment"
  echo "  $(date '+%Y-%m-%d %H:%M:%S')"
  echo "=========================================="
  echo ""

  install_dependencies
  setup_database
  deploy_code
  setup_env
  build_app
  run_migrations
  start_app
  setup_nginx
  verify
}

main "$@"

##### end
