import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../stores/userStore';

const ExportModal = ({ isOpen, onClose, onExport, selectedContacts, group }) => {
    const [buckets, setBuckets] = useState([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const user = useUserStore((state) => state.user);


    useEffect(() => {
        fetchBuckets();
    }, []);

    const fetchBuckets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/buckets?userId=${user.userId}`);
            const data = await response.json();
            setBuckets(data);
        } catch (error) {
            console.error('Error fetching buckets:', error);
        }
    };

    const handleExport = () => {
        if (selectedBucket) {
            onExport(selectedBucket, selectedContacts, group);
            onClose();
        }
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
                        <h2 className="text-2xl font-bold mb-4">Export Contacts</h2>
                        <select
                            value={selectedBucket}
                            onChange={(e) => setSelectedBucket(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="">Select a bucket</option>
                            {buckets.map((bucket) => (
                                <option key={bucket.id} value={bucket.id}>
                                    {bucket.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end">
                            <motion.button
                                onClick={onClose}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleExport}
                                className="bg-primary-500 text-white px-4 py-2 rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!selectedBucket}
                            >
                                Export
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportModal;