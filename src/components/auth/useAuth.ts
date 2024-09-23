import { useState, useEffect } from 'react';

const useAuth = (): { isAuthenticated: boolean; isLoading: boolean } => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem('token'); // or localStorage if you decide to use that
            setIsAuthenticated(!!token); // Set true if token exists, false otherwise
            setIsLoading(false); // Set loading to false after check
        };

        checkAuth();
    }, []);

    return { isAuthenticated, isLoading };
};

export default useAuth;
