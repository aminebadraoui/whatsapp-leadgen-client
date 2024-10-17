import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const WhatsAppAuth = ({ onAuthenticated }) => {
    const [qrCode, setQrCode] = useState('');
    const [status, setStatus] = useState('Connecting to server...');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const connect = useCallback(() => {
        console.log('Attempting to connect to WebSocket...');
        const ws = new WebSocket('ws://localhost:5000/ws');

        ws.onopen = () => {
            console.log('WebSocket connection established');
            setStatus('Connected to server. Waiting for QR code...');
            setReconnectAttempts(0);
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.qr) {
                    setQrCode(data.qr);
                    setStatus('QR Code received. Please scan with WhatsApp.');
                } else if (data.authenticated) {
                    setStatus('Authenticated successfully!');
                    onAuthenticated();
                } else if (data.error) {
                    setStatus(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus(`Error connecting to server: ${error.message || 'Unknown error'}`);
        };

        ws.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            setStatus(`Connection closed (${event.code}). Reconnecting...`);
            setReconnectAttempts(prev => prev + 1);
            setTimeout(connect, 5000);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [onAuthenticated]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">WhatsApp Authentication</h1>
            <p className="mb-4">{status}</p>
            {qrCode && <QRCodeSVG value={qrCode} size={256} />}
            {reconnectAttempts > 0 && (
                <p className="mt-4 text-red-500">
                    Reconnection attempts: {reconnectAttempts}
                </p>
            )}
        </div>
    );
};

export default WhatsAppAuth;