import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMyBusiness } from '../context/MyBusinessContext';

const MyBusinessProtectedRoute = () => {
    const { isUnlocked, loading } = useMyBusiness();

    if (loading) return null; // Wait for context to load

    if (!isUnlocked) {
        return <Navigate to="/actual-world/dashboard" replace />;
    }

    return <Outlet />;
};

export default MyBusinessProtectedRoute;
