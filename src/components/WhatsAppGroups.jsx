import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhatsAppGroupContacts from './WhatsAppGroupContacts';

const WhatsAppGroups = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const socketRef = useRef(null);



    useEffect(() => {
        const wsUrl = `ws://0.0.0.0:5006/ws`;
        console.log('WebSocket URL:', wsUrl);

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
            socketRef.current.send(JSON.stringify({ action: 'getGroups' }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'groupsReceived') {
                setGroups(data.groups);
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

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