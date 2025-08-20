#!/bin/bash

# HTTPS Server Startup Script for Markdown Web
# This script starts the markdown-web server with HTTPS support

# Configuration
WORKING_DIR="${1:-$(pwd)}"
DOMAIN="${2:-server.vultuk.io}"
USER="${3:-ec2-user}"

echo "Starting Markdown Web HTTPS Server..."
echo "Working directory: $WORKING_DIR"
echo "Domain: $DOMAIN"
echo "User: $USER"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "This script must be run as root to bind to ports 80 and 443"
    echo "Use: sudo ./scripts/start-https.sh"
    exit 1
fi

# Navigate to the project directory
cd /home/ec2-user/Development/vultuk/markdown-web

# Build the project if needed
if [ ! -f "dist/server/https-server.js" ]; then
    echo "Building project..."
    sudo -u $USER npm run build
fi

# Check if SSL certificates exist
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/cert.pem"
if [ ! -f "$CERT_PATH" ]; then
    echo "SSL certificates not found for domain: $DOMAIN"
    echo "Please run the SSL setup script first:"
    echo "  sudo ./scripts/setup-ssl.sh $DOMAIN"
    exit 1
fi

# Stop any existing servers
echo "Stopping any existing servers..."
pkill -f "node.*server" || true
sleep 2

# Start the HTTPS server
echo "Starting HTTPS server..."
cd "$WORKING_DIR"
WORKING_DIR="$WORKING_DIR" node /home/ec2-user/Development/vultuk/markdown-web/dist/server/https-server.js &

SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
echo "HTTPS server should be available at https://$DOMAIN"
echo "HTTP traffic on port 80 will automatically redirect to HTTPS"

# Wait a moment and check if server is still running
sleep 3
if ps -p $SERVER_PID > /dev/null; then
    echo "Server is running successfully!"
    echo "To stop the server: sudo kill $SERVER_PID"
else
    echo "Server failed to start. Check the logs above for errors."
    exit 1
fi