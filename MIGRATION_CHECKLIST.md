# 📋 Convex Migration Checklist

A step-by-step checklist to migrate your Kenya Admin Platform from mock data to Convex.

---

## Phase 0: Initial Setup ⚙️

- [ ] **Install Convex**
  ```bash
  npm install convex  # ✅ Already done!
  ```

- [ ] **Initialize Convex**
  ```bash
  npx convex dev
  ```
  - [ ] Sign in to Convex account
  - [ ] Create project
  - [ ] Note the deployment URL

- [ ] **Configure Environment**
  - [ ] Copy deployment URL
  - [ ] Add to `.env.local`:
    ```env
    VITE_CONVEX_URL=https://your-deployment.convex.cloud
    ```
  - [ ] Restart dev server

- [ ] **Verify Connection**
  - [ ] Add `<ConvexTest />` component to dashboard
  - [ ] Check connection status
  - [ ] Confirm no errors in console

---

## Phase 1: Seed Database 📊

- [ ] **Prepare Seeding**
  - [ ] Add `<DataSeeder />` component to dashboard
  - [ ] OR create dedicated seeding route

- [ ] **Run Seeding**
  - [ ] Click "Seed Database" button
  - [ ] Wait for all toasts to complete:
    - [ ] ✅ Users seeded (2,464)
    - [ ] ✅ Transfers seeded (1,000+)
    - [ ] ✅ Leave records seeded (2,464)

- [ ] **Verify Data**
  - [ ] Open Convex Dashboard: https://dashboard.convex.dev
  - [ ] Check `users` table has 2,464 records
  - [ ] Check `transfers` table has 1,000+ records
  - [ ] Check `leaveRecords` table has 2,464 records
  - [ ] Sample a few records to verify data quality

---

## Phase 2: Migrate Components (One by One) 🔄

### Component: AuthContext.tsx

Current Implementation:
```tsx
import { users } from '@/data/users';
const allUsers = users;
```

**Migration Steps:**

- [ ] **Import Convex hook**
  ```tsx
  import { useAllUsers } from '@/hooks/useConvex';
  ```

- [ ] **Replace static data**
  ```tsx
  const allUsers = useAllUsers();
  ```

- [ ] **Add loading state**
  ```tsx
  if (!allUsers) return <div>Loading...</div>;
  ```

- [ ] **Test authentication**
  - [ ] Login as CS
  - [ ] Login as PS
  - [ ] Login as RC
  - [ ] Login as CC
  - [ ] Verify role-based access

---

### Component: RoleDashboard.tsx

Current Implementation:
```tsx
import { users } from '@/data/users';
import { transfers, leaveRecords } from '@/data/transfersAndLeave';
```

**Migration Steps:**

- [ ] **Import Convex hooks**
  ```tsx
  import { useAllUsers, useAllTransfers, useAllLeaveRecords } from '@/hooks/useConvex';
  ```

- [ ] **Replace static imports**
  ```tsx
  const users = useAllUsers();
  const transfers = useAllTransfers();
  const leaveRecords = useAllLeaveRecords();
  ```

- [ ] **Add loading states**
  ```tsx
  if (!users || !transfers || !leaveRecords) {
    return <div>Loading dashboard...</div>;
  }
  ```

- [ ] **Test dashboard**
  - [ ] Statistics cards show correct numbers
  - [ ] Pending approvals count matches
  - [ ] Recent transfers display correctly
  - [ ] Leave status displays correctly

---

### Component: TransferManagement.tsx

Current Implementation:
```tsx
import { transfers } from '@/data/transfersAndLeave';
const [transferList, setTransferList] = useState(transfers);
```

**Migration Steps:**

- [ ] **Import Convex hooks**
  ```tsx
  import { useAllTransfers, useCreateTransfer, useUpdateTransfer } from '@/hooks/useConvex';
  ```

- [ ] **Replace state with query**
  ```tsx
  const transfers = useAllTransfers();
  const createTransfer = useCreateTransfer();
  const updateTransfer = useUpdateTransfer();
  ```

- [ ] **Update create handler**
  ```tsx
  const handleCreateTransfer = async (data) => {
    await createTransfer({
      officerId: data.officerId,
      officerName: data.officerName,
      officerRole: data.officerRole,
      fromLocation: data.from,
      toLocation: data.to,
      status: 'drafted',
      effectiveDate: data.date,
      reason: data.reason,
    });
    toast.success('Transfer created!');
  };
  ```

- [ ] **Update approve handler**
  ```tsx
  const handleApprove = async (transferId) => {
    await updateTransfer({
      id: transferId,
      status: 'approved',
      approvedBy: currentUser.id,
      approvedByName: currentUser.name,
      approvalDate: new Date().toISOString(),
    });
    toast.success('Transfer approved!');
  };
  ```

- [ ] **Test transfer workflows**
  - [ ] Create new transfer (Draft)
  - [ ] Initiate transfer
  - [ ] Approve transfer
  - [ ] Reject transfer
  - [ ] Verify status updates in real-time

