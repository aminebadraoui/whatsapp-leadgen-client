import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Success = () => {
    useEffect(() => {
        // You can add any necessary side effects here, like analytics
    }, []);

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
                    className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <FaCheckCircle className="text-primary-500 text-6xl mx-auto mb-6" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-3xl font-bold text-primary-600 mb-4"
                    >
                        Payment Successful!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-gray-600 mb-8"
                    >
                        Thank you for your purchase. Your account has been successfully activated.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Link
                            to="/dashboard"
                            className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors font-semibold inline-block"
                        >
                            Go to Dashboard
                        </Link>
                    </motion.div>
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

export default Success;