import { describe, it, expect, vi, beforeEach } from 'vitest';

const readdir = vi.fn();
const stat = vi.fn();

vi.mock('fs/promises', () => ({
  default: { readdir, stat },
  readdir,
  stat,
}));

vi.mock('child_process', () => ({
  execFile: (_cmd: string, _args: any, _opts: any, cb: Function) => {
    cb(null, { stdout: ' M note.md\n', stderr: '' });
  },
}));

describe('getDirectoryContents', () => {
  beforeEach(() => {
    readdir.mockReset();
    stat.mockReset();
    process.env.WORKING_DIR = '/root';
  });

  it('ignores dotfiles, normalises paths and attaches git metadata', async () => {
    const dirent = (name: string, isDir: boolean) => ({
      name,
      isDirectory: () => isDir,
    });

    readdir.mockImplementation(async (dir: string) => {
      if (dir === '/root') {
        return [
          dirent('.hidden.md', false),
          dirent('file.md', false),
          dirent('nested', true),
        ];
      }
      if (dir === '/root/nested') {
        return [dirent('note.md', false)];
      }
      return [];
    });

    stat.mockImplementation(async (p: string) => {
      if (p === '/root/nested/.git') {
        return { isDirectory: () => true } as any;
      }
      throw Object.assign(new Error('not found'), { code: 'ENOENT' });
    });

    const api = await import('./api');
    const result = await api.getDirectoryContents('/root');

    const names = result.map((r: any) => r.name);
    expect(names).not.toContain('.hidden.md');

    const file = result.find((r: any) => r.name === 'file.md');
    expect(file.path).toBe('file.md');

    const folder = result.find((r: any) => r.name === 'nested');
    expect(folder.isGitRepo).toBe(true);
    expect(folder.gitSummary).toEqual({ hasUnstaged: true, hasStaged: false });

    const child = folder.children.find((c: any) => c.name === 'note.md');
    expect(child.path).toBe('nested/note.md');
    expect(child.path).not.toContain('\\');
    expect(child.gitStatus).toBe('modified');
  });
});
