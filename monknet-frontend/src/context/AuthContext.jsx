import { createContext, useEffect, useState } from "react";
import { decodeToken } from "../utils/decodeToken";

// Create global Authentication Context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const savedToken = sessionStorage.getItem("token");
  const savedUserData = sessionStorage.getItem("userData");

  // Global auth state
  const [token, setToken] = useState(savedToken || null);
  const [user, setUser] = useState(() => {
    if (savedUserData) {
      try {
        return JSON.parse(savedUserData);
      } catch (e) {
        console.error("Failed to parse userData:", e);
      }
    }
    return savedToken ? decodeToken(savedToken) : null;
  });

  // Sync token changes to sessionStorage and decode user
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      const userData = sessionStorage.getItem("userData");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setUser(decodeToken(token));
        }
      } else {
        setUser(decodeToken(token));
      }
    } else {
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // Update user data when userData changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = sessionStorage.getItem("userData");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Failed to parse userData:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
