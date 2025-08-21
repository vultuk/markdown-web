# Changelog

All notable changes to this project will be documented in this file.

## [2.7.0] - 2025-08-21

### Added
- **Visual Text Selection Highlighting**: New highlight overlay system that shows selected text when AI modal is open
- **Real-time Selection Feedback**: Visual indication of selected text during AI operations for better user awareness
- **Synchronized Scroll Overlay**: Highlight overlay scrolls in sync with textarea for consistent visual feedback
- **Enhanced AI Workflow**: Users can now see exactly which text is selected for AI processing

### New Features
- **Selection Overlay Component**: Dedicated overlay system that renders above textarea to highlight selected text
- **Dynamic Selection Rendering**: Real-time highlighting that updates as user changes text selection
- **AI-Context Visual Cues**: Highlight only appears when AI modal is open to provide contextual feedback
- **Responsive Highlight Design**: Highlight overlay adapts to mobile screen sizes and font scaling

### Technical Improvements
- **Overlay Architecture**: Added `textareaWrap` container with positioned highlight overlay system
- **Scroll Synchronization**: Implemented scroll sync between textarea and highlight overlay for consistent positioning
- **Performance Optimization**: Highlight overlay only renders when AI modal is active to minimize performance impact
- **CSS Layer Management**: Proper z-index and positioning for overlay system without interfering with text input

### User Experience
- **Better AI Interaction**: Users can clearly see which text will be processed by AI operations
- **Visual Selection Clarity**: Semi-transparent blue highlight (rgba(95, 157, 215, 0.35)) provides clear visual indication
- **Non-Intrusive Design**: Highlight overlay doesn't interfere with typing or text selection functionality
- **Context-Aware Display**: Highlight only shows when relevant (AI modal open and text selected)

### Accessibility
- **Screen Reader Friendly**: Highlight overlay marked with `aria-hidden` to prevent screen reader interference
- **Color Contrast**: Highlight color chosen for good visibility without overwhelming text readability
- **Pointer Events**: Overlay configured with `pointer-events: none` to maintain normal text interaction

## [2.6.3] - 2025-08-21

### Enhanced
- **Responsive Icon Sizing**: Optimized export button dropdown caret icon sizing for better visual hierarchy
- **Desktop Icon Optimization**: Reduced desktop caret icon size to 12px to better match text height
- **Mobile Icon Enhancement**: Maintained 16px caret icon size on mobile for optimal touch accessibility

### Technical Improvements
- **CSS Media Query Refinement**: Added precise desktop/mobile icon sizing rules for export button dropdown
- **Visual Hierarchy**: Improved text-to-icon proportion on desktop displays
- **Responsive Design**: Enhanced mobile-first approach with appropriate icon scaling

### User Experience
- **Better Visual Balance**: Desktop caret icons now proportionally match surrounding text elements
- **Consistent Mobile Experience**: Preserved larger mobile icons for better touch interaction
- **Improved Typography**: Enhanced visual harmony between text and iconography

## [2.6.2] - 2025-08-21

### Enhanced
- **SVG Icon Accessibility**: Added `focusable="false"` attribute to SVG icons for better screen reader compatibility
- **Improved Icon Visual Design**: Enhanced export button SVG with cleaner, more distinct paths
- **Refined Mobile Layout**: Added consistent button height (`min-height: 28px`) for better mobile touch targets
- **Optimized Icon Display**: Strengthened mobile icon visibility with improved CSS rules

### Technical Improvements
- **Accessibility Standards**: Enhanced SVG accessibility by preventing unwanted focus on decorative icons
- **Icon Path Optimization**: Split export icon SVG into separate paths for better visual clarity
- **Mobile CSS Enhancement**: Added `!important` rule for reliable mobile icon display
- **Icon Consistency**: Standardized dropdown toggle icon size to 16px for visual uniformity

### User Experience
- **Better Touch Interaction**: Consistent button sizing provides more reliable mobile touch experience
- **Enhanced Visual Clarity**: Improved export icon design with cleaner visual separation
- **Accessibility Improvements**: Screen readers now handle SVG icons more appropriately
- **Cross-Platform Consistency**: More reliable icon display across different devices and screen sizes

### Bug Fixes
- **Mobile Icon Display**: Fixed edge cases where icons might not display properly on some mobile devices
- **Export Button Visual**: Improved export icon visual clarity and distinction
- **Button Layout**: Enhanced mobile button layout consistency with proper height constraints

## [2.6.1] - 2025-08-21

### Improved
- **SVG Icon System**: Replaced emoji icons with professional SVG icons for better cross-platform consistency
- **Enhanced Visual Design**: Improved icon rendering with proper SVG implementations for all UI buttons
- **Better Mobile Experience**: Enhanced icon display behavior on mobile devices with improved responsive design
- **Icon Consistency**: Standardized icon styling and display properties across all interface elements

