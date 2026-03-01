import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/app/components/LoginPage';
import { DashboardRouter } from '@/app/components/DashboardRouter';

export function AppRouter() {
  const { isAuthenticated } = useAuth();
  
  console.log('AppRouter - isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('Rendering LoginPage...');
    return <LoginPage />;
  }

  console.log('Rendering DashboardRouter...');
  return <DashboardRouter />;
}