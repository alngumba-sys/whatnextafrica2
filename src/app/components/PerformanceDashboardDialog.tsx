import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { RegionalCommissioner } from "@/data/regionalCommissioners";
import { BarChart3, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface PerformanceDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'performance' | 'budget' | 'utilization' | 'risks';
  commissioners: RegionalCommissioner[];
}

export function PerformanceDashboardDialog({ open, onOpenChange, type, commissioners }: PerformanceDashboardDialogProps) {
  const formatCurrency = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  const renderPerformanceDetails = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-2">Performance Score Overview</h3>
        <p className="text-sm text-blue-700">
          Performance scores are calculated quarterly based on security incidents handled, project completion rates, 
          budget efficiency, and citizen satisfaction metrics.
        </p>
      </div>

      <div className="space-y-3">
        {commissioners
          .map(rc => ({
            ...rc,
            latestScore: rc.historicalData?.performanceTrend?.[rc.historicalData.performanceTrend.length - 1]?.score || 0,
            previousScore: rc.historicalData?.performanceTrend?.[rc.historicalData.performanceTrend.length - 2]?.score || 0
          }))
          .sort((a, b) => b.latestScore - a.latestScore)
          .map((rc) => {
            const change = rc.latestScore - rc.previousScore;
            return (
              <Card key={rc.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{rc.fullName}</div>
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                      {rc.region}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{rc.latestScore}</div>
                    <div className="text-xs text-gray-500">Latest Score</div>
                  </div>
                </div>

                {/* Performance Trend */}
                <div className="flex items-center gap-2 mb-3">
                  {change > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-semibold">+{change} points from last quarter</span>
                    </>
                  ) : change < 0 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-semibold">{change} points from last quarter</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No change from last quarter</span>
                  )}
                </div>

                {/* Quarterly Trend */}
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Quarterly Performance</div>
                  <div className="flex items-end gap-1 h-16">
                    {rc.historicalData?.performanceTrend?.map((trend, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-600 rounded-t"
                          style={{ height: `${(trend.score / 100) * 100}%` }}
                        />
                        <div className="text-[10px] text-gray-500 mt-1">{trend.quarter}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-[10px] text-blue-600 font-semibold">Security</div>
                    <div className="text-sm font-bold text-blue-900">
                      {rc.performanceMetrics?.securityIncidentsHandled || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-[10px] text-green-600 font-semibold">Projects</div>
                    <div className="text-sm font-bold text-green-900">
                      {rc.performanceMetrics?.projectsCompleted || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <div className="text-[10px] text-amber-600 font-semibold">Satisfaction</div>
                    <div className="text-sm font-bold text-amber-900">
                      {rc.performanceMetrics?.citizenSatisfactionScore || 'N/A'}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );

  const renderBudgetDetails = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-bold text-lg text-green-900 mb-2">Budget Allocation Overview</h3>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <div className="text-sm text-green-700 font-semibold">Total Allocated</div>
            <div className="text-2xl font-bold text-green-900">
              KSh {(commissioners.reduce((sum, rc) => sum + (rc.budgetInfo?.allocated || 0), 0) / 1000000000).toFixed(2)}B
            </div>
          </div>
          <div>
            <div className="text-sm text-green-700 font-semibold">Total Spent</div>
            <div className="text-2xl font-bold text-green-900">
              KSh {(commissioners.reduce((sum, rc) => sum + (rc.budgetInfo?.spent || 0), 0) / 1000000000).toFixed(2)}B
            </div>
          </div>
          <div>
            <div className="text-sm text-green-700 font-semibold">Total Remaining</div>
            <div className="text-2xl font-bold text-green-900">
              KSh {(commissioners.reduce((sum, rc) => sum + (rc.budgetInfo?.remaining || 0), 0) / 1000000000).toFixed(2)}B
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {commissioners
          .filter(rc => rc.budgetInfo)
          .sort((a, b) => (b.budgetInfo?.allocated || 0) - (a.budgetInfo?.allocated || 0))
          .map((rc) => {
            const utilization = ((rc.budgetInfo!.spent / rc.budgetInfo!.allocated) * 100);
            const isHighUtilization = utilization >= 90;
            const isMediumUtilization = utilization >= 75;

            return (
              <Card key={rc.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{rc.fullName}</div>
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                      {rc.region}
                    </Badge>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    rc.budgetInfo!.yearOverYear.startsWith('+') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {rc.budgetInfo!.yearOverYear} YoY
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Allocated</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(rc.budgetInfo!.allocated)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Spent</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(rc.budgetInfo!.spent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Remaining</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(rc.budgetInfo!.remaining)}
                    </div>
                  </div>
                </div>

                {/* Budget Utilization Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-gray-700">Budget Utilization</div>
                    <div className={`text-sm font-bold ${
                      isHighUtilization ? 'text-red-600' : 
                      isMediumUtilization ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {utilization.toFixed(1)}%
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isHighUtilization ? 'bg-red-500' : 
                        isMediumUtilization ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
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
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h3 className="font-bold text-lg text-amber-900 mb-2">Budget Utilization Analysis</h3>
        <p className="text-sm text-amber-700">
          Budget utilization rates show how efficiently each region is using allocated resources. 
          Rates above 90% may indicate resource constraints, while rates below 50% may suggest underutilization.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* High Utilization */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="text-sm font-semibold text-red-900">High Utilization (≥90%)</div>
          </div>
          <div className="text-3xl font-bold text-red-900 mb-2">
            {commissioners.filter(rc => {
              if (!rc.budgetInfo) return false;
              const utilization = (rc.budgetInfo.spent / rc.budgetInfo.allocated) * 100;
              return utilization >= 90;
            }).length}
          </div>
          <div className="text-xs text-red-700">Regions may need additional resources</div>
        </Card>

        {/* Medium Utilization */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <div className="text-sm font-semibold text-amber-900">Medium Utilization (75-89%)</div>
          </div>
          <div className="text-3xl font-bold text-amber-900 mb-2">
            {commissioners.filter(rc => {
              if (!rc.budgetInfo) return false;
              const utilization = (rc.budgetInfo.spent / rc.budgetInfo.allocated) * 100;
              return utilization >= 75 && utilization < 90;
            }).length}
          </div>
          <div className="text-xs text-amber-700">Healthy budget management</div>
        </Card>

        {/* Low Utilization */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-sm font-semibold text-green-900">Low Utilization (&lt;75%)</div>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">
            {commissioners.filter(rc => {
              if (!rc.budgetInfo) return false;
              const utilization = (rc.budgetInfo.spent / rc.budgetInfo.allocated) * 100;
              return utilization < 75;
            }).length}
          </div>
          <div className="text-xs text-green-700">Resources available for initiatives</div>
        </Card>
      </div>

      <div className="space-y-3">
        {commissioners
          .filter(rc => rc.budgetInfo)
          .map(rc => ({
            ...rc,
            utilization: (rc.budgetInfo!.spent / rc.budgetInfo!.allocated) * 100
          }))
          .sort((a, b) => b.utilization - a.utilization)
          .map((rc) => {
            const isHighUtilization = rc.utilization >= 90;
            const isMediumUtilization = rc.utilization >= 75;

            return (
              <Card key={rc.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div>
                      <div className="font-bold text-gray-900">{rc.fullName}</div>
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                        {rc.region}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Spent / Allocated</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(rc.budgetInfo!.spent)} / {formatCurrency(rc.budgetInfo!.allocated)}
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className={`text-2xl font-bold ${
                        isHighUtilization ? 'text-red-600' : 
                        isMediumUtilization ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>
                        {rc.utilization.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">utilization</div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );

  const renderRiskDetails = () => (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="font-bold text-lg text-red-900 mb-2">Risk Alert Categories</h3>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-sm text-red-700 font-semibold mb-1">🔴 Retiring Soon</div>
            <div className="text-xs text-red-600">Commissioners approaching retirement age requiring succession planning</div>
          </div>
          <div>
            <div className="text-sm text-red-700 font-semibold mb-1">🟠 Excessive Leave</div>
            <div className="text-xs text-red-600">Commissioners with unusually high leave days taken</div>
          </div>
          <div>
            <div className="text-sm text-red-700 font-semibold mb-1">🟡 Understaffed</div>
            <div className="text-xs text-red-600">Regions operating below optimal staffing levels</div>
          </div>
          <div>
            <div className="text-sm text-red-700 font-semibold mb-1">🔵 Long Tenure</div>
            <div className="text-xs text-red-600">Extended service in same position without rotation</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {commissioners
          .filter(rc => Object.values(rc.riskFlags || {}).some(flag => flag === true))
          .map((rc) => {
            const risks = [];
            if (rc.riskFlags?.retiringSoon) risks.push({ type: 'Retiring Soon', message: 'Succession planning needed', color: 'red' });
            if (rc.riskFlags?.excessiveLeave) risks.push({ type: 'Excessive Leave', message: 'Review leave patterns', color: 'orange' });
            if (rc.riskFlags?.understaffed) risks.push({ type: 'Understaffed', message: 'Resource allocation required', color: 'yellow' });
            if (rc.riskFlags?.longTenureNoTransfer) risks.push({ type: 'Long Tenure', message: 'Consider rotation', color: 'blue' });

            return (
              <Card key={rc.id} className="p-4 border-2 border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{rc.fullName}</div>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs mt-1">
                      {rc.region}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    {risks.length} Risk{risks.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {risks.map((risk, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg bg-${risk.color}-50 border border-${risk.color}-200`}>
                      <AlertTriangle className={`w-5 h-5 text-${risk.color}-600 shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <div className={`font-semibold text-sm text-${risk.color}-900`}>{risk.type}</div>
                        <div className={`text-xs text-${risk.color}-700 mt-0.5`}>{risk.message}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Context */}
                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Tenure</div>
                    <div className="text-sm font-semibold text-gray-900">{rc.tenure}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Leave Taken</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {rc.leaveDays?.taken}/{rc.leaveDays?.annual}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Staff</div>
                    <div className="text-sm font-semibold text-gray-900">{rc.totalStaff}</div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {commissioners.filter(rc => Object.values(rc.riskFlags || {}).some(flag => flag === true)).length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
          <div className="text-lg font-bold text-gray-900">No Risk Alerts</div>
          <div className="text-sm text-gray-600 mt-1">All commissioners are operating within normal parameters</div>
        </div>
      )}
    </div>
  );

  const titles = {
    performance: 'Performance Score Details',
    budget: 'Budget Allocation Details',
    utilization: 'Budget Utilization Analysis',
    risks: 'Risk Alert Details'
  };

  const detailTitles = {
    performance: 'View detailed performance scores and trends for each regional commissioner.',
    budget: 'Analyze budget allocation, spending, and remaining funds for each region.',
    utilization: 'Examine budget utilization rates to identify resource constraints or underutilization.',
    risks: 'Identify and address potential risks affecting regional commissioner performance and resource management.'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 gap-0"
        style={{ height: '85vh', maxHeight: '85vh', width: '90vw', maxWidth: '1600px', display: 'grid', gridTemplateRows: 'auto 1fr' }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-600" />
            {titles[type]}
          </DialogTitle>
          <DialogDescription>
            {detailTitles[type]}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4" style={{ minHeight: 0 }}>
          {type === 'performance' && renderPerformanceDetails()}
          {type === 'budget' && renderBudgetDetails()}
          {type === 'utilization' && renderUtilizationDetails()}
          {type === 'risks' && renderRiskDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
}