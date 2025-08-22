import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ThemeManager } from './themeManager';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);

export const fileRouter = express.Router();

const themeManager = new ThemeManager();

const getWorkingDir = () => process.env.WORKING_DIR || process.cwd();

// AI status endpoint
fileRouter.get('/ai/status', async (req, res) => {
  try {
    let enabled = false;
    try {
      const settings = await themeManager.getSettings();
      enabled = !!(settings.openAiKey || process.env.OPENAI_KEY || settings.anthropicKey || process.env.ANTHROPIC_API_KEY);
    } catch {
      enabled = !!(process.env.OPENAI_KEY || process.env.ANTHROPIC_API_KEY);
    }
    res.json({ enabled });
  } catch (e) {
    res.json({ enabled: false });
  }
});

// Get directory structure
fileRouter.get('/files', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
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
    const workingDir = path.resolve(getWorkingDir());
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.resolve(workingDir, relativePath);
    const rel = path.relative(workingDir, filePath);

    // Security check: ensure file is within working directory
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
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
    const workingDir = path.resolve(getWorkingDir());
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.resolve(workingDir, relativePath);
    const { content } = req.body;
    const rel = path.relative(workingDir, filePath);

    // Security check: ensure file is within working directory
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
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
    const workingDir = path.resolve(getWorkingDir());
    const { fileName } = req.body;

    if (!fileName || !fileName.endsWith('.md')) {
      return res.status(400).json({ error: 'Invalid file name. Must end with .md' });
    }

    const filePath = path.resolve(workingDir, fileName);
    const rel = path.relative(workingDir, filePath);

    // Security check
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
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
    const workingDir = path.resolve(getWorkingDir());
    const { dirName } = req.body;

    if (!dirName) {
      return res.status(400).json({ error: 'Directory name is required' });
    }

    const dirPath = path.resolve(workingDir, dirName);
    const rel = path.relative(workingDir, dirPath);

    // Security check
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await fs.mkdir(dirPath, { recursive: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ error: 'Failed to create directory' });
  }
});

// Rename file or directory
fileRouter.post('/rename', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const { oldPath, newPath } = req.body as { oldPath?: string; newPath?: string };

    if (!oldPath || !newPath) {
      return res.status(400).json({ error: 'oldPath and newPath are required' });
    }

    const absOld = path.resolve(workingDir, oldPath);
    const absNew = path.resolve(workingDir, newPath);
    const relOld = path.relative(workingDir, absOld);
    const relNew = path.relative(workingDir, absNew);

    // Security: ensure both paths are within working dir
    if (relOld.startsWith('..') || path.isAbsolute(relOld) || relNew.startsWith('..') || path.isAbsolute(relNew)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Prevent renaming working directory itself
    if (absOld === workingDir) {
      return res.status(403).json({ error: 'Cannot rename working directory' });
    }

    // Source must exist
    try {
      await fs.access(absOld);
    } catch {
      return res.status(404).json({ error: 'Source path not found' });
    }

    // Destination must not exist
    try {
      await fs.access(absNew);
      return res.status(409).json({ error: 'Destination already exists' });
    } catch {
      // ok
    }

    // Ensure destination directory exists
    await fs.mkdir(path.dirname(absNew), { recursive: true });

    await fs.rename(absOld, absNew);
    res.json({ success: true });
  } catch (error) {
    console.error('Error renaming path:', error);
    res.status(500).json({ error: 'Failed to rename path' });
  }
});

