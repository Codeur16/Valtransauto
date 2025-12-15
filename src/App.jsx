import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import GDPRBanner from '@/components/GDPRBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import PWAInstaller from '@/components/PWAInstaller';

// === Lazy Loading des pages ===
const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const VehicleSalesPage = lazy(() => import('@/pages/VehicleSalesPage'));
const BookAppointmentPage = lazy(() => import('@/pages/BookAppointmentPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminSignUp = lazy(() => import('@/pages/AdminSignUp'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7]">
      {loading && <LoadingScreen />}
      <Navbar />

      <main className="flex-grow">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/vehicles" element={<VehicleSalesPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        
        {/* GDPR Banner */}
        <GDPRBanner />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PWAInstaller />
     
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
