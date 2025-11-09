import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string, role: Role) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users } = useData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string, role: Role): Promise<User | null> => {
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};