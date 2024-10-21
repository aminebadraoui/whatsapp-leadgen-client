import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddBucketModal = ({ isOpen, onClose, onAdd }) => {
    const [bucketName, setBucketName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(bucketName);
        setBucketName('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Add New Bucket</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={bucketName}
                                onChange={(e) => setBucketName(e.target.value)}
                                placeholder="Enter bucket name"
                                className="w-full p-2 border rounded mb-4"
                                required
                            />
                            <div className="flex justify-end">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className="bg-primary-500 text-white px-4 py-2 rounded"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Add Bucket
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddBucketModal;