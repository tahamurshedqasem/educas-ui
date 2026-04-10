// src/context/AuthContext.js
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage on client side only
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("educas_token");
        const storedUser = localStorage.getItem("educas_user");

        if (storedToken) {
          setToken(storedToken);
          // Set default axios header
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      const { educas_token, user: userData } = response.data;

      // Store in localStorage (client-side only)
      localStorage.setItem("educas_token", educas_token);
      localStorage.setItem("educas_user", JSON.stringify(userData));

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setToken(educas_token);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData,
      );

      const { educas_token, user: newUser } = response.data;

      // Store in localStorage (client-side only)
      localStorage.setItem("educas_token", educas_token);
      localStorage.setItem("educas_user", JSON.stringify(newUser));

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${educas_token}`;

      setToken(educas_token);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage (client-side only)
    localStorage.removeItem("educas_token");
    localStorage.removeItem("educas_user");

    // Remove axios default header
    delete axios.defaults.headers.common["Authorization"];

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    setUser,
    setToken,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
