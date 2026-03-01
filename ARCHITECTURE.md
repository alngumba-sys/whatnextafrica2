# 🏗️ Convex Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     KENYA ADMIN PLATFORM                        │
│                     (React + TypeScript)                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐        ┌──────────────┐
│   Browser 1  │         │   Browser 2  │        │   Browser N  │
│  (PS Office) │         │  (RC Field)  │        │  (CC Mobile) │
└──────────────┘         └──────────────┘        └──────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                          Real-time sync
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │           ConvexProvider (React)               │
        │         Manages subscriptions & state          │
        └────────────────────────────────────────────────┘
                                 │
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                  │
        ▼                                                  ▼
┌──────────────────┐                            ┌───���──────────────┐
│  Custom Hooks    │                            │  Generated API   │
│  (useConvex.ts)  │                            │  (Convex types)  │
└──────────────────┘                            └──────────────────┘
        │                                                  │
        │                                                  │
        └──────────────────────┬───────────────────────────┘
                               │
                               ▼
        ┌────────────────────────────────────────────────┐
        │              CONVEX BACKEND                    │
        │          (Serverless Functions)                │
        ├────────────────────────────────────────────────┤
        │                                                │
        │  ┌──────────────┐      ┌──────────────┐      │
        │  │   Queries    │      │  Mutations   │      │
        │  │   (Read)     │      │   (Write)    │      │
        │  └──────────────┘      └──────────────┘      │
        │         │                      │              │
        │         └──────────┬───────────┘              │
        │                    │                          │
        │                    ▼                          │
        │         ┌──────────────────┐                 │
        │         │   Database       │                 │
        │         │   (6 Tables)     │                 │
        │         └──────────────────┘                 │
        │                                               │
        └────────────────────────────────────────────────┘
                               │
                               │ Real-time push
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │  All Clients │ │  All Clients │ │  All Clients │
        │  Auto-Update │ │  Auto-Update │ │  Auto-Update │
        └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Data Flow Diagram

### Query Flow (Reading Data)

```
Component
    │
    │ const users = useAllUsers()
    │
    ▼
Custom Hook (useConvex.ts)
    │
    │ useQuery(api.queries.getAllUsers)
    │
    ▼
Convex Backend
    │
    │ Query Function
    │
    ▼
Database
    │
    │ SELECT * FROM users
    │
    ▼
Return Data
    │
    │ [{ id: 'cs1', name: '...' }, ...]
    │
    ▼
Component Re-renders
    │
    └─→ UI Updates Automatically
```

---

### Mutation Flow (Writing Data)

```
User Action (Click "Approve")
    │
    ▼
Component
    │
    │ await updateTransfer({ id, status: 'approved' })
    │
    ▼
Custom Hook (useUpdateTransfer)
    │
    │ useMutation(api.mutations.updateTransfer)
    │
    ▼
Convex Backend
    │
    │ Mutation Function
    │
    ▼
Database
    │
    │ UPDATE transfers SET status='approved' WHERE id=...
    │
    ▼
Database Updated
    │
    ├─────────────────┬─────────────────┬─────────────────┐
    │                 │                 │                 │
    ▼                 ▼                 ▼                 ▼
Browser 1         Browser 2         Browser 3         Browser N
(PS Office)       (RC Field)        (CC Mobile)       (Others)
    │                 │                 │                 │
    └─────────────────┴─────────────────┴─────────────────┘
                            │
                            ▼
              ALL Clients See Update INSTANTLY!
```

---

## Database Schema Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        CONVEX DATABASE                         │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │ ← 2,464 Officers
├─────────────────┤
│ _id             │ (Primary Key)
│ username        │ (Indexed)
│ name            │
│ role            │ (Indexed: CS, PS, RC, CC, DC, ACC, etc.)
│ email           │ (Indexed)
│ region          │ (Indexed)
│ county          │ (Indexed)
│ currentStation  │
│ dateOfBirth     │
│ performanceRating│
│ ...             │
└─────────────────┘
         │
         │ One-to-Many
         ▼
