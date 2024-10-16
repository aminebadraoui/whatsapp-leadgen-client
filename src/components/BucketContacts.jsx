import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import SendMessageModal from './SendMessageModal';

const BucketContacts = ({ bucket, onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);

    useEffect(() => {
        fetchBucketContacts();
    }, [bucket.id]);

    const fetchBucketContacts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/buckets/${bucket.id}/contacts`);
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
                    Send New Message
                </motion.button>
            </div>
            <ul>
                {filteredContacts.map((contact) => (
                    <motion.li
                        key={contact.id}
                        className="flex items-center bg-white p-2 mb-2 rounded"
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
                onSend={(messageId) => {
                    // Implement send message functionality
                    console.log('Sending message:', messageId, 'to contacts:', selectedContacts);
                }}
            />
        </div>
    );
};

export default BucketContacts;