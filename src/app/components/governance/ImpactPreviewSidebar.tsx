import { TrendingUp, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

export function ImpactPreviewSidebar() {
  const sampleRoles = [
    {
      role: 'County Commissioner',
      affected: 47,
      canView: true,
      canInitiate: true,
      canApprove: true,
      track: 'county'
    },
    {
      role: 'Under Secretary',
      affected: 45,
      canView: true,
      canInitiate: true,
      canApprove: false,
      track: 'secretariat'
    },
    {
      role: 'District Commissioner',
      affected: 290,
      canView: true,
      canInitiate: true,
      canApprove: false,
      track: 'county'
    }
  ];

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
    <div className="w-96 border-l border-gray-200 bg-white flex flex-col h-full shadow-sm">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 bg-rose-50">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-rose-600" />
          <h3 className="text-lg font-semibold text-gray-900">Impact Preview</h3>
        </div>
        <p className="text-xs text-gray-600">
          Real-time effects of current configuration
        </p>
      </div>

      {/* Impact Statistics */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">System-Wide Impact</div>
          <div className="space-y-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Total Officers</span>
                <span className="text-sm font-semibold text-gray-900">2,464</span>
              </div>
              <div className="text-xs text-gray-500">Affected by current settings</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Active Workflows</span>
                <span className="text-sm font-semibold text-gray-900">4</span>
              </div>
              <div className="text-xs text-gray-500">Approval chains configured</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Pending Approvals</span>
                <span className="text-sm font-semibold text-gray-900">23</span>
              </div>
              <div className="text-xs text-gray-500">Awaiting action</div>
            </div>
          </div>
        </div>

        {/* Sample Role Impact */}
        <div>
          <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Sample Role Permissions</div>
          <div className="space-y-3">
            {sampleRoles.map((role, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-900">{role.role}</div>
                  <Badge className={
                    role.track === 'county'
                      ? 'bg-violet-100 text-violet-700 border-violet-300'
                      : 'bg-amber-100 text-amber-700 border-amber-300'
                  }>
                    {role.affected} officers
                  </Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {role.canView && (
                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                      View
                    </Badge>
                  )}
                  {role.canInitiate && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                      Initiate
                    </Badge>
                  )}
                  {role.canApprove && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                      Approve
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Changes */}
        <div>
          <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Recent Changes</div>
          <div className="space-y-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-blue-900 font-medium">No recent changes</div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    Configuration is stable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div>
          <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Compliance Status</div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-green-800">Fully Compliant</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Vision 2030</span>
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Audit Trail</span>
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Separation of Duties</span>
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Export Actions */}
      <div className="p-6 border-t border-gray-200 space-y-2 bg-gray-50">
        <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Quick Exports</div>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
          onClick={exportPermissionsMatrix}
        >
          <Download className="w-4 h-4 mr-2" />
          Permissions Matrix
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
          onClick={exportAuditReport}
        >
          <Download className="w-4 h-4 mr-2" />
          Audit Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
          onClick={exportConfigurationBackup}
        >
          <Download className="w-4 h-4 mr-2" />
          Configuration Backup
        </Button>
      </div>
    </div>
  );
}