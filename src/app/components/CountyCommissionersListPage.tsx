import { useState, useMemo } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, MapPin, Users, Calendar, TrendingUp, Search, Filter, Lightbulb, Award, MoreVertical, BarChart3, ArrowUpDown, ChevronDown, ChevronUp, Activity, DollarSign, Percent, AlertTriangle } from 'lucide-react';
import { countyCommissioners, type CountyCommissioner } from '@/data/countyCommissioners';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { CountyPerformanceDashboardDialog } from '@/app/components/CountyPerformanceDashboardDialog';

interface CountyCommissionersListPageProps {
  onBack: () => void;
  onSelectCC: (cc: CountyCommissioner) => void;
}

type SortField = 'name' | 'county' | 'region' | 'subcounties' | 'dc' | 'leave' | 'performance' | 'tenure';
type SortOrder = 'asc' | 'desc';

export function CountyCommissionersListPage({ onBack, onSelectCC }: CountyCommissionersListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Dialog states for dashboard card details
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'performance' | 'budget' | 'utilization' | 'risks' | null>(null);

  const handleCardClick = (cardType: 'performance' | 'budget' | 'utilization' | 'risks') => {
    setSelectedCard(cardType);
    setShowCardDetails(true);
  };
  
  // Get unique regions
  const regions = Array.from(new Set(countyCommissioners.map(cc => cc.region))).sort();

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort Header Component
  const SortHeader = ({ field, children, className = "" }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors ${className}`}
    >
      <span>{children}</span>
      {sortField === field ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-40" />
      )}
    </button>
  );

  // Filter and sort commissioners
  const sortedCommissioners = useMemo(() => {
    const filtered = countyCommissioners.filter(cc => {
      const matchesSearch = cc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cc.county.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'all' || cc.region === regionFilter;
      return matchesSearch && matchesRegion;
    });

    const sorted = [...filtered];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'county':
          comparison = a.county.localeCompare(b.county);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'subcounties':
          comparison = a.subcountiesManaged - b.subcountiesManaged;
          break;
        case 'dc':
          comparison = a.districtCommissioners - b.districtCommissioners;
          break;
        case 'leave':
          comparison = a.leaveBalance - b.leaveBalance;
          break;
        case 'performance':
          comparison = a.performanceScore - b.performanceScore;
          break;
        case 'tenure':
          // Parse tenure (e.g., "1 yr 11 mos" -> months)
          const parseToMonths = (tenure: string) => {
            const parts = tenure.split(' ');
            let months = 0;
            for (let i = 0; i < parts.length; i++) {
              if (parts[i] === 'yr' || parts[i] === 'yrs') {
                months += parseInt(parts[i - 1]) * 12;
              } else if (parts[i] === 'mo' || parts[i] === 'mos') {
                months += parseInt(parts[i - 1]);
              }
            }
            return months;
          };
          comparison = parseToMonths(a.tenure) - parseToMonths(b.tenure);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [searchTerm, regionFilter, sortField, sortOrder]);

  // Calculate AI insights
  const insights = useMemo(() => {
    // Find commissioner with highest population
    const maxPopulation = countyCommissioners.reduce((max, cc) => {
      const pop = parseFloat(cc.populationServed.replace('M', '').replace('K', '')) * (cc.populationServed.includes('M') ? 1 : 0.001);
      const maxPop = parseFloat(max.populationServed.replace('M', '').replace('K', '')) * (max.populationServed.includes('M') ? 1 : 0.001);
      return pop > maxPop ? cc : max;
    });

    // Find highest performing commissioner
    const bestPerformer = countyCommissioners.reduce((max, cc) => {
      return cc.performanceScore > max.performanceScore ? cc : max;
    });

    // Find most efficient budget utilization
    const bestUtilization = countyCommissioners.reduce((max, cc) => {
      return cc.utilizationRate > max.utilizationRate ? cc : max;
    });

    return [
      {
        icon: Users,
        title: "Largest County Jurisdiction",
        description: `${maxPopulation.fullName} in ${maxPopulation.county} serves the largest population of ${maxPopulation.populationServed} across ${maxPopulation.subcountiesManaged} sub-counties, managing ${maxPopulation.districtCommissioners} District Commissioners.`,
        color: "bg-blue-50 border-blue-200 text-blue-700"
      },
      {
        icon: Award,
        title: "Top Performance Score",
        description: `${bestPerformer.fullName} in ${bestPerformer.county} leads with an exceptional performance score of ${bestPerformer.performanceScore}%, demonstrating excellence in ${bestPerformer.expertise[0]?.toLowerCase() || 'administration'}.`,
        color: "bg-green-50 border-green-200 text-green-700"
      },
      {
        icon: TrendingUp,
        title: "Best Budget Utilization",
        description: `${bestUtilization.fullName} in ${bestUtilization.county} achieves the highest budget utilization rate of ${bestUtilization.utilizationRate}%, with ${bestUtilization.budgetSpent} spent from ${bestUtilization.budgetAllocated} allocated.`,
        color: "bg-amber-50 border-amber-200 text-amber-700"
      }
    ];
  }, []);

  // Calculate Performance Dashboard Summary Metrics
  const dashboardMetrics = useMemo(() => {
    // Average Performance Score
    const avgPerformance = countyCommissioners.reduce((sum, cc) => sum + cc.performanceScore, 0) / countyCommissioners.length;

    // Total Budget
    const totalBudget = countyCommissioners.reduce((sum, cc) => {
      const amount = parseFloat(cc.budgetAllocated.replace(/[^\d.]/g, ''));
      return sum + amount;
    }, 0);

    // Average Budget Utilization
    const avgUtilization = countyCommissioners.reduce((sum, cc) => sum + cc.utilizationRate, 0) / countyCommissioners.length;

    // Risk Alerts (commissioners with issues)
    const riskCount = countyCommissioners.filter(cc => {
      const hasLowUtilization = cc.utilizationRate < 85;
      const hasLowPerformance = cc.performanceScore < 85;
      const hasLowLeave = cc.leaveBalance < 15;
      return hasLowUtilization || hasLowPerformance || hasLowLeave;
    }).length;

    return {
      avgPerformance: avgPerformance.toFixed(1),
      totalBudget: (totalBudget / 1000).toFixed(1), // Convert to billions
      avgUtilization: avgUtilization.toFixed(1),
      riskAlerts: riskCount
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F3F4' }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900">County Commissioners</h1>
              <p className="text-sm text-gray-600">{sortedCommissioners.length} County Commissioners across Kenya - Click any row for detailed information</p>
            </div>
            <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
              <Users className="w-3 h-3 mr-1" />
              {countyCommissioners.length} Total C.C
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or county..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-64">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter by region" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Performance Dashboard Summary Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-gray-900">Performance Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Avg Performance Score */}
            <Card 
              className="p-5 bg-blue-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleCardClick('performance')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-semibold text-blue-700">Avg. Performance Score</div>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-900 mb-2">{dashboardMetrics.avgPerformance}</div>
              <div className="text-xs text-blue-600">Across all regions</div>
            </Card>

            {/* Total Budget */}
            <Card 
              className="p-5 bg-green-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleCardClick('budget')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-semibold text-green-700">Total Budget</div>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-900 mb-2">KSh {dashboardMetrics.totalBudget}B</div>
              <div className="text-xs text-green-600">Allocated budget</div>
            </Card>

            {/* Avg Budget Utilization */}
            <Card 
              className="p-5 bg-amber-50 border-amber-200 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleCardClick('utilization')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-semibold text-amber-700">Avg. Budget Utilization</div>
                <Percent className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-4xl font-bold text-amber-900 mb-2">{dashboardMetrics.avgUtilization}%</div>
              <div className="text-xs text-amber-600">Budget efficiency</div>
            </Card>

            {/* Risk Alerts */}
            <Card 
              className="p-5 bg-red-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleCardClick('risks')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-semibold text-red-700">Risk Alerts</div>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-red-900 mb-2">{dashboardMetrics.riskAlerts}</div>
              <div className="text-xs text-red-600">Commissioners flagged</div>
            </Card>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-gray-900">AI-Powered Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index} className={`p-4 border ${insight.color}`}>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{insight.title}</h3>
                      <p className="text-xs leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b font-medium text-sm text-gray-700">
            <div className="col-span-3">
              <SortHeader field="name">County Commissioner</SortHeader>
            </div>
            <div className="col-span-2">
              <SortHeader field="county">County</SortHeader>
            </div>
            <div className="col-span-2">
              <SortHeader field="region">Region</SortHeader>
            </div>
            <div className="col-span-1 flex justify-center">
              <SortHeader field="subcounties" className="justify-center">Sub-Counties</SortHeader>
            </div>
            <div className="col-span-1 flex justify-center">
              <SortHeader field="dc" className="justify-center">D.C Managed</SortHeader>
            </div>
            <div className="col-span-1 flex justify-center">
              <SortHeader field="leave" className="justify-center">Leave Days</SortHeader>
            </div>
            <div className="col-span-1 flex justify-center">
              <SortHeader field="performance" className="justify-center">Performance</SortHeader>
            </div>
            <div className="col-span-1 flex justify-center">
              <SortHeader field="tenure" className="justify-center">Tenure</SortHeader>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y">
            {sortedCommissioners.map((cc) => (
              <div
                key={cc.id}
                onClick={() => onSelectCC(cc)}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-violet-50 cursor-pointer transition-colors group"
              >
                {/* Name */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {cc.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                      {cc.fullName}
                    </div>
                    <div className="text-xs text-gray-500">{cc.email}</div>
                  </div>
                </div>

                {/* County */}
                <div className="col-span-2 flex items-center">
                  <div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <MapPin className="w-3 h-3 text-violet-600" />
                      {cc.county}
                    </div>
                    <div className="text-xs text-gray-500">{cc.headquarters}</div>
                  </div>
                </div>

                {/* Region */}
                <div className="col-span-2 flex items-center">
                  <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 text-xs">
                    {cc.region}
                  </Badge>
                </div>

                {/* Sub-Counties */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{cc.subcountiesManaged}</div>
                    <div className="text-xs text-gray-500">sub-counties</div>
                  </div>
                </div>

                {/* D.C Managed */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-violet-600" />
                      <span className="text-sm font-bold text-gray-900">{cc.districtCommissioners}</span>
                    </div>
                    <div className="text-xs text-gray-500">D.C</div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{cc.leaveBalance}</div>
                    <div className="text-xs text-gray-500">days</div>
                  </div>
                </div>

                {/* Performance */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className={`w-3 h-3 ${
                        cc.performanceScore >= 90 ? 'text-green-600' : 
                        cc.performanceScore >= 85 ? 'text-blue-600' : 'text-amber-600'
                      }`} />
                      <span className={`text-sm font-bold ${
                        cc.performanceScore >= 90 ? 'text-green-700' : 
                        cc.performanceScore >= 85 ? 'text-blue-700' : 'text-amber-700'
                      }`}>
                        {cc.performanceScore}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">score</div>
                  </div>
                </div>

                {/* Tenure */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{cc.tenure.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs text-gray-500">yrs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedCommissioners.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No county commissioners found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Dashboard Dialog */}
      <CountyPerformanceDashboardDialog
        open={showCardDetails}
        onOpenChange={setShowCardDetails}
        type={selectedCard || 'performance'}
        commissioners={countyCommissioners}
        metrics={dashboardMetrics}
      />
    </div>
  );
}