### Technical Improvements
- **Icon System Overhaul**: Migrated from unicode emojis (⤓, ▼, ✏️, 👁️, ✅, ↩️, ✨) to scalable SVG icons
- **Responsive Icon Display**: Enhanced CSS media queries for optimal icon visibility on different screen sizes
- **Cross-Platform Compatibility**: SVG icons ensure consistent appearance across all operating systems and browsers
- **Performance Optimization**: Optimized icon rendering with proper line-height and display properties

### Visual Enhancements
- **Export Button Icons**: Professional download and dropdown arrow SVG icons
- **Header Button Icons**: Clean edit, preview, accept, revert, and AI assistant SVG icons
- **Mobile-First Design**: Icons show properly on mobile with responsive visibility controls
- **Theme Integration**: SVG icons adapt to current theme colors using `currentColor` property

### User Experience
- **Professional Appearance**: Consistent, crisp icon rendering across all devices and platforms
- **Better Accessibility**: SVG icons with proper ARIA attributes and screen reader compatibility
- **Visual Clarity**: Enhanced icon recognition and interface usability
- **Cross-Browser Support**: Reliable icon display across all modern web browsers

## [2.6.0] - 2025-08-21

### Added
- **Drag and Drop File Management**: Full drag-and-drop support for moving files and folders within the file explorer
- **Enhanced Mobile UX**: Responsive button layouts with icons-only display on mobile devices
- **Accessibility Improvements**: Comprehensive ARIA labels, screen reader support, and semantic HTML
- **Visual Button Enhancement**: Added icons to all header and export buttons for better visual identification

### New Features
- **File/Folder Drag & Drop**: Click and drag files or folders to move them between directories
- **Auto-expand on Hover**: Folders automatically expand when dragging items over them
- **Smart Drop Prevention**: Prevents dropping folders into themselves or their descendants
- **Mobile-First Button Design**: Buttons adapt to screen size - show icons on mobile, full labels on desktop
- **Visual Drag Feedback**: Dragged items become semi-transparent with visual drop target indicators

### User Experience Improvements
- **Intuitive File Management**: Move files and folders with simple drag-and-drop gestures
- **Better Mobile Navigation**: Compact button layout optimized for touch interfaces
- **Enhanced Accessibility**: All buttons have proper ARIA labels and screen reader support
- **Visual Clarity**: Icons provide immediate visual recognition of button functions
- **Responsive Design**: Interface adapts seamlessly between desktop and mobile layouts

### Technical Enhancements
- **Drag & Drop API**: Full HTML5 drag-and-drop implementation with cross-browser compatibility
- **State Management**: Sophisticated drag state tracking with visual feedback systems
- **CSS Media Queries**: Advanced responsive design with mobile/desktop-specific styling
- **Accessibility Standards**: WCAG-compliant ARIA attributes and semantic markup
- **Error Prevention**: Smart logic prevents invalid drag-and-drop operations

### Mobile Optimizations
- **Touch-Friendly Design**: Optimized touch targets and button sizing for mobile devices
- **Icon-Only Buttons**: Space-efficient button layout showing only essential icons on small screens
- **Responsive Export**: Export button adapts to mobile layout with icon-first design
- **Better Touch Feedback**: Enhanced visual feedback for touch interactions

### Accessibility Features
- **Screen Reader Support**: All interactive elements properly labeled for assistive technologies
- **Keyboard Navigation**: Full keyboard accessibility for drag-and-drop alternative workflows
- **ARIA Live Regions**: Dynamic content changes announced to screen readers
- **Semantic HTML**: Proper HTML structure and landmark elements for better navigation

## [2.5.0] - 2025-08-21

### Added
- **Selection-Based AI Editing**: Apply AI prompts to selected text portions instead of entire content
- **Smart Text Selection Tracking**: Real-time tracking of text selection state with visual feedback
- **Selection Indicator**: Visual indicator showing when text is selected for AI operations
- **Enhanced AI Workflow**: AI operations work seamlessly on both full content and selected segments

### New Features
- **Precise AI Control**: Select specific paragraphs, sentences, or code blocks for targeted AI editing
- **Selection Merge Logic**: Intelligent merging of AI-edited selections back into original content
- **Visual Selection Feedback**: "Using selection (X chars)" indicator in AI modal when text is selected
- **Flexible AI Operations**: Both Adjust and Ask modes support selection-based operations
- **Real-time Selection Updates**: Selection state updates as users navigate and select text

### Enhanced AI Capabilities  
- **Context-Aware Prompting**: AI operations use selected text as context when available
- **Selective Content Modification**: Make targeted changes without affecting entire document
- **Improved Precision**: Edit specific sections while preserving surrounding content structure
- **Better Workflow Integration**: Selection-based editing fits naturally into existing AI workflow

