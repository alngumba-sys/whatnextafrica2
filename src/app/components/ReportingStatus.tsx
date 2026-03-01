import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { transfers as initialTransfers, Transfer, type ReportingStatus } from '@/data/transfersAndLeave';
import { canManageReporting } from '@/data/users';
import { toast } from 'sonner';

export function ReportingStatusManagement() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  if (!user) return null;

  const canManage = canManageReporting(user.role);
  const isPAS = user.role === 'PAS';
  const isACC = user.role === 'ACC';

  // Filter approved transfers that need reporting tracking
  const approvedTransfers = transfers.filter(t => t.status === 'approved');
  const reportedTransfers = approvedTransfers.filter(t => t.reportingStatus === 'reported');
  const notReportedTransfers = approvedTransfers.filter(t => t.reportingStatus === 'not_reported');
  const pendingReleaseTransfers = approvedTransfers.filter(t => t.reportingStatus === 'pending_release');
  const releasedTransfers = approvedTransfers.filter(t => t.reportingStatus === 'released');

  const getReportingStatusBadge = (status?: ReportingStatus) => {
    if (!status) return null;
    
    const config: Record<ReportingStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; text: string; icon: JSX.Element }> = {
      not_reported: { 
        variant: 'destructive', 
        text: 'Not Reported', 
        icon: <XCircle className="w-3 h-3" />
      },
      reported: { 
        variant: 'default', 
        text: 'Reported', 
        icon: <CheckCircle2 className="w-3 h-3" />
      },
      pending_release: { 
        variant: 'secondary', 
        text: 'Pending Release', 
        icon: <Clock className="w-3 h-3" />
      },
      released: { 
        variant: 'outline', 
        text: 'Released', 
        icon: <CheckCircle2 className="w-3 h-3" />
      },
    };
    
    const badge = config[status];
    return (
      <Badge variant={badge.variant} className="flex items-center gap-1">
        {badge.icon}
        {badge.text}
      </Badge>
    );
  };

  const handleMarkAsReported = (transfer: Transfer) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          reportingStatus: 'reported' as ReportingStatus,
          reportedDate: new Date().toISOString().split('T')[0],
        };
      }
      return t;
    });
    setTransfers(updated);
    toast.success(`Marked ${transfer.officerName} as reported`);
    setIsDialogOpen(false);
  };

  const handleDisputeReporting = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setDisputeReason('');
    setIsDisputeDialogOpen(true);
  };

  const handleSubmitDispute = () => {
    if (!selectedTransfer || !disputeReason.trim()) {
      toast.error('Please provide a reason for the dispute');
      return;
    }

    // In a real system, this would create a dispute record
    toast.warning(`Dispute filed for ${selectedTransfer.officerName}: ${disputeReason}`);
    setIsDisputeDialogOpen(false);
    setDisputeReason('');
  };

  const handleRequestRelease = (transfer: Transfer) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          reportingStatus: 'pending_release' as ReportingStatus,
        };
      }
      return t;
    });
    setTransfers(updated);
    toast.info(`Release requested for ${transfer.officerName}`);
    setIsDialogOpen(false);
  };

  const handleReleaseOfficer = (transfer: Transfer) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          reportingStatus: 'released' as ReportingStatus,
          releasedBy: user.id,
          releasedByName: user.name,
          releasedDate: new Date().toISOString().split('T')[0],
        };
      }
      return t;
    });
    setTransfers(updated);
    toast.success(`${transfer.officerName} has been released`);
    setIsReleaseDialogOpen(false);
    setIsDialogOpen(false);
  };

  const TransferReportingCard = ({ transfer }: { transfer: Transfer }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{transfer.officerName}</div>
              <div className="text-sm text-gray-600">{transfer.officerRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{transfer.fromLocation}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-900">{transfer.toLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Effective: {transfer.effectiveDate}</span>
            </div>
            {transfer.approvedByName && (
              <span>Approved by: {transfer.approvedByName}</span>
            )}
          </div>

          {transfer.reportedDate && (
            <div className="mt-2 text-xs text-green-600">
              Reported on: {transfer.reportedDate}
            </div>
          )}

          {transfer.releasedByName && (
            <div className="mt-2 text-xs text-gray-600">
              Released by: {transfer.releasedByName} on {transfer.releasedDate}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {getReportingStatusBadge(transfer.reportingStatus)}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTransfer(transfer);
              setIsDialogOpen(true);
            }}
          >
            Manage
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reporting Status</h2>
        <p className="text-gray-600">Track officer reporting after transfers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Not Reported</div>
              <div className="text-2xl font-bold text-gray-900">{notReportedTransfers.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Reported</div>
              <div className="text-2xl font-bold text-gray-900">{reportedTransfers.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pending Release</div>
              <div className="text-2xl font-bold text-gray-900">{pendingReleaseTransfers.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-gray-500">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Released</div>
              <div className="text-2xl font-bold text-gray-900">{releasedTransfers.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {isPAS && notReportedTransfers.length > 0 && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Officers Not Yet Reported</h4>
              <p className="text-sm text-red-800">
                {notReportedTransfers.length} officer{notReportedTransfers.length !== 1 ? 's have' : ' has'} not reported to their new stations.
              </p>
            </div>
          </div>
        </Card>
      )}

      {isACC && pendingReleaseTransfers.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Release Requests Pending</h4>
              <p className="text-sm text-blue-800">
                {pendingReleaseTransfers.length} officer{pendingReleaseTransfers.length !== 1 ? 's are' : ' is'} awaiting release approval.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Transfer Lists */}
      <div className="space-y-6">
        {/* Not Reported */}
        {notReportedTransfers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Not Yet Reported
            </h3>
            <div className="space-y-3">
              {notReportedTransfers.map(transfer => (
                <TransferReportingCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          </div>
        )}

        {/* Pending Release */}
        {pendingReleaseTransfers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Pending Release
            </h3>
            <div className="space-y-3">
              {pendingReleaseTransfers.map(transfer => (
                <TransferReportingCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          </div>
        )}

        {/* Reported */}
        {reportedTransfers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Reported
            </h3>
            <div className="space-y-3">
              {reportedTransfers.map(transfer => (
                <TransferReportingCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Reporting Status</DialogTitle>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-lg">{selectedTransfer.officerName}</div>
                    <div className="text-sm text-gray-600">{selectedTransfer.officerRole}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <div className="text-xs text-gray-500">From</div>
                    <div className="font-medium">{selectedTransfer.fromLocation}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">To</div>
                    <div className="font-medium text-green-600">{selectedTransfer.toLocation}</div>
                  </div>
                </div>

                {getReportingStatusBadge(selectedTransfer.reportingStatus)}
              </div>

              {/* Actions based on role and status */}
              <div className="space-y-3">
                {/* PAS can mark as reported */}
                {isPAS && selectedTransfer.reportingStatus === 'not_reported' && (
                  <Button
                    className="w-full"
                    onClick={() => handleMarkAsReported(selectedTransfer)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Reported
                  </Button>
                )}

                {/* ACC can dispute if marked as reported but officer hasn't actually reported */}
                {isACC && selectedTransfer.reportingStatus === 'reported' && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDisputeReporting(selectedTransfer)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Dispute - Officer Has Not Reported
                  </Button>
                )}

                {/* ACC can request release for reported officers */}
                {isACC && selectedTransfer.reportingStatus === 'reported' && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRequestRelease(selectedTransfer)}
                  >
                    Request Release
                  </Button>
                )}

                {/* ACC can release officers from pending_release */}
                {isACC && selectedTransfer.reportingStatus === 'pending_release' && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsReleaseDialogOpen(true);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Release Officer
                  </Button>
                )}
              </div>

              {/* History */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="font-medium text-gray-700">History</div>
                {selectedTransfer.approvedByName && (
                  <div className="text-gray-600">
                    Approved by {selectedTransfer.approvedByName} on {selectedTransfer.approvalDate}
                  </div>
                )}
                {selectedTransfer.reportedDate && (
                  <div className="text-gray-600">
                    Reported on {selectedTransfer.reportedDate}
                  </div>
                )}
                {selectedTransfer.releasedByName && (
                  <div className="text-gray-600">
                    Released by {selectedTransfer.releasedByName} on {selectedTransfer.releasedDate}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Confirmation Dialog */}
      <Dialog open={isReleaseDialogOpen} onOpenChange={setIsReleaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Release</DialogTitle>
            <DialogDescription>
              Are you sure you want to release {selectedTransfer?.officerName}? This action confirms they have properly reported and can be released from their previous station.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReleaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedTransfer && handleReleaseOfficer(selectedTransfer)}>
              Confirm Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Dispute</DialogTitle>
            <DialogDescription>
              Report that {selectedTransfer?.officerName} has not actually reported to the new station despite being marked as reported.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Provide details about the dispute..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisputeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmitDispute}>
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}