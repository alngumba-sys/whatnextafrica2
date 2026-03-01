import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { DatePicker } from '@/app/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  ArrowLeft,
  User,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import {
  LeaveApplication,
  LeaveBalance,
  LeaveType,
  LeaveApplicationStatus,
  leaveApplications as initialLeaveApplications,
  leaveBalances as initialLeaveBalances,
} from '@/data/transfersAndLeave';

interface LeaveManagementProps {
  onBack: () => void;
}

export function LeaveManagement({ onBack }: LeaveManagementProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LeaveApplication[]>(initialLeaveApplications);
  const [balances, setBalances] = useState<LeaveBalance[]>(initialLeaveBalances);
  const [activeView, setActiveView] = useState<'my-applications' | 'apply' | 'approve' | 'balance'>('my-applications');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // New application form state
  const [formData, setFormData] = useState({
    leaveType: '' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
    reliefOfficer: '',
    contactDuringLeave: '',
  });

  if (!user) return null;

  // Get subordinates (officers reporting to this user)
  const subordinates = users.filter(u => {
    // For hierarchical reporting
    // CCs approve for DCs, DCs approve for ACCs, etc.
    if (user.role === 'CC' && u.role === 'DC' && u.region === user.region) return true;
    if (user.role === 'DC' && u.role === 'ACC' && u.region === user.region) return true;
    if (user.role === 'RC' && (u.role === 'CC' || u.role === 'DC') && u.region === user.region) return true;
    if (user.role === 'SNA' && (u.role === 'US' || u.role === 'AS')) return true;
    if (user.role === 'PAS' && (u.role === 'US' || u.role === 'AS')) return true;
    if (user.role === 'PS' || user.role === 'CS') return true; // Can approve any
    return false;
  });

  // Filter applications
  const myApplications = applications.filter(app => app.applicantId === user.id);
  const pendingForApproval = applications.filter(app => {
    if (app.status !== 'pending') return false;
    return subordinates.some(sub => sub.id === app.applicantId);
  });

  // Get user's leave balance
  const myBalance = balances.find(b => b.officerId === user.id) || {
    officerId: user.id,
    officerName: user.name,
    annualLeaveEntitlement: 21,
    annualLeaveTaken: 0,
    annualLeaveBalance: 21,
    sickLeaveEntitlement: 12,
    sickLeaveTaken: 0,
    sickLeaveBalance: 12,
    studyLeaveEntitlement: 30,
    studyLeaveTaken: 0,
    year: 2025,
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleApplyLeave = () => {
    const numberOfDays = calculateDays(formData.startDate, formData.endDate);
    
    const newApplication: LeaveApplication = {
      id: `la${Date.now()}`,
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfDays,
      reason: formData.reason,
      status: 'pending',
      applicationDate: new Date().toISOString().split('T')[0],
      reliefOfficer: formData.reliefOfficer,
      reliefOfficerName: users.find(u => u.id === formData.reliefOfficer)?.name,
      contactDuringLeave: formData.contactDuringLeave,
    };

    setApplications([newApplication, ...applications]);
    setFormData({
      leaveType: '' as LeaveType,
      startDate: '',
      endDate: '',
      reason: '',
      reliefOfficer: '',
      contactDuringLeave: '',
    });
    setActiveView('my-applications');
  };

  const handleApprove = (application: LeaveApplication) => {
    const updated = applications.map(app => {
      if (app.id === application.id) {
        return {
          ...app,
          status: 'approved' as LeaveApplicationStatus,
          approverId: user.id,
          approverName: user.name,
          approvalDate: new Date().toISOString().split('T')[0],
        };
      }
      return app;
    });
    setApplications(updated);

    // Update leave balance
    const applicantBalance = balances.find(b => b.officerId === application.applicantId);
    if (applicantBalance) {
      const updatedBalances = balances.map(b => {
        if (b.officerId === application.applicantId) {
          if (application.leaveType === 'annual') {
            return {
              ...b,
              annualLeaveTaken: b.annualLeaveTaken + application.numberOfDays,
              annualLeaveBalance: b.annualLeaveBalance - application.numberOfDays,
            };
          } else if (application.leaveType === 'sick') {
            return {
              ...b,
              sickLeaveTaken: b.sickLeaveTaken + application.numberOfDays,
              sickLeaveBalance: b.sickLeaveBalance - application.numberOfDays,
            };
          } else if (application.leaveType === 'study') {
            return {
              ...b,
              studyLeaveTaken: b.studyLeaveTaken + application.numberOfDays,
            };
          }
        }
        return b;
      });
      setBalances(updatedBalances);
    }

    setIsDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleReject = (application: LeaveApplication) => {
    const updated = applications.map(app => {
      if (app.id === application.id) {
        return {
          ...app,
          status: 'rejected' as LeaveApplicationStatus,
          approverId: user.id,
          approverName: user.name,
          approvalDate: new Date().toISOString().split('T')[0],
          rejectionReason,
        };
      }
      return app;
    });
    setApplications(updated);
    setIsDialogOpen(false);
    setSelectedApplication(null);
    setRejectionReason('');
  };

  const getLeaveTypeLabel = (type: LeaveType) => {
    const labels: Record<LeaveType, string> = {
      annual: 'Annual Leave',
      sick: 'Sick Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      study: 'Study Leave',
      compassionate: 'Compassionate Leave',
      unpaid: 'Unpaid Leave',
    };
    return labels[type];
  };

  const getStatusBadge = (status: LeaveApplicationStatus) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      cancelled: { variant: 'outline' as const, label: 'Cancelled' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getApplicantBalance = (applicantId: string) => {
    return balances.find(b => b.officerId === applicantId) || {
      officerId: applicantId,
      officerName: '',
      annualLeaveEntitlement: 21,
      annualLeaveTaken: 0,
      annualLeaveBalance: 21,
      sickLeaveEntitlement: 12,
      sickLeaveTaken: 0,
      sickLeaveBalance: 12,
      studyLeaveEntitlement: 30,
      studyLeaveTaken: 0,
      year: 2025,
    };
  };

  // Helper function to determine who will approve the application
  const getApproverForUser = (applicant: typeof user) => {
    // Find the approver based on hierarchy
    if (applicant.role === 'ACC') {
      return users.find(u => u.role === 'DC' && u.region === applicant.region);
    }
    if (applicant.role === 'DC') {
      return users.find(u => u.role === 'CC' && u.region === applicant.region);
    }
    if (applicant.role === 'CC') {
      return users.find(u => u.role === 'RC' && u.region === applicant.region);
    }
    if (applicant.role === 'RC') {
      return users.find(u => u.role === 'PS' || u.role === 'PAS');
    }
    if (applicant.role === 'US' || applicant.role === 'AS') {
      return users.find(u => u.role === 'SNA' || u.role === 'PAS');
    }
    if (applicant.role === 'SNA' || applicant.role === 'PAS') {
      return users.find(u => u.role === 'PS');
    }
    if (applicant.role === 'PS') {
      return users.find(u => u.role === 'CS');
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-sm text-gray-600">Apply for leave and manage approvals</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={activeView === 'my-applications' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('my-applications')}
        >
          <FileText className="w-4 h-4 mr-2" />
          My Applications
        </Button>
        <Button
          variant={activeView === 'apply' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('apply')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </Button>
        {pendingForApproval.length > 0 && (
          <Button
            variant={activeView === 'approve' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('approve')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending Approvals ({pendingForApproval.length})
          </Button>
        )}
        <Button
          variant={activeView === 'balance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('balance')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Leave Balance
        </Button>
      </div>

      {/* My Applications View */}
      {activeView === 'my-applications' && (
        <div className="space-y-4">
          <h3 className="font-semibold">My Leave Applications</h3>
          {myApplications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">You haven't applied for any leave yet.</p>
              <Button className="mt-4" onClick={() => setActiveView('apply')}>
                <Plus className="w-4 h-4 mr-2" />
                Apply for Leave
              </Button>
            </Card>
          ) : (
            myApplications.map(app => {
              const approver = app.status === 'pending' ? getApproverForUser(user) : null;
              return (
              <Card key={app.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold">{getLeaveTypeLabel(app.leaveType)}</h4>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    {/* Row 1: Application Date and Leave Period */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-2">
                      <div>
                        <p className="text-gray-600">Application Date</p>
                        <p className="font-medium">{app.applicationDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leave Period</p>
                        <p className="font-medium">{app.startDate} to {app.endDate}</p>
                      </div>
                    </div>

                    {/* Row 2: Number of Days, Approver, and Reason */}
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Number of Days</p>
                        <p className="font-medium">{app.numberOfDays} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {app.status === 'pending' ? 'To be approved by' : app.status === 'approved' ? 'Approved by' : 'Processed by'}
                        </p>
                        <p className="font-medium">
                          {app.status === 'pending' && approver ? approver.name : app.approverName || 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reason</p>
                        <p className="font-medium truncate" title={app.reason}>{app.reason}</p>
                      </div>
                    </div>

                    {app.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-900 font-medium">Rejection Reason:</p>
                        <p className="text-sm text-red-800">{app.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
            })
          )}
        </div>
      )}

      {/* Apply for Leave View */}
      {activeView === 'apply' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Apply for Leave</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={formData.leaveType} onValueChange={(value: LeaveType) => setFormData({ ...formData, leaveType: value })}>
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                  <SelectItem value="paternity">Paternity Leave</SelectItem>
                  <SelectItem value="study">Study Leave</SelectItem>
                  <SelectItem value="compassionate">Compassionate Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker
                  id="startDate"
                  value={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date ? date.toISOString().split('T')[0] : '' })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  id="endDate"
                  value={formData.endDate}
                  onChange={(date) => setFormData({ ...formData, endDate: date ? date.toISOString().split('T')[0] : '' })}
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Duration:</strong> {calculateDays(formData.startDate, formData.endDate)} days
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  <strong>Available Balance:</strong> {myBalance.annualLeaveBalance} days
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please provide a reason for your leave..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="reliefOfficer">Relief Officer (Optional)</Label>
              <Select value={formData.reliefOfficer} onValueChange={(value) => setFormData({ ...formData, reliefOfficer: value })}>
                <SelectTrigger id="reliefOfficer">
                  <SelectValue placeholder="Select relief officer" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === user.role && u.id !== user.id).map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contactDuringLeave">Contact During Leave</Label>
              <Input
                id="contactDuringLeave"
                type="tel"
                value={formData.contactDuringLeave}
                onChange={(e) => setFormData({ ...formData, contactDuringLeave: e.target.value })}
                placeholder="+254 712 345 678"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleApplyLeave}
              disabled={!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason}
            >
              Submit Application
            </Button>
          </div>
        </Card>
      )}

      {/* Approve Leave View */}
      {activeView === 'approve' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Pending Leave Approvals</h3>
          {pendingForApproval.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No pending leave applications for approval.</p>
            </Card>
          ) : (
            pendingForApproval.map(app => {
              const applicantBalance = getApplicantBalance(app.applicantId);
              return (
                <Card key={app.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <h4 className="font-semibold">{app.applicantName}</h4>
                        <Badge variant="outline">{app.applicantRole}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-600">Leave Type</p>
                          <p className="font-medium">{getLeaveTypeLabel(app.leaveType)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Leave Period</p>
                          <p className="font-medium">{app.startDate} to {app.endDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Number of Days</p>
                          <p className="font-medium">{app.numberOfDays} days</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Application Date</p>
                          <p className="font-medium">{app.applicationDate}</p>
                        </div>
                      </div>
                      
                      {/* Leave Balance Info */}
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Leave Balance Status:</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700">Annual Leave</p>
                            <p className="font-semibold text-blue-900">{applicantBalance.annualLeaveBalance} days</p>
                            <p className="text-xs text-blue-600">of {applicantBalance.annualLeaveEntitlement} days</p>
                          </div>
                          <div>
                            <p className="text-blue-700">Sick Leave</p>
                            <p className="font-semibold text-blue-900">{applicantBalance.sickLeaveBalance} days</p>
                            <p className="text-xs text-blue-600">of {applicantBalance.sickLeaveEntitlement} days</p>
                          </div>
                          <div>
                            <p className="text-blue-700">Study Leave</p>
                            <p className="font-semibold text-blue-900">{applicantBalance.studyLeaveEntitlement - applicantBalance.studyLeaveTaken} days</p>
                            <p className="text-xs text-blue-600">of {applicantBalance.studyLeaveEntitlement} days</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-gray-600 text-sm">Reason</p>
                        <p className="text-sm">{app.reason}</p>
                      </div>

                      {app.reliefOfficerName && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">Relief Officer: <span className="font-medium">{app.reliefOfficerName}</span></p>
                        </div>
                      )}

                      {app.contactDuringLeave && (
                        <div className="mt-1 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <p className="text-gray-600">Contact: <span className="font-medium">{app.contactDuringLeave}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsDialogOpen(true);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsDialogOpen(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Leave Balance View */}
      {activeView === 'balance' && (
        <div className="space-y-4">
          <h3 className="font-semibold">My Leave Balance for {myBalance.year}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Annual Leave</h4>
              </div>
              <p className="text-3xl font-bold text-blue-600">{myBalance.annualLeaveBalance}</p>
              <p className="text-sm text-gray-600 mt-1">
                {myBalance.annualLeaveTaken} taken of {myBalance.annualLeaveEntitlement} days
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(myBalance.annualLeaveTaken / myBalance.annualLeaveEntitlement) * 100}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Sick Leave</h4>
              </div>
              <p className="text-3xl font-bold text-green-600">{myBalance.sickLeaveBalance}</p>
              <p className="text-sm text-gray-600 mt-1">
                {myBalance.sickLeaveTaken} taken of {myBalance.sickLeaveEntitlement} days
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(myBalance.sickLeaveTaken / myBalance.sickLeaveEntitlement) * 100}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Study Leave</h4>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {myBalance.studyLeaveEntitlement - myBalance.studyLeaveTaken}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {myBalance.studyLeaveTaken} taken of {myBalance.studyLeaveEntitlement} days
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(myBalance.studyLeaveTaken / myBalance.studyLeaveEntitlement) * 100}%` }}
                />
              </div>
            </Card>
          </div>

          <Card className="p-6 mt-6">
            <h4 className="font-semibold mb-4">Leave History</h4>
            {myApplications.filter(app => app.status === 'approved').length === 0 ? (
              <p className="text-gray-500 text-center py-4">No approved leave history yet.</p>
            ) : (
              <div className="space-y-3">
                {myApplications.filter(app => app.status === 'approved').map(app => (
                  <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{getLeaveTypeLabel(app.leaveType)}</p>
                      <p className="text-sm text-gray-600">{app.startDate} to {app.endDate}</p>
                    </div>
                    <Badge variant="outline">{app.numberOfDays} days</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Approval Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Leave Application</DialogTitle>
            <DialogDescription>Review and approve or reject this leave application.</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Applicant</p>
                <p className="font-semibold">{selectedApplication.applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leave Type</p>
                <p className="font-semibold">{getLeaveTypeLabel(selectedApplication.leaveType)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{selectedApplication.numberOfDays} days</p>
                <p className="text-sm text-gray-500">{selectedApplication.startDate} to {selectedApplication.endDate}</p>
              </div>
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleApprove(selectedApplication)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(selectedApplication)}
                  disabled={!rejectionReason}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}