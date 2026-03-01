import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UploadedAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface LogoContextType {
  uploadedAssets: UploadedAsset[];
  addAsset: (asset: UploadedAsset) => void;
  deleteAsset: (assetId: string) => void;
  primaryLogo: UploadedAsset | null;
  loginLogo: UploadedAsset | null;
  setPrimaryLogo: (assetId: string) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

const STORAGE_KEY = 'kenya-admin-uploaded-assets';

export function LogoProvider({ children }: { children: ReactNode }) {
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error loading assets from localStorage:', error);
      }
    }
    return [];
  });

  // Persist to localStorage whenever assets change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedAssets));
      } catch (error) {
        console.error('Error saving assets to localStorage:', error);
      }
    }
  }, [uploadedAssets]);

  const addAsset = (asset: UploadedAsset) => {
    setUploadedAssets((prev) => [...prev, asset]);
  };

  const deleteAsset = (assetId: string) => {
    setUploadedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const setPrimaryLogo = (assetId: string) => {
    // This function can be used for manual setting if needed in the future
  };

  // Find the most recent logo for each type
  const primaryLogo = uploadedAssets
    .filter(a => a.type === 'header')
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0] || null;

  const loginLogo = uploadedAssets
    .filter(a => a.type === 'login')
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0] || null;

  return (
    <LogoContext.Provider value={{ 
      uploadedAssets, 
      addAsset, 
      deleteAsset, 
      primaryLogo,
      loginLogo,
      setPrimaryLogo 
    }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    // During development hot reload, context might not be ready
    // Return default values instead of throwing
    return {
      uploadedAssets: [],
      addAsset: () => {},
      deleteAsset: () => {},
      primaryLogo: null,
      loginLogo: null,
      setPrimaryLogo: () => {}
    };
  }
  return context;
}