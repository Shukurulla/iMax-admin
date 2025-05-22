import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Bu muhim!
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        // Check if token is expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          // Set auth token in axios
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAdmin(decodedToken);
          setIsAuthenticated(true);
        } else {
          // Token expired, remove from storage
          localStorage.removeItem("adminToken");
          api.defaults.headers.common["Authorization"] = "";
        }
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem("adminToken");
        api.defaults.headers.common["Authorization"] = "";
      }
    }
    setLoading(false); // Loading tugadi
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/admin/login", { username, password });
      const { token } = response.data;

      // Save token to local storage
      localStorage.setItem("adminToken", token);

      // Set auth token in axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const decodedToken = jwtDecode(token);
      setAdmin(decodedToken);
      setIsAuthenticated(true);

      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Kirish vaqtida xatolik yuz berdi",
      };
    }
  };

  const logout = async () => {
    try {
      await api.get("/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Remove token from local storage and state
      localStorage.removeItem("adminToken");
      api.defaults.headers.common["Authorization"] = "";
      setAdmin(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
