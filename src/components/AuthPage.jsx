import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../stores/userStore';


const AuthPage = () => {
    const [status, setStatus] = useState('Authenticating...');
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const authenticateToken = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('No token provided. Please check your email link.');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Authentication failed');
                }

                const data = await response.json();

                // Store the session token
                localStorage.setItem('token', data.token);


                // Set the user in Zustand store
                setUser(data.user);

                setStatus('Authentication successful. Redirecting...');
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (error) {
                console.error('Authentication error:', error);
                setStatus('Authentication failed. Please try again.');
            }
        };

        authenticateToken();
    }, [location, navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-primary-600 mb-4">Lead Chat App</h1>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
};

export default AuthPage;