# Contributing to react-native-esim-manager

Thank you for your interest in contributing! This guide will help you get started with our comprehensive development workflow.

## Quick Start

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-native-esim-manager.git
   cd react-native-esim-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup git hooks**
   ```bash
   npx husky install
   ```

4. **Run validation**
   ```bash
   npm run validate
   ```

## Development Workflow

### Available Scripts

```bash
# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Tests with coverage report

# Code Quality
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint code analysis
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Validation
npm run validate         # Full validation (typecheck + lint + test)
npm run pre-push         # Complete pre-push validation

# Build
npm run prepack          # Build the package
npm run clean            # Clean build artifacts

# Local CI
npm run ci:local         # Simulate CI pipeline locally
```

### Quality Standards

- **Test Coverage**: Maintain 80%+ coverage for all metrics
- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: All rules must pass
- **Prettier**: Code must be formatted
- **Conventional Commits**: Follow commit message format

### Pre-commit Hooks

Husky automatically runs validation before commits:
- Type checking
- Linting with auto-fix
- Code formatting
- Unit tests

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Test both success and error scenarios
- Mock React Native modules properly
- Use descriptive test names

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should handle success case', async () => {
      // Test implementation
    });

    it('should handle error case', async () => {
      // Error handling test
    });
  });
});
```

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Native

- Follow platform-specific best practices
- Handle permissions gracefully
- Use proper error handling
- Test on both iOS and Android

## Git Workflow (GitFlow)

### Branch Strategy

- **`main`**: Production-ready code
- **`develop`**: Integration branch
- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical fixes
- **`release/*`**: Release preparation

### Workflow Steps

1. **Create feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/amazing-feature
   ```

2. **Make changes with tests**
   ```bash
   # Make your changes
   npm run validate  # Ensure quality
   ```

3. **Commit with conventional format**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   # Create PR via GitHub UI
   ```

## Pull Request Process

### Before Submitting

- [ ] Run `npm run validate` successfully
- [ ] Add/update tests for new functionality
- [ ] Update documentation if needed
- [ ] Follow conventional commit format
- [ ] Ensure CI passes

## Commit Message Format

Follow [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration changes

### Examples

```bash
feat: add eSIM installation method
fix: handle Android permission denial
docs: update API documentation
test: add unit tests for error handling
```

## Platform-Specific Guidelines

### iOS Development

- **Minimum Version**: iOS 12.0+
- **Tools**: Xcode latest stable
- **Testing**: Use iOS Simulator and physical devices
- **Guidelines**: Follow Apple's eSIM documentation

### Android Development

- **Minimum API**: Level 28 (Android 9.0+)
- **Tools**: Android Studio latest stable
- **Permissions**: Handle READ_PHONE_STATE properly
- **Testing**: Use Android Emulator and physical devices

## Release Process

### Automated Releases

1. **Create release branch**
   ```bash
   git checkout develop
   git checkout -b release/v1.1.0
   ```

2. **Update version and changelog**
   ```bash
   # Update package.json version
   # Update CHANGELOG.md
   ```

3. **Merge to main and tag**
   ```bash
   git checkout main
   git merge release/v1.1.0
   git tag v1.1.0
   git push origin main --tags
   ```

4. **GitHub Actions handles NPM publishing**

## Local Development Tools

### GitHub Actions Locally (Act)

```bash
# Install Act
brew install act

# Run CI locally
npm run ci:act
```

### Pre-push Validation

```bash
# Full pre-push check
npm run pre-push

# Or step by step
npm run typecheck
npm run lint
npm run test:coverage
npm run prepack
```

## Debugging

### Common Issues

1. **Tests failing**: Check Jest setup and mocks
2. **Type errors**: Ensure strict TypeScript compliance
3. **Linting errors**: Run `npm run lint:fix`
4. **Build errors**: Check TypeScript configuration

### Getting Help

- **Issues**: Use GitHub issue templates
- **Discussions**: GitHub Discussions for questions
- **Security**: Follow security policy for vulnerabilities

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Conventional Commits](https://conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Thank you for contributing to react-native-esim-manager!**