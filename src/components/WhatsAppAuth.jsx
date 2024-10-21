import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaMobile, FaLink, FaQrcode } from 'react-icons/fa';

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
                    // Navigate after 2 seconds
                }
                else if (data.type === 'whatsapp_ready') {
                    setStatus('Authenticated successfully!');
                    // Navigate after 2 seconds
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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-primary-600">Authenticate Your Whatsapp</h2>

            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                    <ol className="list-decimal list-inside space-y-4">
                        <li className="flex items-center">
                            <FaWhatsapp className="mr-2 text-primary-500" />
                            Open WhatsApp on your phone
                        </li>
                        <li className="flex items-center">
                            <FaMobile className="mr-2 text-primary-500" />
                            Tap Menu or Settings and select Linked Devices
                        </li>
                        <li className="flex items-center">
                            <FaLink className="mr-2 text-primary-500" />
                            Tap on Link a Device
                        </li>
                        <li className="flex items-center">
                            <FaQrcode className="mr-2 text-primary-500" />
                            Point your phone at this screen to capture the QR code
                        </li>
                    </ol>
                </div>

                <div className="w-64 p-4 h-64 bg-gray-200 flex items-center justify-center">
                    {qrCode ? (
                        <QRCodeSVG className='h-full w-full' value={qrCode} />
                    ) : (
                        <div className="text-gray-500">Loading QR Code...</div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default WhatsAppAuth;