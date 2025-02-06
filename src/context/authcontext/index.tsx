import { loginApi } from "@/api/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
    children: ReactNode
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: string;
    login: (username: string, password: string) => Promise<{ message: string, statusCode: number }>;
    logout: () => void
}
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: "",
    login: async () => ({ message: "", statusCode: 0 }),
    logout: () => { }
})

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem("user")))
    const [user, setUser] = useState<string>("")

    const login = async (username: string, password: string) => {
        try {

            const response = await loginApi()
            if (response?.username === username) {
                if (response?.password === password) {

                    setIsAuthenticated(true)
                    setUser(username)
                    localStorage.setItem("user", username)
                    return {
                        message: "login successfull",
                        statusCode: 200
                    }
                } else {
                    return {
                        message: "invalid password",
                        statusCode: 401
                    }
                }
            } else {
                return {
                    message: "invalid username",
                    statusCode: 401
                }
            }

        } catch (error) {
            console.error(error)
            return { message: "An error occurred", statusCode: 500 };
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        setUser("")
        localStorage.removeItem("user")
    }

    useEffect(() => {
        const isAuth = localStorage.getItem("user")
        if (isAuth) {
            setIsAuthenticated(true)
            setUser(isAuth)
        }
    }, [])

    const contextValue = {
        isAuthenticated, user, login, logout
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>

}

export const useAuthContext = () => useContext(AuthContext)