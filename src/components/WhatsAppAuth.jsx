import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaWhatsapp, FaMobile, FaLink, FaQrcode } from 'react-icons/fa';
import useWhatsAppStore from '../stores/whatsappStore';
import useWebSocketStore from '../stores/websocketStore';

const WhatsAppAuth = ({ qrCode }) => {
    const [status, setStatus] = useState('Connecting to server...');
    const setClientReady = useWhatsAppStore((state) => state.setClientReady);
    const { connect, socket } = useWebSocketStore();




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