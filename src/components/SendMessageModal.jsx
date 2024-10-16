import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SendMessageModal = ({ isOpen, onClose, onSend }) => {
    const [messageTemplates, setMessageTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        fetchMessageTemplates();
    }, []);

    const fetchMessageTemplates = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/message-templates');
            const data = await response.json();
            setMessageTemplates(data);
        } catch (error) {
            console.error('Error fetching message templates:', error);
        }
    };

    const handleSend = () => {
        if (selectedTemplate) {
            onSend(selectedTemplate);
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
                        <h2 className="text-2xl font-bold mb-4">Send Message</h2>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="">Select a message template</option>
                            {messageTemplates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
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
                                onClick={handleSend}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!selectedTemplate}
                            >
                                Send
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SendMessageModal;