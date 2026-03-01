import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { TransferManagement } from '@/app/components/TransferManagement';
import { LeaveManagement } from '@/app/components/LeaveManagement';
import { AIReshuffle } from '@/app/components/AIReshuffle';
import { InsightDetails } from '@/app/components/InsightDetails';
import { StatisticDetails } from '@/app/components/StatisticDetails';
import { ITDashboard } from '@/app/components/ITDashboard';
import { 
  Users, Calendar, FileText, ArrowRight, CheckCircle2, Clock, 
  AlertCircle, TrendingUp, MapPin, BarChart3, Settings,
  Sparkles, GraduationCap, Award, Building2, Zap, BookOpen,
  UserCheck, UserX, Briefcase, Activity, Shield, DollarSign,
  Target, XCircle, AlertTriangle, Brain, LucideIcon, Info
} from 'lucide-react';
import { 
  users, 
  getRoleName, 
  canApproveTransfers, 
  canInitiateTransfers, 
  canUpdateLeaveStatus, 
  canManageReporting 
} from '@/data/users';
import { Transfer, transfers as initialTransfers, leaveRecords } from '@/data/transfersAndLeave';
import { ReportingStatusManagement } from '@/app/components/ReportingStatus';
import {
  calculateRetiringOfficers,
  calculateAwaitingDeployment,
  calculateOverallCoverageRate,
  calculateOutstandingTraining,
  calculateOfficersOnStudyLeave,
  calculateInterdepartmentalTransfers,
  calculateTransferRequestsReceived,
  calculateOfficersPostedToMinistries
} from '@/utils/insightCalculations';
import { filterTransfersByJurisdiction, getTransferViewDescription } from '@/utils/transferFilters';

interface MetricDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  bgColor: string;
  textColor?: string;
  getValue: () => number | string;
  onClick?: () => void;
}

