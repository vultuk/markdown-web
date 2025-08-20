# Contributing to Markdown Web Editor

Thank you for your interest in contributing to Markdown Web Editor! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- A text editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/vultuk/markdown-web.git
cd markdown-web
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

This starts both the client (Vite) and server (Express) in development mode with hot reload.

## 📝 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/vultuk/markdown-web/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node.js version, browser)
   - Screenshots if applicable

### Suggesting Features
1. Check if the feature has been suggested before
2. Create a new issue with the `enhancement` label
3. Describe the feature and its use case
4. Explain why this feature would be beneficial

### Code Contributions

#### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update tests if needed

3. **Test your changes**
```bash
# Type check
npm run typecheck

# Build to ensure no build errors
npm run build

# Test the application manually
npm run dev
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

5. **Push and create a pull request**
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear description of changes
- Reference to any related issues
- Screenshots/GIFs for UI changes

## 🏗️ Architecture Overview

```
markdown-web/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS modules
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   └── api.ts            # API routes
├── bin/                   # CLI entry point
└── dist/                  # Built files
```

### Key Components
- **App.tsx**: Main application component with state management
- **FileExplorer**: Sidebar file/folder browser
- **Editor**: Main editing interface
- **Header**: Global header with controls
- **StatusBar**: Bottom status information

### API Routes
- `GET /api/files`: List directory contents
- `GET /api/files/*`: Read file content
- `POST /api/files/*`: Save file content
- `POST /api/create-file`: Create new file
- `POST /api/create-directory`: Create new directory

## 🎨 Code Style

### TypeScript
- Use TypeScript for all new code
- Define interfaces for component props
- Use proper typing, avoid `any`

### React
- Use functional components with hooks
- Use `useCallback` and `useMemo` for performance
- Follow React best practices

### CSS
- Use CSS Modules for styling
- Follow BEM-like naming conventions
- Maintain dark theme consistency

### Files
- Use descriptive file and variable names
- Keep components focused and small
- Export components as named exports

## 🧪 Testing

Currently, the project relies on manual testing. We welcome contributions to add:
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for API endpoints

## 📦 Build Process

The build process:
1. **Client build**: Vite builds React app to `dist/client/`
2. **Server build**: TypeScript compiles server to `dist/`
3. **CLI script**: Points to built server files

## 🔄 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Push to GitHub
5. Create GitHub release
6. Automated npm publish via GitHub Actions

## 💬 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Communication
- Use clear, descriptive language
- Be patient with questions and reviews
- Provide helpful feedback in code reviews
- Keep discussions on-topic

## ❓ Questions?

- Check the [README](README.md) for basic information
- Look through existing [Issues](https://github.com/vultuk/markdown-web/issues)
- Create a new issue with the `question` label

Thank you for contributing to Markdown Web Editor! 🎉