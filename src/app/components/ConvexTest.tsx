import { useAllUsers, useAllTransfers, useAllLeaveRecords } from '@/hooks/useConvex';
import { Card } from '@/app/components/ui/card';
import { CheckCircle2, XCircle, Loader2, Database } from 'lucide-react';

/**
 * ConvexTest Component
 * 
 * Use this component to verify your Convex connection is working.
 * Add it temporarily to your dashboard or any page to test.
 * 
 * Usage:
 * import { ConvexTest } from './components/ConvexTest';
 * <ConvexTest />
 */
export function ConvexTest() {
  const users = useAllUsers();
  const transfers = useAllTransfers();
  const leaveRecords = useAllLeaveRecords();

  const isLoading = users === undefined || transfers === undefined || leaveRecords === undefined;
  const hasData = users && users.length > 0;
  const isConnected = !isLoading && hasData;

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Convex Connection Test</h2>
            <p className="text-sm text-muted-foreground">
              Verify your Convex database is connected and working
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            ) : isConnected ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {isLoading ? 'Connecting...' : isConnected ? 'Connected ✓' : 'Not Connected ✗'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? 'Loading data from Convex...'
                  : isConnected
                  ? 'Successfully connected to Convex database'
                  : 'Could not connect to Convex. Check your setup.'}
              </p>
            </div>
          </div>

          {/* Data Counts */}
          {!isLoading && (
            <>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Users/Officers</p>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                </div>
                {users && users.length > 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Transfers</p>
                  <p className="text-2xl font-bold">{transfers?.length || 0}</p>
                </div>
                {transfers && transfers.length > 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Leave Records</p>
                  <p className="text-2xl font-bold">{leaveRecords?.length || 0}</p>
                </div>
                {leaveRecords && leaveRecords.length > 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </>
          )}

          {/* Recommendations */}
          {!isLoading && !isConnected && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Action Required:
              </p>
              <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-decimal list-inside">
                <li>Make sure <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">npx convex dev</code> is running</li>
                <li>Check your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code> has <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">VITE_CONVEX_URL</code></li>
                <li>Seed the database using the DataSeeder component</li>
                <li>Restart your dev server after adding env variables</li>
              </ol>
            </div>
          )}

          {!isLoading && isConnected && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                🎉 Everything looks good!
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your Convex database is connected and populated with data. 
                You can now start using Convex hooks in your components.
              </p>
            </div>
          )}
        </div>

        {/* Sample Data Preview */}
        {!isLoading && users && users.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2">Sample User Data:</p>
            <div className="bg-muted p-3 rounded-lg overflow-auto">
              <pre className="text-xs">
                {JSON.stringify(users[0], null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
