import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaUsers, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import useUserStore from '../stores/userStore';
import { useNavigate, Link } from 'react-router-dom';
import WhatsAppAuth from './WhatsAppAuth';
import WhatsAppGroups from './WhatsAppGroups';
import MessageTemplates from './MessageTemplates';
import LeadBuckets from './LeadBuckets';
import useWhatsAppStore from '../stores/whatsappStore';
import useWebSocketStore from '../stores/websocketStore';
import UpgradeModal from './UpgradeModal';


const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('whatsapp');
    const clearUser = useUserStore((state) => state.clearUser);
    const navigate = useNavigate();
    const setClientReady = useWhatsAppStore((state) => state.setClientReady);
    const isClientReady = useWhatsAppStore((state) => state.isClientReady);
    const user = useUserStore((state) => state.user);
    const { connect, socket } = useWebSocketStore();

    const socketInitialized = useRef(false);

    useEffect(() => {
        if (user && user.userId && !socketInitialized.current) {
            connect(user.userId);
            socketInitialized.current = true;
        }
    }, [user, connect]);

    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        if (!socket) return;

        if (socket) {
            socket.onmessage = (event) => {
                console.log('Received message:', event.data);

                try {
                    const data = JSON.parse(event.data);

                    if (data.action === 'clientStatus') {
                        console.log('Client status:', data.isReady);
                        console.log('userId', user.userId);

                        if (!data.isReady) {
                            socket.send(JSON.stringify({ action: 'initialize', userId: user.userId }));
                        }
                    }

                    if (data.type === 'whatsapp_ready') {
                        setClientReady(true);
                    }

                    if (data.type === 'whatsapp_not_ready' || data.type === 'disconnected') {
                        setClientReady(false);

                        // setTimeout(() => {
                        //     socket.send(JSON.stringify({ action: 'initialize', userId: user.userId }));
                        // }, 5000);
                    }

                    if (data.type === 'qr') {
                        setQrCode(data.qr);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
        }
    }, [socket, setClientReady, isClientReady, user.userId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearUser();
        navigate('/access');
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'whatsapp':
                return isClientReady ? <WhatsAppGroups /> : <WhatsAppAuth qrCode={qrCode} />;
            case 'lead-buckets':
                return <LeadBuckets />;
            case 'templates':
                return <MessageTemplates />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-primary-50">
            <header className="bg-primary-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">

                    <h1 className="text-2xl font-bold">
                        <Link to="/dashboard">
                            Lead Chat App Dashboard
                        </Link>

                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center bg-primary-500 hover:bg-primary-400 text-white font-bold py-2 px-4 rounded"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </header>

            <main className="container mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => setActiveSection('whatsapp')}
                        className={`p-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-shadow ${activeSection === 'whatsapp' ? 'bg-primary-100' : 'bg-white'
                            }`}
                    >
                        <FaWhatsapp className="text-primary-500 text-4xl mb-4 text-center" />
                        <h2 className="text-xl font-semibold mb-2">Your WhatsApp Groups </h2>
                        <p className="text-gray-600">Connect your WhatsApp account to start importing group contacts.</p>
                    </button>

                    <button
                        onClick={() => setActiveSection('lead-buckets')}
                        className={`p-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-shadow ${activeSection === 'lead-buckets' ? 'bg-primary-100' : 'bg-white'
                            }`}
                    >
                        <FaUsers className="text-primary-500 text-4xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your Lead Buckets</h2>
                        <p className="text-gray-600">View and manage your lead buckets.</p>
                    </button>


                    <button
                        onClick={() => setActiveSection('templates')}
                        className={`p-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-shadow ${activeSection === 'templates' ? 'bg-primary-100' : 'bg-white'
                            }`}
                    >
                        <FaFileAlt className="text-primary-500 text-4xl mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Message Templates</h2>
                        <p className="text-gray-600">Create and manage message templates for quick sending.</p>
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    {renderActiveSection()}
                </div>
            </main>

            <UpgradeModal />
        </div>
    );
};

export default Dashboard;