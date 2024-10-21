import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SendMessageProgress = ({ progress }) => {
    const { total, current, completed } = progress;

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-lg font-semibold mb-2">Sending Progress</h3>
            <div className="mb-2">
                <div className="bg-gray-200 rounded-full h-4">
                    <motion.div
                        className="bg-primary-500 h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(current / total) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {current} / {total} messages sent
                </p>
            </div>
            <ul className="max-h-40 overflow-y-auto">
                {completed.map((item, index) => (
                    <motion.li
                        key={index}
                        className="flex items-center text-sm mb-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {item.success ? (
                            <FaCheckCircle className="text-primary-500 mr-2" />
                        ) : (
                            <FaTimesCircle className="text-red-500 mr-2" />
                        )}
                        {item.contact.name} - {item.contact.phoneNumber}
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default SendMessageProgress;