import { createContext, useEffect, useState } from "react";
import { Person } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("echosoulCurrentUser");
    if (t) {
      setToken(t);
    }
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  const login = (userData) => {
    setToken("123");
    setUser(userData);
    localStorage.setItem("token", "123");
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

    try {
      const storedUsers = JSON.parse(
        localStorage.getItem("echosoulUsers") ?? "[]",
      );
      if (Array.isArray(storedUsers)) {
        const updatedUsers = storedUsers.map((stored) => {
          if (
            stored.email === updatedUser.email ||
            stored.id === updatedUser.id
          ) {
            return { ...stored, ...updatedUser };
          }
          return stored;
        });
        localStorage.setItem("echosoulUsers", JSON.stringify(updatedUsers));
      }
    } catch {
      // ignore JSON errors
    }
  };

  const value = {
    Person,
    token,
    user,
    login,
    logout,
    updateUser,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
