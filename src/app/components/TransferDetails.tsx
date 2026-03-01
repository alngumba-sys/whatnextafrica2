import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { transfers as initialTransfers, type Transfer, type TransferStatus } from '@/data/transfersAndLeave';
import { canApproveTransfers, canInitiateTransfers, users } from '@/data/users';
import { toast } from 'sonner';

interface TransferDetailsProps {
  transferId: string;
  onBack: () => void;
  onUpdate: (updatedTransfer: Transfer) => void;
  transfers?: Transfer[];
}

export function TransferDetails({ transferId, onBack, onUpdate, transfers: providedTransfers }: TransferDetailsProps) {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>(providedTransfers || initialTransfers);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const selectedTransfer = transfers.find(t => t.id === transferId);

  if (!user || !selectedTransfer) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transfer Management
        </Button>
        <Card className="p-8 text-center">
          <p className="text-gray-600">Transfer not found</p>
        </Card>
      </div>
    );
  }

  const canApprove = canApproveTransfers(user.role);
  const canInitiate = canInitiateTransfers(user.role);

  const handleApproveTransfer = (transfer: Transfer) => {
    const updated = {
      ...transfer,
      status: 'approved' as TransferStatus,
      approvedBy: user.id,
      approvedByName: user.name,
      approvalDate: new Date().toISOString().split('T')[0],
    };
    onUpdate(updated);
    toast.success(`Transfer approved for ${transfer.officerName}`);
    onBack();
  };

  const handleRejectTransfer = (transfer: Transfer, reason: string) => {
    const updated = {
      ...transfer,
      status: 'rejected' as TransferStatus,
      rejectedBy: user.id,
      rejectedByName: user.name,
      rejectionDate: new Date().toISOString().split('T')[0],
      rejectionReason: reason,
    };
    onUpdate(updated);
    toast.error(`Transfer rejected for ${transfer.officerName}`);
    onBack();
  };

  const handleInitiateDraft = (transfer: Transfer) => {
    const updated = {
      ...transfer,
      status: 'pending_approval' as TransferStatus,
      initiatedBy: user.id,
      initiatedByName: user.name,
      initiatedDate: new Date().toISOString().split('T')[0],
    };
    onUpdate(updated);
    toast.success('Transfer initiated and sent for approval');
    onBack();
  };

  const getStatusBadge = (status: TransferStatus) => {
    const badges: Record<TransferStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; text: string }> = {
      drafted: { variant: 'outline', text: 'Drafted' },
      initiated: { variant: 'secondary', text: 'Initiated' },
      pending_approval: { variant: 'secondary', text: 'Pending Approval' },
      approved: { variant: 'default', text: 'Approved' },
      rejected: { variant: 'destructive', text: 'Rejected' },
      completed: { variant: 'outline', text: 'Completed' },
    };
    const badge = badges[status];
    return <Badge variant={badge.variant} className="text-sm px-3 py-1">{badge.text}</Badge>;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-4">
        <Button variant="outline" onClick={onBack} className="mb-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transfer Management
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transfer Details</h2>
            <p className="text-sm text-gray-600 mt-1">Complete information about the transfer request</p>
          </div>
          {getStatusBadge(selectedTransfer.status)}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Officer Profile */}
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 p-2.5 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">{selectedTransfer.officerName}</div>
                <div className="text-sm text-gray-600">{selectedTransfer.officerRole}</div>
              </div>
            </div>
            
            {/* Officer Stats */}
            {(() => {
              const officer = users.find(u => u.name === selectedTransfer.officerName);
              if (officer) {
                const age = officer.dateOfBirth 
                  ? new Date().getFullYear() - new Date(officer.dateOfBirth).getFullYear()
                  : null;
                
                return (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {officer.employeeNumber && (
                      <div className="bg-white p-2.5 rounded">
                        <div className="text-xs text-gray-500 mb-0.5">Employee Number</div>
                        <div className="font-semibold text-sm text-gray-900">{officer.employeeNumber}</div>
                      </div>
                    )}
                    {officer.gender && (
                      <div className="bg-white p-2.5 rounded">
                        <div className="text-xs text-gray-500 mb-0.5">Gender</div>
                        <div className="font-semibold text-sm text-gray-900">{officer.gender}</div>
                      </div>
                    )}
                    {age && (
                      <div className="bg-white p-2.5 rounded">
                        <div className="text-xs text-gray-500 mb-0.5">Age</div>
                        <div className="font-semibold text-sm text-gray-900">{age} years</div>
                      </div>
                    )}
                    {officer.yearsOfService && (
                      <div className="bg-white p-2.5 rounded">
                        <div className="text-xs text-gray-500 mb-0.5">Years of Service</div>
                        <div className="font-semibold text-sm text-gray-900">{officer.yearsOfService} years</div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Transfer Route */}
          <Card className="p-4 bg-gray-50">
            <div className="text-xs font-medium text-gray-600 mb-3">Transfer Route</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-500 mb-1">From</div>
                <div className="text-xl font-bold text-gray-900">{selectedTransfer.fromLocation}</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-500 mb-1">To</div>
                <div className="text-xl font-bold text-green-600">{selectedTransfer.toLocation}</div>
              </div>
            </div>
          </Card>

          {/* Date & Education */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="text-xs font-medium text-gray-600 mb-1">Effective Date</div>
              <div className="text-base font-bold text-gray-900">{selectedTransfer.effectiveDate}</div>
            </Card>

            {(() => {
              const officer = users.find(u => u.name === selectedTransfer.officerName);
              return officer?.education ? (
                <Card className="p-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Education</div>
                  <div className="text-base font-bold text-gray-900">{officer.education}</div>
                </Card>
              ) : null;
            })()}
          </div>

          {/* Reason */}
          <Card className="p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">Reason for Transfer</div>
            <div className="text-sm text-gray-900">{selectedTransfer.reason}</div>
          </Card>

          {selectedTransfer.notes && (
            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="text-xs font-medium text-blue-900 mb-2">Additional Notes</div>
              <div className="text-sm text-blue-800">{selectedTransfer.notes}</div>
            </Card>
          )}

          {/* Current Posting */}
          {(() => {
            const officer = users.find(u => u.name === selectedTransfer.officerName);
            return officer?.currentStation ? (
              <Card className="p-3 bg-green-50 border-green-200">
                <div className="text-xs font-medium text-green-900 mb-1">Current Posting</div>
                <div className="text-base font-bold text-green-800">{officer.currentStation}</div>
                {officer.dateOfJoining && (
                  <div className="text-xs text-green-700 mt-1">
                    Joined: {new Date(officer.dateOfJoining).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                )}
              </Card>
            ) : null;
          })()}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Transfer History */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600" />
              <h4 className="text-base font-bold text-gray-900">Transfer History</h4>
            </div>
            <div className="space-y-2">
              {(() => {
                const officerTransfers = transfers.filter(
                  t => t.officerName === selectedTransfer.officerName && t.id !== selectedTransfer.id
                ).sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

                if (officerTransfers.length === 0) {
                  return (
                    <div className="text-sm text-gray-500 py-3 text-center">No previous transfers found.</div>
                  );
                }

                return officerTransfers.slice(0, 2).map((transfer, idx) => (
                  <div key={transfer.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                          <span className="font-semibold">{transfer.fromLocation}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-semibold">{transfer.toLocation}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1.5">
                          {new Date(transfer.effectiveDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Reason:</span> {transfer.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            {(() => {
              const totalTransfers = transfers.filter(
                t => t.officerName === selectedTransfer.officerName && t.id !== selectedTransfer.id
              ).length;
              return totalTransfers > 2 ? (
                <div className="text-xs text-gray-500 mt-2 text-center py-1.5 bg-gray-50 rounded">
                  + {totalTransfers - 2} more transfers
                </div>
              ) : null;
            })()}
          </Card>

          {/* Approval Workflow */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-gray-600" />
              <h4 className="text-base font-bold text-gray-900">Approval Workflow</h4>
            </div>
            <div className="space-y-3">
              {selectedTransfer.draftedByName && (() => {
                const drafter = users.find(u => u.name === selectedTransfer.draftedByName);
                return (
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Drafted</div>
                      <div className="text-xs text-gray-600">
                        {selectedTransfer.draftedByName}
                        {drafter && <span className="text-blue-600 font-medium"> ({drafter.role})</span>}
                      </div>
                      <div className="text-xs text-gray-500">{selectedTransfer.draftedDate}</div>
                    </div>
                  </div>
                );
              })()}

              {selectedTransfer.initiatedByName && (() => {
                const initiator = users.find(u => u.name === selectedTransfer.initiatedByName);
                return (
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Initiated</div>
                      <div className="text-xs text-gray-600">
                        {selectedTransfer.initiatedByName}
                        {initiator && <span className="text-yellow-600 font-medium"> ({initiator.role})</span>}
                      </div>
                      <div className="text-xs text-gray-500">{selectedTransfer.initiatedDate}</div>
                    </div>
                  </div>
                );
              })()}

              {selectedTransfer.approvedByName && (() => {
                const approver = users.find(u => u.name === selectedTransfer.approvedByName);
                return (
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Approved</div>
                      <div className="text-xs text-gray-600">
                        {selectedTransfer.approvedByName}
                        {approver && <span className="text-green-600 font-medium"> ({approver.role})</span>}
                      </div>
                      <div className="text-xs text-gray-500">{selectedTransfer.approvalDate}</div>
                    </div>
                  </div>
                );
              })()}

              {selectedTransfer.rejectedByName && (() => {
                const rejector = users.find(u => u.name === selectedTransfer.rejectedByName);
                return (
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Rejected</div>
                      <div className="text-xs text-gray-600">
                        {selectedTransfer.rejectedByName}
                        {rejector && <span className="text-red-600 font-medium"> ({rejector.role})</span>}
                      </div>
                      <div className="text-xs text-gray-500">{selectedTransfer.rejectionDate}</div>
                      {selectedTransfer.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1.5 p-2 bg-red-50 rounded">{selectedTransfer.rejectionReason}</div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            {canApprove && selectedTransfer.status === 'pending_approval' && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="w-full"
                  onClick={() => handleApproveTransfer(selectedTransfer)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Transfer
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowRejectModal(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Transfer
                </Button>
              </div>
            )}

            {canInitiate && selectedTransfer.status === 'drafted' && (
              <Button
                className="w-full"
                onClick={() => handleInitiateDraft(selectedTransfer)}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Initiate Transfer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Transfer Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>
              Enter the reason for rejecting the transfer request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="rejectionReason">Reason</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="h-20"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (rejectionReason.trim()) {
                  handleRejectTransfer(selectedTransfer, rejectionReason);
                  setShowRejectModal(false);
                  setRejectionReason('');
                }
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}