### User Experience Improvements
- **Intuitive Text Selection**: Standard text selection behavior with enhanced AI integration
- **Clear Visual Feedback**: Users know exactly what content will be processed by AI
- **Non-Disruptive Selection**: Text selection doesn't interfere with normal editing workflow
- **Seamless Editing**: Selected text editing feels natural and responsive

### Technical Enhancements
- **Selection State Management**: Robust tracking of selection start/end positions with refs
- **Content Merging Algorithm**: Smart merging of edited selections with original content
- **Selection Persistence**: Selection state maintained during AI operations
- **Error-Safe Selection**: Graceful handling of selection edge cases and browser differences

### Accessibility
- **ARIA Live Regions**: Selection feedback announced to screen readers
- **Keyboard Selection**: Full keyboard selection support with visual feedback
- **Clear Status Updates**: Real-time selection status communicated to all users

## [2.4.0] - 2025-08-21

### Added
- **AI Modal Close Button**: Added dedicated close button (×) to AI modal header for better accessibility
- **Responsive Status Bar**: Mobile-optimized status bar with adaptive stat display
- **Smart Sidebar Initialization**: Enhanced sidebar state initialization with context awareness
- **Mobile-First Status Display**: Optimized status information layout for different screen sizes

### New Features
- **Enhanced AI Modal**: Close button in header eliminates need for separate close action
- **Adaptive Stats Display**: Status bar shows relevant information based on screen size
- **Intelligent Sidebar Behavior**: Smart sidebar opening based on file loading and device context
- **Mobile Status Optimization**: Compact status display with essential information on mobile

### User Experience Improvements
- **Better AI Modal UX**: More intuitive close functionality with header-placed × button
- **Cleaner AI Interface**: Streamlined AI modal with dedicated close button instead of action button
- **Mobile-Friendly Stats**: Optimized information density for small screens
- **Context-Aware Sidebar**: Sidebar behavior adapts to user context and device capabilities

### Technical Improvements
- **Enhanced Modal Design**: Improved AI modal header layout with flex justify-between
- **Responsive CSS**: Added mobile/desktop-specific classes for conditional stat display
- **Smart State Management**: Context-aware sidebar initialization based on URL, device, and settings
- **Better Mobile Layout**: Optimized spacing and information hierarchy for mobile devices

### Responsive Design
- **Mobile Status Bar**: Compact layout with essential stats (AI cost, words)
- **Desktop Status Bar**: Full information display (lines, words, characters, AI cost)
- **Adaptive Behavior**: UI elements adapt automatically to screen size
- **Better Information Hierarchy**: Most important stats prioritized on smaller screens

### Accessibility Enhancements
- **Dedicated Close Button**: Clear, accessible close action in AI modal header
- **Better ARIA Support**: Enhanced accessibility attributes for modal interactions
- **Improved Navigation**: More intuitive modal interaction patterns
- **Touch-Friendly Design**: Better touch targets and mobile interaction patterns

## [2.3.0] - 2025-08-21

### Added
- **AI Ask Mode**: New Q&A functionality to ask questions about markdown content without modification
- **Dual-Mode AI Interface**: Enhanced AI modal with toggle between "Adjust" and "Ask" modes
- **AI Q&A API**: New `/api/ai/ask` endpoint for question-answering functionality
- **Answer Display**: Interactive answer display with markdown rendering, copy, and clear actions

### New Features
- **Mode Toggle**: Switch between content modification (Adjust) and information retrieval (Ask) in AI modal
- **Question Interface**: Dedicated interface for asking questions about current markdown content  
- **Answer Rendering**: Formatted answer display with full markdown support using ReactMarkdown
- **Answer Actions**: Copy answer to clipboard and clear answer functionality
- **Smart Placeholders**: Context-aware placeholder text based on selected mode

### Enhanced AI Capabilities
- **Improved Prompts**: Cleaner prompt formatting without BEGIN/END markers for better AI responses
- **Response Sanitization**: Enhanced cleanup of AI responses to remove accidental code wrappers
- **Better Error Handling**: More robust error handling for both adjust and ask operations
- **Usage Tracking**: Token usage tracking for both content modification and Q&A operations

### User Experience
- **Intuitive Mode Switching**: Clear visual distinction between Adjust and Ask modes
- **Contextual Interface**: UI adapts based on selected mode with appropriate prompts and actions
- **Enhanced Workflow**: Ask questions about content before or after making adjustments
- **Improved Accessibility**: Proper ARIA attributes and role definitions for new interface elements

