import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhatsAppGroupContacts from './WhatsAppGroupContacts';
import useWebSocketStore from '../stores/websocketStore';

const WhatsAppGroups = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);

    const socket = useWebSocketStore(state => state.socket);
    const sendMessage = useWebSocketStore(state => state.sendMessage);

    useEffect(() => {
        if (socket) {
            console.log('WebSocket connection established');
            sendMessage({ action: 'getGroups' });

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
                socket.removeEventListener('message', handleMessage);
            };
        } else {
            setError('WebSocket connection not available');
        }
    }, [socket, sendMessage]);

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