---

### Component: LeaveManagement.tsx

Current Implementation:
```tsx
import { leaveRecords, leaveApplications } from '@/data/transfersAndLeave';
```

**Migration Steps:**

- [ ] **Import Convex hooks**
  ```tsx
  import { 
    useAllLeaveRecords, 
    useAllLeaveApplications,
    useCreateLeaveApplication,
    useUpdateLeaveApplication 
  } from '@/hooks/useConvex';
  ```

- [ ] **Replace static data**
  ```tsx
  const leaveRecords = useAllLeaveRecords();
  const leaveApplications = useAllLeaveApplications();
  const createApplication = useCreateLeaveApplication();
  const updateApplication = useUpdateLeaveApplication();
  ```

- [ ] **Test leave workflows**
  - [ ] View leave records
  - [ ] Create leave application
  - [ ] Approve application
  - [ ] Reject application
  - [ ] Update leave balances

---

### Component: AIReshuffle.tsx

**Migration Steps:**

- [ ] **Import users from Convex**
  ```tsx
  const users = useAllUsers();
  ```

- [ ] **Update AI logic to use Convex data**
  ```tsx
  if (!users) return <div>Loading officers...</div>;
  
  // AI logic uses users array as before
  const reshuffleResults = generateReshuffle(users);
  ```

- [ ] **Test reshuffle**
  - [ ] Generate reshuffle for region
  - [ ] Verify all 2,464 officers available
  - [ ] Confirm reshuffle recommendations

---

### Component: HierarchyPage.tsx

**Migration Steps:**

- [ ] **Import Convex data**
  ```tsx
  const users = useAllUsers();
  ```

- [ ] **Filter by role client-side** (or create specific queries)
  ```tsx
  const hierarchyData = useMemo(() => {
    if (!users) return null;
    
    const cs = users.find(u => u.role === 'CS');
    const ps = users.find(u => u.role === 'PS');
    const rcs = users.filter(u => u.role === 'RC');
    // ... build hierarchy
    
    return { cs, ps, rcs, ... };
  }, [users]);
  ```

- [ ] **Test hierarchy display**
  - [ ] CS at top
  - [ ] PS below CS
  - [ ] RCs correctly positioned
  - [ ] CCs under correct RCs
  - [ ] All levels display correctly

---

### Component: CreatedUsersContext.tsx

**Current Implementation:**
Uses localStorage

**Migration Steps:**

- [ ] **Import Convex hooks**
  ```tsx
  import { useAllCreatedUsers, useCreateCreatedUser, useUpdateCreatedUser, useDeleteCreatedUser } from '@/hooks/useConvex';
  ```

- [ ] **Replace context with Convex**
  ```tsx
  export function CreatedUsersProvider({ children }) {
    // Remove localStorage logic
    // Use Convex hooks directly in components instead
    return <>{children}</>;
  }
  ```

- [ ] **Update components using context**
  - [ ] Replace `useCreatedUsers()` with `useAllCreatedUsers()`
  - [ ] Update add/update/delete handlers

- [ ] **Remove localStorage code**
  ```tsx
  // Delete STORAGE_KEY
  // Delete localStorage.getItem()
  // Delete localStorage.setItem()
  ```

---

## Phase 3: Test Real-time Features 🚀

- [ ] **Multi-browser Test**
  - [ ] Open app in Chrome
  - [ ] Open app in Firefox (or another Chrome window)
  - [ ] Login as PS in Browser A
  - [ ] Login as RC in Browser B
  - [ ] Approve transfer in Browser A
  - [ ] Verify Browser B updates INSTANTLY (no refresh!)

- [ ] **Role-based Access Test**
  - [ ] Login as CC
  - [ ] Verify only sees own county data
  - [ ] Login as RC
  - [ ] Verify sees entire region
  - [ ] Login as PS
  - [ ] Verify sees all data

- [ ] **Workflow Test**
  - [ ] Create transfer (Draft)
  - [ ] Initiate transfer
  - [ ] Approve at each level
  - [ ] Verify approval chain works
  - [ ] Check reporting status
  - [ ] Test release workflow

---

## Phase 4: Performance Optimization 🔧

- [ ] **Add Loading States**
  - [ ] Dashboard shows skeleton loaders
  - [ ] Tables show loading spinners
  - [ ] Forms disable during submission

- [ ] **Add Error Handling**
  ```tsx
  try {
    await createTransfer(data);
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed to create transfer');
    console.error(error);
  }
  ```

- [ ] **Optimize Queries**
  - [ ] Use specific queries instead of fetching all data
  - [ ] Example: `useTransfersByStatus('pending')` instead of filtering all transfers

- [ ] **Add Pagination** (if needed)
  - [ ] For large transfer lists
  - [ ] For officer search results

---

## Phase 5: Cleanup 🧹

- [ ] **Remove Mock Data Usage**
  - [ ] Search codebase for `import { users } from '@/data/users'`
  - [ ] Replace all instances with Convex hooks
  - [ ] Keep `/src/data/*.ts` files for reference (or delete)

