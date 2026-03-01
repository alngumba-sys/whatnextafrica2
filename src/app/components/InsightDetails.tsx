import { X, AlertTriangle, MapPin, GraduationCap, TrendingUp, Calendar, Users, Building2, Award, Zap, Target, BookOpen, Briefcase, Activity, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { users } from '@/data/users';
import { transfers } from '@/data/transfersAndLeave';
import {
  calculateRetiringOfficers,
  calculateRegionalCoverage,
  getTrainingData
} from '@/utils/insightCalculations';

interface InsightDetailsProps {
  insightType: string;
  onClose: () => void;
  userRole: string;
  userRegion?: string;
}

export function InsightDetails({ insightType, onClose, userRole, userRegion }: InsightDetailsProps) {
  // Calculate retirement data using shared function
  const getRetirementData = () => {
    const today = new Date();
    const { officers: retiringOfficers } = calculateRetiringOfficers(userRole === 'RC' ? userRegion : undefined);

    return retiringOfficers.map(officer => {
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
  };

  // Calculate regional coverage data using shared function
  const getRegionalCoverageData = () => {
    return calculateRegionalCoverage();
  };

  // Calculate training data using shared function
  const getTrainingDataInfo = () => {
    return getTrainingData();
  };

  const renderRetirementDetails = () => {
    const data = getRetirementData();
    
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Retirement Planning Overview</h3>
              <p className="text-sm text-amber-800">
                {data.length} officer{data.length !== 1 ? 's' : ''} {userRole === 'RC' ? `in ${userRegion} region` : 'nationwide'} will reach retirement age in the next 12 months. 
                Immediate succession planning is required to ensure operational continuity.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-700">{data.filter(o => o.monthsUntilRetirement <= 3).length}</div>
            <div className="text-xs text-red-600">Retiring in 0-3 months</div>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{data.filter(o => o.monthsUntilRetirement > 3 && o.monthsUntilRetirement <= 6).length}</div>
            <div className="text-xs text-orange-600">Retiring in 4-6 months</div>
          </Card>
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{data.filter(o => o.monthsUntilRetirement > 6).length}</div>
            <div className="text-xs text-yellow-600">Retiring in 7-12 months</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Officers Nearing Retirement</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.map((officer, idx) => (
              <Card key={officer.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{officer.name}</span>
                      <Badge variant={officer.monthsUntilRetirement <= 3 ? 'destructive' : officer.monthsUntilRetirement <= 6 ? 'default' : 'secondary'}>
                        {officer.monthsUntilRetirement} months
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span><strong>Role:</strong> {officer.role}</span>
                        <span><strong>Station:</strong> {officer.currentStation || 'N/A'}</span>
                        <span><strong>Years of Service:</strong> {officer.yearsOfService} years</span>
                        <span><strong>Retirement Date:</strong> {officer.retirementDate.toLocaleDateString()}</span>
                      </div>
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
            <li>Identify high-potential candidates for accelerated development programs</li>
            <li>Initiate knowledge transfer sessions with retiring officers</li>
            <li>Review succession plans for critical positions</li>
            <li>Coordinate with HR for recruitment timelines</li>
            <li>Document institutional knowledge and processes</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderRegionalCoverageDetails = () => {
    const data = getRegionalCoverageData();
    const understaffed = data.filter(r => r.coverage < 95);
    const critical = data.filter(r => r.coverage < 85);
    
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Regional Coverage Analysis</h3>
              <p className="text-sm text-red-800">
                {critical.length} region{critical.length !== 1 ? 's' : ''} critically understaffed (&lt;85% coverage). 
                {understaffed.length} region{understaffed.length !== 1 ? 's' : ''} below optimal staffing levels.
                Strategic redeployment required to balance coverage nationwide.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-700">{critical.length}</div>
            <div className="text-xs text-red-600">Critical (&lt;85%)</div>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{understaffed.length - critical.length}</div>
            <div className="text-xs text-orange-600">Below Target (85-94%)</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">{data.length - understaffed.length}</div>
            <div className="text-xs text-green-600">Adequate (≥95%)</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Regional Staffing Breakdown</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.map((region) => (
              <Card key={region.region} className={`p-4 ${region.coverage < 85 ? 'bg-red-50 border-red-200' : region.coverage < 95 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={region.coverage < 85 ? 'destructive' : region.coverage < 95 ? 'default' : 'secondary'}>
                      {region.coverage}% Coverage
                    </Badge>
                    {region.awaitingDeployment > 0 && (
                      <Badge variant="outline">{region.awaitingDeployment} awaiting</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-700">
                  <span><strong>Current:</strong> {region.current} officers</span>
                  <span><strong>Required:</strong> {region.required} officers</span>
                  {region.shortage > 0 && (
                    <span className="text-red-600"><strong>Shortage:</strong> {region.shortage} officers</span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${region.coverage < 85 ? 'bg-red-600' : region.coverage < 95 ? 'bg-orange-500' : 'bg-green-600'}`}
                      style={{ width: `${Math.min(region.coverage, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Prioritize deployment of {data.reduce((sum, r) => sum + r.awaitingDeployment, 0)} officers awaiting assignment</li>
            <li>Initiate transfers from over-staffed regions (Nairobi, Mombasa) to understaffed areas</li>
            <li>Fast-track recruitment for regions with critical shortages</li>
            <li>Consider temporary deployment incentives for hardship areas</li>
            <li>Review workload distribution and adjust coverage requirements</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderTrainingDetails = () => {
    const data = getTrainingDataInfo();
    const totalBudget = data.programs.reduce((sum, p) => sum + p.budget, 0);
    const totalOfficers = data.programs.reduce((sum, p) => sum + p.officers, 0);
    
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-indigo-900 mb-1">Capacity Building & Training Needs</h3>
              <p className="text-sm text-indigo-800">
                {totalOfficers} officers require mandatory training across {data.programs.length} programs. 
                Total budget allocation of KES {(totalBudget / 1000000).toFixed(1)}M needed to maintain 100% compliance and enhance workforce capabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-700">{data.programs.filter(p => p.priority === 'High').length}</div>
            <div className="text-xs text-red-600">High Priority Programs</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">{totalOfficers}</div>
            <div className="text-xs text-green-600">Officers Requiring Training</div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">KES {(totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-blue-600">Total Budget Required</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Training Programs</h4>
          <div className="space-y-2">
            {data.programs.map((program, idx) => (
              <Card key={idx} className={`p-4 ${program.priority === 'High' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{program.name}</span>
                  <Badge variant={program.priority === 'High' ? 'destructive' : 'default'}>
                    {program.priority} Priority
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-700">
                  <span><strong>Officers:</strong> {program.officers}</span>
                  <span><strong>Budget:</strong> KES {(program.budget / 1000).toFixed(0)}K</span>
                  <span><strong>Deadline:</strong> {program.deadline}</span>
                  <span><strong>Per Officer:</strong> KES {Math.floor(program.budget / program.officers / 1000)}K</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Officers Requiring Training (Sample)</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.officers.map((officer) => (
              <Card key={officer.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{officer.name}</div>
                    <div className="text-xs text-gray-600">
                      {officer.role} • {officer.region} • Last training: {officer.lastTraining}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-900">{officer.trainingNeeded}</div>
                    <Badge variant={officer.priority === 'High' ? 'destructive' : 'secondary'} className="mt-1">
                      {officer.priority}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Prioritize high-priority programs (Leadership, Digital Governance, Crisis Management)</li>
            <li>Secure budget approval for KES {(totalBudget / 1000000).toFixed(1)}M training allocation</li>
            <li>Partner with Kenya School of Government for cost-effective delivery</li>
            <li>Implement phased training schedule to minimize operational disruption</li>
            <li>Establish post-training knowledge sharing and mentorship programs</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderTransferBacklogDetails = () => {
    const pendingTransfers = transfers.filter(t => t.status === 'pending_approval');
    const interdepartmental = transfers.filter(t => t.officerId.includes('SNA') || t.officerId.includes('US'));
    
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-purple-900 mb-1">Transfer Request Backlog Analysis</h3>
              <p className="text-sm text-purple-800">
                {pendingTransfers.length} transfer requests pending review. {interdepartmental.length} involve interdepartmental movements requiring prioritization for optimal cross-ministry collaboration and skill distribution.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-700">{pendingTransfers.filter(t => {
              const days = Math.floor((new Date().getTime() - new Date(t.initiatedDate).getTime()) / (1000 * 60 * 60 * 24));
              return days > 30;
            }).length}</div>
            <div className="text-xs text-red-600">Overdue (&gt;30 days)</div>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{interdepartmental.length}</div>
            <div className="text-xs text-orange-600">Interdepartmental</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">{transfers.filter(t => t.status === 'approved').length}</div>
            <div className="text-xs text-green-600">Approved This Month</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Pending Transfer Requests</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pendingTransfers.slice(0, 15).map((transfer) => {
              const officer = users.find(u => u.id === transfer.officerId);
              const daysWaiting = Math.floor((new Date().getTime() - new Date(transfer.initiatedDate).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <Card key={transfer.id} className={`p-4 ${daysWaiting > 30 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{officer?.name || 'Unknown Officer'}</span>
                    <Badge variant={daysWaiting > 30 ? 'destructive' : 'default'}>
                      {daysWaiting} days waiting
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-700">
                    <span><strong>From:</strong> {transfer.fromLocation}</span>
                    <span><strong>To:</strong> {transfer.toLocation}</span>
                    <span><strong>Initiated:</strong> {new Date(transfer.initiatedDate).toLocaleDateString()}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Prioritize {interdepartmental.length} interdepartmental transfers for strategic skill distribution</li>
            <li>Fast-track review of transfers pending more than 30 days</li>
            <li>Establish weekly review sessions to clear backlog</li>
            <li>Implement automated routing for routine transfers</li>
            <li>Coordinate with receiving departments for smooth onboarding</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderStudyLeaveDetails = () => {
    const onStudyLeave = users.filter(u => u.currentStation?.includes('Study Leave') || Math.random() > 0.95);
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Study Leave Trend Analysis</h3>
              <p className="text-sm text-blue-800">
                {onStudyLeave.length} officers currently on study leave, representing a 15% year-over-year increase. This investment in capacity building should be leveraged through knowledge-sharing sessions upon completion.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{onStudyLeave.length}</div>
            <div className="text-xs text-blue-600">Currently on Study Leave</div>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{Math.floor(onStudyLeave.length * 0.6)}</div>
            <div className="text-xs text-purple-600">Pursuing Masters Degrees</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">{Math.floor(onStudyLeave.length * 0.4)}</div>
            <div className="text-xs text-green-600">Short-term Certifications</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Study Programs Breakdown</h4>
          <div className="space-y-2">
            {[
              { program: 'Public Administration (MA)', count: Math.ceil(onStudyLeave.length * 0.3), duration: '2 years', institution: 'University of Nairobi' },
              { program: 'Strategic Leadership (MBA)', count: Math.ceil(onStudyLeave.length * 0.2), duration: '18 months', institution: 'Strathmore University' },
              { program: 'Digital Governance Certificate', count: Math.ceil(onStudyLeave.length * 0.15), duration: '6 months', institution: 'KSG' },
              { program: 'Security Management (MSc)', count: Math.ceil(onStudyLeave.length * 0.15), duration: '2 years', institution: 'Kenyatta University' },
              { program: 'Policy Analysis Certificate', count: Math.ceil(onStudyLeave.length * 0.1), duration: '4 months', institution: 'KSG' },
              { program: 'Other Programs', count: Math.floor(onStudyLeave.length * 0.1), duration: 'Various', institution: 'Various' },
            ].map((program, idx) => (
              <Card key={idx} className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{program.program}</span>
                  <Badge>{program.count} officers</Badge>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-700">
                  <span><strong>Duration:</strong> {program.duration}</span>
                  <span><strong>Institution:</strong> {program.institution}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Recommended Actions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Establish mandatory knowledge-sharing sessions upon study leave completion</li>
            <li>Create mentorship programs pairing returning officers with junior staff</li>
            <li>Document and integrate new methodologies learned into operational procedures</li>
            <li>Track ROI on study leave investments through performance metrics</li>
            <li>Develop career progression pathways for officers completing advanced degrees</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderLeaveBalanceDetails = () => {
    const avgLeaveBalance = 18;
    
    return (
      <div className="space-y-4">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-teal-900 mb-1">Leave Balance Optimization</h3>
              <p className="text-sm text-teal-800">
                Your current leave balance of {avgLeaveBalance} days represents an opportunity for work-life balance. Historical data suggests optimal utilization patterns for maximizing rest while minimizing operational impact.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">{avgLeaveBalance}</div>
            <div className="text-xs text-green-600">Your Leave Days Available</div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">22</div>
            <div className="text-xs text-blue-600">Annual Entitlement</div>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-2xl font-bold text-orange-700">4</div>
            <div className="text-xs text-orange-600">Days Used This Year</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Optimal Leave Planning Recommendations</h4>
          <div className="space-y-2">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Q1 2026 (March)</span>
                <Badge variant="default">Recommended</Badge>
              </div>
              <p className="text-xs text-gray-700">
                Low operational period. Ideal for 7-10 days continuous leave. Weather favorable for personal activities.
              </p>
            </Card>
            
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Q2 2026 (April-June)</span>
                <Badge variant="secondary">Moderate</Badge>
              </div>
              <p className="text-xs text-gray-700">
                Budget planning period. Consider 3-5 day breaks. Avoid May (peak reporting season).
              </p>
            </Card>
            
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Q3 2026 (August-September)</span>
                <Badge variant="default">Recommended</Badge>
              </div>
              <p className="text-xs text-gray-700">
                Optimal for 5-7 days. School holidays align well for family time. Lower workload typically.
              </p>
            </Card>
            
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Q4 2026 (December)</span>
                <Badge variant="destructive">Avoid</Badge>
              </div>
              <p className="text-xs text-gray-700">
                Year-end reporting and planning. High demand period. Consider early December if necessary.
              </p>
            </Card>
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Leave Utilization Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Plan leave at least 3 weeks in advance for smooth handover</li>
            <li>Aim to use at least 15 days annually for optimal work-life balance</li>
            <li>Consider breaking into 2-3 periods rather than one long stretch</li>
            <li>Coordinate with team members to ensure coverage</li>
            <li>Avoid carrying over more than 5 days to next year</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderCareerAdvancementDetails = () => {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-emerald-900 mb-1">Career Advancement Pathway</h3>
              <p className="text-sm text-emerald-800">
                Based on your tenure and performance, you're on track for promotion review in 8-12 months. Strategic actions now can significantly strengthen your candidacy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">8-12</div>
            <div className="text-xs text-green-600">Months to Review</div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">4.2/5.0</div>
            <div className="text-xs text-blue-600">Performance Rating</div>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="text-2xl font-bold text-purple-700">85%</div>
            <div className="text-xs text-purple-600">Promotion Probability</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Actions to Strengthen Your Candidacy</h4>
          <div className="space-y-2">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Complete Strategic Leadership Certificate</div>
                  <p className="text-xs text-gray-700">Kenya School of Government offers 6-week program starting March 2026. Highly valued for promotion.</p>
                  <Badge className="mt-2">High Impact</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Lead Cross-Departmental Project</div>
                  <p className="text-xs text-gray-700">Volunteer for inter-county coordination initiative. Demonstrates leadership across boundaries.</p>
                  <Badge className="mt-2" variant="secondary">Medium Impact</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Achieve 4.5+ Performance Rating</div>
                  <p className="text-xs text-gray-700">Focus on exceeding targets in Q1 and Q2 2026. Discuss specific metrics with supervisor.</p>
                  <Badge className="mt-2">High Impact</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Mentor Junior Officers</div>
                  <p className="text-xs text-gray-700">Formally mentor 2-3 Assistant Commissioners. Shows leadership readiness.</p>
                  <Badge className="mt-2" variant="secondary">Medium Impact</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Promotion Timeline</h4>
          <div className="space-y-3 mt-3">
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-blue-700 w-20">Mar 2026</div>
              <div className="flex-1 text-sm text-gray-700">Complete leadership training</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-blue-700 w-20">Jun 2026</div>
              <div className="flex-1 text-sm text-gray-700">Mid-year performance review</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-blue-700 w-20">Sep 2026</div>
              <div className="flex-1 text-sm text-gray-700">Submit promotion application</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-blue-700 w-20">Dec 2026</div>
              <div className="flex-1 text-sm text-gray-700">Promotion board review</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderPerformanceDetails = () => {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-green-900 mb-1">Performance & Development Analysis</h3>
              <p className="text-sm text-green-800">
                Your current rating of 4.2/5.0 places you in the top 30% of officers nationally. This strong performance creates opportunities for specialized training and career advancement.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-700">4.2/5.0</div>
            <div className="text-xs text-green-600">Your Rating</div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-700">3.6/5.0</div>
            <div className="text-xs text-blue-600">National Average</div>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="text-2xl font-bold text-purple-700">Top 30%</div>
            <div className="text-xs text-purple-600">Your Percentile</div>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Development Opportunities</h4>
          <div className="space-y-2">
            {[
              { 
                name: 'Strategic Leadership Program', 
                provider: 'Kenya School of Government',
                duration: '6 weeks',
                eligibility: 'Officers rated 4.0+',
                impact: 'Career advancement, leadership roles',
                status: 'Eligible'
              },
              { 
                name: 'Advanced Policy Analysis', 
                provider: 'Harvard Kennedy School (Online)',
                duration: '12 weeks',
                eligibility: 'High performers with 5+ years',
                impact: 'Policy-making roles, strategic positions',
                status: 'Eligible'
              },
              { 
                name: 'Digital Transformation Certificate', 
                provider: 'Kenya School of Government',
                duration: '4 weeks',
                eligibility: 'All officers',
                impact: 'Modern governance skills',
                status: 'Eligible'
              },
            ].map((program, idx) => (
              <Card key={idx} className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{program.name}</span>
                  <Badge variant="default">{program.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2">
                  <div><strong>Provider:</strong> {program.provider}</div>
                  <div><strong>Duration:</strong> {program.duration}</div>
                  <div className="col-span-2"><strong>Eligibility:</strong> {program.eligibility}</div>
                  <div className="col-span-2"><strong>Career Impact:</strong> {program.impact}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Apply for Strategic Leadership Program by March 15, 2026</li>
            <li>Schedule career development discussion with your supervisor</li>
            <li>Consider study leave application for advanced degree programs</li>
            <li>Join professional networks (e.g., Kenya Public Service Association)</li>
            <li>Document your achievements for promotion portfolio</li>
          </ul>
        </Card>
      </div>
    );
  };

  const getModalContent = () => {
    if (insightType.includes('Retirement') || insightType.includes('retirement')) {
      return renderRetirementDetails();
    } else if (insightType.includes('Coverage') || insightType.includes('Staffing') || insightType.includes('coverage')) {
      return renderRegionalCoverageDetails();
    } else if (insightType.includes('Training') || insightType.includes('Capacity') || insightType.includes('training') || insightType.includes('Development') && (userRole === 'CS' || userRole === 'PS' || userRole === 'PAS')) {
      return renderTrainingDetails();
    } else if (insightType.includes('Transfer') || insightType.includes('transfers')) {
      return renderTransferBacklogDetails();
    } else if (insightType.includes('Study Leave') || insightType.includes('study leave')) {
      return renderStudyLeaveDetails();
    } else if (insightType.includes('Leave Balance') || insightType.includes('leave balance')) {
      return renderLeaveBalanceDetails();
    } else if (insightType.includes('Career Advancement') || insightType.includes('career advancement')) {
      return renderCareerAdvancementDetails();
    } else if (insightType.includes('Performance') || insightType.includes('performance')) {
      return renderPerformanceDetails();
    } else {
      return (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Detailed analysis coming soon...</p>
          <p className="text-sm text-gray-500 mt-2">This insight type is being developed.</p>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#66023C] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Insight Details</h2>
            <p className="text-sm text-white/90 mt-1">{insightType}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {getModalContent()}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}