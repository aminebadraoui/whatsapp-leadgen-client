import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddBucketModal from './AddBucketModal';
import BucketContacts from './BucketContacts';
import Loader from './Loader';
import useUserStore from '../stores/userStore';
import useModalStore from '../stores/modalStore';

const LeadBuckets = () => {
    const [buckets, setBuckets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBucket, setSelectedBucket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFetchingBuckets, setIsFetchingBuckets] = useState(true);
    const user = useUserStore((state) => state.user);
    const fetchUserPurchases = useUserStore((state) => state.fetchUserPurchases);
    const purchases = useUserStore((state) => state.purchases);
    const showUpgradeModal = useModalStore((state) => state.showUpgradeModal);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchUserPurchases(user.userId); // Fetch purchases
            await fetchBuckets(); // Fetch buckets
            setIsLoading(false);
        };
        fetchData();
    }, [user.userId]);

    const fetchBuckets = async () => {
        setIsFetchingBuckets(true);
        setError(null);
        try {
            console.log("fetching buckets", `${process.env.REACT_APP_API_URL}/buckets?userId=${user.userId}`);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/buckets?userId=${user.userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBuckets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching buckets:', error);
            setError('Failed to fetch buckets. Please try again later.');
        } finally {
            setIsFetchingBuckets(false);
        }
    };

    const addBucket = async (name) => {
        try {
            console.log('Adding bucket');

            console.log('Purchases:', purchases);
            const hasFullVersion = purchases.some(purchase => purchase.productId === `${process.env.REACT_APP_FULL_VERSION_PRODUCT_ID}`);
            if (!hasFullVersion && buckets.length >= 1) {
                console.log('Showing upgrade modal');
                showUpgradeModal();
                return;
            }

            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/buckets?userId=${user.userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newBucket = await response.json();
            setBuckets(prevBuckets => [...prevBuckets, newBucket]);
        } catch (error) {
            console.error('Error adding bucket:', error);
            setError('Failed to add bucket. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (isFetchingBuckets) {
        return <Loader message='Fetching lead buckets...' />;
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
                        className="bg-primary-500 text-white px-4 py-2 rounded mb-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Bucket
                    </motion.button>
                    {buckets.length === 0 ? (
                        <p>No buckets found. Create a new bucket to get started.</p>
                    ) : (
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
                                    <p>{bucket.contacts?.length || 0} contacts</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
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