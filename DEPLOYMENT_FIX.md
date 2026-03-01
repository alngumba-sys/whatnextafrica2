# Deployment Fix for figma:asset Error

## Problem
Netlify build was failing with error:
```
[vite]: Rollup failed to resolve import "figma:asset/25bb64de2fb1f7d54d5193344f5969437b85ce0e.png"
```

## Root Cause
The `figma:asset` virtual module scheme was cached in Netlify's build cache from a previous deployment. Although we've removed all `figma:asset` imports from the codebase, Netlify's build cache was still referencing the old imports.

## Solution Applied

### 1. Removed all figma:asset imports
- ✅ `/src/app/components/LoginPage.tsx` - Replaced with Shield icon
- ✅ `/src/app/components/DashboardRouter.tsx` - Replaced with Shield icon

### 2. Updated build script to clear cache
Modified `/package.json` build script:
```json
"build": "rm -rf dist node_modules/.vite && vite build"
```

This ensures:
- `dist` folder is cleaned before each build
- Vite's cache in `node_modules/.vite` is cleared

### 3. Added Netlify configuration
Created `/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

**Note:** This is a Vite/React project, NOT Next.js, so no Next.js plugins are needed.

### 4. Verified all code is clean
Confirmed zero remaining references to `figma:asset` in the entire codebase.

## Next Steps for Deployment

### Option 1: Clear Netlify Build Cache (Recommended)
1. Go to your Netlify dashboard
2. Navigate to: Site Settings → Build & Deploy → Environment
3. Click "Clear build cache"
4. Trigger a new deployment

### Option 2: Manual Cache Clear via Netlify UI
1. In Netlify dashboard, go to "Deploys"
2. Click "Trigger deploy" dropdown
3. Select "Clear cache and deploy site"

### Option 3: Force Redeploy via Git
```bash
git add .
git commit -m "fix: remove figma:asset imports and clear build cache"
git push origin main --force-with-lease
```

## Verification
After deployment, the build should:
1. ✅ Clean dist and vite cache
2. ✅ Build without any figma:asset resolution errors
3. ✅ Display Shield icons instead of missing images
4. ✅ Deploy successfully to production

## What Changed Visually
- **Login Page**: Kenya Coat of Arms → Maroon circle with white Shield icon (24x24)
- **Dashboard Header**: Kenya Coat of Arms → White circle with maroon Shield icon (12x12)

These icons maintain the professional government aesthetic and use the ministry's official maroon color (#66023C).