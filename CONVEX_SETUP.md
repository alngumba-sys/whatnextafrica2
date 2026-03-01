# Convex Integration Setup Guide

## 🎯 Overview

This platform now uses **Convex** as the backend database, providing:
- ✅ Real-time data synchronization
- ✅ TypeScript-first development
- ✅ Automatic API generation
- ✅ Built-in authentication
- ✅ Serverless infrastructure
- ✅ No backend code needed

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

## 🚀 Setup Instructions

### Step 1: Install Convex CLI

```bash
npm install -g convex
```

### Step 2: Initialize Convex Project

In your project directory, run:

```bash
npx convex dev
```

This will:
1. Create a new Convex project (or link to existing one)
2. Generate the Convex URL
3. Start the development server
4. Watch for changes in `/convex` directory

### Step 3: Configure Environment Variables

After running `npx convex dev`, you'll get a Convex URL that looks like:
```
https://your-deployment.convex.cloud
```

Add this to your `.env.local` file:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Step 4: Seed the Database

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the DataSeeder component (you can add it temporarily to your dashboard)

3. Click "Seed Database" to populate with 2,464 officers + transfers + leave records

### Step 5: Verify Data

Open the Convex Dashboard at: https://dashboard.convex.dev

You should see:
- ✅ 2,464 users
- ✅ 1,000+ transfers
- ✅ 2,464 leave records

## 📂 Project Structure

```
/convex
  ├── schema.ts           # Database schema (tables & indexes)
  ├── queries.ts          # Query functions (read data)
  ├── mutations.ts        # Mutation functions (write data)
  ├── seed.ts            # Database seeding utilities
  └── _generated/        # Auto-generated TypeScript types

/src
  ├── hooks/
  │   └── useConvex.ts   # Custom hooks for Convex queries/mutations
  └── app/
      └── components/
          └── DataSeeder.tsx  # UI component for seeding database
```

## 🔧 Database Schema

### Tables

1. **users** - Main user/officer records (2,464 officers)
   - Indexed by: username, role, region, county, email

2. **transfers** - Transfer records with approval chains
   - Indexed by: officerId, status, initiatedBy

3. **leaveRecords** - Officer leave status
   - Indexed by: officerId, status

4. **leaveApplications** - Leave applications with approvals
   - Indexed by: applicantId, status, approverId

5. **leaveBalances** - Annual leave balances per officer
   - Indexed by: officerId

6. **createdUsers** - Dynamically created users
   - Indexed by: email, role, status

## 🎨 Usage in Components

### Querying Data

```tsx
import { useAllUsers, useAllTransfers } from '@/hooks/useConvex';

function MyComponent() {
  const users = useAllUsers(); // Real-time reactive query
  const transfers = useAllTransfers();

  if (!users || !transfers) return <div>Loading...</div>;

  return (
    <div>
      <p>Total Officers: {users.length}</p>
      <p>Total Transfers: {transfers.length}</p>
    </div>
  );
}
```

### Creating Data

```tsx
import { useCreateTransfer } from '@/hooks/useConvex';

function TransferForm() {
  const createTransfer = useCreateTransfer();

  const handleSubmit = async (data) => {
    await createTransfer({
      officerId: 'cc1',
      officerName: 'John Kamau',
      officerRole: 'County Commissioner',
      fromLocation: 'Nairobi',
      toLocation: 'Machakos',
      status: 'drafted',
      effectiveDate: '2026-03-15',
      reason: 'Strategic redeployment',
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Updating Data

```tsx
import { useUpdateTransfer } from '@/hooks/useConvex';

function ApproveTransferButton({ transferId }) {
  const updateTransfer = useUpdateTransfer();

  const handleApprove = async () => {
    await updateTransfer({
      id: transferId,
      status: 'approved',
      approvedBy: 'ps1',
      approvedByName: 'Dr. Raymond Omollo',
      approvalDate: new Date().toISOString(),
    });
  };

  return <button onClick={handleApprove}>Approve</button>;
}
```

## 🔄 Real-time Updates

Convex provides **automatic real-time synchronization**:

- When one user approves a transfer, all other users see the update instantly
- No need for manual refresh or polling
- Updates are optimistic and reactive

## 🔐 Authentication (Coming Soon)

Convex supports built-in authentication:
- Email/password
- OAuth (Google, GitHub, etc.)
- Custom authentication providers

## 🚀 Deployment

### Production Deployment

1. Deploy to Convex:
   ```bash
   npx convex deploy
   ```

2. Get your production Convex URL

3. Update your production environment variables:
   ```env
   VITE_CONVEX_URL=https://your-prod-deployment.convex.cloud
   ```

4. Deploy your frontend as usual

## 📊 Monitoring & Analytics

Access the Convex Dashboard for:
- Query performance metrics
- Data browser
- Function logs
- Usage statistics

Dashboard: https://dashboard.convex.dev

## 🐛 Troubleshooting

### Issue: "Cannot find module 'convex/_generated/api'"

**Solution:** Make sure `npx convex dev` is running. This generates the TypeScript types.

### Issue: "VITE_CONVEX_URL is undefined"

**Solution:** 
1. Copy the URL from `npx convex dev` output
2. Add it to `.env.local`
3. Restart your dev server

### Issue: Duplicate data when seeding

**Solution:** Run the "Clear All" function first, then seed again.

## 📚 Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex + React Guide](https://docs.convex.dev/client/react)
- [Convex Dashboard](https://dashboard.convex.dev)

## ✅ Next Steps

1. ✅ Convex installed and configured
2. ✅ Database schema defined
3. ✅ Queries and mutations created
4. ✅ Custom hooks ready
5. ⏭️ Seed the database
6. ⏭️ Update existing components to use Convex hooks
7. ⏭️ Add authentication
8. ⏭️ Deploy to production

## 🎉 Benefits Over localStorage

| Feature | localStorage | Convex |
|---------|-------------|--------|
| Multi-user | ❌ Single device | ✅ Multiple users |
| Real-time | ❌ Manual refresh | ✅ Automatic sync |
| Backup | ❌ Manual | ✅ Automatic |
| Queries | ❌ Filter in JS | ✅ Indexed queries |
| Audit trails | ❌ Complex | ✅ Built-in |
| Scale | ❌ Limited | ✅ Unlimited |
| Security | ❌ Client-only | ✅ Server-side |

---

**Ready to use Convex!** 🚀

Run `npx convex dev` to get started.
