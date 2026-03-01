import { useState } from 'react';
import { OrgNode } from '@/app/components/OrgNode';
import { Button } from '@/app/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Building2, Users } from 'lucide-react';
import { RegionalCommissionersListPage } from '@/app/components/RegionalCommissionersListPage';
import { RegionalCommissionerDetailPage } from '@/app/components/RegionalCommissionerDetailPage';
import { CountyCommissionersListPage } from '@/app/components/CountyCommissionersListPage';
import { CountyCommissionerDetailPage } from '@/app/components/CountyCommissionerDetailPage';
import { PSVisitDialog } from '@/app/components/PSVisitDialog';
import { type RegionalCommissioner } from '@/data/regionalCommissioners';
import { type CountyCommissioner } from '@/data/countyCommissioners';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';

type ViewState = 'hierarchy' | 'rc-list' | 'rc-detail' | 'cc-list' | 'cc-detail' | 'dc-list' | 'acc-list' | 'us-list' | 'as-list';

export function HierarchyPage() {
  const { user } = useAuth();
  const [zoom, setZoom] = useState(100);
  const [viewState, setViewState] = useState<ViewState>('hierarchy');
  const [selectedRC, setSelectedRC] = useState<RegionalCommissioner | null>(null);
  const [selectedCC, setSelectedCC] = useState<CountyCommissioner | null>(null);
  const [showPSVisitDialog, setShowPSVisitDialog] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleReset = () => setZoom(100);

  const handleRCClick = () => {
    setViewState('rc-list');
  };

  const handleSelectRC = (rc: RegionalCommissioner) => {
    setSelectedRC(rc);
    setViewState('rc-detail');
  };

  const handleBackToHierarchy = () => {
    setViewState('hierarchy');
    setSelectedRC(null);
  };

  const handleBackToRCList = () => {
    setViewState('rc-list');
    setSelectedRC(null);
  };

  const handleCCList = () => {
    setViewState('cc-list');
  };

  const handleCCDetail = (cc: CountyCommissioner) => {
    setSelectedCC(cc);
    setViewState('cc-detail');
  };

  const handleBackToCCList = () => {
    setViewState('cc-list');
    setSelectedCC(null);
  };

  const handleDCList = () => {
    setViewState('dc-list');
  };

  const handleACCList = () => {
    setViewState('acc-list');
  };

  const handleUSList = () => {
    setViewState('us-list');
  };

  const handleASList = () => {
    setViewState('as-list');
  };

  // Show R.C detail page
  if (viewState === 'rc-detail' && selectedRC) {
    return <RegionalCommissionerDetailPage rc={selectedRC} onBack={handleBackToRCList} />;
  }

  // Show R.C list page
  if (viewState === 'rc-list') {
    return <RegionalCommissionersListPage onBack={handleBackToHierarchy} onSelectRC={handleSelectRC} />;
  }

  // Show C.C detail page
  if (viewState === 'cc-detail' && selectedCC) {
    return <CountyCommissionerDetailPage cc={selectedCC} onBack={handleBackToCCList} />;
  }

  // Show C.C list page
  if (viewState === 'cc-list') {
    return <CountyCommissionersListPage onBack={handleBackToHierarchy} onSelectCC={handleCCDetail} />;
  }

  // Show hierarchy view
  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header with zoom controls */}
        <div className="border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Organizational Structure</h2>
              <p className="text-gray-500 mt-1">Ministry of Interior & National Administration</p>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 150}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-gray-50 border-b px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-violet-500" />
              <span className="text-sm text-gray-600">County Administration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-500" />
              <span className="text-sm text-gray-600">Secretariat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-sm text-gray-600">Executive</span>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="overflow-auto">
          <div 
            className="min-w-max px-8 py-8"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease'
            }}
          >
            <div className="flex flex-col items-center max-w-[1600px] mx-auto">
              
              {/* Determine visibility based on role */}
              {(() => {
                if (!user) return null;
                
                // CS, PS, PAS, SNA see everything
                const canSeeEverything = ['CS', 'PS', 'PAS', 'SNA'].includes(user.role);
                
                // County track roles can see county track but secretariat is dimmed
                const isCountyTrackRole = ['RC', 'CC', 'DC', 'ACC'].includes(user.role);
                
                // Secretariat track roles can see secretariat but county is dimmed
                const isSecretariatTrackRole = ['US', 'AS'].includes(user.role);
                
                // Determine if secretariat should be dimmed
                const dimSecretariat = isCountyTrackRole;
                
                // Determine if county track should be dimmed
                const dimCountyTrack = isSecretariatTrackRole;

                return (
                  <>
                    {/* EXECUTIVE LEVEL - Level 1 & 2 */}
                    <div className="flex flex-col items-center mb-3">
                      <div className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        EXECUTIVE LEVEL
                      </div>
                      
                      {/* Cabinet Secretary - Level 1 */}
                      <div className="flex flex-col items-center">
                        <div className="bg-rose-200 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                          LEVEL 1
                        </div>
                        <OrgNode 
                          title="Cabinet Secretary for Interior and National Administration"
                          abbreviation="CS"
                          track="top"
                          level={1}
                        />
                      </div>

                      <div className="flex flex-col items-center gap-0.5 my-1">
                        <div className="w-px h-4 bg-rose-400" />
                        <div className="w-px h-4 bg-rose-400" />
                      </div>

                      {/* Principal Secretary - Level 2 */}
                      <div className="flex flex-col items-center">
                        <div className="bg-rose-200 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                          LEVEL 2
                        </div>
                        <div className="relative cursor-pointer group" onClick={() => setShowPSVisitDialog(true)}>
                          <OrgNode 
                            title="Principal Secretary for Ministry of Interior and National Administration"
                            abbreviation="PS"
                            track="top"
                            level={2}
                            isClickable={true}
                          />
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-rose-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium shadow-lg">
                              Click to view today's visit
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-0.5 my-1">
                        <div className="w-px h-4 bg-rose-400" />
                        <div className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">oversees</div>
                        <div className="w-px h-4 bg-rose-400" />
                      </div>
                    </div>

                    {/* LEVEL 3 - P.A.S and R.C */}
                    <div className="flex flex-col items-center w-full mb-2">
                      <div className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        LEVEL 3
                      </div>
                      
                      <div className="flex items-start justify-center gap-12 w-full">
                        {/* Regional Commissioners - Left */}
                        <div className={`flex flex-col items-center ${dimCountyTrack ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-violet-600" />
                            <span className="text-xs font-bold text-gray-700">County Track</span>
                          </div>
                          <div className="relative cursor-pointer group" onClick={dimCountyTrack ? undefined : handleRCClick}>
                            <OrgNode 
                              title="Regional Commissioners"
                              abbreviation="R.C"
                              track="county"
                              level={4}
                              note="8 Commissioners • 148 of 240 leave days remaining"
                              isDimmed={dimCountyTrack}
                            />
                            {!dimCountyTrack && (
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-violet-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium shadow-lg">
                                  Click to view all 8 R.C
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center pt-10">
                          <div className="relative flex items-center">
                            <div className="w-24 h-0.5 bg-gray-400" />
                            <div className="absolute right-0 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-gray-400" />
                          </div>
                          <div className="mx-2 text-xs text-gray-600 bg-white px-2 py-0.5 rounded border whitespace-nowrap">
                            reports to
                          </div>
                        </div>

                        {/* Principal Administrative Secretaries - Right */}
                        <div className={`flex flex-col items-center ${dimSecretariat ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-gray-700">Secretariat Track</span>
                          </div>
                          <OrgNode 
                            title="Principal Administrative Secretaries"
                            abbreviation="P.A.S"
                            track="top"
                            level={4}
                            isDimmed={dimSecretariat}
                          />
                        </div>
                      </div>
                    </div>

                    {/* LEVELS 4, 5, 6 - Two Parallel Tracks */}
                    <div className="flex flex-col items-center w-full mt-4">
                      
                      {/* LEVEL 4 - County Commissioners and S.N.A */}
                      <div className="flex items-center justify-center gap-24 w-full">
                        {/* County Track - C.C */}
                        <div className={`flex flex-col items-center ${dimCountyTrack ? 'opacity-40' : ''}`}>
                          {/* Connector from R.C to C.C */}
                          <div className={`w-px h-6 ${dimCountyTrack ? 'bg-gray-300' : 'bg-violet-400'} mb-2`} />
                          
                          <div className="bg-violet-200 text-violet-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 4
                          </div>
                          <OrgNode 
                            title="County Commissioners"
                            abbreviation="C.C"
                            track="county"
                            level={4}
                            note="Updates leave status"
                            onClick={dimCountyTrack ? undefined : handleCCList}
                            isDimmed={dimCountyTrack}
                          />
                        </div>

                        {/* Secretariat Track - S.N.A */}
                        <div className={`flex flex-col items-center ${dimSecretariat ? 'opacity-40' : ''}`}>
                          {/* Connector from P.A.S to S.N.A */}
                          <div className={`w-px h-6 ${dimSecretariat ? 'bg-gray-300' : 'bg-amber-400'} mb-2`} />
                          
                          <div className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 4
                          </div>
                          <OrgNode 
                            title="Secretary National Administrator"
                            abbreviation="S.N.A"
                            track="secretariat"
                            level={4}
                            note="Custodian of all data, drafts transfers"
                            isDimmed={dimSecretariat}
                          />
                        </div>
                      </div>

                      {/* Connectors between Level 4 and 5 */}
                      <div className="flex items-center justify-center gap-24 w-full my-2">
                        <div className={`w-px h-6 ${dimCountyTrack ? 'bg-gray-300' : 'bg-violet-400'}`} />
                        <div className={`w-px h-6 ${dimSecretariat ? 'bg-gray-300' : 'bg-amber-400'}`} />
                      </div>

                      {/* LEVEL 5 - District Commissioners and U.S */}
                      <div className="flex items-center justify-center gap-24 w-full">
                        {/* County Track - D.C */}
                        <div className={`flex flex-col items-center ${dimCountyTrack ? 'opacity-40' : ''}`}>
                          <div className="bg-violet-200 text-violet-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 5
                          </div>
                          <OrgNode 
                            title="District Commissioners"
                            abbreviation="D.C"
                            track="county"
                            level={5}
                            onClick={dimCountyTrack ? undefined : handleDCList}
                            isDimmed={dimCountyTrack}
                          />
                        </div>

                        {/* Secretariat Track - U.S */}
                        <div className={`flex flex-col items-center ${dimSecretariat ? 'opacity-40' : ''}`}>
                          <div className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 5
                          </div>
                          <OrgNode 
                            title="Under Secretaries"
                            abbreviation="U.S"
                            track="secretariat"
                            level={5}
                            note="Posted to various ministries"
                            onClick={dimSecretariat ? undefined : handleUSList}
                            isDimmed={dimSecretariat}
                          />
                        </div>
                      </div>

                      {/* Connectors between Level 5 and 6 */}
                      <div className="flex items-center justify-center gap-24 w-full my-2">
                        <div className={`w-px h-6 ${dimCountyTrack ? 'bg-gray-300' : 'bg-violet-400'}`} />
                        <div className={`w-px h-6 ${dimSecretariat ? 'bg-gray-300' : 'bg-amber-400'}`} />
                      </div>

                      {/* LEVEL 6 - Assistant County Commissioners and A.S */}
                      <div className="flex items-center justify-center gap-24 w-full">
                        {/* County Track - A.C.C */}
                        <div className={`flex flex-col items-center ${dimCountyTrack ? 'opacity-40' : ''}`}>
                          <div className="bg-violet-200 text-violet-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 6
                          </div>
                          <OrgNode 
                            title="Assistant County Commissioners"
                            abbreviation="A.C.C"
                            track="county"
                            level={6}
                            onClick={dimCountyTrack ? undefined : handleACCList}
                            isDimmed={dimCountyTrack}
                          />
                        </div>

                        {/* Secretariat Track - A.S */}
                        <div className={`flex flex-col items-center ${dimSecretariat ? 'opacity-40' : ''}`}>
                          <div className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                            LEVEL 6
                          </div>
                          <OrgNode 
                            title="Assistant Secretaries"
                            abbreviation="A.S"
                            track="secretariat"
                            level={6}
                            note="Posted to various ministries"
                            onClick={dimSecretariat ? undefined : handleASList}
                            isDimmed={dimSecretariat}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          </div>
        </div>
      </div>

      {/* PS Visit Dialog */}
      <PSVisitDialog 
        open={showPSVisitDialog} 
        onOpenChange={setShowPSVisitDialog}
      />
    </>
  );
}