// Delete file
fileRouter.delete('/files/*', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const relativePath = decodeURIComponent(req.url.replace('/files/', ''));
    const filePath = path.resolve(workingDir, relativePath);
    const rel = path.relative(workingDir, filePath);

    // Security check: ensure file is within working directory
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
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
    const workingDir = path.resolve(getWorkingDir());
    const relativePath = decodeURIComponent(req.url.replace('/directories/', ''));
    const dirPath = path.resolve(workingDir, relativePath);
    const rel = path.relative(workingDir, dirPath);

    // Security check: ensure directory is within working directory
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
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

// Apply AI transformation to markdown
fileRouter.post('/ai/apply', async (req, res) => {
  try {
    const { prompt, content, path: relPath, model: overrideModel } = req.body || {} as { prompt?: string; content?: string; path?: string; model?: string };
    if (typeof prompt !== 'string' || typeof content !== 'string') {
      return res.status(400).json({ error: 'prompt and content are required' });
    }

    // Load preferred model from settings; default to gpt-5-mini if absent
    let model = 'gpt-5-mini';
    try {
      const settings = await themeManager.getSettings();
      if (settings.defaultModel && settings.defaultModelProvider === 'openai') {
        model = settings.defaultModel;
      } else if (settings.openAiModel && typeof settings.openAiModel === 'string') {
        model = settings.openAiModel;
      }
    } catch {}
    // Allow one-off override (supports OpenAI and Anthropic identifiers)
    if (overrideModel) {
      model = overrideModel;
    }

    const instruction = 'You are a precise markdown editor. Apply the user\'s requested changes to the provided markdown and return ONLY the full updated markdown. Do not include any explanation, code fences, or any BEGIN/END markers — only the final markdown document.';
    const input = `${instruction}\n\nCurrent Markdown:\n\n${content}\n\nInstructions:\n${prompt}\n\nReturn only the updated markdown.`;

    // Anthropic branch
    if (String(model).startsWith('claude-')) {
      let aKey = process.env.ANTHROPIC_API_KEY;
      try {
        const s = await themeManager.getSettings();
        if (s.anthropicKey && typeof s.anthropicKey === 'string' && s.anthropicKey.trim()) aKey = s.anthropicKey.trim();
      } catch {}
      if (!aKey) return res.status(400).json({ error: 'Anthropic key not configured' });
      const anthropic = new Anthropic({ apiKey: aKey });
      let aData: any;
      try {
        aData = await anthropic.messages.create({ model, max_tokens: 4096, messages: [{ role: 'user', content: input }] });
      } catch (e: any) {
        const details = e?.message || e?.response?.data || 'Unknown error';
        return res.status(502).json({ error: 'Anthropic request failed', details: String(details).slice(0, 2000) });
      }
      let updated: string | undefined;
      try {
        const parts: string[] = [];
        const arr = Array.isArray(aData?.content) ? aData.content : [];
        for (const part of arr) if (part?.type === 'text' && typeof part?.text === 'string') parts.push(part.text);
        updated = parts.join('');
      } catch {}
      const usageA = (aData as any)?.usage || {};
      const inputTokens = Number(usageA?.input_tokens || 0);
      const outputTokens = Number(usageA?.output_tokens || 0);
      const totalTokens = inputTokens + outputTokens;
      // Anthropic pricing (USD per 1K tokens)
      const anthropicPricing: Record<string, { input: number; output: number }> = {
        'claude-opus-4-1': { input: 15, output: 75 },
        'claude-sonnet-4-0': { input: 3, output: 15 },
      };
      const rateA = anthropicPricing[model] || anthropicPricing[(model.startsWith('claude-opus-4-1') ? 'claude-opus-4-1' : (model.startsWith('claude-sonnet-4-0') ? 'claude-sonnet-4-0' : ''))] || null;
      const costUsd = rateA ? ((inputTokens / 1000) * rateA.input + (outputTokens / 1000) * rateA.output) : null;
      if (typeof updated === 'string') {
        updated = updated.replace(/```[a-z]*\n([\s\S]*?)\n```/gi, '$1');
        updated = updated.replace(/\n?\s*---BEGIN---\s*\n?/gi, '');
        updated = updated.replace(/\n?\s*---END---\s*\n?/gi, '');
      }
      if (typeof updated !== 'string' || !updated.trim()) {
        return res.status(502).json({ error: 'Invalid response from model' });
      }
      try {
        const home = os.homedir();
        const logsRoot = path.join(home, '.markdown-web', 'logs');
        const safeFolder = encodeURIComponent(String(relPath || 'untitled'));
        const logDir = path.join(logsRoot, safeFolder);
        const logPath = path.join(logDir, 'ai.json');
        await fs.mkdir(logDir, { recursive: true });
        let arr: any[] = [];
        try { const existing = await fs.readFile(logPath, 'utf-8'); arr = JSON.parse(existing); if (!Array.isArray(arr)) arr = []; } catch {}
        const entry = { ts: new Date().toISOString(), model, prompt: String(prompt).slice(0,4000), usage: { inputTokens, outputTokens, totalTokens }, costUsd };
        arr.push(entry);
        await fs.writeFile(logPath, JSON.stringify(arr, null, 2));
      } catch {}
      return res.json({ content: updated, usage: { inputTokens, outputTokens, totalTokens }, model, costUsd });
    }

    // OpenAI branch
    let apiKey = process.env.OPENAI_KEY;
    try {
      const s = await themeManager.getSettings();
      if (s.openAiKey && typeof s.openAiKey === 'string' && s.openAiKey.trim()) apiKey = s.openAiKey.trim();
    } catch {}
    if (!apiKey) return res.status(400).json({ error: 'OpenAI key not configured' });
    const client = new OpenAI({ apiKey });
    let data: any;
    try {
      data = await client.responses.create({
        model,
        input,
      });
    } catch (e: any) {
      const details = e?.message || e?.response?.data || 'Unknown error';
      return res.status(502).json({ error: 'OpenAI request failed', details: String(details).slice(0, 2000) });
    }

    let updated: string | undefined = data?.output_text;
    if (!updated) {
      try {
        const pieces: string[] = [];
        const out = Array.isArray(data?.output) ? data.output : [];
        for (const item of out) {
          const contentArr = Array.isArray((item as any)?.content) ? (item as any).content : [];
          for (const c of contentArr) {
            if (typeof (c as any)?.text === 'string') pieces.push((c as any).text);
            else if ((c as any)?.text?.value) pieces.push(String((c as any).text.value));
          }
        }
        updated = pieces.join('');
      } catch {}
    }
    const usage = (data as any)?.usage || {};
    const inputTokens = Number(usage.input_tokens || usage.prompt_tokens || 0);
    const outputTokens = Number(usage.output_tokens || usage.completion_tokens || 0);
    const totalTokens = Number(usage.total_tokens || inputTokens + outputTokens);

    // Estimate cost if pricing is known; allow override via env OPENAI_PRICING JSON
    // OpenAI default pricing (USD per 1K tokens)
    // Based on: GPT-5 $1.250/$10.000 per 1M (input/output),
    // GPT-5 Mini $0.250/$2.000 per 1M, GPT-5 Nano $0.050/$0.400 per 1M
    const defaultPricing: Record<string, { input: number; output: number }> = {
      'gpt-5': { input: 0.00125, output: 0.01 },
      'gpt-5-mini': { input: 0.00025, output: 0.002 },
      'gpt-5-nano': { input: 0.00005, output: 0.0004 },
    };
    let pricing = defaultPricing;
    try {
      if (process.env.OPENAI_PRICING) {
        pricing = JSON.parse(process.env.OPENAI_PRICING);
      }
    } catch {}
    const rate = pricing[model];
    const costUsd = rate ? ((inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output) : null;

    // Sanitize accidental wrappers from the model
    if (typeof updated === 'string') {
      // Remove common wrappers the model might include
      updated = updated.replace(/```[a-z]*\n([\s\S]*?)\n```/gi, '$1');
      updated = updated.replace(/\n?\s*---BEGIN---\s*\n?/gi, '');
      updated = updated.replace(/\n?\s*---END---\s*\n?/gi, '');
    }
    if (typeof updated !== 'string' || !updated.trim()) {
      return res.status(502).json({ error: 'Invalid response from OpenAI' });
    }
    // Attempt to write a log entry if a path was provided
    try {
      const home = os.homedir();
      const logsRoot = path.join(home, '.markdown-web', 'logs');
      const safeFolder = encodeURIComponent(String(relPath || 'untitled'));
      const logDir = path.join(logsRoot, safeFolder);
      const logPath = path.join(logDir, 'ai.json');
      await fs.mkdir(logDir, { recursive: true });
      let arr: any[] = [];
      try {
        const existing = await fs.readFile(logPath, 'utf-8');
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      } catch {}
      const entry = {
        ts: new Date().toISOString(),
        model,
        prompt: String(prompt).slice(0, 4000),
        usage: { inputTokens, outputTokens, totalTokens },
        costUsd,
      };
      arr.push(entry);
      await fs.writeFile(logPath, JSON.stringify(arr, null, 2));
    } catch (e) {
      // best-effort logging only
    }

    return res.json({ content: updated, usage: { inputTokens, outputTokens, totalTokens }, model, costUsd });
  } catch (error) {
    console.error('AI apply failed:', error);
    return res.status(500).json({ error: 'AI apply failed' });
  }
});

// Ask questions about current markdown (no file modification)
fileRouter.post('/ai/ask', async (req, res) => {
  try {
    const { prompt, content, model: overrideModel, path: relPath } = (req.body || {}) as { prompt?: string; content?: string; model?: string; path?: string };
    if (typeof prompt !== 'string' || typeof content !== 'string') {
      return res.status(400).json({ error: 'prompt and content are required' });
    }

    // Resolve model and provider
    let model = 'gpt-5-mini';
    let provider: 'openai' | 'anthropic' = 'openai';
    try {
      const settings = await themeManager.getSettings();
      if (settings.defaultModel) { model = settings.defaultModel; provider = settings.defaultModelProvider === 'anthropic' || String(model).startsWith('claude-') ? 'anthropic' : 'openai'; }
      else if (settings.openAiModel && typeof settings.openAiModel === 'string') { model = settings.openAiModel; provider = 'openai'; }
    } catch {}
    if (overrideModel) { model = overrideModel; provider = String(model).startsWith('claude-') ? 'anthropic' : 'openai'; }

    const instruction = 'You are a helpful documentation assistant. Answer the user\'s question about the provided markdown. Be concise and use markdown formatting in your answer when appropriate. Do not include code fences that wrap the entire answer.';
    const input = `${instruction}\n\nMarkdown:\n\n${content}\n\nQuestion:\n${prompt}`;

    let costUsd: number | null = null;
    if (provider === 'openai') {
      let apiKey = process.env.OPENAI_KEY; try { const s = await themeManager.getSettings(); if (s.openAiKey?.trim()) apiKey = s.openAiKey.trim(); } catch {}
      if (!apiKey) return res.status(400).json({ error: 'OpenAI key not configured' });
      const client = new OpenAI({ apiKey });
      let data: any; try { data = await client.responses.create({ model, input }); } catch (e: any) { const details = e?.message || e?.response?.data || 'Unknown error'; return res.status(502).json({ error: 'OpenAI request failed', details: String(details).slice(0,2000) }); }
      let answer: string | undefined = data?.output_text;
      if (!answer) { try { const pieces: string[] = []; const out = Array.isArray(data?.output) ? data.output : []; for (const item of out) { const contentArr = Array.isArray((item as any)?.content) ? (item as any).content : []; for (const c of contentArr) { if (typeof (c as any)?.text === 'string') pieces.push((c as any).text); else if ((c as any)?.text?.value) pieces.push(String((c as any).text.value)); } } answer = pieces.join(''); } catch {} }
      if (typeof answer === 'string') { answer = answer.replace(/```[a-z]*\n([\s\S]*?)\n```/gi, '$1'); answer = answer.replace(/\n?\s*---BEGIN---\s*\n?/gi, ''); answer = answer.replace(/\n?\s*---END---\s*\n?/gi, ''); }
      if (!answer || typeof answer !== 'string' || !answer.trim()) return res.status(502).json({ error: 'Invalid response from model' });
      const usage = (data as any)?.usage || {}; const inputTokens = Number(usage.input_tokens || usage.prompt_tokens || 0); const outputTokens = Number(usage.output_tokens || usage.completion_tokens || 0); const totalTokens = Number(usage.total_tokens || inputTokens + outputTokens);
      // OpenAI pricing (per 1K tokens), override via OPENAI_PRICING if provided
      // OpenAI default pricing (USD per 1K tokens)
      const defaultPricing: Record<string, { input: number; output: number }> = {
        'gpt-5': { input: 0.00125, output: 0.01 },
        'gpt-5-mini': { input: 0.00025, output: 0.002 },
        'gpt-5-nano': { input: 0.00005, output: 0.0004 },
      };
      let pricing = defaultPricing; try { if (process.env.OPENAI_PRICING) pricing = JSON.parse(process.env.OPENAI_PRICING); } catch {}
      const rate = pricing[model]; costUsd = rate ? ((inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output) : null;
      // Log to file if path provided
      try {
        if (relPath) {
          const home = os.homedir();
          const logsRoot = path.join(home, '.markdown-web', 'logs');
          const safeFolder = encodeURIComponent(String(relPath));
          const logDir = path.join(logsRoot, safeFolder);
          const logPath = path.join(logDir, 'ai.json');
          await fs.mkdir(logDir, { recursive: true });
          let arr: any[] = []; try { const existing = await fs.readFile(logPath, 'utf-8'); arr = JSON.parse(existing); if (!Array.isArray(arr)) arr = []; } catch {}
          arr.push({ ts: new Date().toISOString(), model, prompt: String(prompt).slice(0,4000), usage: { inputTokens, outputTokens, totalTokens }, costUsd });
          await fs.writeFile(logPath, JSON.stringify(arr, null, 2));
        }
      } catch {}
      return res.json({ answer, usage: { inputTokens, outputTokens, totalTokens }, model, costUsd });
    } else {
      let apiKey = process.env.ANTHROPIC_API_KEY; try { const s = await themeManager.getSettings(); if (s.anthropicKey?.trim()) apiKey = s.anthropicKey.trim(); } catch {}
      if (!apiKey) return res.status(400).json({ error: 'Anthropic key not configured' });
      const anthropic = new Anthropic({ apiKey });
      let data: any; try { data = await anthropic.messages.create({ model, max_tokens: 2048, messages: [{ role: 'user', content: input }] }); } catch (e: any) { const details = e?.message || e?.response?.data || 'Unknown error'; return res.status(502).json({ error: 'Anthropic request failed', details: String(details).slice(0,2000) }); }
      let answer: string | undefined; try { const parts: string[] = []; const arr = Array.isArray(data?.content) ? data.content : []; for (const part of arr) if (part?.type === 'text' && typeof part?.text === 'string') parts.push(part.text); answer = parts.join(''); } catch {}
      if (typeof answer === 'string') { answer = answer.replace(/```[a-z]*\n([\s\S]*?)\n```/gi, '$1'); answer = answer.replace(/\n?\s*---BEGIN---\s*\n?/gi, ''); answer = answer.replace(/\n?\s*---END---\s*\n?/gi, ''); }
      if (!answer || typeof answer !== 'string' || !answer.trim()) return res.status(502).json({ error: 'Invalid response from model' });
      const usage = (data as any)?.usage || {}; const inputTokens = Number(usage?.input_tokens || 0); const outputTokens = Number(usage?.output_tokens || 0); const totalTokens = inputTokens + outputTokens;
      // Anthropic pricing (USD per 1K tokens)
      const anthropicPricing: Record<string, { input: number; output: number }> = {
        'claude-opus-4-1': { input: 15, output: 75 },
        'claude-sonnet-4-0': { input: 3, output: 15 },
      };
      const rateA = anthropicPricing[model] || anthropicPricing[(model.startsWith('claude-opus-4-1') ? 'claude-opus-4-1' : (model.startsWith('claude-sonnet-4-0') ? 'claude-sonnet-4-0' : ''))] || null;
      costUsd = rateA ? ((inputTokens / 1000) * rateA.input + (outputTokens / 1000) * rateA.output) : null;
      try {
        if (relPath) {
          const home = os.homedir();
          const logsRoot = path.join(home, '.markdown-web', 'logs');
          const safeFolder = encodeURIComponent(String(relPath));
          const logDir = path.join(logsRoot, safeFolder);
          const logPath = path.join(logDir, 'ai.json');
          await fs.mkdir(logDir, { recursive: true });
          let arr: any[] = []; try { const existing = await fs.readFile(logPath, 'utf-8'); arr = JSON.parse(existing); if (!Array.isArray(arr)) arr = []; } catch {}
          arr.push({ ts: new Date().toISOString(), model, prompt: String(prompt).slice(0,4000), usage: { inputTokens, outputTokens, totalTokens }, costUsd });
          await fs.writeFile(logPath, JSON.stringify(arr, null, 2));
        }
      } catch {}
      return res.json({ answer, usage: { inputTokens, outputTokens, totalTokens }, model, costUsd });
    }
  } catch (error) {
    console.error('AI ask failed:', error);
    return res.status(500).json({ error: 'AI ask failed' });
  }
});

// Get cumulative AI cost for a file
fileRouter.get('/ai/cost', async (req, res) => {
  try {
    const relPath = String(req.query.path || '');
    if (!relPath) return res.json({ totalCostUsd: 0, entries: 0 });
    const home = os.homedir();
    const logsRoot = path.join(home, '.markdown-web', 'logs');
    const safeFolder = encodeURIComponent(relPath);
    const logPath = path.join(logsRoot, safeFolder, 'ai.json');
    let total = 0;
    let entries = 0;
    try {
      const data = await fs.readFile(logPath, 'utf-8');
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        for (const it of arr) {
          if (typeof it?.costUsd === 'number') total += it.costUsd;
        }
        entries = arr.length;
      }
    } catch {}
    return res.json({ totalCostUsd: total, entries });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read AI cost' });
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
    const incoming = req.body || {};
    const current = await themeManager.getSettings();
    // Basic validation: when provided, ensure correct types
    if ('selectedTheme' in incoming && typeof incoming.selectedTheme !== 'string') {
      return res.status(400).json({ error: 'selectedTheme must be a string' });
    }
    if ('previewLayout' in incoming && !['full', 'split'].includes(String(incoming.previewLayout))) {
      return res.status(400).json({ error: 'previewLayout must be "full" or "split"' });
    }
    if ('sidebarMode' in incoming && !['overlay', 'inline'].includes(String(incoming.sidebarMode))) {
      return res.status(400).json({ error: 'sidebarMode must be "overlay" or "inline"' });
    }
    if ('openAiModel' in incoming && typeof incoming.openAiModel !== 'string') {
      return res.status(400).json({ error: 'openAiModel must be a string' });
    }
    if ('openAiKey' in incoming && typeof incoming.openAiKey !== 'string') {
      return res.status(400).json({ error: 'openAiKey must be a string' });
    }
    if ('anthropicKey' in incoming && typeof incoming.anthropicKey !== 'string') {
      return res.status(400).json({ error: 'anthropicKey must be a string' });
    }
    if ('defaultModel' in incoming && typeof incoming.defaultModel !== 'string') {
      return res.status(400).json({ error: 'defaultModel must be a string' });
    }
    if ('defaultModelProvider' in incoming && !['openai','anthropic'].includes(String(incoming.defaultModelProvider))) {
      return res.status(400).json({ error: 'defaultModelProvider must be "openai" or "anthropic"' });
    }
    // removed handling for scrollSync and mermaidEnabled

    const merged = { ...current, ...incoming };
    await themeManager.saveSettings(merged);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Find nearest git root by walking up from a path
async function findGitRoot(startPath: string): Promise<string | null> {
  try {
    let dir = startPath;
    const root = path.parse(dir).root;
    while (true) {
      try {
        const s = await fs.stat(path.join(dir, '.git'));
        if (s.isDirectory()) return dir;
      } catch {}
      if (dir === root) break;
      dir = path.dirname(dir);
    }
    return null;
  } catch {
    return null;
  }
}

// Git: add (stage) a file
fileRouter.post('/git/add', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const relPath = String((req.body || {}).path || '');
    if (!relPath) return res.status(400).json({ error: 'path is required' });
    const absPath = path.resolve(workingDir, relPath);
    const rel = path.relative(workingDir, absPath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return res.status(403).json({ error: 'Access denied' });
    const repoRoot = await findGitRoot(absPath);
    if (!repoRoot) return res.status(400).json({ error: 'Not inside a git repository' });
    const relToRepo = path.relative(repoRoot, absPath).replace(/\\/g, '/');
    // If the file no longer exists, stage the deletion instead
    let exists = true;
    try { await fs.stat(absPath); } catch { exists = false; }
    try {
      const args = exists ? ['add', '--', relToRepo] : ['rm', '--cached', '--', relToRepo];
      const { stdout, stderr } = await execFileAsync('git', args, { cwd: repoRoot });
      return res.json({ success: true, stdout, stderr });
    } catch (e: any) {
      return res.status(502).json({ error: 'git add failed', details: e?.stderr || e?.message || String(e) });
    }
  } catch (e) {
    return res.status(500).json({ error: 'git add failed' });
  }
});

// Git: commit (from a repo folder)
fileRouter.post('/git/commit', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const { repoPath, title, message } = (req.body || {}) as { repoPath?: string; title?: string; message?: string };
    if (!repoPath || !title) return res.status(400).json({ error: 'repoPath and title are required' });
    const absRepo = path.resolve(workingDir, repoPath);
    const rel = path.relative(workingDir, absRepo);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return res.status(403).json({ error: 'Access denied' });
    const repoRoot = await findGitRoot(absRepo);
    if (!repoRoot) return res.status(400).json({ error: 'Not a git repository' });
    const args = ['commit', '-m', String(title)];
    if (message && String(message).trim()) args.push('-m', String(message));
    try {
      const { stdout, stderr } = await execFileAsync('git', args, { cwd: repoRoot });
      return res.json({ success: true, stdout, stderr });
    } catch (e: any) {
      return res.status(502).json({ error: 'git commit failed', details: e?.stderr || e?.message || String(e) });
    }
  } catch (e) {
    return res.status(500).json({ error: 'git commit failed' });
  }
});

// Git: push
fileRouter.post('/git/push', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const { repoPath } = (req.body || {}) as { repoPath?: string };
    if (!repoPath) return res.status(400).json({ error: 'repoPath is required' });
    const absRepo = path.resolve(workingDir, repoPath);
    const rel = path.relative(workingDir, absRepo);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return res.status(403).json({ error: 'Access denied' });
    const repoRoot = await findGitRoot(absRepo);
    if (!repoRoot) return res.status(400).json({ error: 'Not a git repository' });
    try {
      const { stdout, stderr } = await execFileAsync('git', ['push'], { cwd: repoRoot });
      return res.json({ success: true, stdout, stderr });
    } catch (e: any) {
      return res.status(502).json({ error: 'git push failed', details: e?.stderr || e?.message || String(e) });
    }
  } catch (e) {
    return res.status(500).json({ error: 'git push failed' });
  }
});

