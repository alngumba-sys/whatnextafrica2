import { Bell } from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';

interface SystemNotificationsSettingsProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function SystemNotificationsSettings({ onCriticalAction }: SystemNotificationsSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Notifications & Settings</h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure notification triggers, effective date rules, and system-wide toggles
          </p>
        </div>
      </div>

      {/* Notification Triggers */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Triggers</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Transfer Initiated</Label>
              <p className="text-xs text-gray-500 mt-0.5">Notify approvers when new transfer is initiated</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Transfer Approved</Label>
              <p className="text-xs text-gray-500 mt-0.5">Notify initiator and affected officer</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Transfer Rejected</Label>
              <p className="text-xs text-gray-500 mt-0.5">Notify initiator with rejection reason</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Effective Date Approaching</Label>
              <p className="text-xs text-gray-500 mt-0.5">Remind officers 7 days before transfer effective date</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Leave Request Submitted</Label>
              <p className="text-xs text-gray-500 mt-0.5">Notify supervisor of new leave request</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Pending Actions Reminder</Label>
              <p className="text-xs text-gray-500 mt-0.5">Daily digest of pending approvals</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Effective Date Rules */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Effective Date Rules</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Label className="text-sm text-gray-700 font-medium mb-3 block">
              Minimum Notice Period (Days)
            </Label>
            <Input
              type="number"
              defaultValue={14}
              className="bg-white border-gray-300 text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum days between transfer approval and effective date
            </p>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Auto-Complete on Effective Date</Label>
              <p className="text-xs text-gray-500 mt-0.5">Automatically mark transfer as completed when date is reached</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Allow Backdated Transfers</Label>
              <p className="text-xs text-gray-500 mt-0.5">Permit effective dates in the past (S.N.A. override required)</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* System-Wide Toggles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System-Wide Toggles</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Allow New Transfer Initiation</Label>
              <p className="text-xs text-gray-500 mt-0.5">Globally enable/disable new transfer creation</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Allow Leave Requests</Label>
              <p className="text-xs text-gray-500 mt-0.5">Globally enable/disable leave request submission</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Read-Only Mode</Label>
              <p className="text-xs text-gray-500 mt-0.5">Prevent all data modifications (view-only access for all users)</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Maintenance Mode</Label>
              <p className="text-xs text-gray-500 mt-0.5">Display maintenance message to all users except S.N.A.</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Label className="text-sm text-gray-700 font-medium mb-3 block">
              System Email Address
            </Label>
            <Input
              type="email"
              defaultValue="noreply@interior.go.ke"
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Send Email Notifications</Label>
              <p className="text-xs text-gray-500 mt-0.5">Send emails in addition to in-app notifications</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">CC S.N.A. on All Transfers</Label>
              <p className="text-xs text-gray-500 mt-0.5">Copy S.N.A. on all transfer notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
