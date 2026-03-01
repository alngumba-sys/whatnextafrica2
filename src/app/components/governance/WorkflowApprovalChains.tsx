import { useState } from 'react';
import { GitBranch, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';

interface WorkflowApprovalChainsProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

interface ApprovalChain {
  id: string;
  name: string;
  initiatorRole: string;
  chain: string[];
  requiresAllApprovals: boolean;
  crossCountyLock: boolean;
  crossMinistryLock: boolean;
  selfApprovalBlocked: boolean;
  mandatoryJustification: boolean;
}

export function WorkflowApprovalChains({ onCriticalAction }: WorkflowApprovalChainsProps) {
  const [workflows, setWorkflows] = useState<ApprovalChain[]>([
    {
      id: '1',
      name: 'County Commissioner Initiated Transfer',
      initiatorRole: 'CC',
      chain: ['CC', 'RC', 'PAS', 'PS'],
      requiresAllApprovals: true,
      crossCountyLock: true,
      crossMinistryLock: false,
      selfApprovalBlocked: true,
      mandatoryJustification: true
    },
    {
      id: '2',
      name: 'District Commissioner Initiated Transfer',
      initiatorRole: 'DC',
      chain: ['DC', 'CC', 'RC'],
      requiresAllApprovals: true,
      crossCountyLock: true,
      crossMinistryLock: false,
      selfApprovalBlocked: true,
      mandatoryJustification: true
    },
    {
      id: '3',
      name: 'S.N.A. Draft Transfer',
      initiatorRole: 'SNA',
      chain: ['SNA', 'PAS', 'PS', 'CS'],
      requiresAllApprovals: true,
      crossCountyLock: false,
      crossMinistryLock: false,
      selfApprovalBlocked: true,
      mandatoryJustification: true
    },
    {
      id: '4',
      name: 'Cross-Ministry Secretariat Transfer',
      initiatorRole: 'US',
      chain: ['US', 'SNA', 'PAS', 'PS'],
      requiresAllApprovals: true,
      crossCountyLock: false,
      crossMinistryLock: true,
      selfApprovalBlocked: true,
      mandatoryJustification: true
    }
  ]);

  const handleToggleWorkflowSetting = (workflowId: string, setting: keyof ApprovalChain, value: boolean) => {
    onCriticalAction(
      'Modify Approval Workflow',
      `You are about to change a critical workflow setting. This will immediately affect all pending and future transfers using this approval chain.`,
      () => {
        setWorkflows(prev =>
          prev.map(w =>
            w.id === workflowId ? { ...w, [setting]: value } : w
          )
        );
      }
    );
  };

  const getRoleBadgeColor = (role: string) => {
    if (['CS', 'PS', 'PAS'].includes(role)) return 'bg-rose-100 text-rose-700 border-rose-300';
    if (['RC', 'CC', 'DC', 'ACC'].includes(role)) return 'bg-violet-100 text-violet-700 border-violet-300';
    return 'bg-amber-100 text-amber-700 border-amber-300';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <GitBranch className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow & Approval Chains</h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure multi-level approval workflows and separation-of-duties rules
          </p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{workflow.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Initiator:</span>
                  <Badge className={getRoleBadgeColor(workflow.initiatorRole)}>
                    {workflow.initiatorRole}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Approval Chain Visualization */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-600 mb-3 font-semibold">APPROVAL CHAIN</div>
              <div className="flex items-center gap-2 flex-wrap">
                {workflow.chain.map((role, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge className={`${getRoleBadgeColor(role)} px-3 py-1`}>
                      {role}
                    </Badge>
                    {index < workflow.chain.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">All Approvals Required</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Complete chain must approve</p>
                </div>
                <Switch
                  checked={workflow.requiresAllApprovals}
                  onCheckedChange={(checked) =>
                    handleToggleWorkflowSetting(workflow.id, 'requiresAllApprovals', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Block Self-Approval</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Initiator cannot approve own transfer</p>
                </div>
                <Switch
                  checked={workflow.selfApprovalBlocked}
                  onCheckedChange={(checked) =>
                    handleToggleWorkflowSetting(workflow.id, 'selfApprovalBlocked', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Cross-County Lock</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Requires RC approval for county changes</p>
                </div>
                <Switch
                  checked={workflow.crossCountyLock}
                  onCheckedChange={(checked) =>
                    handleToggleWorkflowSetting(workflow.id, 'crossCountyLock', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Cross-Ministry Lock</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Requires PS approval for ministry changes</p>
                </div>
                <Switch
                  checked={workflow.crossMinistryLock}
                  onCheckedChange={(checked) =>
                    handleToggleWorkflowSetting(workflow.id, 'crossMinistryLock', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 col-span-2 border border-gray-200">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Mandatory Justification</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Transfer reason required at initiation</p>
                </div>
                <Switch
                  checked={workflow.mandatoryJustification}
                  onCheckedChange={(checked) =>
                    handleToggleWorkflowSetting(workflow.id, 'mandatoryJustification', checked)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Workflow */}
      <Button
        variant="outline"
        className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => {
          onCriticalAction(
            'Create New Approval Workflow',
            'You are about to create a new system-wide approval workflow. This will become immediately available for all officers with the designated initiator role.',
            () => {
              // Add workflow logic
            }
          );
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Approval Workflow
      </Button>
    </div>
  );
}
