import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAutoLogout from './useAutoLogout';
import { UserContext } from './Context/UserContext'; // Make sure this path matches your context file

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    useAutoLogout(600000); // Automatically logout after 10 minutes

    const isTokenValid = (token) => {
        if (!token) return false;

        const tokenParts = token.split('.');        
        if (tokenParts.length !== 3) return false; // Invalid token format

        try {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiry = payload.exp;
            const now = Math.floor(Date.now() / 1000);

            if (expiry <= now) return false; // Token has expired
            return true;
        } catch (e) {
            return false; // Error in parsing token or invalid token
        }
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('access_token');
        return isTokenValid(token) && user;
    };

    const hasRequiredRole = () => {
        return roleRequired ? user && user.isAdmin : true;
    };

    useEffect(() => {
        if (!isAuthenticated() || !hasRequiredRole()) {
            // Redirect to login if not authenticated or role is not authorized
            navigate('/', { replace: true });
        }
    }, [navigate, isAuthenticated, hasRequiredRole]);

    return isAuthenticated() && hasRequiredRole() ? children : null; // Render children or nothing if not authenticated or authorized
};

export default ProtectedRoute;
