import { AuthProvider } from '@/contexts/AuthContext';
import { CreatedUsersProvider } from '@/contexts/CreatedUsersContext';
import { AppRouter } from '@/app/components/AppRouter';

export default function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <CreatedUsersProvider>
        <AppRouter />
      </CreatedUsersProvider>
    </AuthProvider>
  );
}