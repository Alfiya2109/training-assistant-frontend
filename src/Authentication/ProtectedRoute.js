import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAutoLogout from './useAutoLogout';
import { UserContext } from './Context/UserContext';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    useAutoLogout(600000); // Automatically logout after 10 minutes

    const isTokenValid = (token) => {
        if (!token) return false;

        const tokenParts = token.split('.');        
        if (tokenParts.length !== 3) return false;

        try {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiry = payload.exp;
            const now = Math.floor(Date.now() / 1000);

            if (expiry <= now) return false;
            return true;
        } catch (e) {
            return false;
        }
    };

    const getEffectiveUser = () => {
        if (user) return user;
        try {
            const saved = localStorage.getItem('user_info');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('access_token');
        return isTokenValid(token) && !!getEffectiveUser();
    };

    const hasRequiredRole = () => {
        const effUser = getEffectiveUser();
        return roleRequired ? effUser && effUser.isAdmin : true;
    };

    useEffect(() => {
        if (!isAuthenticated() || !hasRequiredRole()) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    return isAuthenticated() && hasRequiredRole() ? children : null;
};

export default ProtectedRoute;
