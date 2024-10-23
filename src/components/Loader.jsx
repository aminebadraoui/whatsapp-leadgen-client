import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col justify-center items-center h-64">
            <motion.div
                className="w-24 h-24 border-4 border-primary-200 rounded-full "
                style={{ borderTopColor: '#25D366' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="text-primary-600 font-bold  text-center px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
                {message}
            </motion.div>
        </div>
    );
};

export default Loader;