# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.16.0] - 2025-08-21

### Added
- **AI-Powered Editing**: OpenAI integration for intelligent markdown transformation and editing assistance
- **AI Prompt Interface**: Inline AI prompt system with undo/redo functionality for editor transformations
- **OpenAI Configuration**: `--openai-key` CLI parameter for enabling AI features with API key
- **Model Selection**: Configurable OpenAI model selection with gpt-5-mini default
- **AI Status Detection**: Automatic detection and UI adaptation when AI features are available

### New Features
- **Smart AI Button**: Contextual AI button appears in editor when OpenAI key is configured
- **Prompt-Based Editing**: Natural language prompts to transform markdown content (e.g., "make this more formal", "add bullet points")
- **Content Transformation**: AI-powered content improvement, formatting, and style adjustments
- **Undo/Redo Support**: Full undo/redo functionality for AI-generated changes
- **Server-Side Settings**: Enhanced settings persistence with OpenAI model preferences

### Technical Improvements
- **New API Endpoints**: `/api/ai/status` for feature detection, `/api/ai/apply` for content transformation
- **Enhanced CLI**: Added `--openai-key` parameter with validation and error handling
- **Settings Architecture**: Server-side settings storage and synchronization with client preferences
- **AI Integration Layer**: Secure OpenAI API integration with configurable models
- **State Management**: Enhanced state management for AI features and settings persistence

### User Experience
- **Seamless Integration**: AI features appear automatically when API key is configured
- **Visual Feedback**: Clear loading states and success/error messaging for AI operations
- **Non-Disruptive**: AI features are additive and don't interfere with existing workflows
- **Accessible Interface**: Keyboard shortcuts and proper ARIA labels for AI controls

### Command Line Interface
- **New Flag**: `--openai-key <key>` to enable AI features with your OpenAI API key
- **Error Handling**: Clear error messages for missing or invalid OpenAI key configurations
- **Backward Compatibility**: All existing commands work unchanged without AI features

## [1.15.3] - 2025-08-21

### Fixed
- **Authentication Flow**: Fixed component order to ensure authentication is checked before theme initialization
- **App Initialization**: AuthGate now properly wraps ThemeProvider for correct startup sequence

### Technical Improvements
- **Provider Order**: Reordered React providers to ensure authentication state is available before theme context
- **Security**: Authentication checks now happen earlier in the component hierarchy
- **Initialization Flow**: Improved app startup reliability with correct provider nesting

## [1.15.2] - 2025-08-21

### Added
- **Configurable Request Size Limit**: Added `JSON_LIMIT` environment variable support with 50mb default
- **Request Limit Logging**: Server now displays current JSON limit setting on startup

### Technical Improvements
- **Environment Configuration**: JSON request body size can now be configured via `JSON_LIMIT` environment variable
- **Server Flexibility**: Both HTTP and HTTPS servers support configurable request limits
- **Enhanced Logging**: Added request limit information to server startup messages for better debugging

### Performance
- **Large File Support**: Configurable limits allow handling larger markdown files and assets
- **Memory Management**: Administrators can adjust request limits based on system resources
- **Production Ready**: Default 50mb limit provides generous capacity while preventing abuse

## [1.15.1] - 2025-08-21

### Fixed
- **File Path Encoding**: Added proper URL encoding for file paths in API requests to handle special characters and spaces
- **Preview Mode Persistence**: Preview mode now persists when navigating between files instead of always resetting to edit mode

### Improved
- **File Handling**: Better support for files with special characters, spaces, and unicode names in file paths
- **User Experience**: Preview mode preference maintained during file navigation and creation
- **API Reliability**: More robust file loading and saving with proper path encoding

### Technical Improvements
- **URL Encoding**: Added `encodeURIComponent()` to file paths in `saveFile` and `loadFileContent` functions
- **State Management**: Removed forced preview mode resets in file selection and creation workflows
- **Consistent Behavior**: File navigation now respects current preview mode setting

## [1.15.0] - 2025-08-21

### Added
- **Sidebar Overlay Mode**: New overlay sidebar option that floats over content without resizing layout
- **Sidebar Behavior Configuration**: Choose between "Overlay (recommended)" or "Inline (resizes content)" modes
- **Double-click Split Reset**: Double-click split-view resizer to quickly reset to 50/50 layout
- **External Link Behavior**: All markdown links now open in new tabs with proper security attributes

