import express from 'express';
import path from 'path';
import { fileRouter } from './api';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', fileRouter);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, './client')));

// Catch all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

export function startServer(workingDirectory: string) {
  // Set the working directory for file operations
  process.env.WORKING_DIR = workingDirectory;
  
  const server = app.listen(PORT, () => {
    console.log(`Markdown Web Editor running on http://localhost:${PORT}`);
    console.log(`Working directory: ${workingDirectory}`);
  });

  return server;
}

// If this file is run directly (not imported)
if (require.main === module) {
  startServer(process.cwd());
}