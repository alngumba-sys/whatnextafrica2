import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Check } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { RegionalCommissioner } from "@/data/regionalCommissioners";
import { useState, useEffect } from "react";

interface CommissionerComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commissioners: RegionalCommissioner[];
  onRemove: (id: string) => void;
  allCommissioners?: RegionalCommissioner[];
  onAdd?: (id: string) => void;
  onAddMultiple?: (ids: string[]) => void;
}

export function CommissionerComparisonDialog({ open, onOpenChange, commissioners, onRemove, allCommissioners = [], onAdd, onAddMultiple }: CommissionerComparisonDialogProps) {
  const formatCurrency = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (spent: number, allocated: number) => {
    return ((spent / allocated) * 100).toFixed(1);
  };

  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(commissioners.length === 0);

  useEffect(() => {
    // Show selection interface if fewer than 2 commissioners
    const shouldShowSelection = commissioners.length < 2;
    setShowSelection(shouldShowSelection);
    
    // Only sync localSelectedIds when switching to selection mode or dialog first opens
    // Don't reset during the adding process (when user has clicked "Compare" button)
    if (shouldShowSelection && commissioners.length === 0) {
      setLocalSelectedIds([]);
    } else if (!shouldShowSelection) {
      setLocalSelectedIds(commissioners.map(c => c.id));
    }
  }, [commissioners.length]); // Only depend on length, not the full array

  const toggleCommissioner = (id: string) => {
    if (localSelectedIds.includes(id)) {
      setLocalSelectedIds(localSelectedIds.filter(cid => cid !== id));
    } else {
      // Only allow selecting up to 2 commissioners
      if (localSelectedIds.length < 2) {
        setLocalSelectedIds([...localSelectedIds, id]);
      }
    }
  };

  const handleStartComparison = () => {
    if (onAddMultiple) {
      onAddMultiple(localSelectedIds);
    } else {
      localSelectedIds.forEach(id => {
        if (!commissioners.find(c => c.id === id) && onAdd) {
          onAdd(id);
        }
      });
    }
    // Don't immediately hide selection - let useEffect handle it when commissioners are added
  };

  const selectedCommissioners = showSelection 
    ? allCommissioners.filter(c => localSelectedIds.includes(c.id))
    : commissioners;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 gap-0 flex flex-col"
        style={{ height: '85vh', maxHeight: '85vh', width: '73.5vw', maxWidth: '1500px' }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-600" />
            Compare Regional Commissioners
          </DialogTitle>
          <DialogDescription>
            Compare performance metrics and data across selected commissioners
          </DialogDescription>
        </DialogHeader>

        {showSelection ? (
          <div className="overflow-y-auto px-6 py-4 flex-1" style={{ minHeight: 0 }}>
            <div className="space-y-3">
              {allCommissioners.map((rc) => {
                const isSelected = localSelectedIds.includes(rc.id);
                return (
                  <Card
                    key={rc.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50' 
                        : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleCommissioner(rc.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                          {rc.initials}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{rc.fullName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs">
                              {rc.region}
                            </Badge>
                            <span className="text-xs text-gray-500">{rc.headquarters}</span>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-xs text-gray-500">Counties</div>
                          <div className="text-lg font-bold text-gray-900">{rc.countiesCovered}</div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-xs text-gray-500">Population</div>
                          <div className="text-lg font-bold text-gray-900">{rc.populationServed}</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : selectedCommissioners.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No commissioners selected for comparison</p>
            <p className="text-sm mt-2">Select commissioners from the table to compare</p>
          </div>
        ) : (
          <div className="relative flex-1" style={{ minHeight: 0 }}>
            <div className="overflow-auto px-6 py-4 h-full" style={{ minHeight: 0 }}>
              <div className="min-w-max">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-50 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 bg-gray-100 sticky left-0 z-[60] w-[180px]">
                        Metric
                      </th>
                      {selectedCommissioners.map((rc) => (
                        <th key={rc.id} className="px-4 py-3 text-left text-xs border-b-2 border-gray-200 bg-gray-50 w-[250px]">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{rc.fullName}</div>
                              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs mt-1">
                                {rc.region}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRemove(rc.id)}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Basic Info */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Basic Information
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Headquarters</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{rc.headquarters}</td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Tenure</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{rc.tenure}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Years of Service</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{rc.yearsOfService} years</span>
                        </td>
                      ))}
                    </tr>

                    {/* Jurisdiction */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Jurisdiction
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Counties Covered</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-lg font-bold text-gray-900">{rc.countiesCovered}</span>
                          <span className="text-xs text-gray-500 ml-2">counties</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Population Served</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-lg font-bold text-gray-900">{rc.populationServed}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">County Commissioners</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">{rc.countyCommissioners}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Total Staff</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">{rc.totalStaff.toLocaleString()}</span>
                        </td>
                      ))}
                    </tr>

                    {/* Performance Metrics */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Performance Metrics
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Latest Performance Score</td>
                      {selectedCommissioners.map((rc) => {
                        const latestScore = rc.historicalData?.performanceTrend?.[rc.historicalData.performanceTrend.length - 1]?.score || 0;
                        return (
                          <td key={rc.id} className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">{latestScore}</span>
                              {latestScore >= 95 ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : latestScore >= 85 ? (
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Performance Trend</td>
                      {selectedCommissioners.map((rc) => {
                        const trend = rc.historicalData?.performanceTrend || [];
                        const latestScore = trend[trend.length - 1]?.score || 0;
                        const previousScore = trend[trend.length - 2]?.score || 0;
                        const change = latestScore - previousScore;
                        return (
                          <td key={rc.id} className="px-4 py-3">
                            {change > 0 ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">+{change} points</span>
                              </div>
                            ) : change < 0 ? (
                              <div className="flex items-center gap-1 text-red-600">
                                <TrendingDown className="w-4 h-4" />
                                <span className="text-sm font-semibold">{change} points</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No change</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Budget Information */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Budget Information
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Allocated Budget</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {rc.budgetInfo ? formatCurrency(rc.budgetInfo.allocated) : 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Budget Spent</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {rc.budgetInfo ? formatCurrency(rc.budgetInfo.spent) : 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Budget Remaining</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {rc.budgetInfo ? formatCurrency(rc.budgetInfo.remaining) : 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Budget Utilization</td>
                      {selectedCommissioners.map((rc) => {
                        if (!rc.budgetInfo) return <td key={rc.id} className="px-4 py-3">N/A</td>;
                        const utilization = parseFloat(formatPercentage(rc.budgetInfo.spent, rc.budgetInfo.allocated));
                        return (
                          <td key={rc.id} className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{utilization}%</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div 
                                  className={`h-full ${
                                    utilization >= 90 ? 'bg-red-500' : 
                                    utilization >= 75 ? 'bg-amber-500' : 
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Year-over-Year</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className={`text-sm font-semibold ${
                            rc.budgetInfo?.yearOverYear.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {rc.budgetInfo?.yearOverYear || 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Leave Days */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Leave Management
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Leave Days Taken</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {rc.leaveDays?.taken || 0} / {rc.leaveDays?.annual || 30}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10 border-r w-[180px]">Leave Days Remaining</td>
                      {selectedCommissioners.map((rc) => (
                        <td key={rc.id} className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {rc.leaveDays?.remaining || 0} days
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Risk Flags */}
                    <tr className="bg-violet-50">
                      <td colSpan={selectedCommissioners.length + 1} className="px-4 py-2 text-sm font-bold text-violet-900 sticky left-0 z-10 w-[180px]">
                        Risk Indicators
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r w-[180px]">Active Risk Flags</td>
                      {selectedCommissioners.map((rc) => {
                        const flags = [];
                        if (rc.riskFlags?.retiringSoon) flags.push('Retiring Soon');
                        if (rc.riskFlags?.excessiveLeave) flags.push('Excessive Leave');
                        if (rc.riskFlags?.understaffed) flags.push('Understaffed');
                        if (rc.riskFlags?.longTenureNoTransfer) flags.push('Long Tenure');
                        
                        return (
                          <td key={rc.id} className="px-4 py-3">
                            {flags.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {flags.map((flag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                No Risks
                              </Badge>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Scroll indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/90 pointer-events-none" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex flex-col items-center gap-1 text-violet-600 animate-bounce">
                <div className="text-xs font-medium">Scroll for more</div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-3 px-6 py-4 border-t">
          {showSelection && (
            <div className="text-sm text-gray-600">
              Select at least 2 commissioners to compare
            </div>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {showSelection && (
              <Button 
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleStartComparison}
                disabled={localSelectedIds.length < 2}
              >
                Compare {localSelectedIds.length} Commissioner{localSelectedIds.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}