import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated by verifying the cookie
    const checkAuth = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get("http://localhost:3056/api/cAuth/checkAuth");
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:3056/api/cAuth/login", {
        username,
        password,
      }, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:3056/api/cAuth/logout", {}, {
      });
      setIsAuthenticated(false);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;