// Git: clone a repository into a directory (relative to working dir)
fileRouter.post('/git/clone', async (req, res) => {
  try {
    const workingDir = path.resolve(getWorkingDir());
    const { url, directory, name } = (req.body || {}) as { url?: string; directory?: string; name?: string };
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url is required' });
    const baseRel = typeof directory === 'string' ? directory : '';
    const baseAbs = path.resolve(workingDir, baseRel);
    const relBase = path.relative(workingDir, baseAbs);
    if (relBase.startsWith('..') || path.isAbsolute(relBase)) return res.status(403).json({ error: 'Access denied' });
    try { await fs.mkdir(baseAbs, { recursive: true }); } catch {}
    const derivedName = ((): string => {
      if (typeof name === 'string' && name.trim()) return name.trim();
      try {
        const u = new URL(url);
        const last = u.pathname.split('/').filter(Boolean).pop() || 'repo';
        return last.replace(/\.git$/i, '') || 'repo';
      } catch {
        const m = url.split('/').filter(Boolean).pop() || 'repo';
        return m.replace(/\.git$/i, '') || 'repo';
      }
    })();
    const target = path.resolve(baseAbs, derivedName);
    const relTarget = path.relative(workingDir, target);
    if (relTarget.startsWith('..') || relTarget.startsWith(path.sep)) return res.status(403).json({ error: 'Access denied' });
    // Prevent cloning over existing folder
    try {
      const s = await fs.stat(target);
      return res.status(409).json({ error: 'Target already exists' });
    } catch {}
    try {
      const { stdout, stderr } = await execFileAsync('git', ['clone', url, derivedName], { cwd: baseAbs });
      return res.json({ success: true, stdout, stderr, path: path.relative(workingDir, target) });
    } catch (e: any) {
      return res.status(502).json({ error: 'git clone failed', details: e?.stderr || e?.message || String(e) });
    }
  } catch {
    return res.status(500).json({ error: 'git clone failed' });
  }
});
type GitFileStatus = 'untracked' | 'modified' | 'deleted';
type GitContext = { root: string; map: Map<string, GitFileStatus>; hasUnstaged: boolean; hasStaged: boolean } | null;

