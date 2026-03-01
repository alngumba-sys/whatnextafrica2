import { useState, useMemo } from "react";
import { regionalCommissioners as initialCommissioners, type RegionalCommissioner } from "@/data/regionalCommissioners";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, ArrowUpDown, ChevronDown, ChevronUp, Eye, Lightbulb, TrendingUp, Users, Award, Plus, Trash2, RefreshCw, Calendar, MoreVertical, DollarSign, TrendingDown, AlertTriangle, Activity, BarChart3, GitCompare, Zap } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  AddCommissionerDialog,
  DeleteCommissionerDialog,
  TransferCommissionerDialog,
  ManageLeaveDaysDialog,
} from "@/app/components/CommissionerManagementDialog";
import { CommissionerComparisonDialog } from "@/app/components/CommissionerComparisonDialog";
import { PerformanceDashboardDialog } from "@/app/components/PerformanceDashboardDialog";

interface RegionalCommissionersListPageProps {
  onBack: () => void;
  onSelectRC: (rc: RegionalCommissioner) => void;
}

type SortField = 'name' | 'region' | 'headquarters' | 'counties' | 'population' | 'tenure' | 'staff';
type SortOrder = 'asc' | 'desc';

export function RegionalCommissionersListPage({ onBack, onSelectRC }: RegionalCommissionersListPageProps) {
  const [commissioners, setCommissioners] = useState<RegionalCommissioner[]>(initialCommissioners);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [selectedCommissioner, setSelectedCommissioner] = useState<RegionalCommissioner | null>(null);
  
  // Comparison feature
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  
  // Performance dashboard dialog
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [dashboardType, setDashboardType] = useState<'performance' | 'budget' | 'utilization' | 'risks'>('performance');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CRUD Operations
  const handleAddCommissioner = (newCommissioner: Partial<RegionalCommissioner>) => {
    setCommissioners([...commissioners, newCommissioner as RegionalCommissioner]);
  };

  const handleDeleteCommissioner = () => {
    if (selectedCommissioner) {
      setCommissioners(commissioners.filter(c => c.id !== selectedCommissioner.id));
      setShowDeleteDialog(false);
      setSelectedCommissioner(null);
    }
  };

  const handleTransferCommissioner = (commissionerId: string, newRegion: string, newHeadquarters: string) => {
    setCommissioners(commissioners.map(c => 
      c.id === commissionerId
        ? { ...c, region: newRegion, headquarters: newHeadquarters }
        : c
    ));
  };

  const handleUpdateLeaveDays = (commissionerId: string, leaveDays: { annual: number; taken: number; remaining: number; sick: number }) => {
    setCommissioners(commissioners.map(c => 
      c.id === commissionerId
        ? { ...c, leaveDays }
        : c
    ));
  };

  const sortedCommissioners = useMemo(() => {
    const sorted = [...commissioners];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'headquarters':
          comparison = a.headquarters.localeCompare(b.headquarters);
          break;
        case 'counties':
          comparison = parseInt(a.countiesCovered) - parseInt(b.countiesCovered);
          break;
        case 'population':
          const popA = parseFloat(a.populationServed.replace('M', ''));
          const popB = parseFloat(b.populationServed.replace('M', ''));
          comparison = popA - popB;
          break;
        case 'tenure':
          const getMonths = (tenure: string) => {
            const years = parseInt(tenure.match(/(\d+)\s*year/)?.[1] || '0');
            const months = parseInt(tenure.match(/(\d+)\s*month/)?.[1] || '0');
            return years * 12 + months;
          };
          comparison = getMonths(a.tenure) - getMonths(b.tenure);
          break;
        case 'staff':
          const getStaffNumber = (staff: string | number) => {
            if (typeof staff === 'number') return staff;
            return parseInt(staff.replace(/,/g, ''));
          };
          comparison = getStaffNumber(a.totalStaff) - getStaffNumber(b.totalStaff);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [commissioners, sortField, sortOrder]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-violet-600 transition-colors font-semibold text-left w-full group"
    >
      {children}
      <span className="ml-auto">
        {sortField === field ? (
          sortOrder === 'asc' ? (
            <ChevronUp className="w-4 h-4 text-violet-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-violet-600" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        )}
      </span>
    </button>
  );

  // Calculate AI insights
  const insights = useMemo(() => {
    // Find commissioner with highest population
    const maxPopulation = commissioners.reduce((max, rc) => {
      const pop = parseFloat(rc.populationServed.replace('M', ''));
      const maxPop = parseFloat(max.populationServed.replace('M', ''));
      return pop > maxPop ? rc : max;
    });

    // Find most experienced commissioner
    const mostExperienced = commissioners.reduce((max, rc) => {
      return rc.yearsOfService > max.yearsOfService ? rc : max;
    });

    // Calculate average staff per million population
    const avgStaffPerMillion = commissioners.map(rc => {
      const staff = typeof rc.totalStaff === 'number' 
        ? rc.totalStaff 
        : parseInt(String(rc.totalStaff).replace(/,/g, ''));
      const pop = parseFloat(rc.populationServed.replace('M', ''));
      return { name: rc.region, ratio: staff / pop };
    }).sort((a, b) => b.ratio - a.ratio)[0];

    return [
      {
        icon: Users,
        title: "Largest Jurisdiction",
        description: `${maxPopulation.region} serves the largest population of ${maxPopulation.populationServed} across ${maxPopulation.countiesCovered} counties, requiring ${maxPopulation.countyCommissioners} County Commissioners for effective coordination.`,
        color: "bg-blue-50 border-blue-200 text-blue-700"
      },
      {
        icon: Award,
        title: "Most Experienced Leadership",
        description: `${mostExperienced.fullName} brings the most extensive experience with ${mostExperienced.yearsOfService} years of service in administration, currently serving ${mostExperienced.region} for ${mostExperienced.tenure}.`,
        color: "bg-amber-50 border-amber-200 text-amber-700"
      },
      {
        icon: TrendingUp,
        title: "Highest Staff-to-Population Ratio",
        description: `${avgStaffPerMillion.name} demonstrates the most intensive staffing model with ${avgStaffPerMillion.ratio.toFixed(0)} staff members per million residents, indicating comprehensive administrative coverage.`,
        color: "bg-green-50 border-green-200 text-green-700"
      }
    ];
  }, [commissioners]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F3F4' }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Hierarchy
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Regional Commissioners</h1>
              <p className="text-sm text-gray-600">{commissioners.length} Regional Commissioners across Kenya - Click any row for detailed information</p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MoreVertical className="w-4 h-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setShowAddDialog(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Commissioner
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setDashboardType('performance');
                      setShowPerformanceDashboard(true);
                    }}
                    className="cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Performance Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowComparisonDialog(true)}
                    className="cursor-pointer"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Commissioners
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setDashboardType('risks');
                      setShowPerformanceDashboard(true);
                    }}
                    className="cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    View Risk Alerts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* AI Insights */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-gray-900">Insights</h2>
            <Badge variant="outline" className="text-xs">Based on Current Data</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`p-5 border-2 ${insight.color}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/50">
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-2">{insight.title}</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-gray-900">Performance Dashboard</h2>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Card 
              className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDashboardType('performance');
                setShowPerformanceDashboard(true);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-blue-700 font-semibold">Avg. Performance Score</div>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {(commissioners.reduce((sum, rc) => {
                  const latestScore = rc.historicalData?.performanceTrend?.[rc.historicalData.performanceTrend.length - 1]?.score || 0;
                  return sum + latestScore;
                }, 0) / commissioners.length).toFixed(1)}
              </div>
              <div className="text-[10px] text-blue-600 mt-0.5">Across all regions</div>
            </Card>

            <Card 
              className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDashboardType('budget');
                setShowPerformanceDashboard(true);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-green-700 font-semibold">Total Budget</div>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">
                KSh {(commissioners.reduce((sum, rc) => sum + (rc.budgetInfo?.allocated || 0), 0) / 1000000000).toFixed(1)}B
              </div>
              <div className="text-[10px] text-green-600 mt-0.5">Allocated budget</div>
            </Card>

            <Card 
              className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDashboardType('utilization');
                setShowPerformanceDashboard(true);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-amber-700 font-semibold">Avg. Budget Utilization</div>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900">
                {(commissioners.reduce((sum, rc) => {
                  if (!rc.budgetInfo) return sum;
                  return sum + (rc.budgetInfo.spent / rc.budgetInfo.allocated * 100);
                }, 0) / commissioners.length).toFixed(1)}%
              </div>
              <div className="text-[10px] text-amber-600 mt-0.5">Budget efficiency</div>
            </Card>

            <Card 
              className="p-3 bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDashboardType('risks');
                setShowPerformanceDashboard(true);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-red-700 font-semibold">Risk Alerts</div>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-900">
                {commissioners.filter(rc => {
                  return Object.values(rc.riskFlags || {}).some(flag => flag === true);
                }).length}
              </div>
              <div className="text-[10px] text-red-600 mt-0.5">Commissioners flagged</div>
            </Card>
          </div>
        </div>

        {/* Risk Alerts Section */}
        {commissioners.some(rc => Object.values(rc.riskFlags || {}).some(flag => flag === true)) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Risk Alerts</h2>
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Attention Required</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {commissioners
                .filter(rc => Object.values(rc.riskFlags || {}).some(flag => flag === true))
                .map(rc => {
                  const riskMessages = [];
                  if (rc.riskFlags?.retiringSoon) riskMessages.push("Retiring soon - succession planning needed");
                  if (rc.riskFlags?.excessiveLeave) riskMessages.push("Excessive leave taken - review required");
                  if (rc.riskFlags?.understaffed) riskMessages.push("Region is understaffed - resource allocation needed");
                  if (rc.riskFlags?.longTenureNoTransfer) riskMessages.push("Long tenure without transfer - consider rotation");

                  return (
                    <Card key={rc.id} className="p-4 border-2 border-red-200 bg-red-50">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-bold text-sm text-gray-900">{rc.fullName}</div>
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                              {rc.region}
                            </Badge>
                          </div>
                          <ul className="space-y-1">
                            {riskMessages.map((msg, idx) => (
                              <li key={idx} className="text-xs text-red-700 flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>{msg}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Comparison Tool */}
        {selectedForComparison.length > 0 && (
          <div className="mb-6">
            <Card className="p-4 bg-violet-50 border-violet-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-5 h-5 text-violet-600" />
                  <div>
                    <div className="font-bold text-sm text-gray-900">
                      {selectedForComparison.length} Commissioner{selectedForComparison.length !== 1 ? 's' : ''} Selected for Comparison
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Click the button to view side-by-side analysis
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForComparison([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={() => setShowComparisonDialog(true)}
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="name">Name</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="region">Region</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="headquarters">Headquarters</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="counties">Counties</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="population">Population</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="tenure">Tenure</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <SortButton field="staff">Total Staff</SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Leave Days
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCommissioners.map((rc, index) => (
                  <tr 
                    key={rc.id}
                    className="hover:bg-violet-50 transition-colors cursor-pointer group"
                    onClick={() => onSelectRC(rc)}
                  >
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:scale-110 transition-transform">
                          {rc.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{rc.fullName}</div>
                          <div className="text-xs text-gray-500">{rc.appointmentDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs font-semibold">
                        {rc.region}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {rc.headquarters}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-lg font-bold text-gray-900">{rc.countiesCovered}</div>
                      <div className="text-xs text-gray-500">{rc.countyCommissioners} C.C.</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-lg font-bold text-gray-900">{rc.populationServed}</div>
                      <div className="text-xs text-gray-500">served</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">{rc.tenure}</div>
                      <div className="text-xs text-gray-500">{rc.yearsOfService} yrs service</div>
                      <div className="text-xs text-amber-600 font-medium mt-0.5">
                        {(() => {
                          const retirementAge = 60;
                          const estimatedCurrentAge = 30 + rc.yearsOfService; // Rough estimate
                          const yearsToRetirement = Math.max(0, retirementAge - estimatedCurrentAge);
                          const daysToRetirement = Math.round(yearsToRetirement * 365);
                          if (daysToRetirement <= 365) {
                            return `${daysToRetirement} days to retire`;
                          } else if (daysToRetirement <= 730) {
                            const months = Math.round(daysToRetirement / 30);
                            return `${months} months to retire`;
                          } else {
                            return `${yearsToRetirement} yrs to retire`;
                          }
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">{rc.totalStaff}</div>
                      <div className="text-xs text-gray-500">employees</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {rc.leaveDays ? `${rc.leaveDays.taken}/${rc.leaveDays.remaining}` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">taken/remaining</div>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100 h-8 w-8 p-0"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => onSelectRC(rc)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommissioner(rc);
                              setShowTransferDialog(true);
                            }}
                            className="cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Transfer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommissioner(rc);
                              setShowDeleteDialog(true);
                            }}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-xs text-gray-500 mb-1">Total Regions</div>
            <div className="text-2xl font-bold text-gray-900">{commissioners.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-xs text-gray-500 mb-1">Total Counties</div>
            <div className="text-2xl font-bold text-gray-900">
              {commissioners.reduce((sum, rc) => sum + parseInt(rc.countiesCovered), 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-xs text-gray-500 mb-1">Total Population Served</div>
            <div className="text-2xl font-bold text-gray-900">
              {commissioners.reduce((sum, rc) => sum + parseFloat(rc.populationServed.replace('M', '')), 0).toFixed(1)}M
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-xs text-gray-500 mb-1">Total Staff</div>
            <div className="text-2xl font-bold text-gray-900">
              {commissioners.reduce((sum, rc) => {
                const staff = typeof rc.totalStaff === 'number' 
                  ? rc.totalStaff 
                  : parseInt(String(rc.totalStaff).replace(/,/g, ''));
                return sum + staff;
              }, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddCommissionerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddCommissioner}
      />

      <DeleteCommissionerDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        commissioner={selectedCommissioner}
        onConfirm={handleDeleteCommissioner}
      />

      <TransferCommissionerDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        commissioner={selectedCommissioner}
        onTransfer={handleTransferCommissioner}
      />

      <ManageLeaveDaysDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        commissioner={selectedCommissioner}
        onUpdate={handleUpdateLeaveDays}
      />

      <CommissionerComparisonDialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
        commissioners={commissioners.filter(rc => selectedForComparison.includes(rc.id))}
        onRemove={(id) => setSelectedForComparison(selectedForComparison.filter(rcId => rcId !== id))}
        allCommissioners={commissioners}
        onAdd={(id) => setSelectedForComparison([...selectedForComparison, id])}
        onAddMultiple={(ids) => {
          // Add only the IDs that aren't already in the selection
          const newIds = ids.filter(id => !selectedForComparison.includes(id));
          setSelectedForComparison([...selectedForComparison, ...newIds]);
        }}
      />

      <PerformanceDashboardDialog
        open={showPerformanceDashboard}
        onOpenChange={setShowPerformanceDashboard}
        type={dashboardType}
        commissioners={commissioners}
      />
    </div>
  );
}