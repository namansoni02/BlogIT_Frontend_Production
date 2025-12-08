import { createContext, useEffect, useState } from "react";
import { decodeToken } from "../utils/decodeToken";

// Create global Authentication Context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const savedToken = sessionStorage.getItem("token");

  // Global auth state
  const [token, setToken] = useState(savedToken || null);
  const [user, setUser] = useState(savedToken ? decodeToken(savedToken) : null);

  // Sync token changes to sessionStorage and decode user
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      setUser(decodeToken(token));
    } else {
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // Clear authentication and user data
  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
