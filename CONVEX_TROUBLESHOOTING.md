# 🔧 Convex Setup Troubleshooting

## Issue: "Could not resolve 'convex/server'" Error

If you see this error when running `npx convex dev`:

```
ERROR Could not resolve "convex/server"
```

### Solution 1: Install Convex CLI Globally (Recommended)

```bash
npm install -g convex
```

Then run:
```bash
convex dev
```

Instead of `npx convex dev`.

### Solution 2: Clear Node Modules and Reinstall

```bash
rm -rf node_modules
rm -rf .convex
npm install
npx convex dev
```

### Solution 3: Use Different Node Version

Convex works best with Node 18 or higher. Check your version:

```bash
node --version
```

If you're on an older version, upgrade to Node 18+.

### Solution 4: Initialize Fresh Convex Project

1. Stop any running Convex process
2. Delete `.convex` folder if it exists
3. Run:

```bash
npx convex@latest dev
```

This will use the latest Convex CLI version.

### Solution 5: Manual Setup

If the above doesn't work, try this manual approach:

1. **Install Convex globally:**
   ```bash
   npm install -g convex@latest
   ```

2. **Initialize Convex:**
   ```bash
   convex dev
   ```

3. **Follow the prompts:**
   - Sign in to Convex
   - Create new project or select existing
   - Wait for deployment

4. **Copy the deployment URL** from the terminal output

5. **Add to .env.local:**
   ```env
   VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
   ```

6. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Common Issues

### Issue: "esbuild failed"

**Solution:** Make sure you have the latest dependencies:
```bash
npm install convex@latest
```

### Issue: ".env.local not found"

**Solution:** Create the file manually:
```bash
touch .env.local
```

Then add:
```env
VITE_CONVEX_URL=
```

### Issue: "Cannot find module 'convex/_generated/api'"

**Solution:** This is normal! The types are generated AFTER `convex dev` runs successfully. The error will disappear once Convex is running.

### Issue: Port conflicts

**Solution:** Convex dev server runs on port 3210 by default. If it's in use:
```bash
convex dev --port 3211
```

## Verification Steps

After running `convex dev`, you should see:

```
✔ Created a new project
✔ Deployed!

Deployment URL: https://happy-animal-123.convex.cloud
```

If you see this, you're good! Just copy the URL to `.env.local` and restart your dev server.

## Still Having Issues?

1. **Check Convex Status:** https://status.convex.dev
2. **Join Convex Discord:** https://convex.dev/community
3. **Check our setup files:**
   - `/convex/schema.ts` should exist
   - `/convex.json` should exist
   - `/tsconfig.json` should exist

## Alternative: Use Convex Dashboard Manually

If CLI issues persist:

1. Go to https://dashboard.convex.dev
2. Create a new project manually
3. Copy the deployment URL
4. Add to `.env.local`
5. Deploy functions manually from dashboard

---

**Quick Fix Summary:**

```bash
# Try this first
npm install -g convex@latest
convex dev

# If that fails, try
npx convex@latest dev

# If still failing
rm -rf node_modules .convex
npm install
npx convex@latest dev
```
