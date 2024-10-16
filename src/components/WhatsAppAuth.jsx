import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const WhatsAppAuth = ({ onAuthenticated }) => {
    const [qrCode, setQrCode] = useState('');
    const [status, setStatus] = useState('Connecting to server...');

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            setStatus('Connected to server. Waiting for QR code...');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.qr) {
                setQrCode(data.qr);
                setStatus('QR Code received. Please scan with WhatsApp.');
            } else if (data.authenticated) {
                setStatus('Authenticated successfully!');
                onAuthenticated();
            } else if (data.status) {
                setStatus(data.status);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus('Error connecting to server. Please try again.');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            setStatus('Connection to server closed. Please refresh the page.');
        };

        return () => {
            socket.close();
        };
    }, [onAuthenticated]);

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-screen bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-4">WhatsApp Lead Generation</h1>
            <motion.p
                className="text-lg text-gray-700 mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {status}
            </motion.p>
            {qrCode && (
                <motion.div
                    className="bg-white p-4 rounded-lg shadow-md"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <QRCodeSVG value={qrCode} size={256} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default WhatsAppAuth;