async function getGitStatusMap(repoRoot: string): Promise<GitContext> {
  try {
    const { stdout } = await execFileAsync('git', ['status', '--porcelain'], { cwd: repoRoot });
    const map = new Map<string, GitFileStatus>();
    let hasUnstaged = false;
    let hasStaged = false;
    const lines = String(stdout || '').split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      // Format: XY <path> (XY can be '??' for untracked)
      if (line.length < 3) continue;
      const x = line[0];
      const y = line[1];
      const rest = line.slice(3);
      let rel = rest;
      // handle rename format: old -> new (take new)
      const arrowIdx = rest.indexOf(' -> ');
      if (arrowIdx !== -1) {
        rel = rest.slice(arrowIdx + 4);
      }
      // Normalize to posix-style
      const key = rel.replace(/\\/g, '/');
      let kind: GitFileStatus | null = null;
      if (x === '?' && y === '?') {
        kind = 'untracked';
      } else if (x === 'D' || y === 'D') {
        kind = 'deleted';
      } else if (x !== ' ' || y !== ' ') {
        kind = 'modified';
      }
      if (kind) map.set(key, kind);
      if (y !== ' ') hasUnstaged = true; // work tree changes
      if (x !== ' ') hasStaged = true;   // index changes
    }
    return { root: repoRoot, map, hasUnstaged, hasStaged };
  } catch (e) {
    // best-effort: git may not be installed or repo may be inaccessible
    return { root: repoRoot, map: new Map(), hasUnstaged: false, hasStaged: false };
  }
}

