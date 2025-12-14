# Branch Protection Setup

## GitHub Repository Settings

### Main Branch Protection

```
Branch: main
☑️ Restrict pushes that create files larger than 100MB
☑️ Require a pull request before merging
  ☑️ Require approvals (1)
  ☑️ Dismiss stale reviews
  ☑️ Require review from code owners
☑️ Require status checks to pass
  ☑️ Require branches to be up to date
  - CI / test (ubuntu-latest, 18.x)
  - CI / build
☑️ Require conversation resolution before merging
☑️ Include administrators
```

### Develop Branch Protection

```
Branch: develop
☑️ Require status checks to pass
  - CI / test (ubuntu-latest, 18.x)
☑️ Allow force pushes (for maintainers)
```

## Semantic Release Tags

- `v1.0.0` - Major release
- `v1.0.0-rc.1` - Release candidate
- `v1.0.0-beta.1` - Beta release
- `v1.0.0-alpha.1` - Alpha release