### Technical Improvements
- **New API Endpoint**: `/api/ai/ask` for question-answering without content modification
- **Enhanced CSS**: New styling for mode toggles, answer display, and action buttons
- **Component State**: Better state management for dual-mode AI functionality
- **Modal Enhancement**: Improved modal layout and interaction patterns

### Developer Experience
- **API Consistency**: Both AI endpoints follow similar patterns and error handling
- **Response Format**: Standardized response structures for both modify and ask operations
- **Better Documentation**: Enhanced API interface with clearer parameter handling

## [2.2.0] - 2025-08-21

### Enhanced Features
- **Always-On Mermaid**: Mermaid diagram rendering is now permanently enabled for all users
- **Improved Mermaid Loading**: Enhanced loading strategy with local assets first, CDN fallback for better reliability
- **Simplified Settings**: Removed Mermaid configuration toggle for a cleaner, more streamlined settings interface

### New Features
- **Smart Asset Loading**: Mermaid component now tries local bundled assets before falling back to CDN
- **Better Performance**: Local asset loading reduces network dependency and improves rendering speed
- **Zero Configuration**: Mermaid diagrams work out-of-the-box without user configuration

### User Experience
- **Consistent Mermaid**: All users now have access to Mermaid diagrams without needing to enable a setting
- **Cleaner Settings Modal**: Removed experimental Mermaid toggle for simpler configuration
- **Improved Reliability**: Enhanced loading strategy prevents Mermaid loading failures

### Technical Improvements
- **Dual Loading Strategy**: Local UMD assets with CDN fallback for maximum compatibility
- **Settings Cleanup**: Removed mermaidEnabled from server settings interface and validation
- **Code Simplification**: Eliminated conditional Mermaid rendering logic throughout the application
- **Better Error Handling**: Enhanced error handling for both local and CDN loading scenarios

### Breaking Changes
- **Mermaid Always Enabled**: Users can no longer disable Mermaid diagram rendering (now permanently enabled)
- **Settings Interface**: Removed Mermaid toggle from settings modal (affects saved preferences)

### Migration Notes
- Existing users with Mermaid disabled will now have it automatically enabled
- Settings files will no longer store mermaidEnabled preferences
- No action required - all Mermaid diagrams will render automatically

## [2.1.2] - 2025-08-21

### Fixed
- **Scroll Sync Cleanup**: Removed remaining scroll sync props and references from SettingsModal component
- **Interface Cleanup**: Cleaned up TypeScript interfaces to remove unused scroll sync parameters
- **Component Props**: Fixed SettingsModal props to match actual implementation after scroll sync removal

### Technical Improvements
- **Type Safety**: Removed orphaned scroll sync TypeScript interface definitions
- **Code Consistency**: Ensured all components align with the scroll sync removal from v2.1.1
- **Parameter Cleanup**: Eliminated unused props that were causing potential type errors

### Code Quality
- **Dead Code Removal**: Removed all remaining references to scroll sync functionality
- **Interface Alignment**: Fixed component interfaces to match actual usage patterns
- **Maintainability**: Improved code maintainability by removing inconsistent references

## [2.1.1] - 2025-08-21

### Removed
- **Scroll Sync Feature**: Completely removed scroll synchronization between editor and preview panes
- **Settings Toggle**: Removed scroll sync toggle from settings modal
- **Complex State Management**: Eliminated scroll sync state management and event handlers

### Simplified
- **Editor Component**: Removed scroll sync related props and event handlers
- **App Component**: Eliminated scroll sync refs, state, and synchronization logic
- **Settings Modal**: Streamlined interface by removing scroll sync configuration

### Technical Improvements
- **Code Cleanup**: Removed over 50 lines of complex scroll synchronization code
- **Performance**: Eliminated scroll event listeners and requestAnimationFrame usage
- **Maintainability**: Simplified codebase by removing feature that was causing complexity
- **State Management**: Reduced application state complexity

### User Experience
- **Simplified Interface**: Cleaner settings modal without experimental features
- **Focused Experience**: Users can focus on core editing functionality
- **Reduced Complexity**: Eliminated potential scroll sync conflicts and edge cases
- **Better Performance**: Removed performance overhead from scroll event handling

### Rationale
- **Complexity vs Value**: Scroll sync added significant complexity for limited user benefit
- **Edge Cases**: Feature had potential for conflicts and unexpected behavior
- **Performance Impact**: Continuous scroll event handling impacted editor responsiveness
- **User Feedback**: Feature was not widely used and caused confusion

## [2.1.0] - 2025-08-21

### Added
- **Configurable Mermaid Diagrams**: New toggle in settings to enable/disable Mermaid diagram rendering
- **Mermaid Settings Persistence**: Mermaid preference saved to server settings and localStorage
- **Granular Control**: Users can now choose whether to render Mermaid diagrams or show them as code blocks

