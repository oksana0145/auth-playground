import { createContext, useContext, useState, useEffect } from "react";
import { refresh, getMe } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loginUser = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
  };

  const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken);
  };

  const restoreSession = async () => {
    try {
      const refreshData = await refresh();
      const newAccessToken = refreshData.accessToken;

      const userData = await getMe(newAccessToken);

      setAccessToken(newAccessToken);
      setUser(userData.user);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const isAuthenticated = Boolean(user && accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isAuthLoading,
        loginUser,
        logoutUser,
        updateAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
