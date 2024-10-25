import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import SendMessageModal from './SendMessageModal';
import SendMessageProgress from './SendMessageProgress';
import useUserStore from '../stores/userStore';

const BucketContacts = ({ bucket, onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const [sendingProgress, setSendingProgress] = useState(null);
    const user = useUserStore((state) => state.user);
    const purchases = useUserStore((state) => state.purchases);
    const fetchUserPurchases = useUserStore((state) => state.fetchUserPurchases);



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchUserPurchases(user.userId);
            await fetchBucketContacts();
            setIsLoading(false);
        };

        fetchData();
    }, [bucket.id]);

    const fetchBucketContacts = async () => {
        try {
            console.log("fetching bucket contacts", `${process.env.REACT_APP_API_URL}/buckets/${bucket.id}/contacts?userId=${user.userId}`);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/buckets/${bucket.id}/contacts?userId=${user.userId}`);
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching bucket contacts:', error);
        }
    };

    useEffect(() => {
        const hasFullVersion = purchases.some(purchase => purchase.productId === `${process.env.REACT_APP_FULL_VERSION_PRODUCT_ID}`);
        if (!hasFullVersion && selectedContacts.length === 50) {
            showUpgradeModal();
        }
    }, [selectedContacts, user.productType]);

    const toggleContact = (contactId) => {
        const hasFullVersion = purchases.some(purchase => purchase.productId === `${process.env.REACT_APP_FULL_VERSION_PRODUCT_ID}`);
        if (!hasFullVersion) {
            setSelectedContacts(prev => {
                if (prev.includes(contactId)) {
                    return prev.filter(id => id !== contactId);
                } else if (prev.length < 50) {
                    return [...prev, contactId];
                }
                return prev;
            });
        } else {
            setSelectedContacts(prev =>
                prev.includes(contactId)
                    ? prev.filter(id => id !== contactId)
                    : [...prev, contactId]
            );
        }
    };

    const selectAll = () => {
        const hasFullVersion = purchases.some(purchase => purchase.productId === `${process.env.REACT_APP_FULL_VERSION_PRODUCT_ID}`);
        if (!hasFullVersion) {
            setSelectedContacts(contacts.slice(0, 50).map(c => c.id));
        } else {
            setSelectedContacts(contacts.map(c => c.id));
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(searchTerm)
    );

    const handleSendMessage = async (messageTemplate) => {
        console.log("messageTemplate", messageTemplate);
        setSendingProgress({ total: selectedContacts.length, current: 0, completed: [] });

        const wsUrl = process.env.REACT_APP_WS_URL;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connection established for sending messages');
            sendNextMessage(0);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'messageSent') {
                console.log(`Message sent successfully to ${data.contactId}: ${data.messageId}`);
                setSendingProgress((prev) => {
                    const newProgress = {
                        ...prev,
                        current: prev.current + 1,
                        completed: [...prev.completed, { contact: contacts.find(c => c.id === data.contactId), success: true }],
                    };
                    sendNextMessage(newProgress.current);
                    return newProgress;
                });
            } else if (data.action === 'error') {
                console.error(`Error sending message to ${data.contactId}:`, data.message);
                setSendingProgress((prev) => {
                    const newProgress = {
                        ...prev,
                        current: prev.current + 1,
                        completed: [...prev.completed, { contact: contacts.find(c => c.id === data.contactId), success: false, error: data.message }],
                    };
                    sendNextMessage(newProgress.current);
                    return newProgress;
                });
            }
        };

        const sendNextMessage = (index) => {
            if (index < selectedContacts.length) {
                const contact = contacts.find(c => c.id === selectedContacts[index]);

                console.log("contact", contact);
                const delay = index === 0 ? 0 : Math.floor(Math.random() * (60000 - 30000 + 1) + 30000);
                console.log('Delay:', delay);
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        action: 'sendMessage',
                        contactId: contact.id,
                        phoneNumber: contact.phoneNumber,
                        message: messageTemplate.message
                    }));
                }, delay);
            } else {
                ws.close();
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setSendingProgress((prev) => {
                const newProgress = {
                    ...prev,
                    current: prev.current + 1,
                    completed: [...prev.completed, { contact: contacts[prev.current], success: false, error: 'WebSocket error' }],
                };
                sendNextMessage(newProgress.current);
                return newProgress;
            });
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    return (
        <div className="p-6">
            <motion.button
                className="bg-primary-500 text-white px-4 py-2 rounded mb-4 flex items-center"
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
                    onClick={selectAll}
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
                    className="bg-primary-500 text-white px-4 py-2 rounded"
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
