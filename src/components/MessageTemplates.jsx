import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddTemplateModal from './AddTemplateModal';
import TemplateDetails from './TemplateDetails';
import Loader from './Loader';
import useUserStore from '../stores/userStore';
import useModalStore from '../stores/modalStore';

const MessageTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(true);
    const user = useUserStore((state) => state.user);
    const purchases = useUserStore((state) => state.purchases);
    const fetchUserPurchases = useUserStore((state) => state.fetchUserPurchases);
    const showUpgradeModal = useModalStore((state) => state.showUpgradeModal);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchingTemplates(true);
            await fetchUserPurchases(user.userId);
            await fetchTemplates();
            setIsFetchingTemplates(false);
        };
        fetchData();
    }, []);

    const fetchTemplates = async () => {
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/message-templates?userId=${user.userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setError('Failed to fetch templates. Please try again later.');
        }
    };

    const addTemplate = async (title, message) => {
        const hasFullVersion = purchases.some(purchase => purchase.productId === `${process.env.REACT_APP_FULL_VERSION_PRODUCT_ID}`);
        if (!hasFullVersion && templates.length >= 1) {
            showUpgradeModal();
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/message-templates?userId=${user.userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newTemplate = await response.json();
            setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
        } catch (error) {
            console.error('Error adding template:', error);
            setError('Failed to add template. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingTemplates) {
        return <Loader message='Fetching message templates...' />;
    }

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {selectedTemplate ? (
                <TemplateDetails
                    template={selectedTemplate}
                    onBack={() => setSelectedTemplate(null)}
                    onUpdate={(updatedTemplate) => {
                        setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
                        setSelectedTemplate(null);
                    }}
                    onDelete={(deletedId) => {
                        setTemplates(templates.filter(t => t.id !== deletedId));
                        setSelectedTemplate(null);
                    }}
                />
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Message Templates</h2>
                    <motion.button
                        className="bg-primary-500 text-white px-4 py-2 rounded mb-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create New Template
                    </motion.button>
                    {templates.length === 0 ? (
                        <p>No templates found. Create a new template to get started.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <motion.div
                                    key={template.id}
                                    className="bg-white p-4 rounded shadow cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    <h3 className="text-lg font-semibold">{template.title}</h3>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <AddTemplateModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAdd={addTemplate}
                    />
                </>
            )}
        </div>
    );
};

export default MessageTemplates;