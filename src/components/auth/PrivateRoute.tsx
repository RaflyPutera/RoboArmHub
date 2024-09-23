import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // If still loading, you can optionally render a loading spinner or some placeholder
    if (isLoading) {
        return (
            <>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
            </>
          ) // You can replace this with a spinner or loader
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
