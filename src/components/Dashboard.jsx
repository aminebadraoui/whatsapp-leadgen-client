import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LeadBuckets from './LeadBuckets';
import WhatsAppGroups from './WhatsAppGroups';
import MessageTemplates from './MessageTemplates';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('buckets');

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'buckets':
                return <LeadBuckets />;
            case 'whatsapp':
                return <WhatsAppGroups />;
            case 'templates':
                return <MessageTemplates />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="flex h-screen bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-64 bg-green-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">WhatsApp LeadGen</h2>
                <motion.div
                    className={`cursor-pointer p-2 mb-2 rounded hover:bg-green-500 ${activeSection === 'buckets' ? 'bg-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection('buckets')}
                >
                    Lead Buckets
                </motion.div>
                <motion.div
                    className={`cursor-pointer p-2 mb-2 rounded hover:bg-green-500 ${activeSection === 'whatsapp' ? 'bg-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection('whatsapp')}
                >
                    WhatsApp Leads
                </motion.div>
                <motion.div
                    className={`cursor-pointer p-2 mb-2 rounded hover:bg-green-500 ${activeSection === 'templates' ? 'bg-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection('templates')}
                >
                    Message Templates
                </motion.div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                {renderActiveSection()}
            </div>
        </motion.div>
    );
};

export default Dashboard;