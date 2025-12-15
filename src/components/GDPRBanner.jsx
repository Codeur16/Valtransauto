import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function GDPRBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdpr-consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('gdpr-consent', 'rejected');
    setShowBanner(false);
    // Remove any non-essential cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (name.trim() !== 'necessary') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:mr-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              En continuant à naviguer, vous acceptez notre{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Politique de confidentialité
              </a>
              {' '}et nos{' '}
              <a href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                Préférences en matière de cookies
              </a>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReject}
              className="whitespace-nowrap"
            >
              Refuser
            </Button>
            <Button 
              size="sm"
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 whitespace-nowrap"
            >
              Accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
