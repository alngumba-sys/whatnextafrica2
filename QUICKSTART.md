# 🚀 Quick Start: Connecting to Convex

## ⚡ 5-Minute Setup

### Step 1: Run Convex Dev Server (Terminal 1)

```bash
npx convex dev
```

**What this does:**
- Creates/links your Convex project
- Generates your deployment URL
- Watches for schema changes
- Provides real-time sync

**Expected Output:**
```
✔ Created a new project: kenya-admin-platform
✔ Deployed!

Deployment URL: https://happy-animal-123.convex.cloud

Add this to your .env.local file:
VITE_CONVEX_URL=https://happy-animal-123.convex.cloud
```

### Step 2: Add Convex URL to .env.local

Copy the URL from the output above and add it to `.env.local`:

```env
VITE_CONVEX_URL=https://happy-animal-123.convex.cloud
```

### Step 3: Start Your Dev Server (Terminal 2)

```bash
npm run dev
```

### Step 4: Seed the Database

1. Open your app in the browser
2. Temporarily add the DataSeeder component to your dashboard
3. Click "Seed Database"
4. Wait for confirmation (2,464 officers + transfers + leave records)

**That's it!** Your platform is now connected to Convex with real-time data.

---

## 🎯 Verify Everything Works

### Check 1: Convex Dashboard
Visit: https://dashboard.convex.dev

You should see:
- ✅ Your project listed
- ✅ Tables: users, transfers, leaveRecords, etc.
- ✅ Data counts matching your dummy data

### Check 2: Real-time Updates
Open your app in two browser windows side by side. Make a change in one window (e.g., approve a transfer) and watch it appear instantly in the other window!

---

## 📝 Usage Example

### Before (with localStorage):
```tsx
const [users, setUsers] = useState([]);

useEffect(() => {
  const storedUsers = localStorage.getItem('users');
  setUsers(JSON.parse(storedUsers || '[]'));
}, []);
```

### After (with Convex):
```tsx
import { useAllUsers } from '@/hooks/useConvex';

const users = useAllUsers(); // Real-time, auto-updates!
```

---

## 🎉 What You Get

✅ **Real-time sync** - All users see updates instantly  
✅ **No localStorage** - Data persists across devices  
✅ **Type-safe** - Full TypeScript support  
✅ **Indexed queries** - Fast search & filtering  
✅ **Audit trails** - Every change is logged  
✅ **Scalable** - Handle thousands of users  
✅ **Backup** - Automatic data backup  

---

## 🔧 Common Commands

```bash
# Start Convex dev server
npx convex dev

# Deploy to production
npx convex deploy

# Open Convex dashboard
npx convex dashboard

# Clear all data (careful!)
# Use the DataSeeder component's "Clear All" button
```

---

## 🐛 Troubleshooting

### "Cannot connect to Convex"
- ✅ Make sure `npx convex dev` is running
- ✅ Check `.env.local` has correct `VITE_CONVEX_URL`
- ✅ Restart your dev server after adding env var

### "Module not found: convex/_generated"
- ✅ Run `npx convex dev` to generate types
- ✅ Wait for "Deployed!" message before starting app

### "Duplicate data"
- ✅ Use "Clear All" button in DataSeeder
- ✅ Then run "Seed Database" again

---

## 📚 Next Steps

1. ✅ **Explore the Dashboard**: https://dashboard.convex.dev
2. ✅ **Test real-time updates**: Open app in 2 windows
3. ✅ **Read the docs**: https://docs.convex.dev
4. ✅ **Update components**: Replace localStorage with Convex hooks

---

**Need help?** Check `CONVEX_SETUP.md` for detailed documentation.
