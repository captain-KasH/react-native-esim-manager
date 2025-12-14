# Test GitHub Actions Locally with Act

## Install Act

```bash
# macOS
brew install act

# Or download from: https://github.com/nektos/act
```

## Run Workflows Locally

```bash
# Test CI workflow
act -j test

# Test build job
act -j build

# Test all workflows
act

# Test with specific event
act push

# Test pull request workflow
act pull_request
```

## Act Configuration

Create `.actrc` file:

```
-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
```
