# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.2] - 2024-08-20

### Improved
- Enhanced print theme system with configurable background and color properties
- All built-in themes now include proper background and color definitions for print output
- Improved print styling consistency across all themes

### Technical Improvements
- Added background and color properties to theme print configuration interface
- Updated ThemeContext to apply theme-specific background and color for print styles
- Enhanced type definitions for print theme properties

## [1.6.1] - 2024-08-20

### Fixed
- Fixed NPM publishing issue for proper distribution
- Updated release automation for consistent publishing

## [1.6.0] - 2024-08-20

### Added
- **Export Functionality**: Export markdown files to various formats including PDF
- **File and Folder Deletion**: Complete file/folder deletion feature with confirmation modal
- **Enhanced Dependencies**: Added codex and codex-cli dependencies for improved functionality

### New Features
- **PDF Export**: High-quality PDF generation from markdown content
- **Markdown Export**: Export files as .md with proper formatting
- **Confirmation Modals**: Safety confirmation dialogs for destructive actions
- **Export Button**: Clean, accessible export interface in the header
- **Delete Operations**: Context-aware file and folder deletion with confirmation

### Technical Improvements
- **Export API**: New `/api/export` endpoint for file conversion
- **Modal System**: Reusable confirmation modal component
- **Enhanced UI**: Improved styling and user experience for export features
- **Error Handling**: Better error management for export and delete operations
- **Accessibility**: Improved keyboard navigation and screen reader support

### Bug Fixes
- Fixed blank PDF export issues
- Resolved dropdown styling problems
- Improved export UX and error messaging
- Enhanced file deletion safety checks

## [1.3.2] - 2024-08-20

### Fixed
- **Resolved theme switching bug**: Theme changes now apply instantly in preview mode (for real this time!)
- Fixed architecture issue where components had separate theme states instead of shared state

### Technical Architecture Improvements
- **Implemented Theme Context**: Created centralized React Context for theme state management
- **Shared State System**: All components now use the same theme state via React Context
- **Backwards Compatibility**: useTheme hook maintains the same API while using shared context
- **Real-Time Propagation**: Theme changes immediately propagate to all components

### How It Works Now
- Single source of truth for theme state across the entire application
- ThemeSelector and MarkdownPreview share the same context state
- No more component remounting required for theme changes to apply
- Instant theme switching in any mode (edit or preview)

## [1.3.1] - 2024-08-20

### Fixed
- Fixed theme changes not applying instantly when in preview mode
- Theme switching now works immediately without needing to toggle between edit and preview modes
- Improved theme application timing to ensure DOM elements are ready before styling

### Technical Improvements
- Added key prop to ReactMarkdown component to force re-render on theme changes
- Improved style application timing with setTimeout to ensure DOM readiness
- Enhanced real-time theme switching experience

## [1.3.0] - 2024-08-20

### Added
- **Complete Theming System**: Choose from 5 professional themes for preview and print
- **Theme Selector**: Dropdown in header to switch between themes instantly
- **Theme Persistence**: Selected theme is saved in `~/.markdown-web/themes` directory
- **Dynamic Styling**: Real-time theme application to both preview and print output
- **Professional Themes**: 5 built-in themes - Dark, GitHub, Academic, Minimal, and Notion

### New Themes
- 🌙 **Dark** - VS Code-inspired dark theme (default)
- 🐙 **GitHub** - Clean GitHub-style markdown rendering
- 🎓 **Academic** - Serif fonts, formal styling for papers  
- ✨ **Minimal** - Clean, minimal with excellent typography
- 📝 **Notion** - Notion-inspired clean design

### Technical Features
- New API endpoints for theme management (`/api/themes`, `/api/settings`)
- Theme manager backend service with automatic theme initialization
- Real-time CSS generation and application
- Synchronized preview and print styling
- Theme data stored in JSON format for easy customization

### Enhanced Print Experience
- Print output now uses selected theme for consistent styling
- Professional typography optimized for each theme
- Theme-specific formatting for headers, code blocks, tables, and more

## [1.2.4] - 2024-08-20

### Improved
- Removed link styling from print output for cleaner documents
- Links now appear as normal text without underlines or URL display in printed documents
- Creates a more professional and readable print experience

## [1.2.3] - 2024-08-20

### Improved
- Removed text justification from print output for better readability
- Print text now uses natural left alignment instead of justified spacing

## [1.2.2] - 2024-08-20

### Fixed
- Completely rewrote print functionality to properly flow content across multiple pages
- Created separate print container that bypasses app layout constraints during printing
- Fixed print content width to fill entire page properly
- Added real-time content synchronization between preview and print container
- Resolved issue where content appeared in constrained containers instead of flowing naturally

### Technical Changes
- Added JavaScript-based print container creation in MarkdownPreview component
- Implemented MutationObserver for real-time content updates
- Rewrote print CSS to use display:none instead of visibility:hidden
- Reset all HTML/body constraints during print mode

