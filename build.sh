#!/bin/bash
# Install dependencies
npm install

# Skip linting
echo "Skipping lint checks"

# Build the Next.js application
npx next build
