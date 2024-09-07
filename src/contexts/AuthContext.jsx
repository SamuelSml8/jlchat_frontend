import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/auth/validate-token",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data.ok) {
            setIsAuthenticated(true);
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          toast.error("Session expired or invalid token");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate("/login");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const login = () => {
    setIsAuthenticated(true);
    navigate("/chat");
  };

  const logout = () => {
    setIsAuthenticated(false);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
