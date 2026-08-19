import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RedirectRoot = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
};
