import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const WhatsAppAuth = () => {
    const [qrCode, setQrCode] = useState('');
    const [status, setStatus] = useState('Connecting to server...');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Attempting to connect to WebSocket...');
        console.log(process.env.REACT_APP_WS_URL);
        const ws = new WebSocket(process.env.REACT_APP_WS_URL);

        ws.onopen = () => {
            console.log('WebSocket connection established');
            setStatus('Connected to server. Waiting for QR code...');
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'qr') {
                    setQrCode(data.qr);
                    setStatus('QR Code received. Please scan with WhatsApp.');
                } else if (data.type === 'authenticated') {
                    setStatus('Authenticated successfully!');
                    setTimeout(() => navigate('/dashboard'), 2000); // Navigate after 2 seconds
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus(`Error connecting to server: ${error.message}`);
        };

        ws.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            setStatus(`Connection closed: ${event.code} ${event.reason}`);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">WhatsApp Authentication</h1>
            <p className="mb-4">{status}</p>
            {qrCode && <QRCodeSVG value={qrCode} size={256} />}
        </div>
    );
};

export default WhatsAppAuth;