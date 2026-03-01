#!/bin/bash

echo "🚀 Quick Demo Setup with Ngrok..."
echo ""
echo "This creates a temporary public URL for your platform."
echo "Perfect for quick demos and testing!"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok not installed!"
    echo ""
    echo "To install:"
    echo "  macOS: brew install ngrok"
    echo "  Linux: sudo snap install ngrok"
    echo "  Windows: Download from https://ngrok.com/download"
    echo ""
    echo "After installing:"
    echo "  1. Sign up at: https://dashboard.ngrok.com/signup"
    echo "  2. Get your auth token: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "  3. Run: ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    exit 1
fi

echo "✅ Ngrok is installed"
echo ""

# Check if dev server is running
if ! lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Dev server not detected on port 5173"
    echo ""
    echo "Please start your dev server first:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again in another terminal."
    exit 1
fi

echo "✅ Dev server is running on port 5173"
echo ""

echo "🌐 Creating public URL..."
echo ""
echo "Your platform will be accessible at a temporary public URL."
echo "Keep this terminal open to maintain the connection."
echo ""
echo "▶️  Starting ngrok..."
echo ""

# Start ngrok
ngrok http 5173 --log=stdout
