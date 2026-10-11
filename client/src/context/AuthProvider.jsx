import { useState, useEffect } from "react";
import { refresh, getMe } from "../api/authApi.js";
import { AuthContext } from "./AuthContext.js";

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

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const refreshData = await refresh();
        const newAccessToken = refreshData.accessToken;

        const userData = await getMe(newAccessToken);

        if (!cancelled) {
          setAccessToken(newAccessToken);
          setUser(userData.user);
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
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
