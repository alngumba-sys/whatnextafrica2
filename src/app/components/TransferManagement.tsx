import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { DatePicker } from '@/app/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';
import { transfers as initialTransfers, officers, Transfer, type TransferStatus } from '@/data/transfersAndLeave';
import { ministries } from '@/data/ministries';
import { canApproveTransfers, canInitiateTransfers, getRoleName, users } from '@/data/users';
import { toast } from 'sonner';
import { TransferDetails } from '@/app/components/TransferDetails';

// Location mapping data for intelligent dropdown options
const ALL_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Kajiado', 'Machakos', 'Makueni',
  'Nyeri', 'Muranga', 'Kirinyaga', 'Nyandarua', 'Laikipia', 'Embu', 'Tharaka-Nithi', 'Meru', 'Isiolo',
  'Marsabit', 'Kitui', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 'Wajir',
  'Mandera', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Narok', 'Kericho', 'Bomet',
  'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Trans Nzoia', 'Elgeyo-Marakwet', 'Nandi', 'Baringo',
  'Samburu', 'West Pokot', 'Turkana'
];

const COUNTY_DISTRICTS_MAPPING: Record<string, string[]> = {
  'Nairobi': ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
  'Kiambu': ['Kiambu', 'Thika Town', 'Ruiru', 'Juja', 'Gatundu South', 'Gatundu North', 'Githunguri', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari'],
  'Kajiado': ['Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'],
  'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
  'Kisumu': ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'],
  'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo', 'Njoro', 'Rongai', 'Subukia', 'Kuresoi South', 'Kuresoi North', 'Bahati'],
  'Nyeri': ['Nyeri Town', 'Tetu', 'Kieni', 'Mathira', 'Othaya', 'Mukurweini'],
  'Uasin Gishu': ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
  'Machakos': ['Machakos Town', 'Mavoko', 'Kathiani', 'Yatta', 'Kangundo', 'Matungulu', 'Mwala', 'Masinga'],
  'Kitui': ['Kitui Central', 'Kitui West', 'Kitui Rural', 'Kitui South', 'Kitui East', 'Mwingi North', 'Mwingi West', 'Mwingi Central'],
  'Embu': ['Manyatta', 'Runyenjes', 'Mbeere South', 'Mbeere North'],
  'Meru': ['Igembe South', 'Igembe Central', 'Igembe North', 'Tigania West', 'Tigania East', 'North Imenti', 'Buuri', 'Central Imenti', 'South Imenti'],
  'Kakamega': ['Butere', 'Mumias West', 'Mumias East', 'Matungu', 'Khwisero', 'Shinyalu', 'Lurambi', 'Ikolomani', 'Lugari', 'Malava', 'Navakholo', 'Likuyani'],
  'Bungoma': ['Bumula', 'Kabuchai', 'Sirisia', 'Tongaren', 'Webuye East', 'Webuye West', 'Kimilili', 'Mt. Elgon', 'Kanduyi'],
  'Garissa': ['Garissa Township', 'Balambala', 'Lagdera', 'Dadaab', 'Fafi', 'Ijara']
};

const ALL_SUB_COUNTIES = Object.values(COUNTY_DISTRICTS_MAPPING).flat();

interface TransferManagementProps {
  initialTransfersList?: Transfer[];
  onTransfersUpdate?: (transfers: Transfer[]) => void;
  initialSelectedTransferId?: string | null;
  onTransferIdChange?: (id: string | null) => void;
}

