import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { CountyCommissioner } from "@/data/countyCommissioners";
import { BarChart3, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface CountyPerformanceDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'performance' | 'budget' | 'utilization' | 'risks';
  commissioners: CountyCommissioner[];
  metrics?: {
    avgPerformance: string;
    totalBudget: string;
    avgUtilization: string;
    riskAlerts: number;
  };
}

export function CountyPerformanceDashboardDialog({ open, onOpenChange, type, commissioners, metrics }: CountyPerformanceDashboardDialogProps) {
  const formatCurrency = (amount: string) => {
    return amount;
  };

  const renderPerformanceDetails = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-2">Performance Score Overview</h3>
        <p className="text-sm text-blue-700">
          Performance scores are calculated based on key administrative metrics including project delivery, 
          security coordination, budget management, and citizen satisfaction across county jurisdictions.
        </p>
      </div>

      <div className="space-y-3">
        {commissioners
          .sort((a, b) => b.performanceScore - a.performanceScore)
          .map((cc) => (
            <Card key={cc.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{cc.fullName}</div>
                  <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                    {cc.county}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{cc.performanceScore}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-[10px] text-blue-600 font-semibold">Sub-Counties</div>
                  <div className="text-sm font-bold text-blue-900">{cc.subcountiesManaged}</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-[10px] text-green-600 font-semibold">Population</div>
                  <div className="text-sm font-bold text-green-900">{cc.populationServed}</div>
                </div>
                <div className="bg-violet-50 rounded p-2">
                  <div className="text-[10px] text-violet-600 font-semibold">D.C Managed</div>
                  <div className="text-sm font-bold text-violet-900">{cc.districtCommissioners}</div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {cc.expertise.slice(0, 2).map((exp, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] bg-gray-50">
                    {exp}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderBudgetDetails = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-bold text-lg text-green-900 mb-2">Budget Allocation Overview</h3>
        <p className="text-sm text-green-700">
          County budgets cover operational costs, security programs, administrative staff salaries, 
          and development initiatives within each county's jurisdiction.
        </p>
      </div>

      <div className="space-y-3">
        {commissioners
          .sort((a, b) => {
            const aAmount = parseFloat(a.budgetAllocated.replace(/[^\d.]/g, ''));
            const bAmount = parseFloat(b.budgetAllocated.replace(/[^\d.]/g, ''));
            return bAmount - aAmount;
          })
          .map((cc) => {
            const allocated = parseFloat(cc.budgetAllocated.replace(/[^\d.]/g, ''));
            const spent = parseFloat(cc.budgetSpent.replace(/[^\d.]/g, ''));
            const remaining = allocated - spent;

            return (
              <Card key={cc.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{cc.fullName}</div>
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                      {cc.county}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{cc.budgetAllocated}</div>
                    <div className="text-xs text-gray-500">Allocated</div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-[10px] text-green-600 font-semibold">Allocated</div>
                    <div className="text-sm font-bold text-green-900">{cc.budgetAllocated}</div>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-[10px] text-blue-600 font-semibold">Spent</div>
                    <div className="text-sm font-bold text-blue-900">{cc.budgetSpent}</div>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <div className="text-[10px] text-amber-600 font-semibold">Remaining</div>
                    <div className="text-sm font-bold text-amber-900">
                      KES {remaining.toFixed(0)}M
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Budget Utilization</span>
                    <span>{cc.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${cc.utilizationRate}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );

  const renderUtilizationDetails = () => (
    <div className="space-y-4">
      <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
        <h3 className="font-bold text-lg text-violet-900 mb-2">Budget Utilization Analysis</h3>
        <p className="text-sm text-violet-700">
          Utilization rates indicate how effectively County Commissioners are deploying allocated funds 
          for operational needs, projects, and administrative functions.
        </p>
      </div>

      <div className="space-y-3">
        {commissioners
          .sort((a, b) => b.utilizationRate - a.utilizationRate)
          .map((cc) => {
            const isHigh = cc.utilizationRate >= 90;
            const isMedium = cc.utilizationRate >= 80 && cc.utilizationRate < 90;
            const isLow = cc.utilizationRate < 80;

            return (
              <Card key={cc.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{cc.fullName}</div>
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                      {cc.county}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      isHigh ? 'text-green-700' : isMedium ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {cc.utilizationRate}%
                    </div>
                    <div className="text-xs text-gray-500">Utilization</div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-2 rounded flex items-center gap-2 ${
                  isHigh ? 'bg-green-50 border border-green-200' : 
                  isMedium ? 'bg-blue-50 border border-blue-200' : 
                  'bg-amber-50 border border-amber-200'
                }`}>
                  {isHigh ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                   isMedium ? <TrendingUp className="w-4 h-4 text-blue-600" /> :
                   <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  <span className={`text-xs font-semibold ${
                    isHigh ? 'text-green-700' : isMedium ? 'text-blue-700' : 'text-amber-700'
                  }`}>
                    {isHigh ? 'Excellent utilization - funds being deployed effectively' :
                     isMedium ? 'Good utilization - some room for improvement' :
                     'Low utilization - funds underutilized or delayed projects'}
                  </span>
                </div>

                {/* Budget Details */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-[10px] text-gray-600 font-semibold">Allocated</div>
                    <div className="text-sm font-bold text-gray-900">{cc.budgetAllocated}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-[10px] text-gray-600 font-semibold">Spent</div>
                    <div className="text-sm font-bold text-gray-900">{cc.budgetSpent}</div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );

  const renderRisksDetails = () => (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="font-bold text-lg text-red-900 mb-2">Risk Assessment</h3>
        <p className="text-sm text-red-700">
          Identifying potential challenges and areas requiring attention across county administrations 
          including low utilization, resource constraints, and operational challenges.
        </p>
      </div>

      <div className="space-y-3">
        {commissioners
          .map(cc => ({
            ...cc,
            riskScore: (
              (cc.utilizationRate < 85 ? 20 : 0) +
              (cc.performanceScore < 85 ? 20 : 0) +
              (cc.leaveBalance < 15 ? 15 : 0) +
              (cc.challenges.length > 2 ? 15 : 0) +
              (cc.recentTransfer ? 10 : 0)
            )
          }))
          .sort((a, b) => b.riskScore - a.riskScore)
          .map((cc) => {
            const hasRisks = cc.riskScore > 30;
            const hasMediumRisks = cc.riskScore > 15 && cc.riskScore <= 30;

            if (!hasRisks && !hasMediumRisks) return null;

            return (
              <Card key={cc.id} className="p-4 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{cc.fullName}</div>
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                      {cc.county}
                    </Badge>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    hasRisks ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <span className="text-xs font-bold">
                      {hasRisks ? 'High Risk' : 'Medium Risk'}
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="space-y-2">
                  {cc.utilizationRate < 85 && (
                    <div className="flex items-start gap-2 bg-amber-50 p-2 rounded border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-700">
                        <span className="font-semibold">Low Budget Utilization:</span> Only {cc.utilizationRate}% 
                        of allocated funds utilized - potential delays in project implementation
                      </div>
                    </div>
                  )}
                  {cc.performanceScore < 85 && (
                    <div className="flex items-start gap-2 bg-red-50 p-2 rounded border border-red-200">
                      <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-red-700">
                        <span className="font-semibold">Performance Concern:</span> Score at {cc.performanceScore}% 
                        - below optimal performance threshold
                      </div>
                    </div>
                  )}
                  {cc.leaveBalance < 15 && (
                    <div className="flex items-start gap-2 bg-amber-50 p-2 rounded border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-700">
                        <span className="font-semibold">Low Leave Balance:</span> Only {cc.leaveBalance} days remaining 
                        - potential burnout risk
                      </div>
                    </div>
                  )}
                  {cc.recentTransfer && (
                    <div className="flex items-start gap-2 bg-blue-50 p-2 rounded border border-blue-200">
                      <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-blue-700">
                        <span className="font-semibold">Recent Transfer:</span> {cc.recentTransfer} 
                        - adjustment period may affect performance
                      </div>
                    </div>
                  )}
                  {cc.challenges.length > 0 && (
                    <div className="flex items-start gap-2 bg-red-50 p-2 rounded border border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-red-700">
                        <span className="font-semibold">Operational Challenges:</span> {cc.challenges[0]}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
          .filter(Boolean)}

        {commissioners.every(cc => {
          const riskScore = (
            (cc.utilizationRate < 85 ? 20 : 0) +
            (cc.performanceScore < 85 ? 20 : 0) +
            (cc.leaveBalance < 15 ? 15 : 0)
          );
          return riskScore <= 15;
        }) && (
          <Card className="p-6 text-center bg-green-50 border-green-200">
            <div className="text-green-700">
              <div className="text-lg font-bold mb-2">✓ No Significant Risks Detected</div>
              <div className="text-sm">
                All County Commissioners are operating within acceptable performance and resource parameters.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const titles = {
    performance: 'County Commissioner Performance Dashboard',
    budget: 'County Budget Allocation Dashboard',
    utilization: 'Budget Utilization Analysis',
    risks: 'Risk Assessment Dashboard'
  };

  const descriptions = {
    performance: 'Comprehensive performance metrics for all County Commissioners across Kenya.',
    budget: 'Detailed budget allocation and spending analysis for each county jurisdiction.',
    utilization: 'Analysis of budget utilization rates and financial deployment efficiency.',
    risks: 'Identification and assessment of potential operational and administrative risks.'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-600" />
            {titles[type]}
          </DialogTitle>
          <DialogDescription>
            {descriptions[type]}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {type === 'performance' && renderPerformanceDetails()}
          {type === 'budget' && renderBudgetDetails()}
          {type === 'utilization' && renderUtilizationDetails()}
          {type === 'risks' && renderRisksDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
}