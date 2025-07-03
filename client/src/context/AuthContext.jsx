import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('isAdmin') === 'true';
    if (savedToken) {
      setToken(savedToken);
      setIsAdmin(savedAdmin);
    }
  }, []);

  const login = (newToken, adminFlag) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAdmin', adminFlag);
    setToken(newToken);
    setIsAdmin(adminFlag);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
