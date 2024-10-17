import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

import ExportModal from './ExportModal';

const WhatsAppGroupContacts = ({ group, onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const socketRef = useRef(null);



    useEffect(() => {
        const wsUrl = `ws://0.0.0.0:${process.env.WS_PORT}/ws`;
        console.log('WebSocket URL:', wsUrl);
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
            socketRef.current.send(JSON.stringify({ action: 'getGroupMembers', groupId: group.id }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'groupMembersReceived') {
                setContacts(data.members);
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [group.id]);

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

    const handleExport = async (bucketId, selectedContacts, group) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bucketId,
                    contacts: selectedContacts.map(contactId => {
                        const contact = contacts.find(c => c.id === contactId);
                        return {
                            id: contact.id,
                            name: contact.name,
                            phoneNumber: contact.phoneNumber,
                            groupId: group.id,
                            groupName: group.name
                        };
                    }),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to export contacts');
            }

            const result = await response.json();
            console.log('Export result:', result);
            // You can add a success message or update the UI here
        } catch (error) {
            console.error('Error exporting contacts:', error);
            // You can add an error message or update the UI here
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
            <h2 className="text-2xl font-bold mb-4">{group.name} Contacts</h2>
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
                    onClick={() => setIsExportModalOpen(true)}
                    disabled={selectedContacts.length === 0}
                >
                    Export Selected
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
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
                selectedContacts={selectedContacts}
                group={group}
            />
        </div>
    );
};

export default WhatsAppGroupContacts;