┌─────────────────┐
│   transfers     │ ← 1,000+ Transfer Records
├─────────────────┤
│ _id             │ (Primary Key)
│ officerId       │ (Indexed → users._id)
│ officerName     │
│ fromLocation    │
│ toLocation      │
│ status          │ (Indexed: drafted, initiated, approved, etc.)
│ initiatedBy     │ (Indexed)
│ approvedBy      │
│ effectiveDate   │
│ reason          │
│ priority        │
│ ...             │
└─────────────────┘

┌─────────────────┐
│  leaveRecords   │ ← 2,464 Leave Status Records
├─────────────────┤
│ _id             │
│ officerId       │ (Indexed → users._id)
│ officerName     │
│ status          │ (Indexed: active, on_leave, study_leave, etc.)
│ startDate       │
│ endDate         │
│ updatedBy       │
│ ...             │
└─────────────────┘

┌───────────────────┐
│ leaveApplications │ ← Leave Applications
├───────────────────┤
│ _id               │
│ applicantId       │ (Indexed → users._id)
│ leaveType         │ (annual, sick, study, etc.)
│ startDate         │
│ endDate           │
│ status            │ (Indexed: pending, approved, rejected)
│ approverId        │ (Indexed)
│ ...               │
└───────────────────┘

┌─────────────────┐
│ leaveBalances   │ ← Annual Leave Tracking
├─────────────────┤
│ _id             │
│ officerId       │ (Indexed → users._id)
│ annualLeaveBalance│
│ sickLeaveBalance │
│ year            │
│ ...             │
└─────────────────┘

┌─────────────────┐
│ createdUsers    │ ← Dynamically Created Users
├─────────────────┤
│ _id             │
│ firstName       │
│ lastName        │
│ email           │ (Indexed)
│ role            │ (Indexed)
│ status          │ (Indexed)
│ initiatives     │
│ ...             │
└─────────────────┘
```

---

## Component Integration Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│                     (Entry Point)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AppWrapper.tsx                           │
│  ┌───────────────────────────────────────────────────┐     │
│  │           ConvexProvider                          │     │
│  │  (Manages all Convex subscriptions)               │     │
│  │  ┌─────────────────────────────────────────────┐  │     │
│  │  │         AuthProvider                        │  │     │
│  │  │  (Authentication context)                   │  │     │
│  │  │  ┌───────────────────────────────────────┐  │  │     │
│  │  │  │     CreatedUsersProvider              │  │  │     │
│  │  │  │  (Manages created users)              │  │  │     │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │     │
│  │  │  │  │        AppRouter                │  │  │  │     │
│  │  │  │  │  (All app routes)               │  │  │  │     │
│  │  │  │  └─────────────────────────────────┘  │  │  │     │
│  │  │  └───────────────────────────────────────┘  │  │     │
│  │  └─────────────────────────────────────────────┘  │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ RoleDashboard│    │  Transfer    │    │    Leave     │
│              │    │  Management  │    │  Management  │
│ Uses:        │    │              │    │              │
│ useAllUsers()│    │ Uses:        │    │ Uses:        │
│ useAll       │    │ useAll       │    │ useAll       │
│ Transfers()  │    │ Transfers()  │    │ LeaveApps()  │
│ useAll       │    │ useCreate    │    │ useCreate    │
│ LeaveRecords │    │ Transfer()   │    │ LeaveApp()   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                  All use Convex hooks
                            │
                            ▼
                ┌────────────────────┐
                │  useConvex.ts      │
                │  (Custom Hooks)    │
                └────────────────────┘
                            │
                            ▼
                ┌────────────────────┐
                │  Convex Backend    │
                └────────────────────┘
```

---

## Real-time Synchronization Flow

