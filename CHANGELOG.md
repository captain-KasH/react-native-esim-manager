# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2024-12-20

### Changed

- 📝 **Documentation Improvements**
  - Simplified README for better user experience
  - Moved detailed development information to CONTRIBUTING.md
  - Focused README on installation, usage, and API reference
  - Improved documentation structure and readability

## [0.1.0] - 2024-12-20

### Added

- 🚀 **TurboModule Support & New Architecture**
  - Full TurboModule implementation for React Native new architecture
  - Codegen specifications for type-safe native module interfaces
  - New architecture compatibility with React Native 0.70+
  - Enhanced performance with direct JSI bindings

- 📱 **Enhanced Example App**
  - Updated example app for new architecture demonstration
  - React Native 0.81.0 compatibility fixes
  - Added react-refresh dependency for development

- 🎬 **Demo Assets**
  - iOS eSIM installation demo GIF
  - Android eSIM support check demo GIF
  - Android manufacturer disabled scenario demo GIF

- 🧪 **Comprehensive Testing Suite**
  - Unit tests with 94%+ coverage (statements, functions, lines)
  - Jest configuration with TypeScript support
  - Test coverage reporting and thresholds
  - Automated test execution in CI/CD

- 🚀 **CI/CD Pipeline**
  - GitHub Actions workflows for testing, pre-release, and release
  - Node.js 18.x testing with comprehensive validation
  - Automated NPM publishing on version tags
  - Codecov integration for coverage reporting
  - Optimized CI for faster build times

- 🛠️ **Development Tools**
  - ESLint configuration with TypeScript and Prettier integration
  - Prettier code formatting with ignore patterns
  - Husky pre-commit hooks for quality gates
  - Lint-staged for automatic code formatting
  - Pre-push validation scripts

- 📚 **Documentation & Governance**
  - Comprehensive contributing guidelines with GitFlow workflow
  - Security policy for vulnerability reporting
  - Code of conduct for community standards
  - GitHub issue templates for bugs and feature requests
  - Branch strategy documentation

- 🔧 **Project Infrastructure**
  - Dependabot configuration for automated dependency updates
  - Release-it configuration for streamlined releases
  - Local CI simulation tools (Act integration)
  - Docker-based testing environment
  - Comprehensive .gitignore and .prettierignore files
  - Act configuration (.actrc) for local GitHub Actions testing
  - Pre-push validation scripts for quality assurance

- 📦 **Build & Quality**
  - TypeScript strict mode configuration
  - Enhanced package.json with quality scripts
  - Build verification and output validation
  - Module resolution and path mapping

### Changed

- 🔧 **Architecture Improvements**
  - Migrated from legacy bridge to TurboModule architecture
  - Removed deprecated Java module files
  - Enhanced Android eSIM installation for new architecture

- 📝 **Documentation Enhancements**
  - Clarified Android eSIM hardware vs manufacturer disabled scenarios
  - Added comprehensive known issues section
  - Updated README with demo GIFs and troubleshooting guides

- 📝 **Enhanced Documentation**
  - Updated README with badges, comprehensive API docs, and links to all documentation
  - Improved code examples with error handling
  - Added platform-specific guidelines and troubleshooting

- ⚙️ **Configuration Improvements**
  - Updated to React Native 0.80.0 with compatible dependencies
  - Enhanced TypeScript configuration with strict rules
  - Improved Jest configuration with better coverage settings

- 🔒 **Security & Best Practices**
  - Added security policy and vulnerability reporting process
  - Implemented branch protection rules and workflows
  - Enhanced error handling and input validation

### Optimized

- ⚡ **Performance Improvements**
  - Simplified CI to single Node.js 18.x for faster builds
  - Optimized GitHub Actions workflow execution time
  - Streamlined local testing with Act integration
  - Improved build artifact management with enhanced .gitignore

### Fixed

- 🔧 **New Architecture Compatibility**
  - Fixed Android eSIM installation with new architecture
  - Resolved React Native 0.81.0 compatibility issues
  - Fixed react-refresh dependency for development
  - Enhanced test coverage for TurboModule implementation

- 🐛 **Development Issues**
  - Resolved dependency conflicts with React Native 0.80
  - Fixed Jest configuration for proper test execution
  - Corrected ESLint and Prettier integration issues
  - Improved module mocking for React Native components
  - Cleaned up Android build artifacts from repository

## [0.0.3] - 2024-01-15

### Added

- Initial release with basic eSIM management functionality
- iOS and Android platform support
- Permission handling for Android
- eSIM detection and installation methods
- Cellular plan enumeration

### Features

- `requestPermissions()` - Request required permissions (Android)
- `isEsimSupported()` - Check eSIM hardware support
- `isEsimEnabled()` - Check eSIM activation status
- `getEsimInfo()` - Get detailed eSIM information with carrier details
- `installEsimProfile()` - Install eSIM profiles with activation codes
- `getCellularPlans()` - List available cellular plans on device

### Platform Support

- **iOS**: 12.0+ with direct eSIM installation
- **Android**: API 28+ with system settings integration
- Cross-platform TypeScript interfaces
- Proper error handling and permission management