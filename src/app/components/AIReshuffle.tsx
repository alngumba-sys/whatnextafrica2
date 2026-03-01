import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Shuffle, Sparkles, ArrowRight, AlertCircle, CheckCircle2, Brain, MapPin, TrendingUp, X, Check } from 'lucide-react';
import { users } from '@/data/users';
import { transfers } from '@/data/transfersAndLeave';

interface ReshuffleProposal {
  officerId: string;
  officerName: string;
  currentLocation: string;
  proposedLocation: string;
  reason: string;
  insight: string;
  neverBeenThere: boolean;
  yearsAtCurrent: number;
  status?: 'pending' | 'committed' | 'omitted'; // Add status tracking
}

interface AIReshuffleProps {
  onClose: () => void;
  onApprove: (proposals: ReshuffleProposal[]) => void;
}

export function AIReshuffle({ onClose, onApprove }: AIReshuffleProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [proposals, setProposals] = useState<ReshuffleProposal[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccessfully, setGeneratedSuccessfully] = useState(false);

  const availableRoles = [
    { value: 'RC', label: 'Regional Commissioners (R.C)', level: 3 },
    { value: 'CC', label: 'County Commissioners (C.C)', level: 4 },
    { value: 'DC', label: 'District Commissioners (D.C)', level: 5 },
    { value: 'ACC', label: 'Assistant County Commissioners (A.C.C)', level: 6 },
  ];

  // Get all unique locations from users and transfers
  const getAllLocations = (): string[] => {
    const locations = new Set<string>();
    
    users.forEach(user => {
      if (user.currentStation) locations.add(user.currentStation);
    });
    
    transfers.forEach(transfer => {
      locations.add(transfer.fromLocation);
      locations.add(transfer.toLocation);
    });

    return Array.from(locations);
  };

  // Get transfer history for an officer
  const getOfficerHistory = (officerId: string): string[] => {
    const history = new Set<string>();
    
    // Add current location
    const officer = users.find(u => u.id === officerId);
    if (officer?.currentStation) {
      history.add(officer.currentStation);
    }

    // Add all previous locations from transfers
    transfers
      .filter(t => t.officerId === officerId)
      .forEach(t => {
        history.add(t.fromLocation);
        history.add(t.toLocation);
      });

    return Array.from(history);
  };

  // Calculate years at current location
  const getYearsAtCurrentLocation = (officerId: string): number => {
    const officer = users.find(u => u.id === officerId);
    if (!officer?.dateOfJoining) return 0;

    // Find the most recent transfer or use joining date
    const officerTransfers = transfers
      .filter(t => t.officerId === officerId && t.status === 'completed')
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

    const lastTransferDate = officerTransfers[0]?.effectiveDate || officer.dateOfJoining;
    const yearsDiff = (new Date().getTime() - new Date(lastTransferDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    return Math.floor(yearsDiff * 10) / 10; // Round to 1 decimal
  };

  // AI-powered reshuffle algorithm
  const generateReshuffle = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const officersInRole = users.filter(u => u.role === selectedRole);
      const allLocations = getAllLocations();
      const roleSpecificLocations = officersInRole.map(o => o.currentStation || '').filter(Boolean);
      const availableLocations = [...new Set([...allLocations, ...roleSpecificLocations])];
      
      const reshuffleProposals: ReshuffleProposal[] = [];
      const usedLocations = new Set<string>();
      
      // Create a mapping of officers with their constraints
      const officerData = officersInRole.map(officer => {
        const history = getOfficerHistory(officer.id);
        const yearsAtCurrent = getYearsAtCurrentLocation(officer.id);
        const neverBeenLocations = availableLocations.filter(loc => !history.includes(loc));
        
        return {
          officer,
          history,
          yearsAtCurrent,
          neverBeenLocations,
          currentLocation: officer.currentStation || '',
        };
      });

      // Sort by years at current location (prioritize those who've been longest)
      officerData.sort((a, b) => b.yearsAtCurrent - a.yearsAtCurrent);

      // Generate optimal assignments
      officerData.forEach(({ officer, history, yearsAtCurrent, neverBeenLocations, currentLocation }) => {
        // Find a location they've never been to
        const optimalLocation = neverBeenLocations.find(loc => 
          !usedLocations.has(loc) && loc !== currentLocation
        );

        if (optimalLocation) {
          usedLocations.add(optimalLocation);
          
          // Generate AI insights
          const insights = generateInsight(officer, yearsAtCurrent, history.length, optimalLocation);
          
          reshuffleProposals.push({
            officerId: officer.id,
            officerName: officer.name,
            currentLocation: currentLocation,
            proposedLocation: optimalLocation,
            reason: `Strategic rotation based on ${yearsAtCurrent} years at current station`,
            insight: insights,
            neverBeenThere: true,
            yearsAtCurrent,
            status: 'pending', // Initialize status
          });
        }
      });

      setProposals(reshuffleProposals);
      setGeneratedSuccessfully(true);
      setIsGenerating(false);
    }, 2000);
  };

  const generateInsight = (officer: any, yearsAtCurrent: number, transferCount: number, newLocation: string): string => {
    const insights = [];
    
    // Variation 1: Time at current station (more varied messages)
    if (yearsAtCurrent >= 15) {
      const messages = [
        `Has been at current station for ${yearsAtCurrent} years - urgent rotation recommended`,
        `Exceptionally long tenure of ${yearsAtCurrent} years - high priority for redeployment`,
        `${yearsAtCurrent} years at same location - critical need for fresh exposure`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (yearsAtCurrent >= 10) {
      const messages = [
        `Extended posting of ${yearsAtCurrent} years - ideal time for strategic rotation`,
        `${yearsAtCurrent} years at current station - optimal for rotation`,
        `Long-term assignment (${yearsAtCurrent} years) - ready for new challenges`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (yearsAtCurrent >= 5) {
      const messages = [
        `Served ${yearsAtCurrent} years at current station - strong rotation candidate`,
        `${yearsAtCurrent}-year tenure completed - suitable for redeployment`,
        `Has been stationed for ${yearsAtCurrent} years - optimal rotation window`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (yearsAtCurrent >= 3) {
      const messages = [
        `Has been at current station for ${yearsAtCurrent} years - optimal for rotation`,
        `${yearsAtCurrent}-year posting period complete - ready for transfer`,
        `Completed ${yearsAtCurrent} years - standard rotation timeline achieved`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (yearsAtCurrent >= 2) {
      const messages = [
        `Due for rotation after ${yearsAtCurrent} years of service`,
        `${yearsAtCurrent} years at station - approaching optimal rotation period`,
        `Early rotation opportunity after ${yearsAtCurrent} years - career development focus`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      const messages = [
        `Strategic placement for career development`,
        `Early-career rotation opportunity for skill diversification`,
        `Accelerated development track - broadening experience base`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    }

    // Variation 2: Transfer history (more context-specific)
    if (transferCount === 1) {
      const messages = [
        `Limited transfer history (${transferCount} location) - excellent exposure opportunity`,
        `First rotation - crucial for career broadening`,
        `Single-location experience - high learning potential in new assignment`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (transferCount === 2) {
      const messages = [
        `Limited transfer history (${transferCount} locations) - good exposure opportunity`,
        `Developing diverse experience (${transferCount} stations) - continued growth recommended`,
        `Building career portfolio with ${transferCount} postings - strategic expansion`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (transferCount === 3) {
      const messages = [
        `Moderate experience across ${transferCount} locations - balanced exposure`,
        `${transferCount} stations served - well-rounded operational knowledge`,
        `Mid-career officer (${transferCount} postings) - brings adaptable expertise`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (transferCount >= 4 && transferCount <= 6) {
      const messages = [
        `Experienced officer (${transferCount} locations) - brings diverse expertise`,
        `Wide operational exposure (${transferCount} stations) - valuable institutional knowledge`,
        `Seasoned administrator with ${transferCount} postings - adaptable leadership`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (transferCount > 6) {
      const messages = [
        `Highly experienced (${transferCount} locations) - exceptional adaptability and expertise`,
        `Extensive career across ${transferCount} stations - brings comprehensive insights`,
        `Veteran officer (${transferCount} postings) - proven flexibility and strong delivery record`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    }

    // Variation 3: Years of service & seniority (more nuanced)
    if (officer.yearsOfService && officer.yearsOfService >= 30) {
      const messages = [
        `Veteran officer with ${officer.yearsOfService} years experience - approaching retirement phase`,
        `${officer.yearsOfService} years of distinguished service - legacy-building opportunity`,
        `Senior administrator (${officer.yearsOfService} years) - mentorship potential at new location`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (officer.yearsOfService && officer.yearsOfService >= 20) {
      const messages = [
        `Senior officer with ${officer.yearsOfService} years experience - strong leadership capacity`,
        `${officer.yearsOfService} years of service - mature administrator ready for complex assignments`,
        `Experienced leader (${officer.yearsOfService} years) - capable of transformative impact`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (officer.yearsOfService && officer.yearsOfService >= 15) {
      const messages = [
        `Senior officer with ${officer.yearsOfService} years experience`,
        `${officer.yearsOfService}-year career - proven track record and institutional knowledge`,
        `Mid-senior administrator (${officer.yearsOfService} years) - reliable operational leadership`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (officer.yearsOfService && officer.yearsOfService >= 10) {
      const messages = [
        `Established officer with ${officer.yearsOfService} years experience - steady performance`,
        `${officer.yearsOfService} years of service - solid foundation for complex assignments`,
        `Mid-career professional (${officer.yearsOfService} years) - balanced expertise and energy`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    } else if (officer.yearsOfService && officer.yearsOfService >= 5) {
      const messages = [
        `Emerging leader with ${officer.yearsOfService} years experience - high growth potential`,
        `${officer.yearsOfService}-year officer - building strong professional foundation`,
        `Developing administrator (${officer.yearsOfService} years) - promising career trajectory`,
      ];
      insights.push(messages[Math.floor(Math.random() * messages.length)]);
    }

    // Variation 4: New location context (more specific benefits)
    const locationMessages = [
      `Fresh perspective for ${newLocation}`,
      `New insights for ${newLocation} operations`,
      `Will bring innovative approaches to ${newLocation}`,
      `Strategic advantage for ${newLocation} development`,
      `Untapped potential for ${newLocation} transformation`,
      `Objective viewpoint benefits ${newLocation} governance`,
      `Cross-pollination opportunity for ${newLocation}`,
    ];
    insights.push(locationMessages[Math.floor(Math.random() * locationMessages.length)]);

    // Occasionally add bonus strategic insights (20% chance)
    if (Math.random() < 0.2) {
      const bonusInsights = [
        `Aligns with succession planning objectives`,
        `Supports regional balance initiatives`,
        `Enhances skill distribution across counties`,
        `Promotes knowledge transfer and best practices`,
        `Strengthens organizational resilience`,
        `Facilitates capacity building in underserved areas`,
      ];
      insights.push(bonusInsights[Math.floor(Math.random() * bonusInsights.length)]);
    }

    return insights.join('. ');
  };

  // Toggle proposal status between pending/committed/omitted
  const handleToggleCommit = (officerId: string) => {
    setProposals(proposals.map(p => 
      p.officerId === officerId 
        ? { ...p, status: p.status === 'committed' ? 'pending' : 'committed' }
        : p
    ));
  };

  const handleToggleOmit = (officerId: string) => {
    setProposals(proposals.map(p => 
      p.officerId === officerId 
        ? { ...p, status: p.status === 'omitted' ? 'pending' : 'omitted' }
        : p
    ));
  };

  const handleApproveReshuffle = () => {
    // Only approve proposals that are not omitted
    const approvedProposals = proposals.filter(p => p.status !== 'omitted');
    onApprove(approvedProposals);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#66023C] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Reshuffle</h2>
                <p className="text-sm text-white/90 mt-1">Intelligent officer redeployment based on transfer history and insights</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!generatedSuccessfully ? (
            <div className="space-y-6">
              {/* Role Selection */}
              <Card className="p-6 bg-blue-50 border-2 border-blue-200 mt-[0px] mr-[0px] mb-[6px] ml-[0px] px-[24px] py-[6px]">
                <div className="flex items-center gap-2 mb-[2px] mt-[0px] mr-[0px] ml-[0px]">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Select Officer Level for Reshuffle</h3>
                </div>
                <p className="text-sm text-gray-600 mb-[4px] mt-[0px] mr-[0px] ml-[0px]">
                  Choose the officer category you want to reshuffle. The AI will analyze their transfer history 
                  and assign them to locations where they have never served before.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {availableRoles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedRole === role.value
                          ? 'border-purple-600 bg-purple-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{role.label}</div>
                      <div className="text-xs text-gray-500 mt-1">Level {role.level}</div>
                      <div className="text-xs text-gray-600 mt-2">
                        {users.filter(u => u.role === role.value).length} officers
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* How it works */}
              <Card className="p-6 bg-gray-50">
                <h3 className="text-base font-bold text-gray-900 mb-[6px] flex items-center gap-2 mt-[0px] mr-[0px] ml-[0px]">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  How AI Reshuffle Works
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Analyzes Transfer History</div>
                      <div className="text-xs text-gray-600">Reviews all past postings for each officer</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Identifies Fresh Postings</div>
                      <div className="text-xs text-gray-600">Finds locations where officers have never served</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Optimizes Assignments</div>
                      <div className="text-xs text-gray-600">Creates balanced transfers prioritizing tenure and experience</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Generates Insights</div>
                      <div className="text-xs text-gray-600">Provides AI-powered rationale for each transfer</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={generateReshuffle}
                  disabled={!selectedRole || isGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Reshuffle...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate AI Reshuffle
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-green-100 border-green-200">
                  <div className="text-2xl font-bold text-green-700">{proposals.length}</div>
                  <div className="text-sm text-green-600">Officers to Reshuffle</div>
                </Card>
                <Card className="p-4 bg-blue-100 border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {proposals.filter(p => p.neverBeenThere).length}
                  </div>
                  <div className="text-sm text-blue-600">Fresh Locations</div>
                </Card>
                <Card className="p-4 bg-purple-100 border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">
                    {proposals.length > 0 
                      ? Math.round(proposals.reduce((sum, p) => sum + p.yearsAtCurrent, 0) / proposals.length * 10) / 10
                      : 0
                    }
                  </div>
                  <div className="text-sm text-purple-600">Avg. Years at Station</div>
                </Card>
              </div>

              {/* Proposals List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Proposed Transfers</h3>
                  <div className="text-xs text-gray-500">
                    All officers assigned to locations they've never served
                  </div>
                </div>

                {proposals.map((proposal, idx) => (
                  <Card key={proposal.officerId} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-bold text-gray-900">{proposal.officerName}</div>
                            <div className="text-xs text-gray-500">
                              {proposal.yearsAtCurrent} years at current station
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              New Location
                            </span>
                          </div>
                        </div>

                        {/* Transfer Route */}
                        <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-0.5">From</div>
                            <div className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {proposal.currentLocation}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-0.5">To</div>
                            <div className="font-semibold text-sm text-green-700 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-green-600" />
                              {proposal.proposedLocation}
                            </div>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-blue-900 mb-1">AI Insights</div>
                              <div className="text-xs text-blue-800">{proposal.insight}</div>
                            </div>
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCommit(proposal.officerId)}
                            className={`flex items-center gap-1.5 ${
                              proposal.status === 'committed'
                                ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                                : 'hover:border-green-300'
                            }`}
                          >
                            <Check className={`w-3.5 h-3.5 ${proposal.status === 'committed' ? 'opacity-100' : 'opacity-0'}`} />
                            {proposal.status === 'committed' ? 'Committed' : 'Commit'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleOmit(proposal.officerId)}
                            className={`flex items-center gap-1.5 ${
                              proposal.status === 'omitted'
                                ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                                : 'hover:border-red-300'
                            }`}
                          >
                            <X className={`w-3.5 h-3.5 ${proposal.status === 'omitted' ? 'opacity-100' : 'opacity-0'}`} />
                            {proposal.status === 'omitted' ? 'Omitted' : 'Omit'}
                          </Button>
                          {proposal.status === 'pending' && (
                            <Badge variant="outline" className="ml-2 text-gray-600">
                              Pending Review
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <Button variant="outline" onClick={() => setGeneratedSuccessfully(false)}>
                  Regenerate
                </Button>
                <Button
                  onClick={handleApproveReshuffle}
                  disabled={proposals.filter(p => p.status !== 'omitted').length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve & Create Transfers ({proposals.filter(p => p.status !== 'omitted').length})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}