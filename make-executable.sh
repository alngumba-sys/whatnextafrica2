#!/bin/bash

echo "🔧 Making video production scripts executable..."
echo ""

# Make all bash scripts executable
chmod +x deploy-vercel.sh
chmod +x deploy-ngrok.sh
chmod +x check-setup.sh
chmod +x setup-convex.sh
chmod +x seed-database.sh

echo "✅ Scripts are now executable!"
echo ""
echo "You can now run:"
echo "  ./deploy-vercel.sh    - Deploy to Vercel"
echo "  ./deploy-ngrok.sh     - Quick demo with Ngrok"
echo "  ./check-setup.sh      - Verify setup"
echo ""
echo "For QR code generation:"
echo "  node generate-qr.js https://your-url.com"
echo ""
echo "📚 Documentation available:"
echo "  - QUICK_VIDEO_GUIDE.md (start here!)"
echo "  - VIDEO_WALKTHROUGH_GUIDE.md (detailed)"
echo "  - VIDEO_SCRIPT.md (narration script)"
echo "  - RECORDING_CHECKLIST.txt (pre-recording)"
echo ""
