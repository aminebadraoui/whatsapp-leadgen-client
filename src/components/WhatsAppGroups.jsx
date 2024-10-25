import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhatsAppGroupContacts from './WhatsAppGroupContacts';
import useWebSocketStore from '../stores/websocketStore';
import useWhatsAppStore from '../stores/whatsappStore';
import Loader from './Loader';

const WhatsAppGroups = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef(null);

    const isClientReady = useWhatsAppStore(state => state.isClientReady);

    const effectRan = useRef(false);

    useEffect(() => {

        if (effectRan.current) return;
        if (isClientReady) {
            console.log('WebSocket connection established and client is ready');

            const handleMessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.action === 'groupsReceived') {
                    setGroups(data.groups);
                    setError(null);
                } else if (data.action === 'error') {
                    setError(data.message);
                }
            };
            const fetchGroups = () => {
                const wsUrl = process.env.REACT_APP_WS_URL;
                console.log('WebSocket URL:', wsUrl);
                socketRef.current = new WebSocket(wsUrl);

                socketRef.current.addEventListener('message', handleMessage);

                socketRef.current.onopen = () => {
                    console.log('WebSocket connection established');
                    socketRef.current.send(JSON.stringify({ action: 'getGroups' }));
                };
            };

            // Add a delay before fetching groups
            const timer = setTimeout(() => {
                fetchGroups();
                setIsLoading(false);
            }, 10000);





            effectRan.current = true;
            return () => {
                clearTimeout(timer);
                if (socketRef.current) {
                    socketRef.current.close();
                }
            };
        } else if (!isClientReady) {
            setError('WhatsApp client is not ready');
        }
    }, [isClientReady]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (isLoading) {
        return <Loader message='Fetching WhatsApp groups...' />;
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