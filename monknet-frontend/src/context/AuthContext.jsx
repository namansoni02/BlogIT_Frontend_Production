import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);   
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
