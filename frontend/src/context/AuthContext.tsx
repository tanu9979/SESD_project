import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,  setUser]  = useState<User | null>(() => {
    const u = localStorage.getItem('folio_user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('folio_token'));

  const login = (u: User, t: string) => {
    setUser(u); setToken(t);
    localStorage.setItem('folio_user',  JSON.stringify(u));
    localStorage.setItem('folio_token', t);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('folio_user');
    localStorage.removeItem('folio_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
