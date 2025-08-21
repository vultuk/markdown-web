import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileRouter } from './api';
import { ThemeManager } from './themeManager';
import { requireAuth, setupAuth } from './auth';

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

app.use(express.json());
// Auth and API protection are configured in startHttpsServer()

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, './client')));

// Catch all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

// HTTP to HTTPS redirect middleware
function redirectToHttps(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  
  // Allow Let's Encrypt ACME challenges
  if (req.path.startsWith('/.well-known/acme-challenge/')) {
    return next();
  }
  
  res.redirect(301, `https://${req.headers.host}${req.url}`);
}

export async function startHttpsServer(workingDirectory: string, domain: string = 'server.vultuk.io', options?: { disableAuth?: boolean; password?: string }) {
  // Set the working directory for file operations
  process.env.WORKING_DIR = workingDirectory;
  
  // Initialize themes
  const themeManager = new ThemeManager();
  await themeManager.initialize();
  
  // Configure authentication
  const { enabled, password } = await setupAuth(app, {
    disabled: options?.disableAuth,
    password: options?.password,
  });

  if (enabled) {
    app.use('/api', requireAuth(), fileRouter);
  } else {
    app.use('/api', fileRouter);
  }

  // Serve static files from the React app build directory (after API routes)
  app.use(express.static(path.join(__dirname, './client')));

  // Catch all handler for React Router (after API + auth)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
  });

  const certPath = `/etc/letsencrypt/live/${domain}/cert.pem`;
  const keyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;
  const chainPath = `/etc/letsencrypt/live/${domain}/chain.pem`;
  
  // Start HTTP server (for redirects and ACME challenges)
  const httpApp = express();
  httpApp.use('/.well-known', express.static('/var/lib/letsencrypt/.well-known'));
  httpApp.use(redirectToHttps);
  httpApp.use(app);
  
  const httpServer = httpApp.listen(HTTP_PORT, () => {
    console.log(`HTTP server running on port ${HTTP_PORT} (redirects to HTTPS)`);
  });

  // Check if SSL certificates exist
  let httpsServer;
  try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const httpsOptions = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
        ca: fs.existsSync(chainPath) ? fs.readFileSync(chainPath) : undefined
      };

      httpsServer = https.createServer(httpsOptions, app);
      httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS server running on port ${HTTPS_PORT}`);
        console.log(`Secure site available at https://${domain}`);
        console.log(`Working directory: ${workingDirectory}`);
        if (enabled) {
          console.log('Authentication: ENABLED');
          if (password) {
            console.log(`Password: ${password}`);
          }
        } else {
          console.log('Authentication: DISABLED');
        }
      });
    } else {
      console.log('SSL certificates not found. HTTPS server not started.');
      console.log('Run the SSL setup script to generate certificates.');
    }
  } catch (error) {
    console.log('Error starting HTTPS server:', error);
    console.log('HTTPS server not started. Only HTTP available.');
  }

  return { httpServer, httpsServer };
}

// If this file is run directly (not imported)
if (require.main === module) {
  startHttpsServer(process.cwd());
}
