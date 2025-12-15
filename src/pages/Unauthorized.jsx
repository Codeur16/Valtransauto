import { Link } from 'react-router-dom';
import { AlertCircle, Home, Shield, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-white to-red-50 shadow-2xl border-8 border-white">
              <div className="relative">
                <AlertCircle className="h-16 w-16 text-red-600" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-2 border-red-200 rounded-full"
                ></motion.div>
              </div>
            </div>
            
            {/* Lock Icon Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg"
            >
              <Lock className="h-6 w-6" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Accès Restreint
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-6 max-w-md mx-auto"
          >
            Zone réservée à l'administration
          </motion.p>

          {/* Message Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 max-w-md mx-auto"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Autorisation requise
                </h3>
                <p className="text-gray-600">
                  Cette section est exclusivement réservée aux administrateurs du site.
                  Veuillez vous connecter avec vos identifiants administrateur pour y accéder.
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center text-sm text-blue-700">
                <Lock className="h-4 w-4 mr-2" />
                <span>Accès sécurisé par authentification administrateur</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <Button
              asChild
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 px-8 py-6 rounded-xl"
              size="lg"
            >
              <Link to="/" className="flex items-center justify-center gap-3">
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Retour à l'accueil</span>
              </Link>
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 px-8 py-6 rounded-xl"
              size="lg"
            >
              <Link to="/admin/login" className="flex items-center justify-center gap-3">
                <Lock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Connexion Admin</span>
              </Link>
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 text-sm text-gray-500 max-w-md mx-auto"
          >
            <p className="flex items-center justify-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              Pour toute question concernant l'accès administrateur, contactez le support technique.
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center space-x-6"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="h-1 w-1 rounded-full bg-gradient-to-r from-red-300 to-red-400"
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-100 to-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
    </div>
  );
}