# 🚀 Quick Start - Kenya Gov Admin Platform

## Current Status: ✅ Convex is Running!

Your Convex backend is successfully deployed. Follow these 3 simple steps to complete setup:

---

## Step 1️⃣: Add Deployment URL (Required)

Your terminal shows `Convex functions ready!` but you need to add the deployment URL.

### Find Your URL:

**Option A - From Terminal:**
Scroll up in the terminal where `convex dev` is running to find:
```
Deployment URL: https://happy-animal-123.convex.cloud
```

**Option B - From Dashboard:**
1. Visit: https://dashboard.convex.dev
2. Click on your project
3. Look for the deployment URL at the top

### Add to .env.local:

```bash
# Open .env.local and replace the empty line with your URL
VITE_CONVEX_URL=https://your-actual-url.convex.cloud
```

**Important:** Save the file after adding the URL!

---

## Step 2️⃣: Seed Database with 2,464 Officers

Run this command to populate your database:

```bash
npx convex run seed:seedAll
```

You'll see:
```
✔ Seeding complete!
Created 2464 officers
Created sample transfers
Created leave records
```

This takes about 30-60 seconds.

---

## Step 3️⃣: Start Development Server

In a **NEW terminal** (keep `convex dev` running), start the app:

```bash
npm run dev
```

Then open: **http://localhost:5173**

---

## 🔐 Login Credentials

You can use ANY of the 2,464 officer usernames. Here are some examples:

### Top Level (See Everything):
```
Username: cs.interior
Password: (anything works in demo mode)
```

### Regional Level (Nairobi Region):
```
Username: rc.nairobi
Password: (anything)
```

### County Level (Nairobi County):
```
Username: cc.nairobi
Password: (anything)
```

### District Level (Westlands):
```
Username: dc.nairobi.westlands
Password: (anything)
```

---

## ✅ Verify Setup

Run this to check everything:

```bash
bash check-setup.sh
```

---

## 🎯 What's Included

- ✅ 2,464 officers across 6 administrative levels
- ✅ Dual-track structure (County Admin + Secretariat)
- ✅ 47 counties with full hierarchy
- ✅ Transfer management with approval workflows
- ✅ Leave management system
- ✅ Role-based access control
- ✅ AI-powered reshuffle functionality
- ✅ Real-time updates via Convex

---

## 🐛 Common Issues

### "Cannot find deployment"
→ Make sure you added the URL to `.env.local` and restarted dev server

### "No officers showing"
→ Run the seed command: `npx convex run seed:seedAll`

### "Functions not found"
→ Make sure `convex dev` is running in a separate terminal

---

## 📁 Two Terminals Needed

**Terminal 1** (keep running):
```bash
convex dev
```

**Terminal 2** (for development):
```bash
npm run dev
```

---

## 🎉 You're Almost There!

Just add your deployment URL to `.env.local` and run the seed command. Then you're ready to go!

**Need the deployment URL?** Check the terminal where `convex dev` is running, or visit: https://dashboard.convex.dev
