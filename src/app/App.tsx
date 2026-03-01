import { AuthProvider } from '@/contexts/AuthContext';
import { CreatedUsersProvider } from '@/contexts/CreatedUsersContext';
import { LogoProvider } from '@/contexts/LogoContext';
import { AppRouter } from '@/app/components/AppRouter';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <CreatedUsersProvider>
        <LogoProvider>
          <AppRouter />
          <Toaster />
        </LogoProvider>
      </CreatedUsersProvider>
    </AuthProvider>
  );
}