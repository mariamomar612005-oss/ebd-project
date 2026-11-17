import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser());

  const login = (token, userData) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) { /* ignore */ }
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