async function getDirectoryContents(dirPath: string, gitCtx: GitContext = null): Promise<any[]> {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const result = [];
  
  for (const item of items) {
    if (item.name.startsWith('.')) continue; // Skip hidden files
    
    const itemPath = path.join(dirPath, item.name);
    const relativePath = path.relative(getWorkingDir(), itemPath);
    const relForClient = relativePath.split(path.sep).join('/');
    
    if (item.isDirectory()) {
      // Detect if this folder is a Git repository (contains a .git directory)
      let isGitRepo = false;
      try {
        const gitStat = await fs.stat(path.join(itemPath, '.git'));
        isGitRepo = gitStat.isDirectory();
      } catch {}
      let folderGitCtx: GitContext = gitCtx;
      let gitSummary: { hasUnstaged?: boolean; hasStaged?: boolean } | undefined = undefined;
      if (isGitRepo) {
        folderGitCtx = await getGitStatusMap(itemPath);
        gitSummary = { hasUnstaged: !!folderGitCtx?.hasUnstaged, hasStaged: !!folderGitCtx?.hasStaged };
      }
      const children = await getDirectoryContents(itemPath, folderGitCtx);
      result.push({
        name: item.name,
        type: 'directory',
        path: relForClient,
        children: children,
        isGitRepo,
        gitSummary,
      });
    } else if (/\.md$/i.test(item.name)) {
      // Attach per-file git status if we are inside a repo context
      let gitStatus: GitFileStatus | undefined = undefined;
      if (gitCtx && gitCtx.root) {
        const relToRepo = path.relative(gitCtx.root, itemPath).replace(/\\/g, '/');
        const st = gitCtx.map.get(relToRepo);
        if (st) gitStatus = st;
      }
      result.push({
        name: item.name,
        type: 'file',
        path: relForClient,
        gitStatus,
      });
    }
  }
  // Inject deleted files that belong to this directory (within repo context)
  try {
    if (gitCtx && gitCtx.root) {
      const relDir = path.relative(gitCtx.root, dirPath).replace(/\\/g, '/');
      const relDirNorm = relDir === '' ? '' : relDir;
      for (const [relPathFromRepo, status] of gitCtx.map.entries()) {
        if (status !== 'deleted') continue;
        if (!/\.md$/i.test(relPathFromRepo)) continue;
        const parent = path.posix.dirname(relPathFromRepo);
        const parentNorm = parent === '.' ? '' : parent;
        if (parentNorm !== relDirNorm) continue;
        const name = path.posix.basename(relPathFromRepo);
        const abs = path.join(gitCtx.root, relPathFromRepo);
        const relToWorking = path.relative(getWorkingDir(), abs).replace(/\\/g, '/');
        // avoid duplicates if a similarly named file somehow exists in result
        if (!result.some((r: any) => r.type === 'file' && r.path === relToWorking)) {
          result.push({ name, type: 'file', path: relToWorking, gitStatus: 'deleted' });
        }
      }
    }
  } catch {}
  
  return result.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}
