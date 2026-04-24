import { createContext, useEffect, useState } from "react";
import { Person } from "../assets/assets";
import { userAPI } from "../services/api";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on app load
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("echosoulCurrentUser");

    if (t) {
      setToken(t);
      localStorage.setItem("token", t);
    }
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("echosoulCurrentUser");
      }
    }
    setLoading(false);
  }, []);

  // Fetch user profile if token exists
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem(
          "echosoulCurrentUser",
          JSON.stringify(response.data.user),
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If unauthorized, clear token
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem("token");
      }
    }
  };

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("echosoulCurrentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("echosoulCurrentUser");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("echosoulCurrentUser", JSON.stringify(updatedUser));
  };

  const value = {
    Person,
    token,
    user,
    loading,
    login,
    logout,
    updateUser,
    fetchUserProfile,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
