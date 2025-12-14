# Branch Strategy

## GitFlow Model

### Main Branches

- **`main`** - Production releases only (protected)
- **`develop`** - Integration branch for features (protected)

### Supporting Branches

- **`feature/*`** - New features (`feature/esim-installation`)
- **`bugfix/*`** - Bug fixes (`bugfix/android-permissions`)
- **`hotfix/*`** - Critical production fixes (`hotfix/security-patch`)
- **`release/*`** - Release preparation (`release/v1.0.0`)

### Workflow

1. **Feature Development**: `feature/branch` → `develop`
2. **Release Preparation**: `develop` → `release/v1.0.0` → `main` + `develop`
3. **Hotfixes**: `main` → `hotfix/branch` → `main` + `develop`

### Branch Protection Rules

- `main`: Require PR reviews, status checks, up-to-date branches
- `develop`: Require status checks, allow force pushes for maintainers
