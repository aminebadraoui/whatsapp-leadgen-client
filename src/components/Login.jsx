import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaMagic } from 'react-icons/fa';
import useUserStore from '../stores/userStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);

    useEffect(() => {
        const user = useUserStore.getState().user;
        console.log('user', user);
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSendingMagicLink(true);
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/send-magic-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send magic link');
            }

            const data = await response.json();
            setIsSubmitted(true);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsSendingMagicLink(false);
        }
    };



    return (
        <div className="min-h-screen flex flex-col bg-primary-50">
            <header className="bg-primary-600 text-white p-4">
                <div className="container mx-auto">
                    <Link to="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
                        Lead Chat App
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
                >
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                    {!isSubmitted ? (
                        <>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-3xl font-bold text-primary-600 mb-6 text-center"
                            >
                                Login with Magic Link
                            </motion.h2>

                            <form onSubmit={handleSubmit}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSendingMagicLink}
                                >
                                    Send Magic Link <FaMagic className="ml-2" />
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <FaMagic className="text-primary-500 text-5xl mb-4 mx-auto" />
                            <h2 className="text-2xl font-bold text-primary-600 mb-4">Magic Link Sent!</h2>
                            <p className="text-gray-600">
                                Check your email for the magic link to log in. It may take a few minutes to arrive.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </main>

            <footer className="bg-primary-600 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2023 Lead Chat App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;