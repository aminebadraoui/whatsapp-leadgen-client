import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddTemplateModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(title, message);
        setTitle('');
        setMessage('');
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
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Create New Template</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Template Title"
                                className="w-full p-2 border rounded mb-4"
                                required
                            />
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message"
                                className="w-full p-2 border rounded mb-4 h-32"
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
                                    Create Template
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTemplateModal;