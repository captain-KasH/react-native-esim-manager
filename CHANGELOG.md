# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive unit test suite with 80%+ coverage
- GitHub Actions CI/CD pipeline
- ESLint and Prettier configuration
- Contributing guidelines
- Automated release workflow

### Changed
- Enhanced TypeScript configuration
- Improved error handling and documentation

## [0.0.3] - 2024-01-XX

### Added
- Initial release with basic eSIM management functionality
- iOS and Android platform support
- Permission handling for Android
- eSIM detection and installation methods
- Cellular plan enumeration

### Features
- `requestPermissions()` - Request required permissions
- `isEsimSupported()` - Check eSIM hardware support
- `isEsimEnabled()` - Check eSIM activation status
- `getEsimInfo()` - Get detailed eSIM information
- `installEsimProfile()` - Install eSIM profiles
- `getCellularPlans()` - List available cellular plans