## [1.2.1] - 2024-08-20

### Fixed
- Fixed print layout issue where content appeared in a scrollable box instead of flowing across multiple pages
- Removed height constraints and positioning that prevented proper page breaks during printing
- Print output now properly flows across multiple pages with natural page breaks

## [1.2.0] - 2024-08-20

### Added
- Print functionality with clean, print-friendly styling
- Print-only CSS that shows rendered markdown content exclusively
- Professional typography for printed documents (Times New Roman)
- Black-on-white color scheme optimized for printing
- Proper page breaks and margins for professional output
- URL display for external links in printed version

### Features
- Press `Ctrl+P` or `Cmd+P` to print only the rendered markdown
- Hide all UI elements during printing for clean output
- Print-optimized styling for headers, code blocks, tables, and lists

## [1.1.0] - 2024-08-20

### Fixed
- Fixed empty file display issue - empty markdown files now show the editor instead of welcome message
- Improved file selection logic to properly handle empty files

## [1.0.9] - 2024-08-20

### Added
- Global header with hamburger menu for sidebar toggle
- Collapsible sidebar for more editing space
- Clean, modern interface design inspired by VS Code

### Changed
- Moved toolbar functionality to global header
- Removed duplicate filename display (kept in status bar only)
- Improved layout structure for better responsiveness

### Removed
- Individual file toolbar (moved to global header)

## [1.0.8] - 2024-08-20

### Added
- URL-based navigation for files
- Bookmarkable file links with hash routing
- Browser back/forward navigation support
- File path preservation on page refresh

### Features
- Direct file access via URLs (e.g., `#/path/to/file.md`)
- Shareable links to specific files
- Automatic URL updates when selecting files

## [1.0.7] - 2024-08-20

### Added
- Keyboard shortcuts for manual save (`Ctrl+S` / `Cmd+S`)
- Immediate save functionality bypassing auto-save timer
- Enhanced save system with manual trigger support

### Improved
- Save feedback with instant response to keyboard shortcuts
- Better integration between auto-save and manual save systems

## [1.0.6] - 2024-08-20

### Fixed
- URL decoding issue for files and folders with spaces in names
- Proper handling of special characters in file paths
- Fixed server-side path resolution for encoded URLs

## [1.0.5] - 2024-08-20

### Added
- Status bar with real-time statistics (word count, character count, line count)
- File creation in selected subdirectories with context buttons
- Directory-specific create file/folder functionality

### Changed
- Reduced auto-save timer from 15 seconds to 5 seconds
- Enhanced file explorer with per-directory creation options

### Improved
- Better file organization with subdirectory support
- Real-time writing statistics for better productivity tracking

## [1.0.4] - 2024-08-20

### Fixed
- Static file serving path issue for React app
- Corrected file paths for proper client-side routing
- Fixed server-side static file resolution

## [1.0.3] - 2024-08-20

### Added
- `--no-open` command line flag for headless server environments
- Graceful browser opening failure handling
- Better error messages for browser opening issues

### Fixed
- ES module import issue with `open` package
- Browser opening compatibility across different environments

## [1.0.2] - 2024-08-20

### Fixed
- CLI entry point path resolution
- Module loading issues for npm package execution

## [1.0.1] - 2024-08-20

### Fixed
- NPM package file inclusion for proper distribution
- Build process improvements for package publishing

## [1.0.0] - 2024-08-20

### Added
- Initial release of Markdown Web Editor
- Browser-based markdown editing with live preview
- File explorer with directory browsing
- Auto-save functionality (15 seconds)
- Create new files and directories
- Express.js backend with API endpoints
- React frontend with TypeScript
- VS Code-inspired dark theme
- CLI tool for npx execution
- Cross-platform compatibility

### Features
- Real-time markdown preview
- File and directory management
- Secure file access within working directory
- Clean, responsive interface
- GitHub Flavored Markdown support

[1.6.2]: https://github.com/vultuk/markdown-web/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/vultuk/markdown-web/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/vultuk/markdown-web/compare/v1.3.2...v1.6.0
[1.3.2]: https://github.com/vultuk/markdown-web/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/vultuk/markdown-web/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/vultuk/markdown-web/compare/v1.2.4...v1.3.0
[1.2.4]: https://github.com/vultuk/markdown-web/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/vultuk/markdown-web/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/vultuk/markdown-web/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/vultuk/markdown-web/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/vultuk/markdown-web/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/vultuk/markdown-web/compare/v1.0.9...v1.1.0
[1.0.9]: https://github.com/vultuk/markdown-web/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/vultuk/markdown-web/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/vultuk/markdown-web/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/vultuk/markdown-web/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/vultuk/markdown-web/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/vultuk/markdown-web/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/vultuk/markdown-web/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/vultuk/markdown-web/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/vultuk/markdown-web/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/vultuk/markdown-web/releases/tag/v1.0.0