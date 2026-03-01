import { FileText, AlertCircle, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';

interface AuditOverridesComplianceProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function AuditOverridesCompliance({ onCriticalAction }: AuditOverridesComplianceProps) {
  const recentAuditLogs = [
    { timestamp: '2026-02-08 14:23:15', user: 'Dr. Raymond Omollo', role: 'PS', action: 'Approved Transfer', transferId: 'TRF-2024-1234', status: 'success' },
    { timestamp: '2026-02-08 13:45:30', user: 'Hon. Kipchumba Murkomen', role: 'CS', action: 'Overrode Rejection', transferId: 'TRF-2024-1198', status: 'override' },
    { timestamp: '2026-02-08 11:20:10', user: 'Margaret Wanjiku', role: 'SNA', action: 'Modified Permissions', targetRole: 'DC', status: 'warning' },
    { timestamp: '2026-02-08 09:15:45', user: 'Peter Kamau', role: 'RC', action: 'Initiated Transfer', transferId: 'TRF-2024-1235', status: 'success' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Success</Badge>;
      case 'override':
        return <Badge className="bg-rose-100 text-rose-700 border-rose-300">Override</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300">Warning</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit, Overrides & Compliance</h2>
          <p className="text-gray-600 text-sm mt-1">
            Immutable audit logs, override controls, and Vision 2030 compliance monitoring
          </p>
        </div>
      </div>

      {/* Audit Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Configuration</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Immutable Audit Logs</Label>
              <p className="text-xs text-gray-500 mt-0.5">Records cannot be deleted or modified after creation</p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Log All Actions</Label>
              <p className="text-xs text-gray-500 mt-0.5">Record every system interaction and data change</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Require Justification for Overrides</Label>
              <p className="text-xs text-gray-500 mt-0.5">Mandatory explanation for all S.N.A. override actions</p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Real-Time Audit Dashboard</Label>
              <p className="text-xs text-gray-500 mt-0.5">Live monitoring of all system activities</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Real-Time Audit Log */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Audit Log</h3>
            <p className="text-sm text-gray-600 mt-1">Last 24 hours of system activity</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Full Trail
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">Timestamp</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">User</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">Action</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">Details</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{log.user}</div>
                    <div className="text-xs text-gray-500">{log.role}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.transferId || log.targetRole || '—'}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">S.N.A. Override Controls</h3>
        
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
            <div>
              <p className="text-rose-800 font-semibold text-sm">Critical Authority</p>
              <p className="text-rose-700 text-xs mt-1">
                As S.N.A., you have the authority to override any action in the system. All overrides are logged immutably
                and require mandatory justification for accountability and Vision 2030 compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              onCriticalAction(
                'Override Transfer Decision',
                'You are about to override an approved or rejected transfer. This will reverse the decision and force the transfer to a new state. The original decision maker will be notified.',
                () => {
                  // Override logic
                }
              );
            }}
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Override Transfer Decision</div>
              <div className="text-xs text-gray-500">Reverse approval/rejection</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              onCriticalAction(
                'Force Complete Transfer',
                'You are about to force-complete a pending transfer, bypassing the normal approval workflow. This should only be used in exceptional circumstances.',
                () => {
                  // Force complete logic
                }
              );
            }}
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Force Complete Transfer</div>
              <div className="text-xs text-gray-500">Bypass approval workflow</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Vision 2030 Compliance */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Vision 2030 Compliance Status</h3>
        <p className="text-sm text-gray-700 mb-4">Governance reforms alignment tracking</p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-xs text-gray-600">Transparency</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-xs text-gray-600">Accountability</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-xs text-gray-600">Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
