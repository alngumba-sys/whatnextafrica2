#!/bin/bash

echo "🔧 Fixing Convex Setup..."
echo ""

# Step 1: Clean any existing convex files
echo "Step 1: Cleaning existing Convex artifacts..."
rm -rf .convex
rm -rf node_modules/.convex

# Step 2: Reinstall convex package
echo ""
echo "Step 2: Reinstalling Convex package..."
npm uninstall convex
npm install convex@latest

# Step 3: Initialize Convex
echo ""
echo "Step 3: Starting Convex dev server..."
echo "Please follow the prompts to sign in and create your project."
echo ""

convex dev
