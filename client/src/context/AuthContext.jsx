import { createContext, useContext, useState } from "react";
import { data } from "react-router-dom";

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
    const [user,setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)

    const loginUser = (data) => {
        setUser(data.user)
        setAccessToken(data.accessToken)
    }

    const logoutUser = (data) => {
        setUser(null)
        setAccessToken(null)
    }

    const isAuthenticated = Boolean(user && accessToken)

     const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken)
 };

    return (
        <AuthContext.Provider
        value={{
            user,
            accessToken,
            isAuthenticated,
            loginUser,
            logoutUser,
            updateAccessToken,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
 }

 export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
 };
