import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout, getProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            setIsAuthenticated(false);
            setUser(null);
            // Optional: clear invalid token
            if (localStorage.getItem('access_token')) {
                apiLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            setIsAuthenticated(true);
            // Fetch profile immediately after login
            const profileRes = await getProfile();
            setUser(profileRes.data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiLogout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
