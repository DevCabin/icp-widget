#!/bin/bash
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Set environment variables for Chromium
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export CHROME_BIN=/tmp/chromium-min

echo "Build completed successfully!" 