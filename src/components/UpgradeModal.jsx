import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useModalStore from '../stores/modalStore';
import { stripePromise } from '../utils/stripe';

const UpgradeModal = () => {
    const { isUpgradeModalOpen, hideUpgradeModal } = useModalStore();

    const handleUpgrade = async () => {
        try {
            const stripe = await stripePromise;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId: process.env.REACT_APP_FULL_VERSION_PRICE_ID }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const session = await response.json();

            if (!session.id) {
                throw new Error('Invalid session ID received from server');
            }

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <AnimatePresence>
            {isUpgradeModalOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
                        <p className="mb-6 text-gray-600">
                            Upgrade to our full version to unlock unlimited buckets and contacts.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <motion.button
                                className="px-4 py-2 bg-gray-200 rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={hideUpgradeModal}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="px-4 py-2 bg-primary-500 text-white rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleUpgrade}
                            >
                                Upgrade Now
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpgradeModal;