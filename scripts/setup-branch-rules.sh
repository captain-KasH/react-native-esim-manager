#!/bin/bash

# Setup branch protection rules using GitHub CLI
# Run: chmod +x scripts/setup-branch-rules.sh && ./scripts/setup-branch-rules.sh

REPO="captain-KasH/react-native-esim-manager"

echo "Setting up branch protection rules..."

# Main branch protection
gh api repos/$REPO/branches/main/protection \
  --method PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI / test", "CI / build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null
}
EOF

# Develop branch protection
gh api repos/$REPO/branches/develop/protection \
  --method PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": false,
    "contexts": ["CI / test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF

echo "Branch protection rules set successfully!"