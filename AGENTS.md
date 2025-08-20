# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript client (components, hooks, contexts, styles).
- `server/`: Express API and server runtime (`api.ts`, `index.ts`, `https-server.ts`, `themeManager.ts`).
- `dist/`: Production build output (server and bundled client under `server/client`).
- `bin/`: CLI entry (`markdown-web.js`).
- `scripts/`: SSL setup and service helpers.
- Root: `index.html`, `vite.config.ts`, `tsconfig*.json`, docs.

## Build, Test, and Development Commands
- `npm run dev`: Start server (watch) and Vite client with hot reload.
- `npm run build`: Build client and server for production.
- `npm start`: Run the built server from `dist/`.
- `npm run typecheck`: TypeScript strict mode check (no emit).
- `npm run start:https`: Start HTTPS server (requires sudo). See `SSL_SETUP.md`.
- `npm run setup-ssl`: Generate/self-install local certs (requires sudo).

Examples:
```
npm install
npm run dev
npm run build && npm start
```

## Coding Style & Naming Conventions
- Language: TypeScript (strict, noUnused* enabled). Prefer explicit types at boundaries.
- React: Components in PascalCase (`EditorPanel.tsx`), hooks in camelCase (`useFileList.ts`).
- Indentation: 2 spaces; keep imports tidy and relative paths stable.
- Avoid introducing new lint tools unless discussed; follow existing patterns in `src/` and `server/`.

## Testing Guidelines
- No formal test runner is configured yet. At minimum, run `npm run typecheck` and verify key flows manually (open, edit, save, preview).
- If adding logic-heavy modules, prefer lightweight unit tests (e.g., Vitest) colocated as `*.test.ts`. Keep file I/O mocked.
- Include reproduction steps in PRs; attach screenshots for UI changes.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative subject lines (max ~72 chars). Optional Conventional Commits prefixes are welcome (e.g., `feat:`, `fix:`, `chore:`).
- PRs must include: summary, motivation/issue link, test plan (commands, steps), before/after screenshots for UI, and notes on security or migration.
- Keep PRs focused and small. Update `README.md`/`SSL_SETUP.md` when behavior or scripts change.

## Security & Configuration Tips
- The server operates within the launch directory (`WORKING_DIR`) and exposes file APIs under `/api`; avoid expanding scope.
- HTTPS helpers require elevated privileges; review scripts in `scripts/` before running and prefer local/dev use only.
- Do not access files outside the working directory; validate all new endpoints for path traversal safety.

