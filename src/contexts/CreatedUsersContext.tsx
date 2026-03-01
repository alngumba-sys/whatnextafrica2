import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CreatedUser {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  nationalId?: string;
  
  // Role & Position
  role: string;
  position: string;
  department: string;
  reportingTo?: string;
  
  // Location & Jurisdiction
  region: string;
  county: string;
  subcounty?: string;
  headquarters: string;
  jurisdictionOverview?: string;
  
  // Background & Experience
  education?: string;
  yearsOfExperience?: string;
  previousPositions?: string;
  expertise: string[];
  
  // Budget & Metrics
  budgetAllocated?: string;
  performanceTarget?: string;
  kpiMetrics?: string;
  
  // Key Initiatives
  initiatives: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  status: 'active' | 'inactive' | 'pending';
}

interface CreatedUsersContextType {
  createdUsers: CreatedUser[];
  addUser: (user: Omit<CreatedUser, 'id' | 'createdAt' | 'createdBy' | 'status'>) => void;
  updateUser: (id: string, updates: Partial<CreatedUser>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => CreatedUser | undefined;
}

const CreatedUsersContext = createContext<CreatedUsersContextType | undefined>(undefined);

const STORAGE_KEY = 'kenya-admin-created-users';

export function CreatedUsersProvider({ children }: { children: ReactNode }) {
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>(() => {
    // Initialize from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
    }
    return [];
  });

  // Persist to localStorage whenever createdUsers changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createdUsers));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }, [createdUsers]);

  const addUser = (userData: Omit<CreatedUser, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    const newUser: CreatedUser = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'SNA', // Secretary National Administrator
      status: 'active'
    };
    
    setCreatedUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<CreatedUser>) => {
    setCreatedUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, ...updates } : user))
    );
  };

  const deleteUser = (id: string) => {
    setCreatedUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUserById = (id: string) => {
    return createdUsers.find(user => user.id === id);
  };

  return (
    <CreatedUsersContext.Provider
      value={{
        createdUsers,
        addUser,
        updateUser,
        deleteUser,
        getUserById
      }}
    >
      {children}
    </CreatedUsersContext.Provider>
  );
}

export function useCreatedUsers() {
  const context = useContext(CreatedUsersContext);
  if (context === undefined) {
    throw new Error('useCreatedUsers must be used within a CreatedUsersProvider');
  }
  return context;
}