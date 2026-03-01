import { MapPin, Building2, Users, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';

interface HierarchyJurisdictionsProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function HierarchyJurisdictions({ onCriticalAction }: HierarchyJurisdictionsProps) {
  const visibilityRules = [
    {
      role: 'CS/PS/PAS',
      name: 'Executive Level',
      countyTrack: 'Full Visibility',
      secretariatTrack: 'Full Visibility',
      crossJurisdiction: true,
      canViewAll: true
    },
    {
      role: 'RC/CC/DC/ACC',
      name: 'County Administration',
      countyTrack: 'Full Visibility',
      secretariatTrack: 'Dimmed (View Only)',
      crossJurisdiction: false,
      canViewAll: false
    },
    {
      role: 'SNA/US/AS',
      name: 'Secretariat Track',
      countyTrack: 'Dimmed (View Only)',
      secretariatTrack: 'Full Visibility',
      crossJurisdiction: false,
      canViewAll: false
    }
  ];

  const jurisdictionBoundaries = [
    { level: 'Regional Commissioner', count: 8, jurisdiction: 'Regional (Multi-County)', directReports: '~6 counties each' },
    { level: 'County Commissioner', count: 47, jurisdiction: 'County-Wide', directReports: '~6 DCs each' },
    { level: 'District Commissioner', count: 290, jurisdiction: 'District/Sub-County', directReports: '~3-5 ACCs each' },
    { level: 'Assistant County Commissioner', count: 1000, jurisdiction: 'Ward/Location', directReports: 'None' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <MapPin className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hierarchy & Jurisdictions</h2>
          <p className="text-gray-600 text-sm mt-1">
            Define jurisdiction boundaries, reporting lines, and visibility rules
          </p>
        </div>
      </div>

      {/* Visibility Rules */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Track Visibility Rules</h3>
          <p className="text-sm text-gray-600 mt-1">Control what each role can see across County and Secretariat tracks</p>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 text-gray-700 font-semibold">Role Group</th>
                <th className="text-center pb-3 text-gray-700 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-600" />
                    County Track
                  </div>
                </th>
                <th className="text-center pb-3 text-gray-700 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    Secretariat Track
                  </div>
                </th>
                <th className="text-center pb-3 text-gray-700 font-semibold">Cross-Jurisdiction</th>
                <th className="text-center pb-3 text-gray-700 font-semibold">View All Data</th>
              </tr>
            </thead>
            <tbody>
              {visibilityRules.map((rule, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="font-semibold text-gray-900">{rule.name}</div>
                    <div className="text-xs text-gray-500">{rule.role}</div>
                  </td>
                  <td className="py-4 text-center">
                    <Badge className={rule.countyTrack === 'Full Visibility' 
                      ? 'bg-violet-100 text-violet-700 border-violet-300'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                    }>
                      {rule.countyTrack === 'Full Visibility' ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {rule.countyTrack}
                    </Badge>
                  </td>
                  <td className="py-4 text-center">
                    <Badge className={rule.secretariatTrack === 'Full Visibility'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                    }>
                      {rule.secretariatTrack === 'Full Visibility' ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {rule.secretariatTrack}
                    </Badge>
                  </td>
                  <td className="py-4 text-center">
                    <Switch checked={rule.crossJurisdiction} disabled />
                  </td>
                  <td className="py-4 text-center">
                    <Switch checked={rule.canViewAll} disabled />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jurisdiction Boundaries */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Jurisdiction Boundaries</h3>
          <p className="text-sm text-gray-600 mt-1">Geographic and administrative scope for each hierarchy level</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {jurisdictionBoundaries.map((jb, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{jb.level}</div>
                    <Badge className="mt-1 bg-violet-100 text-violet-700 border-violet-300 text-xs">
                      {jb.count} positions
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Jurisdiction Scope</div>
                    <div className="text-sm text-gray-900">{jb.jurisdiction}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Direct Reports</div>
                    <div className="text-sm text-gray-900">{jb.directReports}</div>
                  </div>
                  <div className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        onCriticalAction(
                          `Edit ${jb.level} Jurisdiction`,
                          `You are about to modify jurisdiction boundaries for all ${jb.count} ${jb.level} positions. This will affect reporting lines and data visibility across the hierarchy.`,
                          () => {
                            // Edit logic
                          }
                        );
                      }}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reporting Lines Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Lines Configuration</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Auto-Populate Boss Field</Label>
              <p className="text-xs text-gray-500 mt-0.5">Automatically assign reporting officer based on location</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Strict Hierarchy Enforcement</Label>
              <p className="text-xs text-gray-500 mt-0.5">Prevent transfers that break reporting chain</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Cross-Track Visibility Dimming</Label>
              <p className="text-xs text-gray-500 mt-0.5">County officers see secretariat dimmed and vice versa</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
