import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { ThemeManager } from './themeManager';

export const fileRouter = express.Router();

const themeManager = new ThemeManager();

const getWorkingDir = () => process.env.WORKING_DIR || process.cwd();

// Get directory structure
fileRouter.get('/files', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const files = await getDirectoryContents(workingDir);
    res.json(files);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

// Read file content
fileRouter.get('/files/*', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.join(workingDir, relativePath);
    
    // Security check: ensure file is within working directory
    if (!filePath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Save file content
fileRouter.post('/files/*', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.join(workingDir, relativePath);
    const { content } = req.body;
    
    // Security check: ensure file is within working directory
    if (!filePath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Create new file
fileRouter.post('/create-file', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const { fileName } = req.body;
    
    if (!fileName || !fileName.endsWith('.md')) {
      return res.status(400).json({ error: 'Invalid file name. Must end with .md' });
    }
    
    const filePath = path.join(workingDir, fileName);
    
    // Security check
    if (!filePath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return res.status(409).json({ error: 'File already exists' });
    } catch {
      // File doesn't exist, continue
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    await fs.writeFile(filePath, '', 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// Create new directory
fileRouter.post('/create-directory', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const { dirName } = req.body;
    
    if (!dirName) {
      return res.status(400).json({ error: 'Directory name is required' });
    }
    
    const dirPath = path.join(workingDir, dirName);
    
    // Security check
    if (!dirPath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await fs.mkdir(dirPath, { recursive: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ error: 'Failed to create directory' });
  }
});

// Delete file
fileRouter.delete('/files/*', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.join(workingDir, relativePath);
    
    // Security check: ensure file is within working directory
    if (!filePath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Prevent deletion of the working directory itself
    if (filePath === workingDir) {
      return res.status(403).json({ error: 'Cannot delete working directory' });
    }
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
    
    await fs.rm(filePath);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Delete directory
fileRouter.delete('/directories/*', async (req, res) => {
  try {
    const workingDir = getWorkingDir();
    const relativePath = decodeURIComponent(req.url.replace('/directories/', ''));
    const dirPath = path.join(workingDir, relativePath);
    
    // Security check: ensure directory is within working directory
    if (!dirPath.startsWith(workingDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Prevent deletion of the working directory itself
    if (dirPath === workingDir) {
      return res.status(403).json({ error: 'Cannot delete working directory' });
    }
    
    // Check if directory exists
    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) {
        return res.status(400).json({ error: 'Path is not a directory' });
      }
    } catch {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    await fs.rm(dirPath, { recursive: true, force: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting directory:', error);
    res.status(500).json({ error: 'Failed to delete directory' });
  }
});

// Theme management endpoints
fileRouter.get('/themes', async (req, res) => {
  try {
    const themes = await themeManager.getThemes();
    res.json(themes);
  } catch (error) {
    console.error('Error getting themes:', error);
    res.status(500).json({ error: 'Failed to get themes' });
  }
});

fileRouter.get('/themes/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const theme = await themeManager.getTheme(name);
    
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    res.json(theme);
  } catch (error) {
    console.error('Error getting theme:', error);
    res.status(500).json({ error: 'Failed to get theme' });
  }
});

fileRouter.post('/themes/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const theme = req.body;
    
    if (!theme || theme.name !== name) {
      return res.status(400).json({ error: 'Invalid theme data' });
    }
    
    await themeManager.saveTheme(theme);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving theme:', error);
    res.status(500).json({ error: 'Failed to save theme' });
  }
});

fileRouter.get('/settings', async (req, res) => {
  try {
    const settings = await themeManager.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

fileRouter.post('/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || typeof settings.selectedTheme !== 'string') {
      return res.status(400).json({ error: 'Invalid settings data' });
    }
    
    await themeManager.saveSettings(settings);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

async function getDirectoryContents(dirPath: string): Promise<any[]> {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const result = [];
  
  for (const item of items) {
    if (item.name.startsWith('.')) continue; // Skip hidden files
    
    const itemPath = path.join(dirPath, item.name);
    const relativePath = path.relative(getWorkingDir(), itemPath);
    
    if (item.isDirectory()) {
      const children = await getDirectoryContents(itemPath);
      result.push({
        name: item.name,
        type: 'directory',
        path: relativePath,
        children: children
      });
    } else if (item.name.endsWith('.md')) {
      result.push({
        name: item.name,
        type: 'file',
        path: relativePath
      });
    }
  }
  
  return result.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}