### New Features
- **Smart Sidebar Positioning**: Overlay mode provides floating sidebar with shadow and z-index positioning
- **Improved Desktop Experience**: Overlay mode prevents content jumping when sidebar opens/closes
- **Enhanced Split-View Controls**: Quick reset functionality for split-view proportions
- **Better Link Security**: External links open safely with `target="_blank"` and `rel="noopener noreferrer"`

### Technical Improvements
- **Sidebar Mode State**: New `SidebarMode` type and state management with localStorage persistence
- **Dynamic Sidebar Styling**: Conditional CSS classes for overlay vs inline sidebar behavior
- **Enhanced Settings Modal**: Added sidebar behavior configuration section with radio buttons
- **Mobile-First Behavior**: Mobile devices always use overlay mode regardless of desktop setting

### User Experience
- **Configurable Sidebar**: Users can choose sidebar behavior that fits their workflow
- **Non-disruptive Navigation**: Overlay mode keeps content stable while browsing files
- **Quick Layout Adjustment**: Double-click to instantly balance split-view panes
- **Safer Link Navigation**: External links won't interfere with editor session

## [1.14.0] - 2025-08-21

### Added
- **Centralized Theme Selection**: Theme selector moved to settings modal for consolidated configuration
- **Enhanced Settings Modal**: Added theme selection dropdown with all available themes in settings
- **Unified Settings Experience**: All user preferences now accessible in one location

### Improved
- **Cleaner Header Interface**: Removed theme selector from header to reduce UI clutter
- **Better Settings Organization**: Theme selection now grouped with other preferences in settings modal
- **Streamlined UI**: More focused header with essential controls only

### Technical Improvements
- **Settings Modal Integration**: Added `useTheme` hook integration in settings modal
- **Theme State Management**: Settings modal now handles theme loading states and selection
- **Component Consolidation**: Centralized theme-related UI in single settings interface

### User Experience
- **Consolidated Configuration**: All settings (preview layout, themes) accessible in one modal
- **Cleaner Interface**: Less cluttered header allows more focus on content
- **Logical Grouping**: Related settings organized together for better discoverability

## [1.13.0] - 2025-08-21

### Added
- **Settings Modal**: New settings interface with configurable preview layout options
- **Preview Layout Configuration**: Choose between "Full area" or "Resizable split" preview modes
- **Settings Button**: Added settings button to file explorer footer for easy access
- **Layout Persistence**: Preview layout preference is saved and restored across sessions

### New Features
- **Flexible Preview Display**: Configure how preview mode displays content (full area vs split view)
- **User Preferences**: Centralized settings modal for application configuration
- **Accessible Settings**: Settings modal with proper keyboard navigation and ARIA support
- **Visual Settings UI**: Clean, modal-based settings interface with radio button selections

### Technical Improvements
- **Settings Modal Component**: New `SettingsModal` component with TypeScript definitions
- **Preview Layout State**: New state management for `PreviewLayout` type (`'full' | 'split'`)
- **localStorage Integration**: Automatic persistence of preview layout preferences
- **Conditional Rendering**: Split-view now only renders when layout is set to 'split'

### User Experience
- **Customizable Workflow**: Users can choose their preferred preview layout
- **Persistent Preferences**: Settings are remembered between browser sessions
- **Easy Access**: Settings accessible via dedicated button in file explorer
- **Keyboard Support**: Settings modal supports Escape key to close

## [1.12.6] - 2025-08-21

### Fixed
- **Split-View Layout**: Fixed flex layout properties for split-view panes to prevent layout issues
- **Editor Pane Sizing**: Added explicit flex properties (`flex: '0 0 auto'`) to editor pane for consistent width behavior  
- **CSS Flex Consistency**: Updated CSS flex properties (`flex: 1 1 auto`) for preview pane to match layout expectations

### Technical Improvements
- **Layout Stability**: Enhanced split-view layout with proper flex box constraints
- **Responsive Behavior**: Better split pane sizing behavior across different screen sizes
- **CSS Architecture**: Improved flex layout consistency between inline styles and CSS modules

## [1.12.5] - 2025-08-21

