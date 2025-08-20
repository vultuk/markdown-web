#!/usr/bin/env node

const { startServer } = require('../dist/index.js');
const path = require('path');

async function main() {
  const workingDirectory = process.cwd();
  const argv = process.argv.slice(2);
  const shouldOpenBrowser = !argv.includes('--no-open');
  const disableAuth = argv.includes('--disable-auth');
  const authIndex = argv.indexOf('--auth');
  const providedPassword = authIndex !== -1 ? argv[authIndex + 1] : undefined;
  if (authIndex !== -1 && !providedPassword) {
    console.error('Error: --auth requires a password value');
    process.exit(1);
  }
  
  console.log('Starting Markdown Web Editor...');
  console.log(`Working directory: ${workingDirectory}`);
  
  try {
    const server = startServer(workingDirectory, {
      disableAuth: disableAuth,
      password: providedPassword,
    });
    
    // Open browser after a short delay to ensure server is ready
    if (shouldOpenBrowser) {
      setTimeout(async () => {
        try {
          const { default: open } = await import('open');
          await open('http://localhost:3001');
          console.log('Browser opened automatically');
        } catch (error) {
          console.log('Could not open browser automatically. Please navigate to http://localhost:3001');
          console.log('(Use --no-open flag to disable auto-opening)');
        }
      }, 1000);
    } else {
      console.log('Server running on http://localhost:3001');
      console.log('(Browser auto-opening disabled)');
    }
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGTERM', () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
