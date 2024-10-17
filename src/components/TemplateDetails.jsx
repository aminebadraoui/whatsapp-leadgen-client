import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const TemplateDetails = ({ template, onBack, onUpdate, onDelete }) => {
    const [title, setTitle] = useState(template.title);
    const [message, setMessage] = useState(template.message);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/message-templates/${template.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message }),
            });
            const updatedTemplate = await response.json();
            onUpdate(updatedTemplate);
        } catch (error) {
            console.error('Error updating template:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/api/message-templates/${template.id}`, {
                    method: 'DELETE',
                });
                onDelete(template.id);
            } catch (error) {
                console.error('Error deleting template:', error);
            }
        }
    };

    return (
        <div>
            <motion.button
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
            >
                <FaArrowLeft className="mr-2" /> Back
            </motion.button>
            <h2 className="text-2xl font-bold mb-4">Template Details</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded mb-4 h-32"
            />
            <div className="flex justify-end">
                <motion.button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Delete
                </motion.button>
                <motion.button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update
                </motion.button>
            </div>
        </div>
    );
};

export default TemplateDetails;