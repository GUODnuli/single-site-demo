#!/bin/bash
set -e

# ===========================================
# SSL Certificate Setup with Let's Encrypt
# ===========================================

DOMAIN=${1:-"your-domain.com"}
EMAIL=${2:-"admin@your-domain.com"}

echo "🔐 Setting up SSL for: $DOMAIN"

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Get certificate
docker run --rm \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

echo ""
echo "✅ SSL certificate obtained!"
echo ""
echo "Next steps:"
echo "1. Update nginx/conf.d/default.conf:"
echo "   - Uncomment the HTTPS server block"
echo "   - Replace 'your-domain.com' with '$DOMAIN'"
echo "   - Uncomment the HTTP->HTTPS redirect"
echo ""
echo "2. Restart nginx:"
echo "   docker compose -f docker-compose.prod.yml restart nginx"
