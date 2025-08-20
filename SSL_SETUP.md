# SSL/HTTPS Setup for Markdown Web

This guide explains how to set up SSL certificates and enable HTTPS for your Markdown Web server.

## Prerequisites

1. **Domain Configuration**: Your domain must point to this server
2. **Root Access**: SSL setup requires root privileges
3. **Port Access**: Ports 80 and 443 must be open and available

## Current Status

- **Server IP**: `52.56.73.116`
- **Domain**: `server.vultuk.io` 
- **Current Domain IP**: `100.103.217.79` ❌ (Needs updating)

## Step 1: Update DNS Records

**⚠️ IMPORTANT**: Before proceeding, update your DNS records to point `server.vultuk.io` to `52.56.73.116`.

You can verify this works by running:
```bash
dig +short server.vultuk.io
```

The command should return `52.56.73.116`.

## Step 2: Generate SSL Certificate

Once DNS is correctly configured, run the SSL setup script:

```bash
# Basic setup (uses default domain and email)
sudo ./scripts/setup-ssl.sh

# Custom domain and email
sudo ./scripts/setup-ssl.sh your-domain.com your-email@domain.com
```

This script will:
- Verify DNS configuration
- Stop any conflicting web servers
- Generate Let's Encrypt SSL certificates
- Set up automatic renewal
- Configure proper permissions

## Step 3: Start HTTPS Server

After SSL certificates are generated, you can start the HTTPS server:

### Option A: Using the startup script
```bash
sudo ./scripts/start-https.sh
```

### Option B: Using npm script
```bash
npm run start:https
```

### Option C: Manual start
```bash
sudo node dist/server/https-server.js
```

## Step 4: Install as System Service (Optional)

For production deployments, install as a systemd service:

```bash
# Copy service file
sudo cp scripts/markdown-web-https.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable markdown-web-https
sudo systemctl start markdown-web-https

# Check status
sudo systemctl status markdown-web-https
```

## Features

### HTTPS Server Features
- ✅ **Dual Protocol**: Serves both HTTP (port 80) and HTTPS (port 443)
- ✅ **Auto Redirect**: HTTP traffic automatically redirects to HTTPS
- ✅ **ACME Support**: Allows Let's Encrypt certificate challenges
- ✅ **Auto Renewal**: Certificates renew automatically
- ✅ **Graceful Fallback**: Falls back to HTTP-only if certificates are missing

### Security Features
- ✅ **TLS 1.2/1.3**: Modern encryption protocols
- ✅ **Certificate Chain**: Full certificate chain validation
- ✅ **HSTS Ready**: Prepared for HTTP Strict Transport Security
- ✅ **Secure Headers**: Security-focused HTTP headers

## File Locations

- **SSL Certificates**: `/etc/letsencrypt/live/server.vultuk.io/`
- **HTTPS Server**: `dist/server/https-server.js`
- **Setup Script**: `scripts/setup-ssl.sh`
- **Startup Script**: `scripts/start-https.sh`
- **Service File**: `scripts/markdown-web-https.service`

## Troubleshooting

### Certificate Generation Fails
1. Check DNS configuration: `dig +short your-domain.com`
2. Ensure ports 80/443 are open in firewall
3. Stop any existing web servers
4. Check Let's Encrypt rate limits

### Server Won't Start
1. Check if certificates exist: `ls -la /etc/letsencrypt/live/`
2. Verify file permissions
3. Check for port conflicts: `sudo netstat -tlnp | grep :443`
4. Review server logs

### Domain Not Accessible
1. Verify DNS propagation (can take up to 48 hours)
2. Check firewall rules
3. Ensure security groups allow HTTP/HTTPS traffic (AWS)
4. Test with curl: `curl -I https://your-domain.com`

## Commands Reference

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test certificate renewal
sudo certbot renew --dry-run

# View service logs
sudo journalctl -u markdown-web-https -f

# Restart service
sudo systemctl restart markdown-web-https

# Stop all servers
sudo pkill -f "node.*server"
```

## Production Notes

1. **Firewall**: Ensure ports 80 and 443 are open
2. **Auto-start**: Use the systemd service for automatic startup
3. **Monitoring**: Monitor certificate expiration (auto-renewal should handle this)
4. **Backups**: Consider backing up `/etc/letsencrypt/` directory
5. **Rate Limits**: Let's Encrypt has rate limits (50 certs per domain per week)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server and system logs
3. Verify DNS and network configuration
4. Ensure all prerequisites are met