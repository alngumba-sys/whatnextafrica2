#!/bin/bash

echo "🌱 Seeding Convex Database with 2,464 Officers..."
echo ""
echo "This will populate your database with:"
echo "  • 2,464 officers across all administrative levels"
echo "  • Complete organizational hierarchy"
echo "  • Sample transfers and leave records"
echo ""

# Make sure convex is running
if ! pgrep -f "convex dev" > /dev/null; then
    echo "⚠️  Warning: Convex dev server doesn't appear to be running."
    echo "Please start it with: convex dev"
    echo ""
    exit 1
fi

echo "Running seed script..."
npx convex run seed:seedAll

echo ""
echo "✅ Database seeded successfully!"
echo ""
echo "You can now:"
echo "  1. Start your dev server: npm run dev"
echo "  2. Login with any officer credentials"
echo "  3. Explore the platform!"