export function RoleDashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'transfers' | 'leave' | 'reporting'>('overview');
  const [selectedCards, setSelectedCards] = useState<{ [key: number]: string }>({});
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [showAIReshuffle, setShowAIReshuffle] = useState(false);
  const [allTransfers, setAllTransfers] = useState<Transfer[]>(initialTransfers);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [selectedStatistic, setSelectedStatistic] = useState<{ metricId: string; metricName: string; metricValue: number | string } | null>(null);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);

  if (!user) return null;

  const roleName = getRoleName(user.role);
  
  // Show IT Dashboard for IT Manager
  if (user.role === 'IT') {
    return <ITDashboard />;
  }
  
  // Filter transfers based on user's role and jurisdiction
  const filteredTransfers = filterTransfersByJurisdiction(allTransfers, user);
  const transferViewDescription = getTransferViewDescription(user);
  
  // Calculate statistics using filtered transfers
  const pendingTransfers = filteredTransfers.filter(t => t.status === 'pending_approval').length;
  const draftedTransfers = filteredTransfers.filter(t => t.status === 'drafted').length;
  const activeLeaveRecords = leaveRecords.filter(l => l.status === 'on_leave' || l.status === 'study_leave').length;
  const totalOfficers = users.length;
  const completedTransfers = filteredTransfers.filter(t => t.status === 'approved' || t.status === 'completed').length;
  const activeofficers = leaveRecords.filter(l => l.status === 'active').length;
  const officersDueForPromotion = Math.floor(totalOfficers * 0.15);
  
  // Use shared calculations for consistency with modals
  const officersOnStudyLeave = calculateOfficersOnStudyLeave();
  const officersAwaitingDeployment = calculateAwaitingDeployment();
  const regionalCoverageRate = calculateOverallCoverageRate();
  const officersWithOutstandingTraining = calculateOutstandingTraining();
  const officersNearingRetirement = calculateRetiringOfficers(user.role === 'RC' ? user.region : undefined).count;
  const transferRequestsReceived = calculateTransferRequestsReceived();
  const officersPostedToMinistries = calculateOfficersPostedToMinistries();
  const interdepartmentalTransfers = calculateInterdepartmentalTransfers();
  
  // Other metrics
  const vacantPositions = 8;
  const officersInTraining = 12;
  const disciplinaryCases = 2;
  const officersOnSickLeave = leaveRecords.filter(l => l.status === 'sick_leave').length;
  const performanceRatingAvg = 4.2;
  const emergencyDeployments = 1;
  const officersOnSuspension = leaveRecords.filter(l => l.status === 'suspended').length;
  const complianceReportsPending = 3;
  const budgetUtilizationRate = 87;
  const officersRequiringTransfer = 7;

  // Define all 20+ available metrics
  const availableMetrics: { [key: string]: MetricDefinition } = {
    pendingTransfers: { id: 'pendingTransfers', name: 'Pending Transfers', icon: FileText, bgColor: 'bg-gray-600', getValue: () => pendingTransfers, onClick: () => setActiveView('transfers') },
    activeLeave: { id: 'activeLeave', name: 'Active Leave', icon: Calendar, bgColor: 'bg-gray-600', getValue: () => activeLeaveRecords, onClick: () => setActiveView('leave') },
    totalOfficers: { id: 'totalOfficers', name: 'Total Officers', icon: Users, bgColor: 'bg-gray-600', getValue: () => totalOfficers },
    completedTransfers: { id: 'completedTransfers', name: 'Completed Transfers', icon: CheckCircle2, bgColor: 'bg-gray-600', getValue: () => completedTransfers, onClick: () => setActiveView('transfers') },
    activeOfficers: { id: 'activeOfficers', name: 'Active Officers', icon: UserCheck, bgColor: 'bg-gray-600', textColor: 'text-emerald-900', getValue: () => activeofficers },
    dueForPromotion: { id: 'dueForPromotion', name: 'Due for Promotion', icon: Award, bgColor: 'bg-amber-600', getValue: () => officersDueForPromotion },
    onStudyLeave: { id: 'onStudyLeave', name: 'On Study Leave', icon: GraduationCap, bgColor: 'bg-blue-600', getValue: () => officersOnStudyLeave, onClick: () => setActiveView('leave') },
    vacantPositions: { id: 'vacantPositions', name: 'Vacant Positions', icon: UserX, bgColor: 'bg-red-600', textColor: 'text-red-700', getValue: () => vacantPositions },
    awaitingDeployment: { id: 'awaitingDeployment', name: 'Awaiting Deployment', icon: Briefcase, bgColor: 'bg-indigo-600', getValue: () => officersAwaitingDeployment },
    regionalCoverage: { id: 'regionalCoverage', name: 'Regional Coverage', icon: MapPin, bgColor: 'bg-green-600', textColor: 'text-green-700', getValue: () => `${regionalCoverageRate}%` },
    inTraining: { id: 'inTraining', name: 'In Training', icon: BookOpen, bgColor: 'bg-teal-600', getValue: () => officersInTraining },
    disciplinaryCases: { id: 'disciplinaryCases', name: 'Disciplinary Cases', icon: Shield, bgColor: 'bg-orange-600', textColor: 'text-orange-700', getValue: () => disciplinaryCases },
    onSickLeave: { id: 'onSickLeave', name: 'On Sick Leave', icon: Activity, bgColor: 'bg-pink-600', getValue: () => officersOnSickLeave, onClick: () => setActiveView('leave') },
    transferRequests: { id: 'transferRequests', name: 'Transfer Requests', icon: FileText, bgColor: 'bg-cyan-600', getValue: () => transferRequestsReceived, onClick: () => setActiveView('transfers') },
    postedToMinistries: { id: 'postedToMinistries', name: 'Posted to Ministries', icon: Building2, bgColor: 'bg-violet-600', getValue: () => officersPostedToMinistries },
    performanceAvg: { id: 'performanceAvg', name: 'Performance Avg', icon: TrendingUp, bgColor: 'bg-emerald-600', textColor: 'text-emerald-700', getValue: () => `${performanceRatingAvg}/5.0` },
    nearingRetirement: { id: 'nearingRetirement', name: 'Nearing Retirement', icon: Clock, bgColor: 'bg-gray-700', getValue: () => officersNearingRetirement },
    emergencyDeploys: { id: 'emergencyDeploys', name: 'Emergency Deploys', icon: Zap, bgColor: 'bg-red-700', textColor: 'text-red-700', getValue: () => emergencyDeployments },
    onSuspension: { id: 'onSuspension', name: 'On Suspension', icon: XCircle, bgColor: 'bg-rose-600', textColor: 'text-rose-700', getValue: () => officersOnSuspension, onClick: () => setActiveView('leave') },
    compliancePending: { id: 'compliancePending', name: 'Compliance Pending', icon: AlertTriangle, bgColor: 'bg-yellow-600', textColor: 'text-yellow-700', getValue: () => complianceReportsPending },
    budgetUtilization: { id: 'budgetUtilization', name: 'Budget Utilization', icon: DollarSign, bgColor: 'bg-blue-700', textColor: 'text-blue-700', getValue: () => `${budgetUtilizationRate}%` },
    requiringTransfer: { id: 'requiringTransfer', name: 'Requiring Transfer', icon: Target, bgColor: 'bg-slate-600', getValue: () => officersRequiringTransfer, onClick: () => setActiveView('transfers') },
    interdepartmental: { id: 'interdepartmental', name: 'Interdepartmental', icon: ArrowRight, bgColor: 'bg-fuchsia-600', getValue: () => interdepartmentalTransfers, onClick: () => setActiveView('transfers') },
    outstandingTraining: { id: 'outstandingTraining', name: 'Outstanding Training', icon: Sparkles, bgColor: 'bg-lime-600', getValue: () => officersWithOutstandingTraining },
  };

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`dashboard-cards-${user.username}`);
    if (savedPreferences) {
      setSelectedCards(JSON.parse(savedPreferences));
    } else {
      // Default cards
      setSelectedCards({
        0: 'pendingTransfers',
        1: 'activeLeave',
        2: 'totalOfficers',
        3: 'completedTransfers',
        4: 'activeOfficers'
      });
    }
  }, [user.username]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(selectedCards).length > 0) {
      localStorage.setItem(`dashboard-cards-${user.username}`, JSON.stringify(selectedCards));
    }
  }, [selectedCards, user.username]);

  const handleCardSelection = (cardIndex: number, metricId: string) => {
    setSelectedCards(prev => ({
      ...prev,
      [cardIndex]: metricId
    }));
    setShowDropdown(null);
  };

  // Render customizable metric card
  const renderMetricCard = (cardIndex: number) => {
    const metricId = selectedCards[cardIndex] || Object.keys(availableMetrics)[cardIndex];
    const metric = availableMetrics[metricId];
    
    if (!metric) return null;

    const Icon = metric.icon;
    
    return (
      <Card 
        key={cardIndex}
        className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 !bg-[#f5ebe0] !border-[#ced4da] relative bg-[rgb(243,225,206)]"
        onClick={() => setSelectedStatistic({ metricId: metric.id, metricName: metric.name, metricValue: metric.getValue() })}
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(showDropdown === cardIndex ? null : cardIndex);
            }}
            className="p-1 hover:bg-gray-300 rounded transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
          </button>
          
          {showDropdown === cardIndex && (
            <div className="absolute right-0 top-8 w-56 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
              <div className="p-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-700">Select Metric</p>
              </div>
              <div className="p-1">
                {Object.values(availableMetrics).map((m) => {
                  const MIcon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardSelection(cardIndex, m.id);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-left ${
                        metricId === m.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className={`${m.bgColor} p-1 rounded`}>
                        <MIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`${metric.bgColor} p-1.5 rounded-md`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-800">{metric.name}</span>
          </div>
        </div>
        <p className={`text-2xl font-bold ${metric.textColor || 'text-gray-900'}`}>{metric.getValue()}</p>
      </Card>
    );
  };

  // Show specific component based on view
  if (activeView === 'transfers') {
    return (
      <div>
        <Button variant="ghost" onClick={() => {
          setActiveView('overview');
          setSelectedTransferId(null);
        }} className="mb-4">
          ← Back to Overview
        </Button>
        <TransferManagement 
          initialTransfersList={allTransfers}
          onTransfersUpdate={(updatedTransfers) => setAllTransfers(updatedTransfers)}
          initialSelectedTransferId={selectedTransferId}
          onTransferIdChange={(id) => setSelectedTransferId(id)}
        />
      </div>
    );
  }

  if (activeView === 'leave') {
    return (
      <div>
        <LeaveManagement onBack={() => setActiveView('overview')} />
      </div>
    );
  }

  if (activeView === 'reporting') {
    return (
      <div>
        <Button variant="ghost" onClick={() => setActiveView('overview')} className="mb-4">
          ← Back to Overview
        </Button>
        <ReportingStatusManagement />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 px-[24px] py-[12px]">
      {/* Compact Welcome Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(72,46,38)] mb-1">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-600">
              {roleName}
              {user.region && ` • ${user.region}`}
            </p>
          </div>
        </div>
      </div>

      {/* Customizable Quick Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[0, 1, 2, 3, 4].map((index) => renderMetricCard(index))}
      </div>

      {/* AI Insights Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Insights & Recommendations</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Generate role-specific insights */}
          {(() => {
            const insights = [];
            
            // Generate variation based on user ID for personalization
            const userIdNum = parseInt(user.id.replace(/\D/g, '')) || 1;
            const variation = userIdNum % 3; // 0, 1, or 2 for variation
            
            // Insight 1: Retirement Planning - varies by role AND user
            if (user.role === 'CS' || user.role === 'PS' || user.role === 'PAS') {
              insights.push({
                title: 'Upcoming Retirements - Strategic Planning Required',
                description: `${officersNearingRetirement} officers across all regions will retire in the next 12 months. Consider succession planning and identifying high-potential candidates for accelerated development programs.`,
                icon: AlertTriangle,
                color: 'bg-amber-50',
                iconColor: 'text-amber-600',
                borderColor: 'border-l-amber-500'
              });
            } else if (user.role === 'RC') {
              const regionOfficersRetiring = Math.max(1, Math.floor(officersNearingRetirement / 8));
              insights.push({
                title: `${user.region} Region: Retirement Alert`,
                description: `${regionOfficersRetiring} officer${regionOfficersRetiring > 1 ? 's' : ''} in ${user.region} ${regionOfficersRetiring > 1 ? 'are' : 'is'} due to retire within 12 months. Recommend initiating transfer requests to fill anticipated vacancies and ensure continuity of operations.`,
                icon: AlertTriangle,
                color: 'bg-amber-50',
                iconColor: 'text-amber-600',
                borderColor: 'border-l-amber-500'
              });
            } else if (user.role === 'CC') {
              const countyStaffing = 85 + (userIdNum % 10);
              insights.push({
                title: `${user.region}: County Staffing Status`,
                description: `Your county has ${countyStaffing}% staffing level. With 2 officers on extended leave, recommend activating contingency plans and requesting 1 additional officer for optimal coverage.`,
                icon: Users,
                color: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-l-blue-500'
              });
            } else if (user.role === 'DC') {
              const districtCoverage = 90 + (userIdNum % 8);
              insights.push({
                title: `District Operations - ${user.region}`,
                description: `Your district maintains ${districtCoverage}% operational coverage. Current workload analysis suggests reviewing duty rosters to balance officer assignments across sub-counties for optimal service delivery.`,
                icon: MapPin,
                color: 'bg-teal-50',
                iconColor: 'text-teal-600',
                borderColor: 'border-l-teal-500'
              });
            } else if (user.role === 'ACC') {
              const assistantWorkload = 12 + (userIdNum % 5);
              insights.push({
                title: 'Workload & Development Opportunity',
                description: `You're currently managing ${assistantWorkload} active cases. Your performance metrics indicate readiness for increased responsibility - consider discussing career progression with your DC.`,
                icon: TrendingUp,
                color: 'bg-green-50',
                iconColor: 'text-green-600',
                borderColor: 'border-l-green-500'
              });
            } else if (user.role === 'SNA') {
              insights.push({
                title: 'Transfer Request Backlog',
                description: `${transferRequestsReceived} transfer requests pending review. Recommend prioritizing ${interdepartmentalTransfers} interdepartmental transfers to optimize cross-ministry collaboration and skill distribution.`,
                icon: Zap,
                color: 'bg-purple-50',
                iconColor: 'text-purple-600',
                borderColor: 'border-l-purple-500'
              });
            } else if (user.role === 'US') {
              const ministryProjects = 3 + (userIdNum % 4);
              insights.push({
                title: 'Ministry Assignment Performance',
                description: `You're contributing to ${ministryProjects} key ministry projects. Your cross-functional collaboration score is above average - ideal timing to pursue specialized training for career advancement.`,
                icon: Building2,
                color: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                borderColor: 'border-l-indigo-500'
              });
            } else if (user.role === 'AS') {
              const supportTasks = 8 + (userIdNum % 6);
              insights.push({
                title: 'Administrative Excellence',
                description: `You're managing ${supportTasks} concurrent administrative tasks with 95% completion rate. Your efficiency metrics qualify you for leadership training programs in Q2 2026.`,
                icon: Award,
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                borderColor: 'border-l-emerald-500'
              });
            } else {
              insights.push({
                title: 'Performance & Development Opportunity',
                description: `Your current rating of ${performanceRatingAvg}/5.0 is above average. Consider applying for study leave or specialized training to enhance your promotion prospects.`,
                icon: TrendingUp,
                color: 'bg-green-50',
                iconColor: 'text-green-600',
                borderColor: 'border-l-green-500'
              });
            }

            // Insight 2: Workload & Coverage - varies by role AND region
            if (user.role === 'CS') {
              insights.push({
                title: 'National Coverage Analysis',
                description: `Nationwide staffing at ${regionalCoverageRate}%. Analysis identifies understaffing in Turkana, Marsabit, Wajir. Recommend strategic redeployment of ${officersAwaitingDeployment} officers to critical areas.`,
                icon: MapPin,
                color: 'bg-red-50',
                iconColor: 'text-red-600',
                borderColor: 'border-l-red-500'
              });
            } else if (user.role === 'PS' || user.role === 'PAS') {
              const lowCoverageRegions = ['Turkana', 'Marsabit', 'Wajir'];
              insights.push({
                title: 'Regional Coverage Imbalance Detected',
                description: `Analysis identifies understaffing in ${lowCoverageRegions.join(', ')}. Recommend redistributing ${officersAwaitingDeployment} officers awaiting deployment to improve coverage from ${regionalCoverageRate}% to 98%.`,
                icon: MapPin,
                color: 'bg-red-50',
                iconColor: 'text-red-600',
                borderColor: 'border-l-red-500'
              });
            } else if (user.role === 'RC') {
              const regionOfficersOnLeave = Math.max(2, Math.floor(activeLeaveRecords / 8));
              insights.push({
                title: `${user.region}: Regional Leave Impact`,
                description: `${regionOfficersOnLeave} officers in your region currently on leave. Regional workload analysis suggests coordinating with neighboring counties for temporary resource sharing during peak periods.`,
                icon: Users,
                color: 'bg-orange-50',
                iconColor: 'text-orange-600',
                borderColor: 'border-l-orange-500'
              });
            } else if (user.role === 'CC') {
              const ccLeaveImpact = 2 + (userIdNum % 3);
              insights.push({
                title: `${user.region}: Active Leave Impact`,
                description: `${ccLeaveImpact} officers in your county currently on leave. Workload distribution analysis suggests activating relief officers for units with >30% staff on leave to maintain service delivery standards.`,
                icon: Users,
                color: 'bg-orange-50',
                iconColor: 'text-orange-600',
                borderColor: 'border-l-orange-500'
              });
            } else if (user.role === 'DC') {
              const dcAreaCoverage = ['Eastern District', 'Western District', 'Northern District'][userIdNum % 3];
              insights.push({
                title: `${dcAreaCoverage}: Coverage Optimization`,
                description: `Your district shows strong coverage in urban areas but rural zones need attention. Recommend rotating 2 officers to remote stations for balanced territorial coverage.`,
                icon: MapPin,
                color: 'bg-yellow-50',
                iconColor: 'text-yellow-700',
                borderColor: 'border-l-yellow-500'
              });
            } else if (user.role === 'ACC') {
              const myLeaveBalance = 18 + (userIdNum % 4);
              insights.push({
                title: 'Leave Balance Optimization',
                description: `You have ${myLeaveBalance} annual leave days remaining. Historical data shows optimal leave utilization patterns suggest taking leave in Q1 or Q3 for better work-life balance.`,
                icon: Calendar,
                color: 'bg-teal-50',
                iconColor: 'text-teal-600',
                borderColor: 'border-l-teal-500'
              });
            } else if (user.role === 'SNA') {
              insights.push({
                title: 'Ministry Staffing Analysis',
                description: `Current deployment shows ${officersPostedToMinistries} officers across ministries. Analysis suggests 3 additional officers needed in Ministry of Health and Ministry of Education to meet workload demands.`,
                icon: Building2,
                color: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-l-blue-500'
              });
            } else if (user.role === 'US' || user.role === 'AS') {
              const myMinistry = ['Ministry of Health', 'Ministry of Education', 'Ministry of Transport', 'Ministry of Agriculture'][userIdNum % 4];
              insights.push({
                title: `${myMinistry}: Resource Allocation`,
                description: `Your ministry has received 15% budget increase for 2026. This creates opportunities for capacity building programs and potential staff expansion - stay engaged with planning sessions.`,
                icon: DollarSign,
                color: 'bg-green-50',
                iconColor: 'text-green-600',
                borderColor: 'border-l-green-500'
              });
            } else {
              insights.push({
                title: 'Leave Balance Optimization',
                description: `You have ${21 - (userIdNum % 8)} annual leave days remaining. Historical data shows optimal leave utilization patterns suggest taking leave in Q1 or Q3 for better work-life balance.`,
                icon: Calendar,
                color: 'bg-teal-50',
                iconColor: 'text-teal-600',
                borderColor: 'border-l-teal-500'
              });
            }

            // Insight 3: Training & Development - varies by role AND user specifics
            if (user.role === 'CS') {
              insights.push({
                title: 'National Capacity Building Strategy',
                description: `${officersWithOutstandingTraining} officers nationwide need mandatory training. Budget allocation of KES 4.2M recommended. Prioritize leadership programs for 22 senior officers identified for promotion.`,
                icon: GraduationCap,
                color: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                borderColor: 'border-l-indigo-500'
              });
            } else if (user.role === 'PS') {
              insights.push({
                title: 'Capacity Building Investment Needed',
                description: `${officersWithOutstandingTraining} officers have pending mandatory training requirements. Budget allocation of KES 4.2M recommended to complete certification programs and maintain compliance at 100%.`,
                icon: GraduationCap,
                color: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                borderColor: 'border-l-indigo-500'
              });
            } else if (user.role === 'PAS' || user.role === 'SNA') {
              insights.push({
                title: 'Study Leave Trend Analysis',
                description: `${officersOnStudyLeave} officers currently on study leave (up 15% YoY). Recommend establishing knowledge-sharing sessions post-study to maximize ROI and institutional learning.`,
                icon: BookOpen,
                color: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-l-blue-500'
              });
            } else if (user.role === 'RC') {
              const regionPromotionReady = Math.max(2, Math.floor(officersDueForPromotion / 8));
              insights.push({
                title: `${user.region}: Officer Development Pipeline`,
                description: `${regionPromotionReady} officers in your region eligible for promotion. Performance data suggests organizing leadership training for top candidates to prepare for advancement opportunities in Q2 2026.`,
                icon: Award,
                color: 'bg-yellow-50',
                iconColor: 'text-yellow-700',
                borderColor: 'border-l-yellow-500'
              });
            } else if (user.role === 'CC') {
              const countyPromotionReady = 1 + (userIdNum % 3);
              insights.push({
                title: 'County Officer Development',
                description: `${countyPromotionReady} officer${countyPromotionReady > 1 ? 's' : ''} in your county ${countyPromotionReady > 1 ? 'are' : 'is'} promotion-eligible. Recommend coordinating with RC to organize leadership training and succession planning workshops.`,
                icon: Award,
                color: 'bg-yellow-50',
                iconColor: 'text-yellow-700',
                borderColor: 'border-l-yellow-500'
              });
            } else if (user.role === 'DC') {
              const myTeamSize = 4 + (userIdNum % 3);
              insights.push({
                title: 'Team Development Initiative',
                description: `Your team of ${myTeamSize} ACCs shows strong performance metrics. Recommend nominating 2 high-performers for advanced training programs to build district leadership capacity.`,
                icon: Users,
                color: 'bg-purple-50',
                iconColor: 'text-purple-600',
                borderColor: 'border-l-purple-500'
              });
            } else if (user.role === 'ACC') {
              const monthsToPromotion = 8 + (userIdNum % 6);
              insights.push({
                title: 'Career Advancement Pathway',
                description: `Based on tenure and performance, you're on track for promotion review in ${monthsToPromotion}-${monthsToPromotion + 4} months. Completing 2 additional certifications would strengthen your candidacy significantly.`,
                icon: Target,
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                borderColor: 'border-l-emerald-500'
              });
            } else if (user.role === 'US') {
              const trainingOpportunities = ['Strategic Leadership', 'Public Policy Analysis', 'Digital Governance', 'Project Management'][userIdNum % 4];
              insights.push({
                title: 'Professional Development Opportunity',
                description: `New ${trainingOpportunities} program launching in March 2026. Your profile matches program requirements - early application recommended for under-secretary track preparation.`,
                icon: GraduationCap,
                color: 'bg-blue-50',
                iconColor: 'text-blue-600',
                borderColor: 'border-l-blue-500'
              });
            } else if (user.role === 'AS') {
              const skillGap = ['Data Analytics', 'Policy Writing', 'Stakeholder Engagement', 'Financial Management'][userIdNum % 4];
              insights.push({
                title: 'Skill Enhancement Recommendation',
                description: `Analysis of your role requirements identifies ${skillGap} as a growth area. Ministry-sponsored certification program available - completion could accelerate your advancement to Under Secretary.`,
                icon: Sparkles,
                color: 'bg-violet-50',
                iconColor: 'text-violet-600',
                borderColor: 'border-l-violet-500'
              });
            } else {
              insights.push({
                title: 'Career Advancement Pathway',
                description: `Based on tenure and performance, you're on track for promotion review in 8-12 months. Completing 2 additional certifications would strengthen your candidacy significantly.`,
                icon: Target,
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                borderColor: 'border-l-emerald-500'
              });
            }

            return insights.map((insight, index) => {
              const InsightIcon = insight.icon;
              return (
                <Card 
                  key={index} 
                  className={`${insight.color} border-l-4 ${insight.borderColor} border-gray-200 cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedInsight(insight.title)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <InsightIcon className={`w-5 h-5 ${insight.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            });
          })()}
        </div>
      </div>

      {/* Compact Action Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-6">
        {/* Transfer Management */}
        {(canApproveTransfers(user.role) || canInitiateTransfers(user.role)) && (
          <Card className="p-4 bg-[#F5F5DC] border-[#66023C]/20 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E8DCC8] p-2 rounded-lg">
                <ArrowRight className="w-5 h-5 text-[#66023C]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Transfer Management</h3>
                <p className="text-xs text-gray-600">Manage officer transfers</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {canInitiateTransfers(user.role) && (
                <button 
                  onClick={() => setActiveView('transfers')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#E8DCC8] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.role === 'SNA' ? 'Draft New Transfer' : 'Initiate Transfer'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              )}
              
              {canApproveTransfers(user.role) && (
                <button 
                  onClick={() => setActiveView('transfers')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#E8DCC8] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Review Pending</span>
                    {pendingTransfers > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">{pendingTransfers}</Badge>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              )}
              
              {/* AI Reshuffle Button - Only for PS, PAS, and SNA */}
              {(user.role === 'PS' || user.role === 'PAS' || user.role === 'SNA') && (
                <button 
                  onClick={() => setShowAIReshuffle(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#E8DCC8] hover:bg-[#D2B48C] transition-all border border-[#66023C]/30"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#66023C]" />
                    <span className="text-sm font-medium text-[#66023C]">AI Reshuffle</span>
                    <Sparkles className="w-3 h-3 text-[#66023C]" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#66023C]/60" />
                </button>
              )}
              
              <button 
                onClick={() => setActiveView('transfers')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#E8DCC8] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Transfer History</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </Card>
        )}

        {/* My Leave */}
        <Card className="p-4 bg-[#F5F5DC] border-[#66023C]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E8DCC8] p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-[#66023C]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Leave</h3>
              <p className="text-xs text-gray-600">Manage leave applications</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => setActiveView('leave')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Apply for Leave</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => setActiveView('leave')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Leave Balance</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => setActiveView('leave')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">My Applications</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </Card>

        {/* Leave Management (for supervisors) */}
        {canUpdateLeaveStatus(user.role) && (
          <Card className="p-4 bg-[#F5F5DC] border-[#66023C]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E8DCC8] p-2 rounded-lg">
                <Users className="w-5 h-5 text-[#66023C]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leave Management</h3>
                <p className="text-xs text-gray-600">Manage team leave</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveView('leave')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Update Leave Status</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => setActiveView('leave')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Active Records</span>
                  {activeLeaveRecords > 0 && (
                    <Badge className="bg-amber-500 text-white text-xs">{activeLeaveRecords}</Badge>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </Card>
        )}

        {/* Reporting Status */}
        {canManageReporting(user.role) && (
          <Card className="p-4 bg-[#F5F5DC] border-[#66023C]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E8DCC8] p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#66023C]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reporting Status</h3>
                <p className="text-xs text-gray-600">Track officer reporting</p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveView('reporting')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Track Reporting</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </Card>
        )}
      </div>

      {/* Recent Transfers - Compact */}
      {/* Transfer View Filter Banner - Only show for non-top-level users */}
      {!['CS', 'PS', 'PAS'].includes(user.role) && transferViewDescription && (
        <Card className="mb-4 bg-[#E8DCC8] border-[#66023C]/30">
          <div className="p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#66023C] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-900 leading-relaxed">
              <span className="font-semibold">Transfer View:</span> {transferViewDescription}
            </p>
          </div>
        </Card>
      )}
      
      <Card className="border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Transfers</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setActiveView('transfers')}
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {filteredTransfers.slice(0, 5).map((transfer) => {
              // Determine who requested/initiated the transfer
              const requesterName = transfer.initiatedByName || transfer.draftedByName;
              const requester = requesterName ? users.find(u => u.name === requesterName) : null;
              const approver = transfer.approvedByName ? users.find(u => u.name === transfer.approvedByName) : null;
              
              return (
                <div 
                  key={transfer.id} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {/* Column 1: Icon + Officer Name */}
                  <div className="flex items-center gap-2 w-40 flex-shrink-0">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-sm text-gray-900 truncate">{transfer.officerName}</span>
                  </div>
                  
                  {/* Column 2: Transfer Route (From → To) */}
                  <div className="flex items-center gap-2 w-64 flex-shrink-0">
                    <span className="text-sm text-gray-600 truncate">{transfer.fromLocation}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{transfer.toLocation}</span>
                  </div>
                  
                  {/* Column 3: Requested Date */}
                  <div className="text-xs text-gray-600 w-48 flex-shrink-0">
                    <span className="text-gray-500 whitespace-nowrap">Requested date:</span>{' '}
                    <span className="font-medium">{transfer.initiatedDate || transfer.draftedDate || transfer.effectiveDate}</span>
                  </div>
                  
                  {/* Column 4: Initiated By - Full name and role */}
                  <div className="text-xs flex-shrink-0 ml-16">
                    <span className="text-gray-500">By:</span>{' '}
                    <span className="font-medium text-gray-600">
                      {requester ? `${requester.name}, ${getRoleName(requester.role)}` : requesterName || 'Unknown'}
                    </span>
                  </div>
                  
                  {/* Spacer to push status and button to the right */}
                  <div className="flex-1"></div>
                  
                  {/* Status Badge */}
                  <Badge 
                    className={
                      transfer.status === 'approved' 
                        ? 'bg-green-100 text-green-700 text-xs whitespace-nowrap flex-shrink-0' 
                        : transfer.status === 'pending_approval' 
                        ? 'bg-amber-100 text-amber-700 text-xs whitespace-nowrap flex-shrink-0' 
                        : transfer.status === 'completed'
                        ? 'bg-blue-100 text-blue-700 text-xs whitespace-nowrap flex-shrink-0'
                        : 'bg-gray-100 text-gray-700 text-xs whitespace-nowrap flex-shrink-0'
                    }
                  >
                    {transfer.status.replace('_', ' ')}
                  </Badge>
                  
                  {/* View Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 px-3 whitespace-nowrap flex-shrink-0"
                    onClick={() => {
                      setSelectedTransferId(transfer.id);
                      setActiveView('transfers');
                    }}
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Role Information - Compact */}
      <Card className="mt-4 bg-[#E8DCC8] border-[#66023C]/30">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#66023C] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Your Role & Responsibilities</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {user.role === 'SNA' && (
                <>As <span className="font-semibold">Secretary National Administrator</span>, you are the custodian of all data and can draft transfers for approval.</>
              )}
              {user.role === 'RC' && (
                <>As <span className="font-semibold">Regional Commissioner</span>, you can initiate transfers within your region for approval by P.A.S or P.S.</>
              )}
              {(user.role === 'PS' || user.role === 'PAS') && (
                <>As <span className="font-semibold">{roleName}</span>, you have the authority to approve all transfers and monitor reporting status.</>
              )}
              {(user.role === 'CC' || user.role === 'DC' || user.role === 'ACC') && (
                <>You can update leave status for officers under your supervision and manage reporting status.</>
              )}
              {(user.role === 'US' || user.role === 'AS') && (
                <>You are posted to a ministry and can view transfer history and manage your profile.</>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* AI Reshuffle Modal */}
      {showAIReshuffle && (
        <AIReshuffle
          onClose={() => setShowAIReshuffle(false)}
          onApprove={(proposals) => {
            // Create transfers from the AI reshuffle proposals
            const newTransfers: Transfer[] = proposals.map((proposal, index) => {
              const officer = users.find(u => u.id === proposal.officerId);
              const transferId = `ai_reshuffle_${Date.now()}_${index}`;
              
              return {
                id: transferId,
                officerId: proposal.officerId,
                officerName: proposal.officerName,
                officerRole: officer ? getRoleName(officer.role) : '',
                fromLocation: proposal.currentLocation,
                toLocation: proposal.proposedLocation,
                status: 'pending_approval' as const,
                initiatedBy: user.id,
                initiatedByName: user.name,
                initiatedDate: new Date().toISOString().split('T')[0],
                effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                reason: `AI-powered reshuffle: ${proposal.reason}. ${proposal.insight}`,
                reportingStatus: 'not_reported' as const,
              };
            });

            // Add new transfers to the beginning of the array (most recent first)
            setAllTransfers([...newTransfers, ...allTransfers]);
            
            alert(`${proposals.length} transfers have been created successfully and are now pending approval!`);
            setShowAIReshuffle(false);
          }}
        />
      )}

      {/* Insight Details Modal */}
      {selectedInsight && (
        <InsightDetails
          insightType={selectedInsight}
          onClose={() => setSelectedInsight(null)}
          userRole={user.role}
          userRegion={user.region}
        />
      )}

      {/* Statistic Details Modal */}
      {selectedStatistic && (
        <StatisticDetails
          metricId={selectedStatistic.metricId}
          metricName={selectedStatistic.metricName}
          metricValue={selectedStatistic.metricValue}
          onClose={() => setSelectedStatistic(null)}
          userRole={user.role}
          userRegion={user.region}
        />
      )}
    </div>
  );
}