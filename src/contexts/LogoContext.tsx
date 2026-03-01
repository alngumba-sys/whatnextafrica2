import { createContext, useContext, useState, ReactNode } from 'react';

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

export function LogoProvider({ children }: { children: ReactNode }) {
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);

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