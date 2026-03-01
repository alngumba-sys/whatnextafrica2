import { useState } from 'react';
import { Shield, Edit2, Save, X, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';

interface RoleBasedAccessControlProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

type Permission = 'view' | 'initiate' | 'approve' | 'reject' | 'modify' | 'export' | 'override';

interface RolePermissions {
  role: string;
  name: string;
  track: 'executive' | 'county' | 'secretariat';
  permissions: Record<Permission, boolean>;
}

export function RoleBasedAccessControl({ onCriticalAction }: RoleBasedAccessControlProps) {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([
    {
      role: 'CS',
      name: 'Cabinet Secretary',
      track: 'executive',
      permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true }
    },
    {
      role: 'PS',
      name: 'Principal Secretary',
      track: 'executive',
      permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: true }
    },
    {
      role: 'PAS',
      name: 'Principal Administrative Secretary',
      track: 'executive',
      permissions: { view: true, initiate: true, approve: true, reject: true, modify: true, export: true, override: false }
    },
    {
      role: 'RC',
      name: 'Regional Commissioner',
      track: 'county',
      permissions: { view: true, initiate: true, approve: true, reject: true, modify: false, export: true, override: false }
    },
    {
      role: 'CC',
      name: 'County Commissioner',
      track: 'county',
      permissions: { view: true, initiate: true, approve: true, reject: true, modify: false, export: false, override: false }
    },
    {
      role: 'DC',
      name: 'District Commissioner',
      track: 'county',
      permissions: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false }
    },
    {
      role: 'ACC',
      name: 'Assistant County Commissioner',
      track: 'county',
      permissions: { view: true, initiate: false, approve: false, reject: false, modify: false, export: false, override: false }
    },
    {
      role: 'US',
      name: 'Under Secretary',
      track: 'secretariat',
      permissions: { view: true, initiate: true, approve: false, reject: false, modify: false, export: false, override: false }
    },
    {
      role: 'AS',
      name: 'Assistant Secretary',
      track: 'secretariat',
      permissions: { view: true, initiate: false, approve: false, reject: false, modify: false, export: false, override: false }
    },
  ]);

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'county':
        return { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' };
      case 'secretariat':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
  };

  const handleTogglePermission = (roleId: string, permission: Permission) => {
    setRolePermissions(prev =>
      prev.map(rp =>
        rp.role === roleId
          ? { ...rp, permissions: { ...rp.permissions, [permission]: !rp.permissions[permission] } }
          : rp
      )
    );
  };

  const handleSaveChanges = (role: RolePermissions) => {
    onCriticalAction(
      `Modify ${role.name} Permissions`,
      `You are about to permanently modify system-wide permissions for all ${role.name} users. This will immediately affect ${role.role === 'CC' ? '47' : role.role === 'DC' ? '290+' : role.role === 'ACC' ? '1000+' : 'multiple'} officers across Kenya's administrative hierarchy.`,
      () => {
        setEditingRole(null);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role-Based Access Control Matrix</h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure granular permissions for all 9 administrative roles across both tracks
          </p>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 font-semibold">Role</th>
                <th className="text-left px-6 py-4 text-gray-700 font-semibold">Track</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">View</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Initiate</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Approve</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Reject</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Modify</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Export</th>
                <th className="text-center px-4 py-4 text-gray-700 font-semibold">Override</th>
                <th className="text-right px-6 py-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((rp) => {
                const colors = getTrackColor(rp.track);
                const isEditing = editingRole === rp.role;

                return (
                  <tr
                    key={rp.role}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${colors.bg}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{rp.name}</div>
                        <div className="text-xs text-gray-500">{rp.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={colors.badge}>
                        {rp.track.charAt(0).toUpperCase() + rp.track.slice(1)}
                      </Badge>
                    </td>
                    {(['view', 'initiate', 'approve', 'reject', 'modify', 'export', 'override'] as Permission[]).map((perm) => (
                      <td key={perm} className="px-4 py-4 text-center">
                        {isEditing ? (
                          <Switch
                            checked={rp.permissions[perm]}
                            onCheckedChange={() => handleTogglePermission(rp.role, perm)}
                            className="mx-auto"
                          />
                        ) : (
                          rp.permissions[perm] ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveChanges(rp)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRole(null)}
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRole(rp.role)}
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Definitions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">View</div>
            <div className="text-xs text-gray-600">Access to view transfers and organizational data within jurisdiction</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Initiate</div>
            <div className="text-xs text-gray-600">Create new transfer requests for officers under supervision</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Approve</div>
            <div className="text-xs text-gray-600">Approve pending transfers at their hierarchy level</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Reject</div>
            <div className="text-xs text-gray-600">Reject transfer requests with mandatory justification</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Modify</div>
            <div className="text-xs text-gray-600">Edit draft or pending transfers before final approval</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Export</div>
            <div className="text-xs text-gray-600">Download reports, matrices, and data exports</div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">Override</div>
            <div className="text-xs text-gray-600">Bypass normal approval chains in exceptional circumstances</div>
          </div>
        </div>
      </div>
    </div>
  );
}