#!/bin/bash

# SSL Status Check Script
# This script checks the SSL configuration status

DOMAIN="${1:-server.vultuk.io}"

echo "=== SSL Status Check for $DOMAIN ==="
echo

# Check server IP
SERVER_IP=$(curl -s -4 icanhazip.com 2>/dev/null || echo "Unable to determine")
echo "Server IP: $SERVER_IP"

# Check domain resolution
DOMAIN_IP=$(dig +short $DOMAIN 2>/dev/null | tail -n1)
if [ -n "$DOMAIN_IP" ]; then
    echo "Domain IP: $DOMAIN_IP"
    if [ "$SERVER_IP" = "$DOMAIN_IP" ]; then
        echo "✅ DNS configuration is correct"
    else
        echo "❌ DNS configuration needs updating"
        echo "   Domain should point to: $SERVER_IP"
    fi
else
    echo "❌ Domain does not resolve"
fi

echo

# Check certificates
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
if [ -d "$CERT_PATH" ]; then
    echo "✅ SSL certificates found at: $CERT_PATH"
    
    # Check certificate expiration
    if [ -f "$CERT_PATH/cert.pem" ]; then
        EXPIRY=$(openssl x509 -in "$CERT_PATH/cert.pem" -noout -dates | grep notAfter | cut -d= -f2)
        echo "   Certificate expires: $EXPIRY"
        
        # Check if expiring soon (30 days)
        EXPIRY_TIMESTAMP=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
        NOW_TIMESTAMP=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_TIMESTAMP - NOW_TIMESTAMP) / 86400 ))
        
        if [ "$DAYS_LEFT" -gt 30 ]; then
            echo "   ✅ Certificate is valid for $DAYS_LEFT more days"
        elif [ "$DAYS_LEFT" -gt 0 ]; then
            echo "   ⚠️  Certificate expires in $DAYS_LEFT days"
        else
            echo "   ❌ Certificate has expired"
        fi
    fi
else
    echo "❌ No SSL certificates found"
    echo "   Run: sudo ./scripts/setup-ssl.sh"
fi

echo

# Check if HTTPS server is running
if pgrep -f "https-server.js" > /dev/null; then
    echo "✅ HTTPS server is running"
    HTTPS_PID=$(pgrep -f "https-server.js")
    echo "   Process ID: $HTTPS_PID"
else
    echo "❌ HTTPS server is not running"
    echo "   To start: sudo ./scripts/start-https.sh"
fi

echo

# Check port availability
echo "Port Status:"
if command -v netstat >/dev/null 2>&1; then
    HTTP_PORT=$(netstat -tlnp 2>/dev/null | grep ":80 " | wc -l)
    HTTPS_PORT=$(netstat -tlnp 2>/dev/null | grep ":443 " | wc -l)
    
    if [ "$HTTP_PORT" -gt 0 ]; then
        echo "   ✅ Port 80 (HTTP) is in use"
    else
        echo "   ❌ Port 80 (HTTP) is available"
    fi
    
    if [ "$HTTPS_PORT" -gt 0 ]; then
        echo "   ✅ Port 443 (HTTPS) is in use"
    else
        echo "   ❌ Port 443 (HTTPS) is available"
    fi
else
    echo "   ℹ️  Cannot check port status (netstat not available)"
fi

echo

# Check HTTPS connectivity
echo "Connectivity Test:"
if command -v curl >/dev/null 2>&1; then
    # Test HTTP
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://$DOMAIN" 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
        echo "   ✅ HTTP redirects to HTTPS (status: $HTTP_STATUS)"
    elif [ "$HTTP_STATUS" = "200" ]; then
        echo "   ⚠️  HTTP is responding but not redirecting (status: $HTTP_STATUS)"
    else
        echo "   ❌ HTTP not accessible (status: $HTTP_STATUS)"
    fi
    
    # Test HTTPS
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "https://$DOMAIN" 2>/dev/null || echo "000")
    if [ "$HTTPS_STATUS" = "200" ]; then
        echo "   ✅ HTTPS is working (status: $HTTPS_STATUS)"
    else
        echo "   ❌ HTTPS not accessible (status: $HTTPS_STATUS)"
    fi
else
    echo "   ℹ️  Cannot test connectivity (curl not available)"
fi

echo

# Summary
echo "=== Summary ==="
if [ "$SERVER_IP" = "$DOMAIN_IP" ] && [ -d "$CERT_PATH" ] && pgrep -f "https-server.js" > /dev/null; then
    echo "✅ SSL setup is complete and working"
    echo "   Your site should be available at: https://$DOMAIN"
else
    echo "❌ SSL setup needs attention"
    echo "   Follow the steps in SSL_SETUP.md"
fi