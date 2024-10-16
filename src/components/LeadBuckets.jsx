import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddBucketModal from './AddBucketModal';
import BucketContacts from './BucketContacts';

const LeadBuckets = () => {
    const [buckets, setBuckets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBucket, setSelectedBucket] = useState(null);

    useEffect(() => {
        fetchBuckets();
    }, []);

    const fetchBuckets = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/api/buckets');
            if (!response.ok) {
                throw new Error('Failed to fetch buckets');
            }
            const data = await response.json();
            setBuckets(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addBucket = async (name) => {
        try {
            const response = await fetch('http://localhost:5000/api/buckets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error('Failed to add bucket');
            }
            const newBucket = await response.json();
            setBuckets(prevBuckets => [...prevBuckets, newBucket]);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div>Loading buckets...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {selectedBucket ? (
                <BucketContacts bucket={selectedBucket} onBack={() => setSelectedBucket(null)} />
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Lead Buckets</h2>
                    <motion.button
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Bucket
                    </motion.button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {buckets.map((bucket) => (
                            <motion.div
                                key={bucket.id}
                                className="bg-white p-4 rounded shadow cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setSelectedBucket(bucket)}
                            >
                                <h3 className="text-lg font-semibold">{bucket.name}</h3>
                                <p>{bucket.contacts.length} contacts</p>
                            </motion.div>
                        ))}
                    </div>
                    <AddBucketModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAdd={addBucket}
                    />
                </>
            )}
        </div>
    );


};

export default LeadBuckets;