### Improved
- **Mobile UX Enhancement**: Sidebar now automatically closes when opening files on mobile devices
- **Better Touch Experience**: Prevents UI overlap and improves navigation on smaller screens
- **Responsive Design**: Enhanced file navigation workflow optimized for mobile usage

### Technical Improvements
- **Smart Mobile Detection**: Automatic sidebar management based on device viewport
- **Optimized Touch Interaction**: Cleaner file opening flow that prioritizes content visibility on mobile
- **State Management**: Added mobile-specific UI state handling in file selection logic

## [1.12.4] - 2025-08-20

### Added
- **Preview Mode Persistence**: Preview mode preference is now remembered across browser sessions
- **localStorage Integration**: Preview mode setting is automatically saved and restored

### Improved
- **Better User Experience**: Users no longer need to re-enable preview mode after refreshing or reopening the app
- **Consistent State Management**: Preview mode state properly initialized from localStorage on app startup
- **Cleaner Navigation**: Removed unnecessary preview mode resets during file navigation

### Technical Improvements
- **State Persistence**: Added localStorage-based state management for preview mode preference
- **Safe Error Handling**: Graceful fallbacks for localStorage access failures
- **Optimized Initialization**: Preview mode state loaded efficiently during component initialization

## [1.12.3] - 2025-08-20

### Fixed
- **Authentication Cookie Handling**: Added `credentials: 'same-origin'` to all API fetch requests for consistent authentication
- **Server Route Organization**: Moved static file serving configuration inside server functions for better control flow
- **API Credential Consistency**: Ensured all endpoints (files, themes, settings, CRUD operations) properly send credentials

### Technical Improvements
- **Comprehensive API Coverage**: Updated all client-side fetch requests to include proper credential handling
- **File Operations**: Fixed authentication for create/delete file and directory operations
- **Theme System**: Enhanced credential handling for theme loading and saving operations
- **Settings Management**: Improved credential handling for settings API calls

### Authentication Enhancements
- **Consistent Cookie Support**: All API calls now properly send authentication cookies
- **Session Reliability**: Improved session handling across all application features
- **Better Server Organization**: Cleaner separation of concerns in server configuration

## [1.12.2] - 2025-08-20

### Fixed
- **Static File Serving**: Fixed route ordering in HTTP and HTTPS servers to properly serve static files after API routes
- **Authentication Cookies**: Added `credentials: 'same-origin'` to fetch requests for better cookie handling
- **Server Routing**: Corrected catch-all route placement to prevent conflicts with API endpoints

### Documentation
- **Enhanced README**: Added comprehensive authentication documentation and CLI options
- **Usage Instructions**: Improved setup guide with password authentication examples
- **Security Guidelines**: Added security best practices and HTTPS recommendations

### Technical Improvements
- Fixed static file serving order in both development and production servers
- Improved cookie handling for authentication requests
- Better route organization for API endpoints and static content

## [1.12.1] - 2025-08-20

### Fixed
- **Scrypt Memory Safety**: Added proper `maxmem` parameter calculation to prevent potential memory issues during password hashing
- **Enhanced Security**: Improved memory management in authentication system following Node.js best practices

### Technical Improvements
- Added safe memory limit calculation for scrypt operations (minimum 64MB or 2x requirement)
- Enhanced cryptographic function safety with proper memory bounds

## [1.12.0] - 2025-08-20

### Added
- **Password Authentication System**: Optional password protection for secure access to your markdown editor
- **Session Management**: Secure JWT-based session handling with HttpOnly cookies
- **Command Line Authentication Options**: New `--auth <password>` and `--disable-auth` flags for CLI control
- **Rate Limiting**: Built-in protection against brute force login attempts (20 attempts per 10 minutes per IP)
- **Security Features**: Scrypt password hashing, HMAC session signing, and CSRF protection

### New Features
- **Flexible Authentication**: Choose to enable or disable authentication based on your security needs
- **Auto-generated Passwords**: Strong, URL-safe passwords automatically generated when auth is enabled without a custom password
- **Secure by Default**: HTTPS-compatible authentication with secure cookie settings
- **Login Interface**: Clean, VS Code-themed login form for password entry
- **Session Persistence**: Configurable session lifetime (default 24 hours)

