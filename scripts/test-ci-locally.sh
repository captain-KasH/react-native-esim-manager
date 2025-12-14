#!/bin/bash

# Local CI Pipeline Test Script
# Simulates GitHub Actions CI workflow

set -e

echo "🚀 Starting local CI pipeline test..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type checking
echo "🔍 Running type checking..."
npm run typecheck

# Linting
echo "🧹 Running linting..."
npm run lint

# Testing with coverage
echo "🧪 Running tests with coverage..."
npm run test:coverage

# Build package
echo "🏗️  Building package..."
npm run prepack

# Check build output
echo "📋 Checking build output..."
ls -la lib/

echo "✅ Local CI pipeline completed successfully!"