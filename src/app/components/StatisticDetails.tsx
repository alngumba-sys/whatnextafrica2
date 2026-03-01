import { X, Users, Calendar, FileText, CheckCircle2, UserCheck, Award, GraduationCap, UserX, Briefcase, MapPin, BookOpen, Shield, Activity, TrendingUp, Clock, Zap, XCircle, AlertTriangle, DollarSign, Target, ArrowRight, Sparkles, Clipboard, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { users } from '@/data/users';
import { transfers, leaveRecords } from '@/data/transfersAndLeave';
import { calculateRetiringOfficers } from '@/utils/insightCalculations';

interface StatisticDetailsProps {
  metricId: string;
  metricName: string;
  metricValue: number | string;
  onClose: () => void;
  userRole: string;
  userRegion?: string;
}

export function StatisticDetails({ metricId, metricName, metricValue, onClose, userRole, userRegion }: StatisticDetailsProps) {
  
  // Helper to render standard detail card with icon, title, description
  const renderHeader = (Icon: any, bgColor: string, title: string, description: string) => (
    <div className={`${bgColor} border ${bgColor.replace('50', '200')} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-').replace('-50', '-600')} flex-shrink-0 mt-1`} />
        <div>
          <h3 className={`font-bold ${bgColor.replace('bg-', 'text-').replace('-50', '-900')} mb-1`}>{title}</h3>
          <p className={`text-sm ${bgColor.replace('bg-', 'text-').replace('-50', '-800')}`}>{description}</p>
        </div>
      </div>
    </div>
  );

  // Get data based on metric type
  const getData = () => {
    switch (metricId) {
      case 'pendingTransfers':
        return transfers.filter(t => t.status === 'pending_approval');
      case 'activeLeave':
        return leaveRecords.filter(l => l.status === 'on_leave' || l.status === 'study_leave');
      case 'completedTransfers':
        return transfers.filter(t => t.status === 'approved' || t.status === 'completed');
      case 'onSickLeave':
        return leaveRecords.filter(l => l.status === 'sick_leave');
      case 'onSuspension':
        return leaveRecords.filter(l => l.status === 'suspended');
      case 'transferRequests':
        return transfers.filter(t => t.status === 'pending_approval' || t.status === 'drafted');
      case 'interdepartmental':
        return transfers.filter(t => t.fromMinistry && t.toMinistry);
      case 'pendingAppraisals':
        return users.filter((u, idx) => idx % 5 === 0).slice(0, Math.floor(users.length * 0.23));
      case 'dueForPromotion':
        return users.filter((u, idx) => idx % 7 === 0 && u.yearsOfService && u.yearsOfService >= 5).slice(0, Math.floor(users.length * 0.15));
      case 'onStudyLeave':
        return users.filter((u, idx) => idx % 23 === 0).slice(0, parseInt(metricValue as string) || 28);
      case 'awaitingDeployment':
        return users.filter((u, idx) => idx % 31 === 0).slice(0, parseInt(metricValue as string) || 73);
      case 'inTraining':
        return users.filter((u, idx) => idx % 19 === 0).slice(0, 12);
      case 'requiringTransfer':
        // Exclude CS, PS, and PAS as they are top-level positions who cannot transfer themselves
        return users.filter((u, idx) => idx % 29 === 0 && u.role !== 'CS' && u.role !== 'PS' && u.role !== 'PAS').slice(0, 7);
      case 'outstandingTraining':
        return users.filter((u, idx) => idx % 13 === 0).slice(0, parseInt(metricValue as string) || 256);
      case 'postedToMinistries':
        return users.filter(u => u.role === 'US' || u.role === 'AS');
      case 'activeOfficers':
        return users.filter(u => {
          const onLeave = leaveRecords.find(l => l.officerId === u.id && (l.status === 'on_leave' || l.status === 'study_leave'));
          return !onLeave;
        });
      case 'nearingRetirement':
        return calculateRetiringOfficers(userRole === 'RC' ? userRegion : undefined).officers;
      default:
        return [];
    }
  };

  const renderContent = () => {
    const data = getData();

    // Pending Transfers
    if (metricId === 'pendingTransfers') {
      const items = data as typeof transfers;
      
      // Assign priorities based on role importance and time waiting
      const itemsWithPriority = items.map(t => {
        const requestDate = new Date(t.initiatedDate || t.draftedDate || t.effectiveDate);
        const daysWaiting = Math.floor((new Date().getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // High priority: Senior roles (CC, DC) or waiting >30 days
        const isSeniorRole = t.officerRole.includes('Commissioner') || t.officerRole.includes('Secretary');
        const priority = (isSeniorRole && daysWaiting > 20) || daysWaiting > 30 ? 'high' :
                        daysWaiting > 15 || isSeniorRole ? 'medium' : 'normal';
        
        return { ...t, priority };
      });
      
      return (
        <div className="space-y-4">
          {renderHeader(FileText, 'bg-blue-50', 'Pending Transfer Requests', `${items.length} transfer requests awaiting approval. Review and approve transfers to ensure proper workforce distribution and officer career development.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{itemsWithPriority.filter(t => t.priority === 'high').length}</div>
              <div className="text-xs text-amber-600">High Priority</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{itemsWithPriority.filter(t => t.priority === 'medium').length}</div>
              <div className="text-xs text-blue-600">Medium Priority</div>
            </Card>
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="text-2xl font-bold text-gray-700">{itemsWithPriority.filter(t => t.priority === 'normal').length}</div>
              <div className="text-xs text-gray-600">Normal Priority</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Pending Transfers</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {itemsWithPriority.slice(0, 10).map((transfer) => {
                const officer = users.find(u => u.id === transfer.officerId);
                const requestDate = transfer.initiatedDate || transfer.draftedDate || transfer.effectiveDate;
                return (
                  <Card key={transfer.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{officer?.name || transfer.officerName}</span>
                          <Badge variant={transfer.priority === 'high' ? 'destructive' : transfer.priority === 'medium' ? 'default' : 'secondary'}>
                            {transfer.priority}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1 text-gray-700">
                            <span className="font-medium">{transfer.officerRole}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span><strong>From:</strong> {transfer.fromLocation}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span><strong>To:</strong> {transfer.toLocation}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <span><strong>Requested:</strong> {new Date(requestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            {transfer.reason && <span className="ml-2">• <strong>Reason:</strong> {transfer.reason.substring(0, 50)}{transfer.reason.length > 50 ? '...' : ''}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Prioritize high-priority transfers affecting critical positions</li>
              <li>Review transfer reasons and verify operational needs</li>
              <li>Ensure replacement officers are identified before approving</li>
              <li>Coordinate with receiving and sending regions for smooth transition</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Active Leave
    if (metricId === 'activeLeave') {
      const items = data as typeof leaveRecords;
      
      // Map leave status to type for categorization
      const getLeaveType = (record: typeof leaveRecords[0]) => {
        if (record.status === 'study_leave') return 'study';
        if (record.status === 'sick_leave') return 'sick';
        // Check notes or assume annual leave for 'on_leave' status
        if (record.status === 'on_leave') {
          if (record.notes?.toLowerCase().includes('maternity')) return 'maternity';
          if (record.notes?.toLowerCase().includes('sick')) return 'sick';
          return 'annual';
        }
        return 'annual';
      };
      
      return (
        <div className="space-y-4">
          {renderHeader(Calendar, 'bg-purple-50', 'Officers Currently on Leave', `${items.length} officers are currently on various types of leave. Monitor leave balance and ensure adequate coverage in all regions.`)}
          
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{items.filter(l => getLeaveType(l) === 'annual').length}</div>
              <div className="text-xs text-blue-600">Annual Leave</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{items.filter(l => getLeaveType(l) === 'sick').length}</div>
              <div className="text-xs text-green-600">Sick Leave</div>
            </Card>
            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <div className="text-2xl font-bold text-indigo-700">{items.filter(l => getLeaveType(l) === 'maternity').length}</div>
              <div className="text-xs text-indigo-600">Maternity Leave</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{items.filter(l => getLeaveType(l) === 'study').length}</div>
              <div className="text-xs text-amber-600">Study Leave</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers on Leave (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((leave) => {
                const officer = users.find(u => u.id === leave.officerId);
                const days = leave.startDate && leave.endDate ? Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                const leaveType = getLeaveType(leave);
                return (
                  <Card key={leave.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{officer?.name || leave.officerName}</span>
                          <Badge variant="secondary">{leaveType}</Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span><strong>Station:</strong> {officer?.currentStation || 'N/A'}</span>
                          {leave.startDate && <span> | <strong>Start:</strong> {new Date(leave.startDate).toLocaleDateString()}</span>}
                          {days > 0 && <span> | <strong>Days:</strong> {days}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Ensure relief officers are deployed to critical stations</li>
              <li>Monitor units with more than 30% staff on leave</li>
              <li>Track officer return dates and plan handover procedures</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Total Officers
    if (metricId === 'totalOfficers') {
      const roleBreakdown = {
        CS: users.filter(u => u.role === 'CS').length,
        PS: users.filter(u => u.role === 'PS').length,
        PAS: users.filter(u => u.role === 'PAS').length,
        RC: users.filter(u => u.role === 'RC').length,
        CC: users.filter(u => u.role === 'CC').length,
        DC: users.filter(u => u.role === 'DC').length,
        ACC: users.filter(u => u.role === 'ACC').length,
        SNA: users.filter(u => u.role === 'SNA').length,
        US: users.filter(u => u.role === 'US').length,
        AS: users.filter(u => u.role === 'AS').length,
      };

      return (
        <div className="space-y-4">
          {renderHeader(Users, 'bg-green-50', 'Total Officers in Service', `${users.length} officers currently serving across all levels and regions. This includes ${users.filter(u => u.gender === 'Male').length} male and ${users.filter(u => u.gender === 'Female').length} female officers.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{users.filter(u => u.gender === 'Male').length}</div>
              <div className="text-xs text-blue-600">Male Officers</div>
            </Card>
            <Card className="p-4 bg-pink-50 border-pink-200">
              <div className="text-2xl font-bold text-pink-700">{users.filter(u => u.gender === 'Female').length}</div>
              <div className="text-xs text-pink-600">Female Officers</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {Math.round((users.filter(u => u.gender === 'Female').length / users.length) * 100)}%
              </div>
              <div className="text-xs text-purple-600">Female Representation</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers by Role</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(roleBreakdown).map(([role, count]) => (
                <Card key={role} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{role}</span>
                    <Badge variant="secondary">{count} officers</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Completed Transfers
    if (metricId === 'completedTransfers') {
      const items = data as typeof transfers;
      return (
        <div className="space-y-4">
          {renderHeader(CheckCircle2, 'bg-green-50', 'Completed Transfers', `${items.length} transfers successfully completed. These transfers represent workforce optimization and officer career development.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {items.filter(t => {
                  const dateToCheck = t.approvalDate || t.initiatedDate;
                  if (!dateToCheck) return false;
                  return new Date(dateToCheck).getMonth() === new Date().getMonth() && 
                         new Date(dateToCheck).getFullYear() === new Date().getFullYear();
                }).length}
              </div>
              <div className="text-xs text-blue-600">This Month</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {items.filter(t => {
                  const dateToCheck = t.approvalDate || t.initiatedDate;
                  if (!dateToCheck) return false;
                  return new Date(dateToCheck).getFullYear() === new Date().getFullYear();
                }).length}
              </div>
              <div className="text-xs text-green-600">This Year</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {Math.round(items.filter(t => t.fromMinistry && t.toMinistry).length / items.length * 100)}%
              </div>
              <div className="text-xs text-purple-600">Interdepartmental</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Completed Transfers</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 10).map((transfer) => {
                const officer = users.find(u => u.id === transfer.officerId);
                return (
                  <Card key={transfer.id} className="p-4 hover:shadow-md transition-shadow bg-green-50 border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{officer?.name || 'Unknown Officer'}</span>
                          <Badge variant="secondary">{transfer.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span><strong>From:</strong> {transfer.fromRegion} → <strong>To:</strong> {transfer.toRegion}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Active Officers  
    if (metricId === 'activeOfficers') {
      const items = data as typeof users;
      return (
        <div className="space-y-4">
          {renderHeader(UserCheck, 'bg-emerald-50', 'Active Officers on Duty', `${items.length} officers currently active and on duty across all regions. These officers are available for deployment, operations, and administrative duties.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {Math.round((items.length / users.length) * 100)}%
              </div>
              <div className="text-xs text-green-600">Operational Capacity</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {items.filter(u => u.role === 'ACC' || u.role === 'DC').length}
              </div>
              <div className="text-xs text-blue-600">Field Officers</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {items.filter(u => u.role === 'US' || u.role === 'AS').length}
              </div>
              <div className="text-xs text-purple-600">Ministry Officers</div>
            </Card>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Deployment Overview</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>All 47 counties have operational County Commissioners on duty</li>
              <li>400 District Commissioners providing district-level coverage</li>
              <li>2000 Assistant County Commissioners at grassroots locations</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Pending Appraisals
    if (metricId === 'pendingAppraisals') {
      const items = data as typeof users;
      return (
        <div className="space-y-4">
          {renderHeader(Clipboard, 'bg-purple-50', 'Pending Performance Appraisals', `${items.length} officers have pending appraisals for the current review period. Timely completion ensures accurate performance tracking and career development planning.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-red-600">Overdue (&gt;30 days)</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.floor(items.length * 0.35)}</div>
              <div className="text-xs text-amber-600">Due This Week</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.25)}</div>
              <div className="text-xs text-blue-600">Self-Assessment Phase</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers Awaiting Appraisal (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant={idx % 3 === 0 ? 'destructive' : idx % 3 === 1 ? 'default' : 'secondary'}>
                          {idx % 3 === 0 ? 'Overdue' : idx % 3 === 1 ? 'Due Soon' : 'In Progress'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Role:</strong> {officer.role} | <strong>Station:</strong> {officer.currentStation || 'N/A'} | <strong>Last Review:</strong> {idx % 3 === 0 ? 'Nov 2025' : 'Dec 2025'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Send reminders to supervisors for overdue appraisals</li>
              <li>Ensure all officers complete self-assessments by end of week</li>
              <li>Follow SPAS framework guidelines for fair evaluations</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Due for Promotion
    if (metricId === 'dueForPromotion') {
      const items = data as typeof users;
      return (
        <div className="space-y-4">
          {renderHeader(Award, 'bg-amber-50', 'Officers Due for Promotion', `${items.length} officers meet the criteria for promotion based on years of service, performance ratings, and competency assessments.`)}
          
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.floor(items.length * 0.3)}</div>
              <div className="text-xs text-green-600">ACC to DC</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.25)}</div>
              <div className="text-xs text-blue-600">DC to CC</div>
            </Card>
            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <div className="text-2xl font-bold text-indigo-700">{Math.floor(items.length * 0.25)}</div>
              <div className="text-xs text-indigo-600">AS to US</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(items.length * 0.2)}</div>
              <div className="text-xs text-purple-600">CC to RC</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Promotion-Ready Officers (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((officer) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow bg-amber-50 border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant="secondary">Ready</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Current:</strong> {officer.role} | <strong>Years:</strong> {officer.yearsOfService} | <strong>Performance:</strong> 4.{Math.floor(Math.random() * 5 + 3)}/5.0</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Promotion Criteria</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Minimum 5 years in current grade with performance above 4.0</li>
              <li>Submit promotion recommendations to PSC by end of Q1 2026</li>
              <li>Plan succession for vacated positions upon promotions</li>
            </ul>
          </Card>
        </div>
      );
    }

    // On Study Leave
    if (metricId === 'onStudyLeave') {
      const items = data as typeof users;
      const programs = ['MBA in Public Administration', 'MSc Security Management', 'PhD Public Policy', 'Advanced Leadership Cert', 'MSc Governance'];
      const institutions = ['University of Nairobi', 'Kenyatta University', 'Strathmore University', 'Kenya School of Government'];
      
      return (
        <div className="space-y-4">
          {renderHeader(GraduationCap, 'bg-blue-50', 'Officers on Study Leave', `${items.length} officers currently pursuing advanced studies and professional development programs.`)}
          
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-purple-600">Master's Programs</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.25)}</div>
              <div className="text-xs text-blue-600">Doctoral Studies</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.floor(items.length * 0.2)}</div>
              <div className="text-xs text-green-600">Professional Certs</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.floor(items.length * 0.15)}</div>
              <div className="text-xs text-amber-600">Returning Soon</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers on Study Leave (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant="secondary">{officer.role}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Program:</strong> {programs[idx % programs.length]} | <strong>Institution:</strong> {institutions[idx % institutions.length]} | <strong>Return:</strong> {idx % 3 === 0 ? 'Jun 2026' : idx % 3 === 1 ? 'Sep 2026' : 'Dec 2026'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Study Leave Management</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Track academic progress through quarterly reports</li>
              <li>Plan reintegration and knowledge sharing for returning officers</li>
              <li>Ensure continuous coverage during study absence</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Vacant Positions
    if (metricId === 'vacantPositions') {
      const vacancies = [
        { position: 'Assistant County Commissioner', region: 'Turkana', priority: 'Critical', duration: '52 days' },
        { position: 'District Commissioner', region: 'Marsabit', priority: 'High', duration: '38 days' },
        { position: 'Assistant County Commissioner', region: 'Wajir', priority: 'High', duration: '31 days' },
        { position: 'Assistant Secretary', ministry: 'Ministry of Health', priority: 'Medium', duration: '22 days' },
        { position: 'Under Secretary', ministry: 'Ministry of Education', priority: 'Medium', duration: '15 days' },
        { position: 'Assistant County Commissioner', region: 'Mandera', priority: 'High', duration: '45 days' },
        { position: 'District Commissioner', region: 'Garissa', priority: 'Medium', duration: '18 days' },
        { position: 'Assistant County Commissioner', region: 'Tana River', priority: 'High', duration: '28 days' },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(UserX, 'bg-red-50', 'Vacant Positions Requiring Action', `${vacancies.length} critical positions currently vacant. Prolonged vacancies impact service delivery and operational efficiency.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{vacancies.filter(v => v.priority === 'Critical').length}</div>
              <div className="text-xs text-red-600">Critical Priority</div>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{vacancies.filter(v => v.priority === 'High').length}</div>
              <div className="text-xs text-orange-600">High Priority</div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{vacancies.filter(v => v.priority === 'Medium').length}</div>
              <div className="text-xs text-yellow-600">Medium Priority</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Vacant Positions Details</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vacancies.map((vacancy, idx) => (
                <Card key={idx} className={`p-4 ${
                  vacancy.priority === 'Critical' ? 'bg-red-50 border-red-200' : 
                  vacancy.priority === 'High' ? 'bg-orange-50 border-orange-200' : 
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{vacancy.position}</span>
                        <Badge variant={vacancy.priority === 'Critical' ? 'destructive' : vacancy.priority === 'High' ? 'default' : 'secondary'}>
                          {vacancy.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Location:</strong> {vacancy.region || vacancy.ministry} | <strong>Vacant For:</strong> {vacancy.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Deploy officers from awaiting deployment pool</li>
              <li>Prioritize recruitment for hardship areas</li>
              <li>Offer hardship allowances to attract qualified officers</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Awaiting Deployment
    if (metricId === 'awaitingDeployment') {
      const items = data as typeof users;
      const status = ['New Recruit - Training Completed', 'Transfer Approved - Awaiting Assignment', 'Post-Training - Certification Complete'];
      
      return (
        <div className="space-y-4">
          {renderHeader(Briefcase, 'bg-indigo-50', 'Officers Awaiting Deployment', `${items.length} officers have completed training or transfer approvals and are ready for deployment.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.45)}</div>
              <div className="text-xs text-blue-600">New Recruits</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.floor(items.length * 0.35)}</div>
              <div className="text-xs text-green-600">Post-Transfer</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(items.length * 0.2)}</div>
              <div className="text-xs text-purple-600">Post-Training</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers Ready for Deployment (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow bg-indigo-50 border-indigo-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant="secondary">{officer.role}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Status:</strong> {status[idx % 3]} | <strong>Waiting:</strong> {Math.floor(Math.random() * 20) + 5} days</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Deployment Strategy</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Match officers' skills with vacant positions</li>
              <li>Prioritize deployment to understaffed regions</li>
              <li>Complete deployment paperwork within 5 working days</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Regional Coverage
    if (metricId === 'regionalCoverage') {
      const coverageData = [
        { region: 'Nairobi', coverage: 102, required: 320, current: 326, status: 'Overstaffed' },
        { region: 'Turkana', coverage: 78, required: 85, current: 66, status: 'Critical' },
        { region: 'Marsabit', coverage: 82, required: 75, current: 62, status: 'Understaffed' },
        { region: 'Wajir', coverage: 85, required: 70, current: 60, status: 'Understaffed' },
        { region: 'Mombasa', coverage: 98, required: 280, current: 274, status: 'Adequate' },
        { region: 'Kisumu', coverage: 96, required: 210, current: 202, status: 'Adequate' },
        { region: 'Nakuru', coverage: 94, required: 195, current: 183, status: 'Adequate' },
        { region: 'Eldoret', coverage: 91, required: 165, current: 150, status: 'Adequate' },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(MapPin, 'bg-green-50', 'Regional Coverage Analysis', `Overall regional coverage at ${metricValue}. Strategic redeployment needed for critical gaps in frontier counties.`)}
          
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{coverageData.filter(r => r.status === 'Critical').length}</div>
              <div className="text-xs text-red-600">Critical (&lt;85%)</div>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{coverageData.filter(r => r.status === 'Understaffed').length}</div>
              <div className="text-xs text-orange-600">Understaffed</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{coverageData.filter(r => r.status === 'Adequate').length}</div>
              <div className="text-xs text-green-600">Adequate</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{coverageData.filter(r => r.status === 'Overstaffed').length}</div>
              <div className="text-xs text-blue-600">Overstaffed</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Regional Staffing Breakdown</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {coverageData.map((region) => (
                <Card key={region.region} className={`p-4 ${
                  region.status === 'Critical' ? 'bg-red-50 border-red-200' :
                  region.status === 'Understaffed' ? 'bg-orange-50 border-orange-200' :
                  region.status === 'Overstaffed' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{region.region}</span>
                    <Badge variant={region.status === 'Critical' ? 'destructive' : region.status === 'Understaffed' ? 'default' : 'secondary'}>
                      {region.coverage}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-700 mb-2">
                    <span><strong>Current:</strong> {region.current}</span>
                    <span><strong>Required:</strong> {region.required}</span>
                    <span><strong>Gap:</strong> {region.required - region.current > 0 ? `${region.required - region.current} short` : `${region.current - region.required} excess`}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        region.status === 'Critical' ? 'bg-red-600' :
                        region.status === 'Understaffed' ? 'bg-orange-500' :
                        region.status === 'Overstaffed' ? 'bg-blue-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(region.coverage, 100)}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Rebalancing Strategy</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Redeploy 15-20 officers from Nairobi to frontier counties</li>
              <li>Offer hardship allowances for underserved regions</li>
              <li>Monitor coverage quarterly and adjust plans</li>
            </ul>
          </Card>
        </div>
      );
    }

    // In Training
    if (metricId === 'inTraining') {
      const items = data as typeof users;
      const trainingPrograms = ['Advanced Leadership Program', 'Digital Governance Training', 'Crisis Management', 'Public Financial Management', 'Strategic Communication'];
      
      return (
        <div className="space-y-4">
          {renderHeader(BookOpen, 'bg-teal-50', 'Officers Currently in Training', `${items.length} officers participating in capacity building programs. Continuous training ensures workforce competency.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-purple-600">Leadership Training</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.35)}</div>
              <div className="text-xs text-blue-600">Technical Skills</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.floor(items.length * 0.25)}</div>
              <div className="text-xs text-green-600">Mandatory Certs</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers in Training (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant="secondary">{officer.role}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Program:</strong> {trainingPrograms[idx % trainingPrograms.length]} | <strong>Duration:</strong> {idx % 2 === 0 ? '2 weeks' : '3 weeks'} | <strong>Completion:</strong> {idx % 3 === 0 ? 'Feb 15' : idx % 3 === 1 ? 'Feb 22' : 'Mar 1'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Training Management</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Track training completion rates</li>
              <li>Schedule post-training knowledge sharing sessions</li>
              <li>Link training outcomes to performance appraisals</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Disciplinary Cases
    if (metricId === 'disciplinaryCases') {
      const cases = [
        { officer: 'Officer A.M.', role: 'ACC', region: 'Nairobi', issue: 'Unauthorized absence', status: 'Under Investigation', severity: 'Medium' },
        { officer: 'Officer K.W.', role: 'DC', region: 'Mombasa', issue: 'Misconduct allegation', status: 'Hearing Scheduled', severity: 'High' },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(Shield, 'bg-orange-50', 'Active Disciplinary Cases', `${cases.length} active disciplinary cases requiring attention. Fair and timely resolution maintains institutional integrity.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{cases.filter(c => c.severity === 'High').length}</div>
              <div className="text-xs text-red-600">High Severity</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{cases.filter(c => c.severity === 'Medium').length}</div>
              <div className="text-xs text-amber-600">Medium Severity</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{cases.filter(c => c.status === 'Under Investigation').length}</div>
              <div className="text-xs text-blue-600">Under Investigation</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Case Details</h4>
            <div className="space-y-2">
              {cases.map((caseItem, idx) => (
                <Card key={idx} className={`p-4 ${caseItem.severity === 'High' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{caseItem.officer}</span>
                        <Badge variant={caseItem.severity === 'High' ? 'destructive' : 'default'}>
                          {caseItem.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Role:</strong> {caseItem.role} | <strong>Region:</strong> {caseItem.region} | <strong>Issue:</strong> {caseItem.issue} | <strong>Status:</strong> {caseItem.status}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Management Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Follow due process and PSC guidelines</li>
              <li>Complete investigations within 30 days</li>
              <li>Maintain confidentiality throughout</li>
            </ul>
          </Card>
        </div>
      );
    }

    // On Sick Leave
    if (metricId === 'onSickLeave') {
      const items = data as typeof leaveRecords;
      
      return (
        <div className="space-y-4">
          {renderHeader(Activity, 'bg-pink-50', 'Officers on Sick Leave', `${items.length} officers currently on sick leave. Monitor recovery progress and ensure workplace support.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{Math.floor(items.length * 0.3)}</div>
              <div className="text-xs text-red-600">Critical/Hospitalized</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-amber-600">Recovery Period</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.floor(items.length * 0.3)}</div>
              <div className="text-xs text-green-600">Returning Soon</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers on Sick Leave (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 10).map((leave) => {
                const officer = users.find(u => u.id === leave.officerId);
                return (
                  <Card key={leave.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{officer?.name || 'Unknown'}</span>
                          <Badge variant="secondary">Sick Leave</Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span><strong>Role:</strong> {officer?.role} | <strong>Station:</strong> {officer?.currentStation || 'N/A'} | <strong>Started:</strong> {new Date(leave.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Sick Leave Management</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Ensure medical certificates submitted within 3 days</li>
              <li>Arrange relief officers for critical positions</li>
              <li>Plan phased return-to-work for long-term illnesses</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Transfer Requests
    if (metricId === 'transferRequests') {
      const items = data as typeof transfers;
      
      return (
        <div className="space-y-4">
          {renderHeader(FileText, 'bg-cyan-50', 'Transfer Requests Received', `${items.length} transfer requests submitted. Review and process requests for optimal workforce distribution.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{items.filter(t => t.priority === 'high').length}</div>
              <div className="text-xs text-amber-600">High Priority</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{items.filter(t => t.status === 'pending_approval').length}</div>
              <div className="text-xs text-blue-600">Awaiting Approval</div>
            </Card>
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="text-2xl font-bold text-gray-700">{items.filter(t => t.status === 'drafted').length}</div>
              <div className="text-xs text-gray-600">In Draft</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Requests</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 10).map((request) => {
                const officer = users.find(u => u.id === request.officerId);
                return (
                  <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{officer?.name || request.officerName}</span>
                          <Badge variant={request.priority === 'high' ? 'destructive' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span><strong>From:</strong> {request.fromRegion} → <strong>To:</strong> {request.toRegion} | <strong>Requested:</strong> {new Date(request.requestedDate || request.initiatedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Processing Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Review requests within 14 days</li>
              <li>Verify operational needs in both regions</li>
              <li>Consider officer circumstances and career development</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Posted to Ministries
    if (metricId === 'postedToMinistries') {
      const items = data as typeof users;
      const ministryBreakdown = {
        'Ministry of Health': Math.floor(items.length * 0.25),
        'Ministry of Education': Math.floor(items.length * 0.22),
        'Ministry of Transport': Math.floor(items.length * 0.18),
        'Ministry of Agriculture': Math.floor(items.length * 0.15),
        'Ministry of Finance': Math.floor(items.length * 0.12),
        'Other Ministries': Math.floor(items.length * 0.08),
      };
      
      return (
        <div className="space-y-4">
          {renderHeader(Building2, 'bg-violet-50', 'Officers Posted to Ministries', `${items.length} Under Secretaries and Assistant Secretaries deployed across government ministries.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{users.filter(u => u.role === 'US').length}</div>
              <div className="text-xs text-blue-600">Under Secretaries</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{users.filter(u => u.role === 'AS').length}</div>
              <div className="text-xs text-purple-600">Assistant Secretaries</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Object.keys(ministryBreakdown).length}</div>
              <div className="text-xs text-green-600">Ministries Covered</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Distribution by Ministry</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(ministryBreakdown).map(([ministry, count]) => (
                <Card key={ministry} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{ministry}</span>
                    <Badge variant="secondary">{count} officers</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Deployment Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Health and Education have highest staffing needs</li>
              <li>Conduct quarterly performance reviews</li>
              <li>Rotate officers every 3-4 years for diverse experience</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Performance Average
    if (metricId === 'performanceAvg') {
      const performanceDistribution = {
        'Exceptional (4.5-5.0)': Math.floor(users.length * 0.15),
        'Above Average (4.0-4.4)': Math.floor(users.length * 0.35),
        'Satisfactory (3.5-3.9)': Math.floor(users.length * 0.30),
        'Needs Improvement (3.0-3.4)': Math.floor(users.length * 0.15),
        'Unsatisfactory (<3.0)': Math.floor(users.length * 0.05),
      };
      
      return (
        <div className="space-y-4">
          {renderHeader(TrendingUp, 'bg-emerald-50', 'Overall Performance Average', `Workforce performance average of ${metricValue} indicates strong productivity. Continue supporting high performers.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{performanceDistribution['Exceptional (4.5-5.0)']}</div>
              <div className="text-xs text-green-600">Exceptional</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{performanceDistribution['Above Average (4.0-4.4)']}</div>
              <div className="text-xs text-blue-600">Above Average</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{performanceDistribution['Needs Improvement (3.0-3.4)'] + performanceDistribution['Unsatisfactory (<3.0)']}</div>
              <div className="text-xs text-amber-600">Needs Support</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Performance Distribution</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(performanceDistribution).map(([range, count]) => (
                <Card key={range} className={`p-4 ${
                  range.includes('Exceptional') ? 'bg-green-50 border-green-200' :
                  range.includes('Above') ? 'bg-blue-50 border-blue-200' :
                  range.includes('Satisfactory') ? 'bg-gray-50 border-gray-200' :
                  range.includes('Needs') ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{range}</span>
                    <Badge variant={range.includes('Exceptional') ? 'secondary' : range.includes('Unsatisfactory') ? 'destructive' : 'default'}>
                      {count} officers ({Math.round((count / users.length) * 100)}%)
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Management Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Recognize and reward exceptional performers</li>
              <li>Provide coaching for officers needing improvement</li>
              <li>Link performance to promotion opportunities</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Nearing Retirement
    if (metricId === 'nearingRetirement') {
      const today = new Date();
      const retiringData = (data as any[]).map(officer => {
        const birthDate = new Date(officer.dateOfBirth!);
        const retirementDate = new Date(birthDate.getFullYear() + 60, birthDate.getMonth(), birthDate.getDate());
        const monthsUntilRetirement = Math.floor((retirementDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
        
        return {
          ...officer,
          retirementDate,
          monthsUntilRetirement,
          yearsOfService: officer.yearsOfService || Math.floor((today.getTime() - new Date(officer.dateOfJoining || '2000-01-01').getTime()) / (1000 * 60 * 60 * 24 * 365))
        };
      }).sort((a, b) => a.monthsUntilRetirement - b.monthsUntilRetirement);

      return (
        <div className="space-y-4">
          {renderHeader(Clock, 'bg-amber-50', 'Officers Nearing Retirement', `${retiringData.length} officers will reach retirement age (60 years) within 12 months. Immediate succession planning required.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{retiringData.filter(o => o.monthsUntilRetirement <= 3).length}</div>
              <div className="text-xs text-red-600">0-3 Months</div>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{retiringData.filter(o => o.monthsUntilRetirement > 3 && o.monthsUntilRetirement <= 6).length}</div>
              <div className="text-xs text-orange-600">4-6 Months</div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{retiringData.filter(o => o.monthsUntilRetirement > 6).length}</div>
              <div className="text-xs text-yellow-600">7-12 Months</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers by Retirement Timeline</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {retiringData.map((officer) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant={officer.monthsUntilRetirement <= 3 ? 'destructive' : officer.monthsUntilRetirement <= 6 ? 'default' : 'secondary'}>
                          {officer.monthsUntilRetirement} months
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Role:</strong> {officer.role} | <strong>Station:</strong> {officer.currentStation || 'N/A'} | <strong>Years:</strong> {officer.yearsOfService} | <strong>Retirement:</strong> {officer.retirementDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Succession Planning</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Identify successors for critical positions</li>
              <li>Initiate knowledge transfer and mentorship</li>
              <li>Review recruitment pipeline for replacements</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Emergency Deploys
    if (metricId === 'emergencyDeploys') {
      const emergencies = [
        { event: 'Flood Response - Tana River', deployed: 8, date: 'Jan 20, 2026', status: 'Active' },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(Zap, 'bg-red-50', 'Emergency Deployments', `${emergencies.length} active deployment with ${emergencies.reduce((sum, e) => sum + e.deployed, 0)} officers mobilized.`)}
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Active Emergencies</h4>
            <div className="space-y-2">
              {emergencies.map((emergency, idx) => (
                <Card key={idx} className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{emergency.event}</span>
                        <Badge variant="destructive">{emergency.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Officers:</strong> {emergency.deployed} | <strong>Date:</strong> {emergency.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Response Protocol</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Maintain emergency teams on standby</li>
              <li>Ensure rapid mobilization within 24 hours</li>
              <li>Coordinate with NDMA and other agencies</li>
            </ul>
          </Card>
        </div>
      );
    }

    // On Suspension
    if (metricId === 'onSuspension') {
      const items = data as typeof leaveRecords;
      
      return (
        <div className="space-y-4">
          {renderHeader(XCircle, 'bg-rose-50', 'Officers on Suspension', `${items.length} officer${items.length !== 1 ? 's' : ''} currently suspended pending investigation. Ensure due process.`)}
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.ceil(items.length * 0.6)}</div>
              <div className="text-xs text-amber-600">Under Investigation</div>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-red-600">Pending Hearing</div>
            </Card>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Management Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Complete investigations within 90 days</li>
              <li>Maintain confidentiality and protect rights</li>
              <li>Arrange acting appointments for suspended officers' roles</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Compliance Pending
    if (metricId === 'compliancePending') {
      const reports = [
        { title: 'Q4 2025 Appraisal Completion Report', deadline: 'Feb 5, 2026', status: 'Overdue' },
        { title: 'Annual Leave Utilization Report', deadline: 'Feb 10, 2026', status: 'Due Soon' },
        { title: 'Officer Training Compliance Update', deadline: 'Feb 20, 2026', status: 'Upcoming' },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(AlertTriangle, 'bg-yellow-50', 'Compliance Reports Pending', `${reports.length} mandatory reports pending. Timely reporting ensures regulatory compliance.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{reports.filter(r => r.status === 'Overdue').length}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{reports.filter(r => r.status === 'Due Soon').length}</div>
              <div className="text-xs text-amber-600">Due This Week</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{reports.filter(r => r.status === 'Upcoming').length}</div>
              <div className="text-xs text-blue-600">Upcoming</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Pending Reports</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reports.map((report, idx) => (
                <Card key={idx} className={`p-4 ${
                  report.status === 'Overdue' ? 'bg-red-50 border-red-200' :
                  report.status === 'Due Soon' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{report.title}</span>
                        <Badge variant={report.status === 'Overdue' ? 'destructive' : report.status === 'Due Soon' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Deadline:</strong> {report.deadline}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Prioritize overdue Q4 appraisal report</li>
              <li>Set automated reminders for deadlines</li>
              <li>Maintain compliance tracking dashboard</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Budget Utilization
    if (metricId === 'budgetUtilization') {
      const categories = [
        { category: 'Personnel Costs', allocated: 450000000, spent: 402000000, utilization: 89 },
        { category: 'Training & Development', allocated: 35000000, spent: 31500000, utilization: 90 },
        { category: 'Operations', allocated: 85000000, spent: 68000000, utilization: 80 },
        { category: 'Travel & Deployment', allocated: 42000000, spent: 37800000, utilization: 90 },
        { category: 'Equipment', allocated: 28000000, spent: 23500000, utilization: 84 },
      ];
      
      return (
        <div className="space-y-4">
          {renderHeader(DollarSign, 'bg-blue-50', 'Budget Utilization Overview', `Current utilization at ${metricValue} indicates efficient resource management.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">KES 563M</div>
              <div className="text-xs text-green-600">Spent (87%)</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">KES 77M</div>
              <div className="text-xs text-blue-600">Remaining (13%)</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">KES 640M</div>
              <div className="text-xs text-purple-600">Total Allocated</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Budget by Category</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((item) => (
                <Card key={item.category} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{item.category}</span>
                    <Badge variant="secondary">{item.utilization}%</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-700 mb-2">
                    <span><strong>Allocated:</strong> {(item.allocated / 1000000).toFixed(1)}M</span>
                    <span><strong>Spent:</strong> {(item.spent / 1000000).toFixed(1)}M</span>
                    <span><strong>Balance:</strong> {((item.allocated - item.spent) / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.utilization >= 85 ? 'bg-green-600' : item.utilization >= 70 ? 'bg-blue-600' : 'bg-amber-600'}`}
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Budget Management</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Optimize remaining KES 77M for Q1 2026</li>
              <li>Submit FY 2026/27 budget proposal by March 15</li>
              <li>Conduct monthly budget reviews</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Requiring Transfer
    if (metricId === 'requiringTransfer') {
      const items = data as typeof users;
      const reasons = ['Extended tenure (5+ years)', 'Skills better suited elsewhere', 'Career development', 'Regional rebalancing'];
      
      return (
        <div className="space-y-4">
          {renderHeader(Target, 'bg-slate-50', 'Officers Requiring Transfer', `${items.length} officers identified as requiring transfer based on tenure, performance, or operational needs.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-amber-600">Extended Tenure</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.35)}</div>
              <div className="text-xs text-blue-600">Skills Mismatch</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.ceil(items.length * 0.25)}</div>
              <div className="text-xs text-purple-600">Career Development</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers Requiring Transfer (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow bg-slate-50 border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant="secondary">{officer.role}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Station:</strong> {officer.currentStation || officer.region} | <strong>Years Here:</strong> {Math.floor(Math.random() * 4) + 5} | <strong>Reason:</strong> {reasons[idx % reasons.length]}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Planning Actions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Initiate transfers for 5+ year tenures</li>
              <li>Match officer skills with destination needs</li>
              <li>Consider personal circumstances</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Interdepartmental
    if (metricId === 'interdepartmental') {
      const items = data as typeof transfers;
      
      return (
        <div className="space-y-4">
          {renderHeader(ArrowRight, 'bg-fuchsia-50', 'Interdepartmental Transfers', `${items.length} transfers between ministries and field operations. Cross-functional mobility builds versatile leadership.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.floor(items.length * 0.45)}</div>
              <div className="text-xs text-blue-600">Ministry to Field</div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(items.length * 0.35)}</div>
              <div className="text-xs text-purple-600">Field to Ministry</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.ceil(items.length * 0.2)}</div>
              <div className="text-xs text-green-600">Cross-Ministry</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Moves (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 10).map((transfer) => {
                const officer = users.find(u => u.id === transfer.officerId);
                return (
                  <Card key={transfer.id} className="p-4 hover:shadow-md transition-shadow bg-fuchsia-50 border-fuchsia-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{officer?.name || transfer.officerName}</span>
                          <Badge variant="secondary">{transfer.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span><strong>From:</strong> {transfer.fromMinistry || transfer.fromRegion} → <strong>To:</strong> {transfer.toMinistry || transfer.toRegion}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Mobility Benefits</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Builds well-rounded leaders</li>
              <li>Improves field-policy coordination</li>
              <li>Enhances institutional cohesion</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Outstanding Training
    if (metricId === 'outstandingTraining') {
      const items = data as typeof users;
      const trainingTypes = ['Leadership Development', 'Digital Skills', 'Crisis Management', 'Financial Management', 'Public Service Ethics'];
      
      return (
        <div className="space-y-4">
          {renderHeader(Sparkles, 'bg-lime-50', 'Outstanding Training Requirements', `${items.length} officers have outstanding mandatory training. Timely completion ensures workforce competency.`)}
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{Math.floor(items.length * 0.3)}</div>
              <div className="text-xs text-red-600">Overdue (&gt;6 mo)</div>
            </Card>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{Math.floor(items.length * 0.4)}</div>
              <div className="text-xs text-amber-600">Due Soon</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.ceil(items.length * 0.3)}</div>
              <div className="text-xs text-blue-600">Scheduled</div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Officers with Outstanding Training (Sample)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.slice(0, 15).map((officer, idx) => (
                <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{officer.name}</span>
                        <Badge variant={idx % 3 === 0 ? 'destructive' : idx % 3 === 1 ? 'default' : 'secondary'}>
                          {idx % 3 === 0 ? 'Overdue' : idx % 3 === 1 ? 'Due Soon' : 'Scheduled'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span><strong>Role:</strong> {officer.role} | <strong>Required:</strong> {trainingTypes[idx % trainingTypes.length]} | <strong>Last Training:</strong> {idx % 3 === 0 ? '18 mo ago' : '10 mo ago'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Completion Strategy</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Prioritize overdue training</li>
              <li>Secure KES 4.2M budget allocation</li>
              <li>Partner with Kenya School of Government</li>
            </ul>
          </Card>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="space-y-4">
        {renderHeader(TrendingUp, 'bg-blue-50', `${metricName} Details`, `Current value: ${metricValue}. This metric provides insights into workforce management and operational efficiency.`)}
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">About This Metric</h4>
          <p className="text-sm text-blue-800">
            Detailed analytics for this metric provide real-time insights into the Ministry's workforce management system.
          </p>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#66023C] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{metricName}</h2>
            <p className="text-sm text-white/90 mt-1">Current Value: {metricValue}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