export function TransferManagement({ 
  initialTransfersList, 
  onTransfersUpdate,
  initialSelectedTransferId,
  onTransferIdChange 
}: TransferManagementProps = {}) {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfersList || initialTransfers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [showingDetails, setShowingDetails] = useState(false);

  // Form state for new transfer
  const [newTransfer, setNewTransfer] = useState({
    officerId: '',
    fromLocation: '',
    toLocation: '',
    fromMinistry: '',
    toMinistry: '',
    effectiveDate: '',
    reason: '',
    notes: '',
  });

  // Effect to handle initial transfer selection from dashboard
  useEffect(() => {
    if (initialSelectedTransferId) {
      setSelectedTransferId(initialSelectedTransferId);
      setShowingDetails(true);
    }
  }, [initialSelectedTransferId]);

  if (!user) return null;

  const canApprove = canApproveTransfers(user.role);
  const canInitiate = canInitiateTransfers(user.role);
  const isSNA = user.role === 'SNA';

  // If showing details page, render TransferDetails component
  if (showingDetails && selectedTransferId) {
    return (
      <TransferDetails
        transferId={selectedTransferId}
        transfers={transfers}
        onBack={() => {
          setShowingDetails(false);
          setSelectedTransferId(null);
        }}
        onUpdate={(updatedTransfer) => {
          setTransfers(transfers.map(t => t.id === updatedTransfer.id ? updatedTransfer : t));
          if (onTransfersUpdate) {
            onTransfersUpdate(transfers.map(t => t.id === updatedTransfer.id ? updatedTransfer : t));
          }
        }}
      />
    );
  }

  // Filter transfers based on status
  const pendingTransfers = transfers.filter(t => t.status === 'pending_approval');
  const draftedTransfers = transfers.filter(t => t.status === 'drafted');
  const approvedTransfers = transfers.filter(t => t.status === 'approved');
  const completedTransfers = transfers.filter(t => t.status === 'completed');
  const rejectedTransfers = transfers.filter(t => t.status === 'rejected');

  const handleCreateTransfer = () => {
    setIsCreating(true);
    setIsDialogOpen(true);
    setNewTransfer({
      officerId: '',
      fromLocation: '',
      toLocation: '',
      fromMinistry: '',
      toMinistry: '',
      effectiveDate: '',
      reason: '',
      notes: '',
    });
  };

  const handleSaveTransfer = () => {
    const officer = officers.find(o => o.id === newTransfer.officerId);
    if (!officer) {
      toast.error('Please select an officer');
      return;
    }

    const transfer: Transfer = {
      id: `tr${String(transfers.length + 1).padStart(3, '0')}`,
      officerId: newTransfer.officerId,
      officerName: officer.name,
      officerRole: officer.role,
      fromLocation: newTransfer.fromLocation || officer.currentLocation,
      toLocation: newTransfer.toLocation,
      fromMinistry: newTransfer.fromMinistry,
      toMinistry: newTransfer.toMinistry,
      status: isSNA ? 'drafted' : 'initiated',
      effectiveDate: newTransfer.effectiveDate,
      reason: newTransfer.reason,
      notes: newTransfer.notes,
      reportingStatus: 'not_reported',
    };

    if (isSNA) {
      transfer.draftedBy = user.id;
      transfer.draftedByName = user.name;
      transfer.draftedDate = new Date().toISOString().split('T')[0];
      toast.success('Transfer drafted successfully');
    } else {
      transfer.initiatedBy = user.id;
      transfer.initiatedByName = user.name;
      transfer.initiatedDate = new Date().toISOString().split('T')[0];
      transfer.status = 'pending_approval';
      toast.success('Transfer initiated and sent for approval');
    }

    setTransfers([transfer, ...transfers]);
    if (onTransfersUpdate) {
      onTransfersUpdate([transfer, ...transfers]);
    }
    setIsDialogOpen(false);
    setIsCreating(false);
  };

  const handleApproveTransfer = (transfer: Transfer) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          status: 'approved' as TransferStatus,
          approvedBy: user.id,
          approvedByName: user.name,
          approvalDate: new Date().toISOString().split('T')[0],
        };
      }
      return t;
    });
    setTransfers(updated);
    if (onTransfersUpdate) {
      onTransfersUpdate(updated);
    }
    toast.success(`Transfer approved for ${transfer.officerName}`);
    setSelectedTransferId(null);
  };

  const handleRejectTransfer = (transfer: Transfer, reason: string) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          status: 'rejected' as TransferStatus,
          rejectedBy: user.id,
          rejectedByName: user.name,
          rejectionDate: new Date().toISOString().split('T')[0],
          rejectionReason: reason,
        };
      }
      return t;
    });
    setTransfers(updated);
    if (onTransfersUpdate) {
      onTransfersUpdate(updated);
    }
    toast.error(`Transfer rejected for ${transfer.officerName}`);
    setSelectedTransferId(null);
  };

  const handleInitiateDraft = (transfer: Transfer) => {
    const updated = transfers.map(t => {
      if (t.id === transfer.id) {
        return {
          ...t,
          status: 'pending_approval' as TransferStatus,
          initiatedBy: user.id,
          initiatedByName: user.name,
          initiatedDate: new Date().toISOString().split('T')[0],
        };
      }
      return t;
    });
    setTransfers(updated);
    if (onTransfersUpdate) {
      onTransfersUpdate(updated);
    }
    toast.success('Transfer initiated and sent for approval');
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
    return <Badge variant={badge.variant}>{badge.text}</Badge>;
  };

  const TransferCard = ({ transfer }: { transfer: Transfer }) => (
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

          {(transfer.fromMinistry || transfer.toMinistry) && (
            <div className="text-xs text-gray-600 mb-2">
              {transfer.fromMinistry && ministries.find(m => m.id === transfer.fromMinistry)?.abbreviation}
              {transfer.fromMinistry && transfer.toMinistry && ' → '}
              {transfer.toMinistry && ministries.find(m => m.id === transfer.toMinistry)?.abbreviation}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Effective: {transfer.effectiveDate}</span>
            </div>
            {transfer.initiatedByName && (() => {
              const initiator = users.find(u => u.name === transfer.initiatedByName);
              return (
                <span>
                  By: {transfer.initiatedByName}
                  {initiator && <span className="text-blue-600 font-medium"> ({initiator.role})</span>}
                </span>
              );
            })()}
            {transfer.approvedByName && (() => {
              const approver = users.find(u => u.name === transfer.approvedByName);
              return (
                <span>
                  Approved by: {transfer.approvedByName}
                  {approver && <span className="text-green-600 font-medium"> ({approver.role})</span>}
                </span>
              );
            })()}
            {transfer.draftedByName && !transfer.initiatedByName && (() => {
              const drafter = users.find(u => u.name === transfer.draftedByName);
              return (
                <span>
                  Drafted by: {transfer.draftedByName}
                  {drafter && <span className="text-purple-600 font-medium"> ({drafter.role})</span>}
                </span>
              );
            })()}
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <span className="font-medium">Reason:</span> {transfer.reason}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(transfer.status)}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTransferId(transfer.id);
              setShowingDetails(true);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transfer Management</h2>
          <p className="text-gray-600">Manage officer transfers and assignments</p>
        </div>
        {(canInitiate || isSNA) && (
          <Button onClick={handleCreateTransfer}>
            <FileText className="w-4 h-4 mr-2" />
            {isSNA ? 'Draft Transfer' : 'Initiate Transfer'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending Approval
            {pendingTransfers.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingTransfers.length}</Badge>
            )}
          </TabsTrigger>
          {isSNA && (
            <TabsTrigger value="drafted" className="gap-2">
              <FileText className="w-4 h-4" />
              Drafts
              {draftedTransfers.length > 0 && (
                <Badge variant="secondary" className="ml-1">{draftedTransfers.length}</Badge>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approved
            {approvedTransfers.length > 0 && (
              <Badge variant="secondary" className="ml-1">{approvedTransfers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Completed
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTransfers.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending transfers</p>
            </Card>
          ) : (
            pendingTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)
          )}
        </TabsContent>

        <TabsContent value="drafted" className="space-y-4">
          {draftedTransfers.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No drafted transfers</p>
            </Card>
          ) : (
            draftedTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedTransfers.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No approved transfers</p>
            </Card>
          ) : (
            approvedTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTransfers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No completed transfers</p>
            </Card>
          ) : (
            completedTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedTransfers.length === 0 ? (
            <Card className="p-8 text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No rejected transfers</p>
            </Card>
          ) : (
            rejectedTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for creating transfer */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isSNA ? 'Draft New Transfer' : 'Initiate Transfer'}
            </DialogTitle>
            <DialogDescription>
              Create a new transfer request for an officer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="officer">Select Officer</Label>
              <Select value={newTransfer.officerId} onValueChange={(value) => {
                const selectedOfficer = officers.find(o => o.id === value);
                setNewTransfer({ 
                  ...newTransfer, 
                  officerId: value,
                  fromLocation: selectedOfficer?.currentLocation || '',
                  fromMinistry: selectedOfficer?.currentMinistry || ''
                });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map(officer => (
                    <SelectItem key={officer.id} value={officer.id}>
                      <div>
                        <div className="font-medium">{officer.name}</div>
                        <div className="text-xs text-gray-500">{officer.role} - {officer.currentLocation}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromLocation">From Location</Label>
                <Input
                  id="fromLocation"
                  value={newTransfer.fromLocation}
                  onChange={(e) => setNewTransfer({ ...newTransfer, fromLocation: e.target.value })}
                  placeholder="Current location"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toLocation">To Location *</Label>
                {(() => {
                  const selectedOfficer = officers.find(o => o.id === newTransfer.officerId);
                  const officerRole = selectedOfficer?.role;
                  
                  // CC (County Commissioner) - show counties
                  if (officerRole === 'CC') {
                    return (
                      <Select value={newTransfer.toLocation} onValueChange={(value) => setNewTransfer({ ...newTransfer, toLocation: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_COUNTIES.map(county => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }
                  
                  // DC (District Commissioner) or ACC (Assistant County Commissioner) - show districts/sub-counties
                  if (officerRole === 'DC' || officerRole === 'ACC') {
                    return (
                      <Select value={newTransfer.toLocation} onValueChange={(value) => setNewTransfer({ ...newTransfer, toLocation: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district/sub-county" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_SUB_COUNTIES.map(district => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }
                  
                  // Secretariat track (AS, US, etc.) - show text input for ministry locations
                  if (officerRole === 'AS' || officerRole === 'US' || officerRole === 'PS' || officerRole === 'CS') {
                    return (
                      <Input
                        id="toLocation"
                        value={newTransfer.toLocation}
                        onChange={(e) => setNewTransfer({ ...newTransfer, toLocation: e.target.value })}
                        placeholder="Ministry location (e.g., Ministry of Health)"
                        required
                      />
                    );
                  }
                  
                  // Default - free text input
                  return (
                    <Input
                      id="toLocation"
                      value={newTransfer.toLocation}
                      onChange={(e) => setNewTransfer({ ...newTransfer, toLocation: e.target.value })}
                      placeholder="New location"
                      required
                    />
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromMinistry">From Ministry (Optional)</Label>
                <Select value={newTransfer.fromMinistry} onValueChange={(value) => setNewTransfer({ ...newTransfer, fromMinistry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map(ministry => (
                      <SelectItem key={ministry.id} value={ministry.id}>
                        {ministry.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toMinistry">To Ministry (Optional)</Label>
                <Select value={newTransfer.toMinistry} onValueChange={(value) => setNewTransfer({ ...newTransfer, toMinistry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map(ministry => (
                      <SelectItem key={ministry.id} value={ministry.id}>
                        {ministry.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date *</Label>
              <DatePicker
                id="effectiveDate"
                value={newTransfer.effectiveDate}
                onChange={(date) => setNewTransfer({ ...newTransfer, effectiveDate: date ? date.toISOString().split('T')[0] : '' })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Transfer *</Label>
              <Textarea
                id="reason"
                value={newTransfer.reason}
                onChange={(e) => setNewTransfer({ ...newTransfer, reason: e.target.value })}
                placeholder="Enter reason for transfer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newTransfer.notes}
                onChange={(e) => setNewTransfer({ ...newTransfer, notes: e.target.value })}
                placeholder="Any additional information"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            {isCreating ? (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTransfer}>
                  {isSNA ? 'Save Draft' : 'Initiate Transfer'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}