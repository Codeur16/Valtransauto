// components/PWAInstaller.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Afficher la bannière après 5 secondes
      setTimeout(() => {
        setShowBanner(true);
      }, 5000);
    };

    // Vérifier si l'app peut être installée
    const checkInstallable = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      if (isMobile) {
        setIsInstallable(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkInstallable();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installée avec succès');
      setIsInstalled(true);
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Stocker en localStorage pour ne pas montrer pendant 7 jours
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  // Ne pas afficher si déjà installé ou si bannière récemment fermée
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa_banner_dismissed');
    if (dismissedTime) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime) < sevenDays) {
        setShowBanner(false);
      }
    }
  }, []);

  if (isInstalled || !showBanner || !isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50"
      >
        <div className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] text-white rounded-2xl shadow-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Installer l'app VALTRANSAUTO</h3>
                <p className="text-sm text-white/80 mt-1">
                  Installez l'application pour un accès rapide depuis votre écran d'accueil
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-white text-[#1F4E79] hover:bg-white/90 font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Installer
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Plus tard
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <p>• Accès hors ligne disponible</p>
            <p>• Notifications push</p>
            <p>• Expérience native</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstaller;