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
  const openAiIndex = argv.indexOf('--openai-key');
  const openAiKey = openAiIndex !== -1 ? argv[openAiIndex + 1] : undefined;
  const ngrokTokenIndex = argv.indexOf('--ngrok-auth-token');
  const ngrokAuthToken = ngrokTokenIndex !== -1 ? argv[ngrokTokenIndex + 1] : undefined;
  const ngrokDomainIndex = argv.indexOf('--ngrok-domain');
  const ngrokDomain = ngrokDomainIndex !== -1 ? argv[ngrokDomainIndex + 1] : undefined;
  if (authIndex !== -1 && !providedPassword) {
    console.error('Error: --auth requires a password value');
    process.exit(1);
  }
  if (openAiIndex !== -1 && !openAiKey) {
    console.error('Error: --openai-key requires a value');
    process.exit(1);
  }
  if ((ngrokTokenIndex !== -1 && !ngrokAuthToken) || (ngrokDomainIndex !== -1 && !ngrokDomain)) {
    console.error('Error: --ngrok-auth-token and --ngrok-domain both require values');
    process.exit(1);
  }
  
  console.log('Starting Markdown Web Editor...');
  console.log(`Working directory: ${workingDirectory}`);
  
  try {
    const server = startServer(workingDirectory, {
      disableAuth: disableAuth,
      password: providedPassword,
      openaiKey: openAiKey,
    });
    
    // Open browser to local URL only when not using ngrok
    if (shouldOpenBrowser && !(ngrokAuthToken && ngrokDomain)) {
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
      if (!shouldOpenBrowser) console.log('(Browser auto-opening disabled)');
    }
    
    let ngrokListener = null;
    // Start ngrok tunnel if both token and domain provided
    if (ngrokAuthToken && ngrokDomain) {
      try {
        const ngrok = await import('@ngrok/ngrok');
        // Some environments require explicit auth token setup
        try { await ngrok.authtoken(ngrokAuthToken); } catch {}
        const addr = 3001; // local server port
        ngrokListener = await ngrok.connect({ addr, authtoken: ngrokAuthToken, domain: ngrokDomain });
        const url = typeof ngrokListener?.url === 'function' ? ngrokListener.url() : (ngrokListener?.url || ngrokListener?.toString?.() || '');
        console.log(`ngrok tunnel established: ${url || '(URL unavailable)'}`);
        if (shouldOpenBrowser && url) {
          try {
            const { default: open } = await import('open');
            await open(url);
          } catch {}
        }
      } catch (e) {
        console.warn('Failed to start ngrok tunnel:', e?.message || e);
      }
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      const closeServer = () => server.close(() => { console.log('Server closed'); process.exit(0); });
      if (ngrokListener && typeof ngrokListener.close === 'function') {
        try { ngrokListener.close().then(closeServer).catch(closeServer); } catch { closeServer(); }
      } else {
        closeServer();
      }
    });
    
    process.on('SIGTERM', () => {
      console.log('\nShutting down gracefully...');
      const closeServer = () => server.close(() => { console.log('Server closed'); process.exit(0); });
      if (ngrokListener && typeof ngrokListener.close === 'function') {
        try { ngrokListener.close().then(closeServer).catch(closeServer); } catch { closeServer(); }
      } else {
        closeServer();
      }
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
