import { AuthProvider } from '@/contexts/AuthContext';
import { AppRouter } from '@/app/components/AppRouter';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ConvexProvider>
  );
}