# Markdown Web Editor

[![npm version](https://badge.fury.io/js/markdown-web.svg)](https://badge.fury.io/js/markdown-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, browser-based markdown editor that you can run in any directory. Edit `.md` files with live preview, auto-save, and a VS Code-inspired interface.

## ✨ Features

- 📁 **File Explorer** - Browse and organize all `.md` files in your directory
- ✏️ **Rich Text Editor** - Clean, distraction-free editing experience
- 👁️ **Live Preview** - Toggle between edit and rendered markdown views
- 💾 **Auto-save** - Files saved automatically (5 seconds after editing)
- ⌨️ **Keyboard Shortcuts** - `Ctrl+S` / `Cmd+S` for instant save
- 🔗 **URL Navigation** - Bookmarkable links to specific files
- 📊 **Status Bar** - Word count, character count, and line count
- 🎨 **VS Code Theme** - Dark theme with familiar interface
- 🍔 **Collapsible Sidebar** - More space for writing when needed
- 📂 **Directory Creation** - Create files and folders within subdirectories

## 🚀 Quick Start

### Run with npx (no installation required)
```bash
npx markdown-web
```

### Or install globally
```bash
npm install -g markdown-web
markdown-web
```

### Options

- `--no-open` - Don't open browser automatically (useful for servers)

```bash
npx markdown-web --no-open
```

## 📖 Usage

1. Navigate to any directory containing markdown files
2. Run `npx markdown-web`
3. Your browser will open to `http://localhost:3001`
4. Start editing! Files are auto-saved as you type

### URL Navigation
- Direct file links: `http://localhost:3001/#/path/to/file.md`
- Bookmark specific files
- Browser back/forward works
- Refreshing preserves current file

### Keyboard Shortcuts
- `Ctrl+S` / `Cmd+S` - Save immediately
- Toggle preview with header button
- Use hamburger menu to hide/show sidebar

## 🛠️ Development

To work on this project:

```bash
# Clone the repository
git clone https://github.com/vultuk/markdown-web.git
cd markdown-web

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run typecheck
```

## 🔒 Security

- Only allows access to files within the launch directory
- Automatically filters for `.md` files only
- Prevents directory traversal attacks
- No external network access required

## 🏗️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Express.js with Node.js
- **Build Tool**: Vite 5
- **Markdown Rendering**: react-markdown with remark-gfm
- **Styling**: CSS Modules with VS Code-inspired dark theme
- **File Operations**: Node.js fs/promises API

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by VS Code's interface design
- Built with modern web technologies
- Thanks to the React and Node.js communities

## 📊 Project Status

- ✅ **Stable**: Ready for production use
- 🔄 **Actively maintained**: Regular updates and improvements
- 🐛 **Bug reports welcome**: Please open issues for any problems
- 💡 **Feature requests**: Open to suggestions and improvements