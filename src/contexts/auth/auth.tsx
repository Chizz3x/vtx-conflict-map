import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

export interface IUser {
  id: string;
  email: string;
  username: string;
}

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const value = useMemo<IAuthContext>(
    () => ({
      user: null,
      isAuthenticated: false,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): IAuthContext => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { AuthProvider, useAuth };
