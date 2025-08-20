#!/bin/bash

# SSL Setup Script for Markdown Web Server
# This script generates Let's Encrypt SSL certificates for your domain

DOMAIN="${1:-server.vultuk.io}"
EMAIL="${2:-admin@vultuk.io}"

echo "Setting up SSL for domain: $DOMAIN"
echo "Contact email: $EMAIL"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "This script must be run as root (use sudo)"
    exit 1
fi

# Check if domain resolves to this server
SERVER_IP=$(curl -s -4 icanhazip.com)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo "Server IP: $SERVER_IP"
echo "Domain IP: $DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo "WARNING: Domain $DOMAIN does not point to this server ($SERVER_IP)"
    echo "Please update your DNS records first, then re-run this script."
    echo "Current domain points to: $DOMAIN_IP"
    exit 1
fi

# Stop any existing web servers on ports 80/443
echo "Stopping any existing web servers..."
sudo pkill -f "node.*server" || true
sudo systemctl stop httpd || true
sudo systemctl stop nginx || true
sleep 2

# Create directory for ACME challenges
sudo mkdir -p /var/lib/letsencrypt/.well-known

# Generate certificate using standalone mode
echo "Generating SSL certificate..."
certbot certonly \
    --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN

if [ $? -eq 0 ]; then
    echo "SSL certificate generated successfully!"
    echo "Certificate location: /etc/letsencrypt/live/$DOMAIN/"
    
    # Set up automatic renewal
    echo "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > /etc/cron.d/certbot-renew << EOF
# Renew Let's Encrypt certificates automatically
0 3 * * * root certbot renew --quiet --post-hook "pkill -f 'node.*server' && sleep 5"
EOF
    
    echo "Automatic renewal configured (runs daily at 3 AM)"
    
    # Set proper permissions
    chmod 644 /etc/cron.d/certbot-renew
    
    echo ""
    echo "SSL setup complete!"
    echo "You can now start the HTTPS server."
    echo ""
    echo "To start the server with HTTPS:"
    echo "  sudo node /home/ec2-user/Development/vultuk/markdown-web/dist/server/https-server.js"
    echo ""
    echo "Or use the provided startup script:"
    echo "  sudo ./scripts/start-https.sh"
    
else
    echo "Failed to generate SSL certificate"
    echo "Please check the error messages above"
    exit 1
fi