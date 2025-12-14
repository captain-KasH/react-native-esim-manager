#!/bin/bash

# Pre-push validation script
set -e

echo "🔍 Running pre-push validation..."

# 1. Type checking
echo "📝 Type checking..."
npm run typecheck

# 2. Linting
echo "🧹 Linting..."
npm run lint

# 3. Formatting check
echo "💅 Format checking..."
npm run format:check

# 4. Tests with coverage
echo "🧪 Running tests..."
npm run test:coverage

# 5. Build check
echo "🏗️ Building package..."
npm run prepack

# 6. Check build output
echo "📦 Checking build output..."
if [ ! -d "lib" ]; then
  echo "❌ Build failed - lib directory not found"
  exit 1
fi

echo "✅ All checks passed! Ready to push."