- [ ] **Remove localStorage**
  - [ ] Delete localStorage code from CreatedUsersContext
  - [ ] Remove any other localStorage usage

- [ ] **Remove DataSeeder Component** (optional)
  - [ ] Once database is seeded, you don't need UI anymore
  - [ ] Or keep it for development/testing

- [ ] **Update Documentation**
  - [ ] Update README with Convex setup instructions
  - [ ] Document new component patterns
  - [ ] Update API documentation

---

## Phase 6: Production Preparation 🎯

- [ ] **Deploy to Convex Production**
  ```bash
  npx convex deploy
  ```

- [ ] **Update Production Environment Variables**
  - [ ] Set `VITE_CONVEX_URL` to production URL
  - [ ] Test production deployment

- [ ] **Setup Backups**
  - [ ] Convex automatically backs up data
  - [ ] Document recovery procedures

- [ ] **Setup Monitoring**
  - [ ] Monitor Convex Dashboard
  - [ ] Set up alerts for errors
  - [ ] Track query performance

- [ ] **Load Testing**
  - [ ] Test with multiple concurrent users
  - [ ] Verify performance with 2,464 officers
  - [ ] Check real-time sync latency

---

## Testing Checklist ✅

### Functional Testing

- [ ] **Authentication**
  - [ ] Login works for all roles
  - [ ] Role-based access enforced
  - [ ] Logout works correctly

- [ ] **Transfers**
  - [ ] Create transfer
  - [ ] Initiate transfer
  - [ ] Approve transfer
  - [ ] Reject transfer
  - [ ] View transfer history
  - [ ] Filter/search transfers

- [ ] **Leave Management**
  - [ ] View leave records
  - [ ] Create leave application
  - [ ] Approve leave
  - [ ] Reject leave
  - [ ] Update leave status

- [ ] **Reporting**
  - [ ] Dashboard statistics correct
  - [ ] Reports generate correctly
  - [ ] Analytics display properly

- [ ] **AI Reshuffle**
  - [ ] Generate reshuffle
  - [ ] View recommendations
  - [ ] Apply reshuffle

### Real-time Testing

- [ ] Two users approve same transfer (conflict handling)
- [ ] Create transfer in one browser, appears in another
- [ ] Delete record in one browser, disappears in another
- [ ] 10+ concurrent users

### Performance Testing

- [ ] Dashboard loads in <2 seconds
- [ ] Transfer list loads in <1 second
- [ ] Search returns results in <500ms
- [ ] Real-time updates appear in <200ms

---

## Rollback Plan 🔄

If issues arise:

1. **Immediate Rollback**
   - [ ] Comment out ConvexProvider
   - [ ] Restore old localStorage code
   - [ ] Redeploy previous version

2. **Partial Rollback**
   - [ ] Keep some components on Convex
   - [ ] Revert problematic components to localStorage

3. **Debug Mode**
   - [ ] Enable both Convex and localStorage
   - [ ] Compare data between them
   - [ ] Identify discrepancies

---

## Success Criteria ✨

Migration is complete when:

- [x] Convex is installed and configured
- [ ] Database is seeded with all data
- [ ] All components use Convex hooks (no mock data imports)
- [ ] Real-time updates work across browsers
- [ ] No localStorage code remains (except auth tokens if needed)
- [ ] All tests pass
- [ ] Performance meets requirements
- [ ] Production deployment successful

---

## Timeline Estimate ⏱️

| Phase | Estimated Time | Status |
|-------|----------------|--------|
| Phase 0: Setup | 15 minutes | ⏭️ Next |
| Phase 1: Seeding | 10 minutes | ⏭️ |
| Phase 2: Migration | 4-6 hours | ⏭️ |
| Phase 3: Testing | 2-3 hours | ⏭️ |
| Phase 4: Optimization | 2 hours | ⏭️ |
| Phase 5: Cleanup | 1 hour | ⏭️ |
| Phase 6: Production | 1 hour | ⏭️ |
| **Total** | **~12-15 hours** | |

---

## Support & Resources 📚

- **Convex Docs**: https://docs.convex.dev
- **Convex Discord**: https://convex.dev/community
- **Your Documentation**:
  - `QUICKSTART.md` - Fast setup
  - `CONVEX_SETUP.md` - Technical details
  - `INTEGRATION_GUIDE.md` - Migration patterns
  - `ARCHITECTURE.md` - System architecture

---

## Notes 📝

Use this section to track your progress:

```
[Date: ____] Started Convex setup
[Date: ____] Database seeded successfully
[Date: ____] Migrated AuthContext
[Date: ____] Migrated RoleDashboard
[Date: ____] Migrated TransferManagement
[Date: ____] Real-time testing completed
[Date: ____] Production deployment successful
```

---

**Current Phase:** Phase 0 - Initial Setup  
**Next Action:** Run `npx convex dev`

Good luck with your migration! 🚀
