# Release Process Guide

This document outlines the complete release process for react-native-esim-manager using GitFlow methodology.

## 🔄 Release Workflow Overview

```
feature/branch → develop → release/vX.X.X → main → tag vX.X.X → NPM
                     ↑                              ↓
                     └──────── merge back ←────────┘
```

## 📋 Pre-Release Checklist

- [ ] All features and fixes merged to `develop`
- [ ] All tests passing on `develop` branch
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Version number decided (following [Semantic Versioning](https://semver.org/))

## 🚀 Step-by-Step Release Process

### Step 1: Prepare Release Branch

```bash
# Switch to develop and get latest changes
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.1.0

# Update version in package.json (without creating git tag)
npm version 1.1.0 --no-git-tag-version
```

### Step 2: Update Documentation

```bash
# Update CHANGELOG.md with new version
# Add release notes, features, fixes, breaking changes

# Example CHANGELOG entry:
## [1.1.0] - 2024-01-15

### Added
- New eSIM profile validation method
- Enhanced error handling for Android

### Fixed
- iOS 17 compatibility issues
- Memory leak in cellular plan detection

### Changed
- Improved TypeScript definitions
```

### Step 3: Commit Release Changes

```bash
# Commit version and changelog updates
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.1.0 and update changelog"

# Push release branch
git push origin release/v1.1.0
```

### Step 4: Pre-Release Testing

- **Automatic**: GitHub Actions creates draft pre-release
- **Manual Testing**: Test the release branch thoroughly
- **Fix Issues**: Make any necessary fixes to `release/v1.1.0`

```bash
# If fixes are needed
git add .
git commit -m "fix: resolve issue in release candidate"
git push origin release/v1.1.0
```

### Step 5: Merge to Main

```bash
# Create Pull Request: release/v1.1.0 → main
# Get approval and merge via GitHub UI

# Or merge locally:
git checkout main
git pull origin main
git merge release/v1.1.0
git push origin main
```

### Step 6: Create Release Tag

```bash
# Create and push tag (triggers NPM deployment)
git tag v1.1.0
git push origin v1.1.0
```

**🚀 This automatically triggers:**
- NPM package publication
- GitHub release creation
- Release notes generation

### Step 7: Merge Back to Develop

```bash
# Keep develop branch updated
git checkout develop
git merge main
git push origin develop

# Clean up release branch
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

## 🔧 Hotfix Process

For critical fixes that need immediate release:

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/v1.1.1

# Make critical fixes
# Update version and changelog
npm version patch --no-git-tag-version

# Commit and push
git add .
git commit -m "fix: critical security patch"
git push origin hotfix/v1.1.1

# Merge to main
git checkout main
git merge hotfix/v1.1.1
git push origin main

# Create tag
git tag v1.1.1
git push origin v1.1.1

# Merge back to develop
git checkout develop
git merge main
git push origin develop

# Clean up
git branch -d hotfix/v1.1.1
git push origin --delete hotfix/v1.1.1
```

## 📦 Automated Workflows

### Pre-Release Workflow
- **Trigger**: Push to `release/*` branches
- **Action**: Creates draft GitHub release
- **Purpose**: Testing and validation

### Release Workflow
- **Trigger**: Push tags matching `v*`
- **Actions**:
  - Runs full test suite
  - Builds package
  - Publishes to NPM
  - Creates GitHub release

## 🏷️ Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backward compatible)
- **PATCH** (0.0.1): Bug fixes (backward compatible)

### Examples:
```bash
# Bug fix
npm version patch    # 1.0.0 → 1.0.1

# New feature
npm version minor    # 1.0.1 → 1.1.0

# Breaking change
npm version major    # 1.1.0 → 2.0.0
```

## 🔒 Security & Access

### Required Secrets
- `NPM_TOKEN`: For automated NPM publishing
- `GITHUB_TOKEN`: For creating releases (automatically provided)

### Branch Protection
- `main`: Requires PR reviews and passing CI
- `develop`: Requires passing CI

## 📝 Release Notes Template

```markdown
## [1.1.0] - 2024-01-15

### 🚀 New Features
- Feature description with usage example

### 🐛 Bug Fixes
- Fix description and impact

### 💥 Breaking Changes
- Breaking change description
- Migration guide

### 📚 Documentation
- Documentation improvements

### 🔧 Internal
- Development and build improvements
```

## ❌ Common Issues & Solutions

### Issue: NPM publish fails
**Solution**: Check NPM_TOKEN secret and package version

### Issue: Tag already exists
**Solution**: Delete tag and recreate
```bash
git tag -d v1.1.0
git push origin --delete v1.1.0
git tag v1.1.0
git push origin v1.1.0
```

### Issue: Release branch conflicts
**Solution**: Rebase on develop
```bash
git checkout release/v1.1.0
git rebase develop
git push origin release/v1.1.0 --force-with-lease
```

## 📞 Support

For questions about the release process:
- Check [Contributing Guide](CONTRIBUTING.md)
- Open an issue with `question` label
- Review [Branch Strategy](.github/branch-strategy.md)

---

**Remember**: Always test thoroughly before releasing and follow the checklist! 🎯