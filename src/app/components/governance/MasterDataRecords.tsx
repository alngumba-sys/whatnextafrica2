import { Database, Upload, Download, UserPlus, UserX } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface MasterDataRecordsProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function MasterDataRecords({ onCriticalAction }: MasterDataRecordsProps) {
  const dataStats = [
    { label: 'Total Officers', count: 2464, track: 'All', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { label: 'County Track', count: 1392, track: 'County', color: 'bg-violet-100 text-violet-700 border-violet-300' },
    { label: 'Secretariat Track', count: 1063, track: 'Secretariat', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { label: 'Executive Level', count: 9, track: 'Executive', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-rose-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Master Data & Officer Records</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage the complete officer database, bulk operations, and data integrity
          </p>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-4 gap-4">
        {dataStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.count.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-3">{stat.label}</div>
            <Badge className={stat.color}>{stat.track}</Badge>
          </div>
        ))}
      </div>

      {/* Bulk Operations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Data Operations</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              onCriticalAction(
                'Bulk Import Officers',
                'You are about to import officer records in bulk. This will create new entries in the master database and assign them to the organizational hierarchy. Ensure data is properly formatted and validated.',
                () => {
                  // Import logic
                }
              );
            }}
          >
            <Upload className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Bulk Import Officers</div>
              <div className="text-xs text-gray-500">Upload CSV/Excel with officer data</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              // Export logic
            }}
          >
            <Download className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Export Master Database</div>
              <div className="text-xs text-gray-500">Download complete officer records</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              onCriticalAction(
                'Activate Multiple Users',
                'You are about to activate user accounts and grant system access. These officers will be able to log in and perform actions based on their role permissions.',
                () => {
                  // Activate logic
                }
              );
            }}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Bulk Activate Users</div>
              <div className="text-xs text-gray-500">Grant system access to officers</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-auto py-4"
            onClick={() => {
              onCriticalAction(
                'Suspend Multiple Users',
                'You are about to suspend user accounts and revoke system access. This action is reversible but will immediately prevent these officers from logging in.',
                () => {
                  // Suspend logic
                }
              );
            }}
          >
            <UserX className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Bulk Suspend Users</div>
              <div className="text-xs text-gray-500">Revoke system access temporarily</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Data Integrity Tools */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Integrity & Corrections</h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
            <div>
              <div className="text-sm font-medium text-gray-900">Validate Reporting Lines</div>
              <div className="text-xs text-gray-600 mt-1">Ensure all officers have valid boss assignments</div>
            </div>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Run Check
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
            <div>
              <div className="text-sm font-medium text-gray-900">Detect Duplicate Records</div>
              <div className="text-xs text-gray-600 mt-1">Find and merge duplicate officer entries</div>
            </div>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Scan Database
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
            <div>
              <div className="text-sm font-medium text-gray-900">Historical Data Correction</div>
              <div className="text-xs text-gray-600 mt-1">Correct past transfer records with audit trail</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                onCriticalAction(
                  'Correct Historical Data',
                  'You are about to modify historical records. This action will be logged in the immutable audit trail with your S.N.A. credentials and justification.',
                  () => {
                    // Correction logic
                  }
                );
              }}
            >
              Initiate Correction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
