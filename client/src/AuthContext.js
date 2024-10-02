import React, { createContext, useState, useEffect, useContext } from "react";
import api from "./api";
import AuthMenu from "./components/AuthMenu";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [showAuthMenu, setShowAuthMenu] = useState();
  const [user, setUser] = useState(null);

  async function fetchUserData() {
    try {
      const res = await api.get("users/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUserData, setShowAuthMenu }}>
      {showAuthMenu && <AuthMenu />}
      {children}
    </AuthContext.Provider>
  );
};