### Technical Improvements
- **Advanced Cryptography**: Uses Node.js crypto module with scrypt key derivation and timing-safe comparison
- **Memory-based Rate Limiting**: Simple, effective protection against login attempts without external dependencies
- **Auth Middleware**: Modular authentication system that can be easily enabled/disabled
- **Secure Headers**: Proper cookie security attributes including HttpOnly, SameSite, and Secure flags

### Command Line Interface
- **New Flags**: `--auth <password>` to set a custom password, `--disable-auth` to run without authentication
- **Backward Compatibility**: Existing commands work unchanged when authentication is disabled
- **Clear Status Messages**: Console output shows authentication status and password when applicable

### User Experience
- **Seamless Integration**: Authentication gate appears before the main application when enabled
- **Visual Feedback**: Loading states and error messages for authentication attempts
- **Terminal Integration**: Password is displayed in terminal output for easy reference
- **Quick Setup**: Authentication can be enabled with a simple command line flag

## [1.11.0] - 2024-08-20

### Added
- **Progressive Web App (PWA) Support**: Application can now be installed as a native-like web app
- **Service Worker Registration**: Enables offline functionality and improved caching
- **Mobile App Experience**: Enhanced mobile web app capabilities with proper meta tags
- **Apple Touch Icon Support**: Optimized icons for iOS home screen installation
- **Web App Manifest**: Structured manifest file for better app store integration

### Technical Improvements
- Added PWA meta tags for mobile web app capabilities
- Implemented service worker registration for offline support
- Enhanced mobile responsiveness with app-like interface
- Added theme color and status bar styling for mobile devices

## [1.10.0] - 2024-08-20

### Added
- **Resizable Split-View Panes**: Drag-to-resize functionality for editor and preview panes
- **Persistent Layout Preferences**: Split pane widths are saved and restored between sessions
- **Enhanced Mobile Adaptation**: Intelligent layout switching between desktop and mobile modes
- **Improved Split-View Controls**: Better visual feedback and interaction for resizing

### New Features
- **Draggable Pane Divider**: Click and drag to adjust the width between editor and preview
- **Minimum Width Constraints**: Ensures both panes maintain usable minimum widths
- **Layout Persistence**: Remembers your preferred split layout across browser sessions
- **Smart Initialization**: Automatically sets optimal split proportions on first use

### Technical Improvements
- **Split Resize State Management**: Dedicated state handling for split-view resizing operations
- **Ref-based Measurements**: Accurate container width calculations for responsive sizing
- **Enhanced Mouse Event Handling**: Smooth drag operations with proper event management
- **LocalStorage Integration**: Reliable persistence of split width preferences

### User Experience
- **Flexible Workspace**: Customize editor vs preview space allocation to your preference
- **Visual Feedback**: Clear resize cursor and visual indicators during drag operations
- **Responsive Behavior**: Different layout strategies for mobile vs desktop viewing
- **Smooth Interactions**: Fluid resizing with proper constraints and boundaries

### Mobile Experience
- **Adaptive Layout**: Mobile devices show full-width preview instead of split view
- **Touch-Optimized**: Better touch interaction handling for mobile users
- **Performance**: Optimized rendering for smaller screens and touch devices

## [1.9.0] - 2024-08-20

### Added
- **Split-View Preview Mode**: Side-by-side editing and preview experience
- **Enhanced Preview Functionality**: Improved preview mode with better layout management
- **Developer Documentation**: Comprehensive repository guidelines and development instructions
- **Architecture Improvements**: Better separation of concerns between components

### New Features
- **Split-Screen Interface**: Preview mode now shows editor and preview side-by-side
- **Improved Layout System**: Enhanced CSS grid system for better responsive design
- **Better Component Architecture**: Cleaner separation between Editor and Preview components
- **Repository Guidelines**: Complete development guidelines in AGENTS.md

### Technical Improvements
- **Component Refactoring**: Moved MarkdownPreview handling from Editor to App component
- **Layout Management**: New split-pane layout system for preview mode
- **CSS Architecture**: Enhanced responsive design with better mobile support
- **Code Organization**: Improved import structure and component responsibilities

### User Experience
- **Visual Editing**: See markdown source and rendered output simultaneously
- **Better Workflow**: Enhanced editing experience with immediate visual feedback
- **Responsive Design**: Split-view adapts to different screen sizes
- **Improved Navigation**: Better preview mode toggle and layout management

