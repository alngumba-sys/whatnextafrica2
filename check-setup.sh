#!/bin/bash

echo "🔍 Checking Convex Setup Status..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "   Please create it with: VITE_CONVEX_URL=your-deployment-url"
    exit 1
fi

# Check if VITE_CONVEX_URL is set
if grep -q "VITE_CONVEX_URL=$" ".env.local" || grep -q "VITE_CONVEX_URL= *$" ".env.local"; then
    echo "⚠️  VITE_CONVEX_URL is not set in .env.local"
    echo ""
    echo "To fix this:"
    echo "  1. Check your terminal where 'convex dev' is running"
    echo "  2. Find the line: 'Deployment URL: https://...convex.cloud'"
    echo "  3. Copy that URL"
    echo "  4. Add it to .env.local:"
    echo "     VITE_CONVEX_URL=https://your-deployment-url.convex.cloud"
    echo ""
    echo "OR visit: https://dashboard.convex.dev"
    echo "   → Select your project → Settings → Copy Deployment URL"
    echo ""
    exit 1
fi

echo "✅ .env.local configured"

# Check if convex dev is running
if pgrep -f "convex dev" > /dev/null; then
    echo "✅ Convex dev server is running"
else
    echo "⚠️  Convex dev server not detected"
    echo "   Start it with: convex dev"
    echo ""
fi

# Extract URL from .env.local
CONVEX_URL=$(grep "VITE_CONVEX_URL=" .env.local | cut -d '=' -f 2)

if [ ! -z "$CONVEX_URL" ]; then
    echo "✅ Deployment URL: $CONVEX_URL"
else
    echo "⚠️  Could not read deployment URL"
fi

echo ""
echo "📊 Next Steps:"
echo ""
echo "1️⃣  Seed the database (if not done yet):"
echo "    npx convex run seed:seedAll"
echo ""
echo "2️⃣  Start your dev server:"
echo "    npm run dev"
echo ""
echo "3️⃣  Open browser and login:"
echo "    http://localhost:5173"
echo "    Username: cs.interior (or any officer username)"
echo ""