```
Time: T0 - User A (PS Office) approves transfer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Browser A (PS)
    │ User clicks "Approve"
    │
    ▼
    updateTransfer({ id: 'tr001', status: 'approved' })
    │
    │ Mutation sent to Convex
    │
    ▼
Convex Backend
    │
    │ Processing mutation...
    │ Database updated
    │
    ▼
Database
    │ UPDATE transfers SET status='approved'
    │
    │ Triggers real-time push to ALL subscribers
    │
    ├────────────────┬────────────────┬────────────────┐
    │                │                │                │
    ▼                ▼                ▼                ▼

Browser A        Browser B        Browser C        Browser N
(PS Office)      (RC Field)       (CC Mobile)      (Others)
    │                │                │                │
    │                │ INSTANT        │ INSTANT        │ INSTANT
    │                │ UPDATE         │ UPDATE         │ UPDATE
    │                │                │                │
    ▼                ▼                ▼                ▼
"Approved!"      "Status:         "Transfer        "Dashboard
                  Approved"        Approved"        Updated"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time: T0 + 100ms - ALL users see the update!

NO REFRESH NEEDED! 🚀
```

---

## Deployment Architecture

```
Development Environment:
┌────────────────────────────────────────┐
│  Your Computer                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │ Terminal 1   │   │ Terminal 2   │  │
│  │              │   │              │  │
│  │ npx convex   │   │ npm run dev  │  │
│  │ dev          │   │              │  │
│  │              │   │              │  │
│  │ (Watches     │   │ (Vite dev    │  │
│  │  /convex/)   │   │  server)     │  │
│  └──────────────┘   └──────────────┘  │
│         │                   │          │
│         └─────────┬─────────┘          │
└───────────────────┼────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Convex Cloud      │
        │   (Dev Deployment)  │
        └─────────────────────┘

Production Environment:
┌────────────────────────────────────────┐
│  Deployment Server                     │
│  ┌──────────────┐   ┌──────────────┐  │
│  │ Build Step   │   │ Deploy Step  │  │
│  │              │   │              │  │
│  │ npm run      │   │ npx convex   │  │
│  │ build        │   │ deploy       │  │
│  └──────────────┘   └──────────────┘  │
│         │                   │          │
│         └─────────┬─────────┘          │
└───────────────────┼────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐       ┌──────────────┐
│   Frontend   │       │   Convex     │
│   (Vercel/   │       │   (Prod      │
│   Netlify)   │       │   Deploy)    │
└──────────────┘       └──────────────┘
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
            ┌──────────────┐
            │   End Users  │
            │   (Browsers) │
            └──────────────┘
```

---

## File Structure Diagram

```
kenya-admin-platform/
│
├── convex/                    ← Convex Backend
│   ├── schema.ts             ← Database tables & indexes
│   ├── queries.ts            ← Read functions
│   ├── mutations.ts          ← Write functions
│   ├── seed.ts               ← Data seeding
│   └── _generated/           ← Auto-generated (gitignored)
│       ├── api.d.ts
│       ├── server.d.ts
│       └── dataModel.d.ts
│
├── src/
│   ├── hooks/
│   │   └── useConvex.ts      ← Custom React hooks
│   │
│   ├── app/components/
│   │   ├── DataSeeder.tsx    ← UI for seeding
│   │   ├── ConvexTest.tsx    ← Connection test
│   │   ├── RoleDashboard.tsx ← Uses Convex hooks
│   │   ├── Transfer          ← Uses Convex hooks
│   │   │   Management.tsx
│   │   └── AppWrapper.tsx    ← ConvexProvider setup
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx   ← Can use Convex
│   │   └── CreatedUsers      ← Can migrate to Convex
│   │       Context.tsx
│   │
│   └── data/                  ← Original dummy data
│       ├── users.ts          ← Used for seeding
│       ├── transfers         ← Used for seeding
│       │   AndLeave.ts
│       └── ...
│
├── .env.local                 ← Convex URL
├── convex.json               ← Convex config
├── package.json              ← Scripts added
├── QUICKSTART.md             ← Setup guide
├── CONVEX_SETUP.md           ← Technical docs
├── INTEGRATION_GUIDE.md      ← Patterns & examples
└── README_CONVEX.md          ← Summary
```

---

**Legend:**
- `→` Data flow direction
- `├──` Parent-child relationship
- `▼` Step-by-step progression
- `(Indexed)` Database index for fast lookups
- `✅` Completed
- `⏭️` Next step
