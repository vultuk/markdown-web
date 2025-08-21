import express from 'express';
import path from 'path';
import { fileRouter } from './api';
import { ThemeManager } from './themeManager';
import { requireAuth, setupAuth } from './auth';

const app = express();
const PORT = process.env.PORT || 3001;
const JSON_LIMIT = process.env.JSON_LIMIT || '50mb';

app.use(express.json({ limit: JSON_LIMIT }));

// Auth endpoints and API protection are configured in startServer()

// Serve static files from the React app build directory
// (Static and catch-all are configured inside startServer after auth + API)

export async function startServer(workingDirectory: string, options?: { disableAuth?: boolean; password?: string }) {
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

  // Protect API routes when auth is enabled
  if (enabled) {
    app.use('/api', requireAuth(), fileRouter);
  } else {
    app.use('/api', fileRouter);
  }

  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, './client')));

  // Catch all handler for React Router (must be after API + auth routes)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
  });
  
  const server = app.listen(PORT, () => {
    console.log(`Markdown Web Editor running on http://localhost:${PORT}`);
    console.log(`Working directory: ${workingDirectory}`);
    console.log(`Request JSON limit: ${JSON_LIMIT}`);
    if (enabled) {
      console.log('Authentication: ENABLED');
      if (password) {
        console.log(`Password: ${password}`);
      }
      console.log('Use HTTPS for security when possible.');
    } else {
      console.log('Authentication: DISABLED');
    }
  });

  return server;
}

// If this file is run directly (not imported)
if (require.main === module) {
  startServer(process.cwd());
}
