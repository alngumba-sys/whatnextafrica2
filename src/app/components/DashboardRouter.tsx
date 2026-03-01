import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { LogOut, User as UserIcon, Home, Shield, UserPlus } from 'lucide-react';
import { getRoleName } from '@/data/users';
import { HierarchyPage } from '@/app/components/HierarchyPage';
import { RoleDashboard } from '@/app/components/RoleDashboard';
import { SystemGovernance } from '@/app/components/SystemGovernance';
import { CreateNewUserDialog } from '@/app/components/CreateNewUserDialog';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import coatOfArms from 'figma:asset/a4ef2a41d34a4fb02e01c58896dc3b258b86fad6.png';

type View = 'home' | 'hierarchy' | 'dashboard' | 'governance';

export function DashboardRouter() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);

  if (!user) return null;

  const isSNA = user.role === 'SNA';

  // If showing governance, render full-screen governance interface
  if (currentView === 'governance') {
    return <SystemGovernance onClose={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top Navigation Bar */}
      <div className="border-b sticky top-0 z-20 shadow-sm bg-[#66023C]">
        <div className="max-w-[1800px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-6">
              <ImageWithFallback src={coatOfArms} alt="Coat of Arms" className="h-12 w-auto" />
              <h1 className="text-xl font-bold text-white">
                Ministry of Interior & National Administration
              </h1>
            </div>

            {/* Center: Navigation Buttons */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/20 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className={`text-white hover:text-white hover:bg-white/20 ${
                  currentView === 'dashboard' ? 'bg-white/30 shadow-sm' : ''
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                My Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('hierarchy')}
                className={`text-white hover:text-white hover:bg-white/20 ${
                  currentView === 'hierarchy' ? 'bg-white/30 shadow-sm' : ''
                }`}
              >
                Organizational Chart
              </Button>
              {isSNA && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('governance')}
                  className={`text-white hover:text-white hover:bg-white/20 ${
                    currentView === 'governance' ? 'bg-white/30 shadow-sm' : ''
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  System Governance
                </Button>
              )}
            </div>

            {/* Right: Create New Employee & Logout */}
            <div className="flex items-center gap-4">
              {isSNA && (
                <Button
                  onClick={() => setShowCreateUserDialog(true)}
                  className="flex items-center gap-2 bg-[#8B7355] hover:bg-[#6d5940] text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Employee
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {/* Dashboard Overview */}
        {currentView === 'dashboard' && <RoleDashboard />}

        {/* Organizational Chart */}
        {currentView === 'hierarchy' && <HierarchyPage />}

        {/* System Governance */}
        {currentView === 'governance' && <SystemGovernance />}
      </main>

      {/* Create New Employee Dialog */}
      {showCreateUserDialog && (
        <CreateNewUserDialog onClose={() => setShowCreateUserDialog(false)} />
      )}
    </div>
  );
}