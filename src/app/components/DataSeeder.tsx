import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useBatchInsertUsers, useBatchInsertTransfers, useBatchInsertLeaveRecords, useClearAllData } from '@/hooks/useConvex';
import { users } from '@/data/users';
import { transfers, leaveRecords } from '@/data/transfersAndLeave';
import { Loader2, Database, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{
    users: boolean;
    transfers: boolean;
    leaveRecords: boolean;
  }>({
    users: false,
    transfers: false,
    leaveRecords: false,
  });

  const batchInsertUsers = useBatchInsertUsers();
  const batchInsertTransfers = useBatchInsertTransfers();
  const batchInsertLeaveRecords = useBatchInsertLeaveRecords();
  const clearAllData = useClearAllData();

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      // Seed users
      toast.info('Seeding users...');
      await batchInsertUsers({ users } as any);
      setSeedStatus(prev => ({ ...prev, users: true }));
      toast.success(`✅ ${users.length} users seeded`);

      // Seed transfers
      toast.info('Seeding transfers...');
      await batchInsertTransfers({ transfers } as any);
      setSeedStatus(prev => ({ ...prev, transfers: true }));
      toast.success(`✅ ${transfers.length} transfers seeded`);

      // Seed leave records
      toast.info('Seeding leave records...');
      await batchInsertLeaveRecords({ records: leaveRecords } as any);
      setSeedStatus(prev => ({ ...prev, leaveRecords: true }));
      toast.success(`✅ ${leaveRecords.length} leave records seeded`);

      toast.success('🎉 Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      return;
    }

    try {
      await clearAllData({});
      setSeedStatus({
        users: false,
        transfers: false,
        leaveRecords: false,
      });
      toast.success('Database cleared');
    } catch (error) {
      console.error('Error clearing database:', error);
      toast.error('Failed to clear database');
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Database Seeder</h2>
          <p className="text-sm text-muted-foreground">
            Populate your Convex database with initial data (2,464 officers, transfers, and leave records)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {seedStatus.users ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="font-medium">Users</p>
              <p className="text-sm text-muted-foreground">{users.length} officers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {seedStatus.transfers ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="font-medium">Transfers</p>
              <p className="text-sm text-muted-foreground">{transfers.length} transfer records</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {seedStatus.leaveRecords ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="font-medium">Leave Records</p>
              <p className="text-sm text-muted-foreground">{leaveRecords.length} leave records</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="flex-1"
            size="lg"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Database
              </>
            )}
          </Button>

          <Button
            onClick={handleClearDatabase}
            variant="destructive"
            size="lg"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Only run this once when setting up your database. 
            Running it multiple times will create duplicate data.
          </p>
        </div>
      </div>
    </Card>
  );
}
