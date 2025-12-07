import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-32 h-32 md:w-48 md:h-48"
      >
        <img 
          src="https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png" 
          alt="Loading..." 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;