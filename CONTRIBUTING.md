# Contributing to react-native-esim-manager

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Run the example app: `npm run example`

## Development Workflow

### Code Quality
- Run tests: `npm test`
- Run linting: `npm run lint`
- Run type checking: `npm run typecheck`
- Format code: `npm run format`
- Validate all: `npm run validate`

### Testing
- Write tests for new features
- Maintain test coverage above 80%
- Test on both iOS and Android platforms

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Run `npm run validate` to ensure quality
4. Update documentation if needed
5. Submit a pull request with clear description

## Commit Messages

Use conventional commits format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions/changes
- `refactor:` code refactoring

## Platform-Specific Guidelines

### iOS Development
- Test on iOS 12.0+ devices
- Use Xcode latest stable version
- Follow Apple's eSIM guidelines

### Android Development
- Test on API 28+ (Android 9.0+)
- Handle permissions properly
- Follow Android's eSIM best practices

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions will handle NPM publishing

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Check existing issues before creating new ones