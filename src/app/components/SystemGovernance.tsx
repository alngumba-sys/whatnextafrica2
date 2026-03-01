import { useState } from 'react';
import { Shield, Lock, AlertTriangle, Download, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RoleBasedAccessControl } from '@/app/components/governance/RoleBasedAccessControl';
import { WorkflowApprovalChains } from '@/app/components/governance/WorkflowApprovalChains';
import { HierarchyJurisdictions } from '@/app/components/governance/HierarchyJurisdictions';
import { MasterDataRecords } from '@/app/components/governance/MasterDataRecords';
import { AuditOverridesCompliance } from '@/app/components/governance/AuditOverridesCompliance';
import { AIReshuffleControls } from '@/app/components/governance/AIReshuffleControls';
import { SystemNotificationsSettings } from '@/app/components/governance/SystemNotificationsSettings';
import { ImpactPreviewSidebar } from '@/app/components/governance/ImpactPreviewSidebar';
import { UserManagement } from '@/app/components/governance/UserManagement';
import { toast } from 'sonner';

interface SystemGovernanceProps {
  onClose: () => void;
}

export function SystemGovernance({ onClose }: SystemGovernanceProps) {
  const [activeTab, setActiveTab] = useState('rbac');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);
  const [justification, setJustification] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);

  const handleCriticalAction = (title: string, description: string, action: () => void) => {
    setConfirmAction({ title, description, action });
    setShowConfirmDialog(true);
    setJustification('');
  };

  const handleConfirm = () => {
    if (confirmAction && justification.trim()) {
      confirmAction.action();
      setShowConfirmDialog(false);
      setJustification('');
      setConfirmAction(null);
      toast.success('Action completed and logged in audit trail');
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollLeft = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;

    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < maxScroll - 5);
  };

  const handleLeftArrowClick = () => {
    if (scrollContainerRef) {
      scrollContainerRef.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleRightArrowClick = () => {
    if (scrollContainerRef) {
      scrollContainerRef.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const exportPermissionsMatrix = () => {
    const roles = [
      { role: 'CS', name: 'Cabinet Secretary', track: 'executive', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true } },
      { role: 'PS', name: 'Principal Secretary', track: 'executive', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true } },
      { role: 'PAS', name: 'Prin. Admin. Secretary', track: 'executive', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true } },
      { role: 'SNA', name: 'Secretary National Admin.', track: 'executive', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true } },
      { role: 'RC', name: 'Regional Commissioner', track: 'county', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false } },
      { role: 'CC', name: 'County Commissioner', track: 'county', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false } },
      { role: 'DC', name: 'District Commissioner', track: 'county', permissions: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false } },
      { role: 'ACC', name: 'Asst. County Commissioner', track: 'county', permissions: { view: true, initiate: false, approve: false, reject: false, modify: false, export: false, override: false } },
      { role: 'US', name: 'Under Secretary', track: 'secretariat', permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false } },
      { role: 'AS', name: 'Assistant Secretary', track: 'secretariat', permissions: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false } },
    ];

    const csvContent = [
      ['Role', 'Name', 'Track', 'View', 'Initiate', 'Approve', 'Reject', 'Modify', 'Export', 'Override'],
      ...roles.map(r => [
        r.role,
        r.name,
        r.track.charAt(0).toUpperCase() + r.track.slice(1),
        r.permissions.view ? 'Yes' : 'No',
        r.permissions.initiate ? 'Yes' : 'No',
        r.permissions.approve ? 'Yes' : 'No',
        r.permissions.reject ? 'Yes' : 'No',
        r.permissions.modify ? 'Yes' : 'No',
        r.permissions.export ? 'Yes' : 'No',
        r.permissions.override ? 'Yes' : 'No',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permissions-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Permissions matrix exported successfully');
  };

  const exportAuditReport = () => {
    const auditData = {
      reportGenerated: new Date().toISOString(),
      generatedBy: 'Secretary National Administrator',
      reportPeriod: 'Last 30 Days',
      summary: {
        totalActions: 1247,
        transfersInitiated: 342,
        transfersApproved: 298,
        transfersRejected: 23,
        overridesExecuted: 12,
        permissionChanges: 8,
        systemConfigChanges: 5
      },
      recentActions: [
        { timestamp: '2026-02-08 14:23:15', user: 'Dr. Raymond Omollo', role: 'PS', action: 'Approved Transfer', transferId: 'TRF-2024-1234', status: 'Success' },
        { timestamp: '2026-02-08 13:45:30', user: 'Hon. Kipchumba Murkomen', role: 'CS', action: 'Overrode Rejection', transferId: 'TRF-2024-1198', status: 'Override' },
        { timestamp: '2026-02-08 11:20:10', user: 'Margaret Wanjiku', role: 'SNA', action: 'Modified Permissions', targetRole: 'DC', status: 'Warning' },
        { timestamp: '2026-02-08 09:15:45', user: 'Peter Kamau', role: 'RC', action: 'Initiated Transfer', transferId: 'TRF-2024-1235', status: 'Success' },
      ],
      complianceStatus: {
        vision2030Alignment: '100%',
        transparencyScore: '100%',
        accountabilityScore: '100%',
        efficiencyScore: '98%'
      }
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Audit report exported successfully');
  };

  const exportConfigurationBackup = () => {
    const configData = {
      backupGenerated: new Date().toISOString(),
      platformVersion: '2.0.0',
      backupType: 'Full System Configuration',
      rolePermissions: {
        CS: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true },
        PS: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true },
        PAS: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true },
        SNA: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true },
        RC: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false },
        CC: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false },
        DC: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false },
        ACC: { view: true, initiate: false, approve: false, reject: false, modify: false, export: false, override: false },
        US: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false },
        AS: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false },
      },
      approvalWorkflows: [
        { id: '1', name: 'County Commissioner Initiated Transfer', initiatorRole: 'CC', chain: ['CC', 'RC', 'PAS', 'PS'], requiresAllApprovals: true },
        { id: '2', name: 'District Commissioner Initiated Transfer', initiatorRole: 'DC', chain: ['DC', 'CC', 'RC'], requiresAllApprovals: true },
        { id: '3', name: 'S.N.A. Draft Transfer', initiatorRole: 'SNA', chain: ['SNA', 'PAS', 'PS', 'CS'], requiresAllApprovals: true },
        { id: '4', name: 'Cross-Ministry Secretariat Transfer', initiatorRole: 'US', chain: ['US', 'SNA', 'PAS', 'PS'], requiresAllApprovals: true }
      ],
      systemSettings: {
        minimumNoticePeriod: 14,
        autoCompleteOnEffectiveDate: true,
        allowBackdatedTransfers: false,
        sendEmailNotifications: true,
        immutableAuditLogs: true,
        requireJustificationForOverrides: true
      },
      aiParameters: {
        tenureWeight: 80,
        performanceWeight: 60,
        regionalBalanceWeight: 75,
        diversityWeight: 55,
        minimumTenureRequired: true,
        homeCountyRestriction: true
      },
      hierarchyConfiguration: {
        totalOfficers: 2464,
        countyTrackOfficers: 1392,
        secretariatTrackOfficers: 1063,
        executiveLevelOfficers: 9
      }
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-config-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Configuration backup exported successfully');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50">
      {/* Kenya Flag Subtle Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-1/3 bg-black" />
        <div className="h-1/3 bg-red-700" />
        <div className="h-1/3 bg-green-700" />
      </div>

      <div className="relative h-full flex flex-col">
        {/* Executive Header */}
        <div className="border-b border-rose-200 bg-white shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg shadow-md">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Secretary National Administrator
                    </h1>
                    <Badge className="bg-rose-100 text-rose-700 border-rose-300 text-xs font-semibold">
                      ABSOLUTE CUSTODIAN
                    </Badge>
                  </div>
                  <p className="text-rose-600 mt-1 text-sm font-medium">
                    Supreme Authority — Kenya Government Administrative Hierarchy Management Platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportPermissionsMatrix}
                  className="bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Matrix
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-rose-50 border-t border-rose-200 px-8 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <p className="text-rose-800 text-sm font-medium">
                <strong>Critical Access:</strong> All changes affect national administration integrity.
                Actions are logged immutably and require mandatory justification.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Tabs Content */}
          <div className="flex-1 overflow-auto bg-slate-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                  <button
                    onClick={handleLeftArrowClick}
                    className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-white to-transparent flex items-center justify-start pl-2 hover:from-rose-50 transition-colors group"
                    aria-label="Scroll left"
                  >
                    <div className="bg-rose-500 text-white rounded-full p-1.5 shadow-lg animate-pulse-subtle group-hover:bg-rose-600 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                  </button>
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                  <button
                    onClick={handleRightArrowClick}
                    className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-2 hover:from-rose-50 transition-colors group"
                    aria-label="Scroll right"
                  >
                    <div className="bg-rose-500 text-white rounded-full p-1.5 shadow-lg animate-pulse-subtle group-hover:bg-rose-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                )}

                <div
                  className="overflow-x-auto overflow-y-hidden scroll-smooth"
                  onScroll={handleScroll}
                  ref={setScrollContainerRef}
                >
                  <TabsList className="bg-transparent border-none h-auto p-0 w-max min-w-full justify-start">
                    <TabsTrigger
                      value="rbac"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      Role-Based Access Control
                    </TabsTrigger>
                    <TabsTrigger
                      value="workflow"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      Workflow & Approval Chains
                    </TabsTrigger>
                    <TabsTrigger
                      value="hierarchy"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      Hierarchy & Jurisdictions
                    </TabsTrigger>
                    <TabsTrigger
                      value="masterdata"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      Master Data & Officer Records
                    </TabsTrigger>
                    <TabsTrigger
                      value="audit"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      Audit, Overrides & Compliance
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      AI Reshuffle Controls
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      System Notifications & Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="users"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      User Management
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-8">
                <TabsContent value="rbac" className="mt-0">
                  <RoleBasedAccessControl onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="workflow" className="mt-0">
                  <WorkflowApprovalChains onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="hierarchy" className="mt-0">
                  <HierarchyJurisdictions onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="masterdata" className="mt-0">
                  <MasterDataRecords onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="audit" className="mt-0">
                  <AuditOverridesCompliance onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="ai" className="mt-0">
                  <AIReshuffleControls onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <SystemNotificationsSettings onCriticalAction={handleCriticalAction} />
                </TabsContent>
                <TabsContent value="users" className="mt-0">
                  <UserManagement onCriticalAction={handleCriticalAction} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Impact Preview Sidebar */}
          <ImpactPreviewSidebar />
        </div>
      </div>

      {/* Critical Action Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Lock className="w-6 h-6 text-rose-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Requires S.N.A. Override
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-base">
              {confirmAction?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 my-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-rose-800 font-semibold text-sm">
                  This action affects national administration integrity
                </p>
                <p className="text-rose-700 text-sm mt-1">
                  This change will be logged immutably in the audit trail and attributed to your S.N.A. credentials.
                  Mandatory justification required.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification" className="text-gray-700 font-medium">
              Mandatory Justification *
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Enter detailed justification for this S.N.A. override action..."
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[120px] focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!justification.trim()}
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm S.N.A. Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}