### New Features
- **Settings Toggle**: Added "Render Mermaid code blocks (experimental)" checkbox in settings modal
- **Fallback Behavior**: When disabled, Mermaid code blocks display as regular code blocks
- **User Choice**: Allow users to disable potentially resource-intensive diagram rendering if desired
- **Seamless Integration**: Mermaid setting integrates with existing settings persistence system

### Technical Improvements
- **Server API**: Extended settings API to support `mermaidEnabled` boolean parameter
- **Default Values**: Mermaid rendering defaults to `false` for better performance out-of-the-box
- **Type Safety**: Added proper TypeScript interfaces for mermaidEnabled setting
- **Validation**: Server-side validation for mermaidEnabled setting parameter

### User Experience
- **Performance Control**: Users can disable Mermaid rendering for better performance with large documents
- **Flexibility**: Choose between diagram rendering or raw code display based on preference
- **Settings Organization**: Mermaid toggle logically grouped in settings modal
- **Immediate Effect**: Setting changes take effect immediately without page refresh

### Settings Management
- **Persistent Preference**: Mermaid setting saved across browser sessions
- **Server Sync**: Setting synchronized between client and server storage
- **Default Behavior**: Conservative default (disabled) for better initial performance
- **Error Handling**: Graceful fallbacks for settings loading failures

## [2.0.3] - 2025-08-21

### Improved
- **Scroll Sync Performance**: Enhanced scroll synchronization with requestAnimationFrame for smoother performance
- **State Management**: Added better state management for scroll ratios to prevent UI glitches
- **Animation Optimization**: Implemented proper animation frame handling to reduce scroll event processing overhead

### Technical Improvements
- **RAF Implementation**: Used requestAnimationFrame to throttle scroll synchronization updates
- **State Persistence**: Added refs for tracking scroll ratios and animation frames
- **Performance**: Reduced potential for rapid scroll updates causing UI lag
- **Memory Management**: Proper cleanup of animation frame requests

### Performance Enhancements
- **Smoother Scrolling**: Better coordination between editor and preview scroll events
- **Reduced Overhead**: Optimized scroll event handling with frame-based updates
- **UI Responsiveness**: Improved overall UI responsiveness during scroll synchronization

## [2.0.2] - 2025-08-21

### Fixed
- **Scroll Sync Stability**: Removed unused preview scroll handlers that could cause potential errors
- **Error Handling**: Added try-catch protection for scroll synchronization to prevent crashes
- **Code Cleanup**: Simplified scroll event handling by removing redundant preview-to-editor sync

### Technical Improvements
- **Event Handler Optimization**: Streamlined scroll synchronization to use unidirectional flow (editor-to-preview only)
- **Error Prevention**: Added defensive programming patterns to handle edge cases in scroll calculations
- **Performance**: Reduced unnecessary event listeners and potential memory leaks

## [2.0.1] - 2025-08-21

### Fixed
- **Mermaid CDN Loading**: Switched from local bundled Mermaid to CDN-based loading for better reliability
- **Build Compatibility**: Eliminated potential bundling issues by using external CDN instead of local imports
- **Script Loading**: Changed from `async` to `defer` for more predictable script loading behavior
- **Error Handling**: Enhanced error messages for CDN loading failures with clearer feedback

### Technical Improvements
- **CDN Integration**: Uses `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js` for consistent availability
- **Async Pattern**: Improved Promise-based loading pattern with proper async/await handling
- **Deployment Reliability**: Reduces build-time dependencies and potential bundling conflicts
- **Loading Performance**: Better script loading strategy with deferred execution

### Reliability Enhancements
- **External Dependencies**: Eliminates local bundling issues that could affect Mermaid diagram rendering
- **Network Resilience**: Provides fallback messaging when CDN is unavailable
- **Build Independence**: Removes dependency on local Mermaid files during build process
- **Consistent Behavior**: More predictable diagram rendering across different deployment scenarios

## [2.0.0] - 2025-08-21

Breaking changes
- Default authentication: Password auth is now enabled by default for the server and all `/api` endpoints. Existing unauthenticated workflows must pass a password. Use `--disable-auth` to opt out, or `--auth <password>` to set a custom password.
- API protection: `/api` is protected via session cookie; clients must include credentials.
- UI adjustments: Theme selector moved from header to Settings modal; preview default is “Full area” (can be changed).

