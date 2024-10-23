import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhatsAppGroupContacts from './WhatsAppGroupContacts';
import useWebSocketStore from '../stores/websocketStore';
import useWhatsAppStore from '../stores/whatsappStore';

const WhatsAppGroups = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);

    const socket = useWebSocketStore(state => state.socket);
    const sendMessage = useWebSocketStore(state => state.sendMessage);
    const isClientReady = useWhatsAppStore(state => state.isClientReady);

    useEffect(() => {
        if (socket && isClientReady) {
            console.log('WebSocket connection established and client is ready');

            const fetchGroups = () => {
                console.log('Fetching groups...');
                sendMessage({ action: 'getGroups' });
            };

            // Add a delay before fetching groups
            const timer = setTimeout(fetchGroups, 10000);

            const handleMessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.action === 'groupsReceived') {
                    setGroups(data.groups);
                    setError(null);
                } else if (data.action === 'error') {
                    setError(data.message);
                }
            };

            socket.addEventListener('message', handleMessage);

            return () => {
                clearTimeout(timer);
                socket.removeEventListener('message', handleMessage);
            };
        } else if (!isClientReady) {
            setError('WhatsApp client is not ready');
        } else if (!socket) {
            setError('WebSocket connection not available');
        }
    }, [socket, sendMessage, isClientReady]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">WhatsApp Leads</h2>
            {selectedGroup ? (
                <WhatsAppGroupContacts group={selectedGroup} onBack={() => setSelectedGroup(null)} />
            ) : (
                <ul>
                    {groups.map((group) => (
                        <motion.li
                            key={group.id}
                            className="bg-white p-2 mb-2 rounded cursor-pointer hover:bg-gray-100"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGroup(group)}
                        >
                            {group.name}
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WhatsAppGroups;