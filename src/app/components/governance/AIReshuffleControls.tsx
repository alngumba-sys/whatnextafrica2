import { Cpu, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';

interface AIReshuffleControlsProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function AIReshuffleControls({ onCriticalAction }: AIReshuffleControlsProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Cpu className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Reshuffle Controls</h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure AI-powered transfer suggestions and bulk reshuffle parameters
          </p>
        </div>
      </div>

      {/* AI Status */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Engine Status</h3>
              <p className="text-sm text-gray-600">Advanced algorithms for optimal officer placement</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-300">
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">1,247</div>
            <div className="text-xs text-gray-600">Reshuffles Suggested</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
            <div className="text-xs text-gray-600">Acceptance Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">2.3 yrs</div>
            <div className="text-xs text-gray-600">Avg. Tenure Balanced</div>
          </div>
        </div>
      </div>

      {/* AI Parameters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Algorithm Parameters</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-700 font-medium">Tenure Weight</Label>
              <span className="text-sm text-blue-600 font-medium">High Priority</span>
            </div>
            <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Prioritize officers with longer tenure at current station for rotation
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-700 font-medium">Performance Weight</Label>
              <span className="text-sm text-blue-600 font-medium">Medium Priority</span>
            </div>
            <Slider defaultValue={[60]} max={100} step={1} className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Consider performance ratings when suggesting placements
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-700 font-medium">Regional Balance Weight</Label>
              <span className="text-sm text-blue-600 font-medium">High Priority</span>
            </div>
            <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Ensure equitable distribution across Kenya's regions
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-700 font-medium">Diversity Weight</Label>
              <span className="text-sm text-blue-600 font-medium">Medium Priority</span>
            </div>
            <Slider defaultValue={[55]} max={100} step={1} className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Promote diversity in county and district leadership
            </p>
          </div>
        </div>
      </div>

      {/* AI Constraints */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Constraints & Rules</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Minimum Tenure Required</Label>
              <p className="text-xs text-gray-500 mt-0.5">Officers must serve minimum 18 months before rotation</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Home County Restriction</Label>
              <p className="text-xs text-gray-500 mt-0.5">Prevent officers from serving in their home county</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Performance Threshold</Label>
              <p className="text-xs text-gray-500 mt-0.5">Only suggest high performers for critical stations</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div>
              <Label className="text-sm text-gray-700 font-medium">Family Consideration</Label>
              <p className="text-xs text-gray-500 mt-0.5">Factor in family circumstances for hardship stations</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Level-Specific AI Control */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enable AI by Hierarchy Level</h3>
        
        <div className="space-y-3">
          {[
            { level: 'Regional Commissioner', role: 'RC', count: 8 },
            { level: 'County Commissioner', role: 'CC', count: 47 },
            { level: 'District Commissioner', role: 'DC', count: 290 },
            { level: 'Assistant County Commissioner', role: 'ACC', count: 1000 },
            { level: 'Under Secretary', role: 'US', count: 45 },
            { level: 'Assistant Secretary', role: 'AS', count: 18 },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div>
                <Label className="text-sm text-gray-700 font-medium">{item.level}</Label>
                <p className="text-xs text-gray-500 mt-0.5">{item.count} positions</p>
              </div>
              <Switch defaultChecked={item.count > 50} />
            </div>
          ))}
        </div>
      </div>

      {/* Generate Reshuffle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate AI Reshuffle</h3>
            <p className="text-sm text-gray-600">Create bulk transfer suggestions based on configured parameters</p>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            onCriticalAction(
              'Generate AI Reshuffle Suggestions',
              'You are about to generate AI-powered transfer suggestions for multiple officers across Kenya. The AI will analyze tenure, performance, regional balance, and other parameters to suggest optimal placements. Review suggestions carefully before approval.',
              () => {
                // Generate logic
              }
            );
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate AI Reshuffle Suggestions
        </Button>
      </div>
    </div>
  );
}