### Documentation
- **Development Guidelines**: Complete coding standards and project structure documentation
- **Build Instructions**: Comprehensive build, test, and development command reference
- **Security Guidelines**: Best practices for secure development and deployment
- **Contribution Guide**: Clear guidelines for commits, PRs, and testing

## [1.8.0] - 2024-08-20

### Added
- **Toast Notification System**: User-friendly notifications for operations and errors
- **Enhanced Error Handling**: Better error feedback with contextual messages
- **Operation Status Feedback**: Real-time feedback for file operations and failures

### New Features
- **Toast Component**: Accessible toast notifications with different types (info, success, error)
- **Smart Error Messages**: Contextual error messages for file operations, renaming, and navigation
- **Better User Feedback**: Improved user experience with clear operation status messages
- **Auto-dismiss Notifications**: Toast messages automatically dismiss after 4 seconds

### Technical Improvements
- **Toast State Management**: Centralized toast notification state in main App component
- **Error Recovery**: Better error handling with graceful fallbacks for failed operations
- **Accessibility**: Toast notifications include proper ARIA attributes and roles
- **Mobile Responsive**: Toast notifications adapt to mobile screen sizes

### User Experience
- **File Operation Feedback**: Clear messages when file operations succeed or fail
- **Navigation Errors**: Helpful messages when file navigation fails with automatic recovery
- **Rename Feedback**: Success and error messages for file/folder rename operations
- **Loading States**: Better feedback during file loading and content retrieval

## [1.7.0] - 2024-08-20

### Added
- **File and Folder Renaming**: Double-click any file or folder to rename it inline
- **HTTPS/SSL Support**: Complete SSL/TLS infrastructure with Let's Encrypt integration
- **Mobile Responsive Design**: Enhanced mobile interface with touch-friendly interactions
- **SSL Setup Scripts**: Automated SSL certificate generation and server management tools

### New Features
- **Inline Renaming**: Double-click files and folders in the explorer to rename them instantly
- **SSL Certificate Management**: Automated Let's Encrypt certificate generation and renewal
- **HTTPS Server**: Production-ready HTTPS server with automatic HTTP to HTTPS redirect
- **Mobile UI Improvements**: Better touch targets and responsive layout for mobile devices
- **SSL Status Monitoring**: Built-in SSL certificate status checking and monitoring tools

### Technical Improvements
- **New API Endpoint**: `/api/rename` for file and directory renaming operations
- **HTTPS Server Module**: Complete HTTPS server implementation with certificate handling
- **SSL Scripts**: Setup, startup, and status checking scripts for SSL/HTTPS deployment
- **Responsive Design**: Enhanced CSS with better mobile breakpoints and touch interactions
- **Security**: Comprehensive path validation and security checks for rename operations

### Infrastructure
- **SSL Setup**: `scripts/setup-ssl.sh` for automated certificate generation
- **HTTPS Startup**: `scripts/start-https.sh` for production HTTPS server deployment
- **Service Management**: Systemd service file for production server management
- **SSL Monitoring**: `scripts/ssl-status.sh` for certificate and server status checking
- **Documentation**: Complete SSL setup and deployment documentation

### Mobile Experience
- **Touch Interactions**: Optimized touch targets for mobile file management
- **Responsive Layout**: Better mobile sidebar and content area management
- **Mobile Navigation**: Enhanced mobile-friendly navigation and controls

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

[1.12.4]: https://github.com/vultuk/markdown-web/compare/v1.12.3...v1.12.4
[1.12.3]: https://github.com/vultuk/markdown-web/compare/v1.12.2...v1.12.3
[1.12.2]: https://github.com/vultuk/markdown-web/compare/v1.12.1...v1.12.2
[1.12.1]: https://github.com/vultuk/markdown-web/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/vultuk/markdown-web/compare/v1.11.0...v1.12.0
[1.11.0]: https://github.com/vultuk/markdown-web/compare/v1.10.0...v1.11.0
[1.10.0]: https://github.com/vultuk/markdown-web/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/vultuk/markdown-web/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/vultuk/markdown-web/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/vultuk/markdown-web/compare/v1.6.2...v1.7.0
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