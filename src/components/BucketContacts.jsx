import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import SendMessageModal from './SendMessageModal';
import SendMessageProgress from './SendMessageProgress';

const BucketContacts = ({ bucket, onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const [sendingProgress, setSendingProgress] = useState(null);

    useEffect(() => {
        fetchBucketContacts();
    }, [bucket.id]);

    const fetchBucketContacts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/buckets/${bucket.id}/contacts`);
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching bucket contacts:', error);
        }
    };

    const toggleContact = (contactId) => {
        setSelectedContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(searchTerm)
    );

    const handleSendMessage = async (messageTemplate) => {
        console.log("messageTemplate", messageTemplate);
        setSendingProgress({ total: selectedContacts.length, current: 0, completed: [] });
        for (let i = 0; i < selectedContacts.length; i++) {
            const contact = contacts.find(c => c.id === selectedContacts[i]);
            const delay = Math.floor(Math.random() * (120000 - 60000 + 1) + 60000);
            console.log('Delay:', delay); // Random delay between 1-2 minutes
            await new Promise(resolve => setTimeout(resolve, 300));

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contactId: contact.id, message: messageTemplate.message }),
                });

                const result = await response.json();
                console.log('Result:', result);

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to send message');
                }

                console.log(`Message sent successfully to ${contact.name}: ${result.messageId}`);

                setSendingProgress(prev => ({
                    ...prev,
                    current: i + 1,
                    completed: [...prev.completed, { contact, success: true }],
                }));
            } catch (error) {
                console.error(`Error sending message to ${contact.name}:`, error);
                setSendingProgress(prev => ({
                    ...prev,
                    current: i + 1,
                    completed: [...prev.completed, { contact, success: false, error: error.message }],
                }));
            }
        }
    };

    return (
        <div className="p-6">
            <motion.button
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
            >
                <FaArrowLeft className="mr-2" /> Back
            </motion.button>
            <h2 className="text-2xl font-bold mb-4">{bucket.name} Contacts</h2>
            <div className="mb-4 flex items-center">
                <FaSearch className="mr-2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name or phone number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <motion.button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedContacts(contacts.map(c => c.id))}
                >
                    Select All
                </motion.button>
                <motion.button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedContacts([])}
                >
                    Deselect All
                </motion.button>
                <motion.button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSendMessageModalOpen(true)}
                    disabled={selectedContacts.length === 0}
                >
                    Send Message
                </motion.button>
            </div>
            <ul className="space-y-2">
                {filteredContacts.map((contact) => (
                    <motion.li
                        key={contact.id}
                        className="flex items-center bg-white p-2 rounded shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleContact(contact.id)}
                            className="mr-2"
                        />
                        {contact.name} - {contact.phoneNumber}
                    </motion.li>
                ))}
            </ul>
            <SendMessageModal
                isOpen={isSendMessageModalOpen}
                onClose={() => setIsSendMessageModalOpen(false)}
                onSend={handleSendMessage}
            />
            {sendingProgress && (
                <SendMessageProgress progress={sendingProgress} />
            )}
        </div>
    );
};

export default BucketContacts;