Features
- CLI auth options: `--auth <password>`, `--disable-auth`, and generated random password by default.
- Auth endpoints: `/auth/status`, `/auth/login`, `/auth/logout` with signed HttpOnly session cookie.
- Settings modal: New UI with options for preview layout (Full area / Resizable split), sidebar behavior (Overlay / Inline), theme selection, OpenAI model, and scroll sync toggle.
- Persistent settings: Settings saved to `~/.markdown-web/settings.json`; client persists updates and shows a save toast.
- AI integration: Optional `--openai-key` enables an AI flow with prompt modal, per-request model override, Accept/Reject review, autosave pause during review, and theme-friendly UI polish.
- AI usage logging: Logs to `~/.markdown-web/logs/<encoded-filepath>/ai.json` with prompt, tokens, model, and estimated cost; Status bar shows per-file total cost.
- Syntax highlighting: Theme-aware code highlighting in preview and print/export (auto dark/light based on theme background).
- Mermaid support: Render ` ```mermaid` fenced blocks in preview with theme-aware Mermaid diagrams.
- Scroll sync: Optional editor/preview scroll synchronization in desktop split mode, toggleable in Settings.
- Desktop sidebar overlay: Sidebar can behave as an overlay on desktop (default) or inline resizable.
- Mobile UX: Uses `100dvh` for correct viewport sizing; keeps key UI elements visible.

Fixes & hardening
- Scrypt memory: Set explicit `maxmem` for Node’s scrypt to avoid memory errors on modern Node.
- Auth route ordering: Ensure auth + API routes are mounted before static/catch-all to avoid 401/HTML mismatches.
- Cookie handling: Client uses `credentials: 'same-origin'` for all API/auth endpoints.
- Large payloads: Increased JSON body limit (default 50MB) and configurable via `JSON_LIMIT`.
- Mermaid loader: Switched to a safer dynamic UMD loader path to avoid ESM init errors in production bundles.

Developer notes
- Server: Uses OpenAI official SDK (Responses API) and returns `output_text` for markdown-only responses.
- Dev proxy: Vite dev proxies `/auth` alongside `/api`.


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.20.2] - 2025-08-21

### Fixed
- **Enhanced Mermaid Loading**: Improved dynamic import with module caching to prevent double-initialization issues
- **ESM Import Path**: Uses explicit `'mermaid/dist/mermaid.esm.min.mjs'` entry point to avoid bundler optimizer glitches
- **Module Caching**: Added module reference caching across renders for better performance and reliability
- **Initialization Safety**: Added error handling around Mermaid initialization to handle edge cases gracefully

### Technical Improvements
- **Performance**: Better module loading performance with `mermaidLoaderRef` caching system
- **Bundler Compatibility**: More robust handling of different bundling scenarios and optimization settings
- **Error Prevention**: Safer initialization prevents "Cannot access before initialization" errors in some environments
- **Memory Efficiency**: Prevents duplicate module loading and initialization across component re-renders

### Reliability Enhancements
- **Edge Case Handling**: Better handling of bundler edge cases that could cause Mermaid loading failures
- **Consistent Rendering**: More reliable diagram rendering across different deployment environments
- **Initialization Robustness**: Try-catch protection around initialization calls for better error recovery

## [1.20.1] - 2025-08-21

### Fixed
- **Mermaid Import Fix**: Fixed potential module loading issues with dynamic import for better compatibility
- **Import Pattern**: Changed from static to dynamic import in Mermaid component to prevent bundling issues
- **Module Loading**: Enhanced Mermaid library loading with proper fallback handling

### Technical Improvements
- **Dynamic Imports**: Used `await import('mermaid')` pattern for more reliable module loading
- **Compatibility**: Better handling of different module formats and bundling scenarios
- **Error Prevention**: Reduced potential import-related errors in various environments

## [1.20.0] - 2025-08-21

### Added
- **Scroll Synchronization**: Advanced scroll sync between editor and preview panes in split-view mode
- **AI Model Selection**: Enhanced AI interface with model selection dropdown (gpt-5, gpt-5-mini, gpt-5-nano)
- **Configurable Scroll Sync**: New setting to enable/disable scroll synchronization between editor and preview
- **Enhanced AI Controls**: Model selection and improved AI workflow with better state management

### New Features
- **Bidirectional Scroll Sync**: Editor and preview scroll positions stay synchronized in split-view mode
- **Persistent Scroll Settings**: Scroll sync preference is saved and restored across sessions
- **AI Model Choice**: Users can select their preferred OpenAI model for AI-powered editing
- **Smart Scroll Detection**: Automatic detection of programmatic vs user-initiated scrolling
- **Enhanced AI Modal**: Improved AI modal with model selection and better visual design

### Technical Improvements
- **Advanced Scroll Logic**: Sophisticated scroll ratio calculation and synchronization system
- **Model Persistence**: AI model selection persisted in localStorage and server settings
- **State Management**: Enhanced state management for scroll sync and AI model preferences
- **Scroll Event Handling**: Optimized scroll event handling with programmatic scroll detection
- **Settings Integration**: Full integration of scroll sync settings with existing settings system

### User Experience
- **Synchronized Editing**: Keep track of content position while switching between editor and preview
- **Flexible AI Models**: Choose the right AI model for different tasks and performance needs
- **Smooth Scrolling**: Seamless scroll synchronization without jarring jumps or conflicts
- **Persistent Preferences**: All scroll and AI settings remembered between sessions
- **Enhanced Workflow**: Better editing experience with coordinated editor and preview navigation

### Settings Enhancements
- **Scroll Sync Toggle**: New checkbox in settings modal to control scroll synchronization
- **AI Model Setting**: Persistent AI model selection with dropdown interface
- **Desktop-Specific**: Scroll sync only available in desktop split-view mode for optimal experience
- **Settings Persistence**: All new settings automatically saved to server and localStorage

### Performance Improvements
- **Optimized Scroll Events**: Efficient scroll event handling with minimal performance impact
- **Smart Updates**: Programmatic scroll detection prevents infinite scroll loops
- **Responsive Design**: Scroll sync gracefully disabled on mobile devices
- **Memory Efficient**: Proper cleanup of scroll event listeners and refs

## [1.19.0] - 2025-08-21

### Added
- **Mermaid Diagram Support**: Native support for Mermaid diagrams in markdown code blocks
- **Interactive Diagrams**: Render flowcharts, sequence diagrams, class diagrams, and more using Mermaid syntax
- **Theme-Aware Diagrams**: Mermaid diagrams automatically adapt to current theme (light/dark modes)
- **Comprehensive Diagram Types**: Support for all major Mermaid diagram types including flowcharts, sequence, class, state, and more

### New Features
- **Mermaid Component**: Dedicated React component for rendering Mermaid diagrams with error handling
- **Automatic Theme Detection**: Diagrams use appropriate light/dark theme based on current editor theme
- **Language Detection**: Automatic recognition of `mermaid` code blocks for diagram rendering
- **Error Handling**: Graceful fallback when diagram syntax is invalid with clear error messages

### Technical Improvements
- **Mermaid Integration**: Added `mermaid@^10.9.1` dependency for diagram rendering capabilities
- **Security Features**: Strict security level configuration for safe diagram rendering
- **Theme Synchronization**: Background luminance detection for optimal diagram theme selection
- **Component Architecture**: Clean separation of diagram rendering logic in dedicated Mermaid component

### User Experience
- **Visual Documentation**: Create flowcharts, diagrams, and visual documentation directly in markdown
- **Professional Diagrams**: High-quality SVG diagram output with crisp rendering at any scale
- **Consistent Theming**: Diagrams match the overall application theme automatically
- **Enhanced Documentation**: Better support for technical documentation with visual elements

### Developer Experience
- **Standard Mermaid Syntax**: Use familiar Mermaid syntax in fenced code blocks with `mermaid` language
- **Real-Time Rendering**: Diagrams render immediately as you type in the editor
- **Error Feedback**: Clear error messages when diagram syntax is invalid
- **Theme Integration**: Seamless integration with existing theme system

## [1.18.1] - 2025-08-21

### Fixed
- **Enhanced Syntax Highlighting**: Added `ignoreMissing: true` and `detect: true` options to rehype-highlight plugin
- **Improved Language Detection**: Automatic language detection for code blocks without explicit language specification
- **Error Prevention**: Prevents errors when encountering unsupported or unknown programming languages in code blocks

### Technical Improvements
- **Robust Code Highlighting**: More resilient syntax highlighting that gracefully handles edge cases
- **Better Language Support**: Enhanced support for detecting and highlighting various programming languages
- **Error Handling**: Improved error handling for syntax highlighting edge cases

### User Experience
- **Reliable Code Display**: Code blocks now render consistently without breaking on unknown languages
- **Automatic Detection**: Better automatic language detection for unlabeled code blocks
- **Smoother Experience**: Eliminates potential rendering errors in technical documentation

## [1.18.0] - 2025-08-21

### Added
- **Syntax Highlighting**: Added comprehensive syntax highlighting for code blocks using highlight.js
- **Theme-Aware Highlighting**: Code highlighting adapts to current theme (light/dark backgrounds)
- **Enhanced AI Controls**: Moved AI button and accept/revert controls to header for better accessibility
- **Improved Code Display**: Better visual distinction for code blocks in both preview and print modes

### New Features
- **Dynamic Syntax Themes**: Automatic selection between GitHub dark/light highlighting themes based on background
- **Integrated Code Support**: Full syntax highlighting for popular programming languages
- **Enhanced Header Layout**: Consolidated AI controls in header with accept/revert buttons when changes are pending
- **Better UX Flow**: Streamlined AI interaction workflow with clearer visual feedback

### Technical Improvements
- **highlight.js Integration**: Added `highlight.js@^11.9.0` and `rehype-highlight@^6.0.0` dependencies
- **Theme-Smart Highlighting**: Automatic highlight theme selection based on background luminance
- **Component Reorganization**: Moved AI controls from Editor to Header component for better organization
- **Enhanced Preview**: ReactMarkdown now includes rehype-highlight plugin for code rendering
- **CSS Architecture**: Improved styling for code blocks with theme-aware highlight injection

### User Experience
- **Cleaner Interface**: AI controls now integrated in header alongside other primary actions
- **Better Code Readability**: Syntax highlighting makes code blocks more readable and professional
- **Consistent Theming**: Code highlighting matches overall application theme automatically
- **Improved Workflow**: Accept/revert AI changes directly from header without scrolling

### Developer Experience
- **Modern Code Display**: Professional syntax highlighting for technical documentation
- **Multi-Language Support**: Comprehensive language detection and highlighting
- **Print-Friendly**: Syntax highlighting preserved in print output with appropriate theme selection

## [1.17.0] - 2025-08-21

### Added
- **AI Cost Tracking**: Comprehensive tracking of OpenAI API usage costs and token consumption
- **Usage Analytics**: Detailed logging of AI operations with token usage, costs, and timestamps
- **Cost Display**: Real-time cost information shown in editor and status bar for transparency
- **Accept/Revert Controls**: New UI controls to accept or revert AI-generated changes before auto-saving
- **Per-File Cost History**: Individual cost tracking for each file with persistent logging

### New Features
- **Cost Estimation**: Automatic cost calculation based on token usage and model pricing
- **Usage Badges**: Visual indicators showing cost and token usage for each AI operation
- **Cost API Endpoint**: New `/api/ai/cost` endpoint to retrieve cumulative costs per file
- **Smart Auto-Save**: Auto-save pauses during AI operations to prevent conflicts
- **Cost Persistence**: AI usage logs stored in `~/.markdown-web/logs/` with per-file organization

### Technical Improvements
- **Enhanced AI API**: Extended AI endpoint with cost tracking, usage logging, and path-based organization
- **Configurable Pricing**: Support for custom pricing via `OPENAI_PRICING` environment variable
- **Usage Logging**: Comprehensive logging system with timestamps, model info, and usage metrics
- **State Management**: Enhanced state management for AI pending operations and cost tracking
- **File-Based Logging**: Per-file logging system with safe encoding and error handling

### User Experience
- **Cost Transparency**: Users can see exactly how much each AI operation costs
- **Better Control**: Accept/revert buttons provide more control over AI changes
- **Usage Insights**: Status bar shows cumulative AI costs for each file
- **Visual Feedback**: Clear indicators for AI costs and token usage
- **Non-Disruptive**: Auto-save intelligently pauses during AI operations

### API Enhancements
- **Extended AI Apply**: `/api/ai/apply` now returns usage statistics and cost information
- **Cost Retrieval**: New `/api/ai/cost` endpoint for retrieving per-file cost summaries
- **Usage Metadata**: Comprehensive usage tracking with input/output token counts
- **Pricing Flexibility**: Configurable pricing models with environment variable support

## [1.16.2] - 2025-08-21

### Improved
- **AI Button Design**: Updated AI button icon from 🤖 to ✨ with gradient background for better visual appeal
- **Enhanced AI Modal**: Added proper modal header with "✨ AI Assistant" title for clearer context
- **Better Visual Hierarchy**: Improved modal layout with dedicated header and body sections

### UI/UX Enhancements
- **Gradient Styling**: AI button now features attractive purple-to-blue gradient background
- **Modal Polish**: Enhanced modal appearance with better spacing, shadows, and visual structure
- **Improved Typography**: Better text styling and organization in AI interface components
- **Professional Appearance**: More polished and cohesive visual design for AI features

### Technical Improvements
- **CSS Architecture**: Better organization of AI-related styles with improved maintainability
- **Visual Consistency**: Unified design language across AI interface components
- **Enhanced Accessibility**: Improved modal structure with proper semantic elements

## [1.16.1] - 2025-08-21

### Improved
- **OpenAI Integration**: Updated to use official OpenAI JavaScript SDK for better reliability and performance
- **Enhanced Error Handling**: Improved AI error messages with detailed feedback for troubleshooting
- **API Reliability**: More robust OpenAI API integration with better error recovery

### Technical Improvements
- **OpenAI SDK**: Added `openai@^4.57.0` dependency for official SDK integration
- **Error Details**: Enhanced error reporting with specific OpenAI error messages and details
- **Code Quality**: Refactored AI API calls to use official SDK patterns and best practices

### Bug Fixes
- **AI Error Messages**: Fixed generic "AI request failed" messages to show specific error details
- **API Response Parsing**: Improved handling of OpenAI API response structures
- **Error Recovery**: Better error handling for various OpenAI API failure scenarios

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
