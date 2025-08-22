import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import http from 'http';
import supertest from 'supertest';

let server: http.Server;
let tmpRoot: string;
let originalPort = process.env.PORT;
let originalHome = process.env.HOME;

async function makeDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function write(p: string, content = '') {
  await makeDir(path.dirname(p));
  await fs.writeFile(p, content, 'utf-8');
}

beforeAll(async () => {
  // Isolate HOME so settings/logs don't touch real user env
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'mdweb-tests-'));
  process.env.HOME = path.join(tmpRoot, 'home');
  await fs.mkdir(process.env.HOME, { recursive: true });

  // Create a test workspace with nested paths and spaces
  const workspace = path.join(tmpRoot, 'workspace');
  await makeDir(workspace);
  await write(path.join(workspace, 'readme.md'), '# Readme');
  await write(path.join(workspace, 'Work', 'afx Markets', 'System Overview.md'), '# System');

  // Start server on an ephemeral port (set before import)
  process.env.PORT = '0';
  const mod = await import('../server/index');
  server = await mod.startServer(workspace);
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (originalPort === undefined) delete process.env.PORT; else process.env.PORT = originalPort;
  if (originalHome === undefined) delete process.env.HOME; else process.env.HOME = originalHome;
});

describe('Server API basics', () => {
  it('lists .md files including paths with spaces', async () => {
    const res = await supertest(server).get('/api/files').expect(200);
    const list = res.body as any[];
    expect(Array.isArray(list)).toBe(true);
    // find the nested folder and file
    const work = list.find((x) => x.type === 'directory' && x.name === 'Work');
    expect(work).toBeTruthy();
    const afx = (work?.children || []).find((x: any) => x.type === 'directory' && x.name === 'afx Markets');
    expect(afx).toBeTruthy();
    const sys = (afx?.children || []).find((x: any) => x.type === 'file' && x.name === 'System Overview.md');
    expect(sys).toBeTruthy();
    // ensure POSIX-style path returned
    expect(sys.path).toContain('Work/afx Markets/System Overview.md');
  });

  it('can create a new markdown file', async () => {
    const fileRel = 'Notes/New File.md';
    await supertest(server).post('/api/create-file').send({ fileName: fileRel }).expect(200);
    const res = await supertest(server).get('/api/files').expect(200);
    const notes = res.body.find((x: any) => x.type === 'directory' && x.name === 'Notes');
    const nf = (notes?.children || []).find((x: any) => x.type === 'file' && x.name === 'New File.md');
    expect(nf).toBeTruthy();
  });

  it('can rename a file', async () => {
    const oldRel = 'Old.md';
    const newRel = 'Renamed.md';
    await supertest(server).post('/api/create-file').send({ fileName: oldRel }).expect(200);
    await supertest(server).post('/api/rename').send({ oldPath: oldRel, newPath: newRel }).expect(200);
    const res = await supertest(server).get('/api/files').expect(200);
    const renamed = res.body.find((x: any) => x.type === 'file' && x.name === 'Renamed.md');
    expect(renamed).toBeTruthy();
  });

  it('can delete a file', async () => {
    const delRel = 'ToDelete.md';
    await supertest(server).post('/api/create-file').send({ fileName: delRel }).expect(200);
    await supertest(server).delete(`/api/files/${encodeURIComponent(delRel)}`).expect(200);
    const res = await supertest(server).get('/api/files').expect(200);
    const gone = res.body.find((x: any) => x.type === 'file' && x.name === 'ToDelete.md');
    expect(gone).toBeUndefined();
  });

  it('AI status toggles when key is set via settings', async () => {
    // Initially disabled (no keys)
    const s0 = await supertest(server).get('/api/ai/status').expect(200);
    expect(s0.body.enabled).toBe(false);
    // Set key through settings
    await supertest(server).post('/api/settings').send({ openAiKey: 'test-key' }).expect(200);
    const s1 = await supertest(server).get('/api/ai/status').expect(200);
    expect(s1.body.enabled).toBe(true);
  });
});

