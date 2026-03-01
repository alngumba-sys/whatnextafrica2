#!/bin/bash

echo "🚀 Deploying Kenya Gov Admin Platform to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local has CONVEX_URL
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local with your VITE_CONVEX_URL first."
    exit 1
fi

CONVEX_URL=$(grep "VITE_CONVEX_URL=" .env.local | cut -d '=' -f 2)

if [ -z "$CONVEX_URL" ]; then
    echo "❌ VITE_CONVEX_URL not set in .env.local!"
    echo "Please add your Convex deployment URL to .env.local first."
    exit 1
fi

echo "✅ Found Convex URL: $CONVEX_URL"
echo ""

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "You will be prompted to:"
echo "  1. Login to Vercel (if not already)"
echo "  2. Confirm project settings"
echo "  3. Wait for deployment"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "⚠️  IMPORTANT: Add environment variable in Vercel Dashboard"
    echo ""
    echo "1. Go to: https://vercel.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to: Settings → Environment Variables"
    echo "4. Add variable:"
    echo "   Name: VITE_CONVEX_URL"
    echo "   Value: $CONVEX_URL"
    echo "5. Redeploy from Dashboard or run: vercel --prod"
    echo ""
    echo "Your deployment URL will be displayed above ☝️"
    echo "Save this URL - you'll need it for the QR code!"
    echo ""
else
    echo "❌ Deployment failed!"
    exit 1
fi
