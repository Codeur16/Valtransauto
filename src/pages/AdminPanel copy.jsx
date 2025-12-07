import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X,
  Car, Menu, Users, LogOut, Calendar,
  ChevronLeft, ChevronRight, Home, Shield, Lock, 
  AlertCircle, Clock, User, Phone, Mail, 
  Car as CarIcon, Calendar as CalendarIcon, Check, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composants UI réutilisables
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-16">
    <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    {action}
  </div>
);

const AdminPanel = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la gestion des véhicules
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Formulaire initial
  const initialFormData = {
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    price: '',
    mileage: '',
    fuel_type: 'Essence',
    transmission: 'Manuelle',
    location: 'Bruxelles',
    description: '',
    image_url: '',
    features: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Options pour les sélecteurs
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
  const transmissions = ['Manuelle', 'Automatique', 'Séquentielle'];
  const locations = ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'];

useEffect(() => {
  // Vérifier si l'utilisateur est déjà authentifié
  const authStatus = localStorage.getItem('admin_authenticated');
  if (authStatus === 'true') {
    setIsAuthenticated(true);
    fetchVehicles();
  }
}, []);

// Update image preview when image_url changes
useEffect(() => {
  if (formData.image_url && formData.image_url.trim() !== '') {
    setImagePreview(formData.image_url);
    setImageError(false);
  } else {
    setImagePreview('');
    setImageError(false);
  }
}, [formData.image_url]);

const handleLogin = async () => {
  if (password === 'ValtransautoAdmin2025') {
    setIsAuthenticated(true);
    localStorage.setItem('admin_authenticated', 'true');
    await fetchVehicles();
    await fetchReservations();
    toast({
      title: 'Authentification réussie',
      description: 'Bienvenue dans le panel admin',
      className: 'bg-green-500 text-white'
    });
  } else {
    toast({
      title: '❌ Mot de passe incorrect',
      description: 'Veuillez réessayer',
      variant: 'destructive'
    });
  }
};

const handleLogout = () => {
  setIsAuthenticated(false);
  localStorage.removeItem('admin_authenticated');
  setPassword('');
  setVehicles([]);
  toast({
    title: '👋 Déconnexion réussie',
    description: 'Vous avez été déconnecté avec succès.'
  });
};

// Récupérer la liste des véhicules
const fetchVehicles = useCallback(async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setVehicles(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des véhicules:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: 'Impossible de charger les véhicules. Veuillez réessayer.'
    });
  } finally {
    setLoading(false);
  }
}, []);

// Récupérer la liste des réservations
const fetchReservations = useCallback(async () => {
  setLoadingReservations(true);
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .order('start_date', { ascending: false });

    if (error) throw error;
    
    setReservations(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: 'Impossible de charger les réservations. Veuillez réessayer.'
    });
  } finally {
    setLoadingReservations(false);
  }
}, []);

// Mettre à jour le statut d'une réservation
const updateReservationStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    // Mise à jour optimiste
    setReservations(prev => 
      prev.map(res => 
        res.id === id ? { ...res, status, updated_at: new Date().toISOString() } : res
      )
    );

    toast({
      title: '✅ Statut mis à jour',
      description: `La réservation a été marquée comme ${status === 'confirmed' ? 'confirmée' : 'annulée'}.`,
      className: 'bg-green-500 text-white'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: 'Impossible de mettre à jour la réservation.'
    });
  }
};

const validateForm = () => {
  const errors = [];

  if (!formData.make.trim()) errors.push('Marque requise');
  if (!formData.model.trim()) errors.push('Modèle requis');
  if (!formData.year || formData.year < 1900 || formData.year > 2025) {
    errors.push('Année invalide (1900-2025)');
  }
  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.push('Prix invalide');
  }
  if (!formData.mileage || parseInt(formData.mileage) < 0) {
    errors.push('Kilométrage invalide');
  }
  if (!formData.fuel_type) errors.push('Type de carburant requis');
  if (!formData.image_url.trim()) errors.push('URL image requise');

  // Validate image URL format
  try {
    new URL(formData.image_url);
  } catch (e) {
    errors.push('URL image invalide');
  }

  if (errors.length > 0) {
    toast({
      variant: 'destructive',
      title: '⚠️ Erreurs de validation',
      description: errors.join(', ')
    });
    return false;
  }

  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setSubmitting(true);

  try {
    const vehicleData = {
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      mileage: parseInt(formData.mileage),
      fuel_type: formData.fuel_type,
      transmission: formData.transmission,
      location: formData.location,
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim(),
      features: formData.features,
      updated_at: new Date().toISOString(),
      is_available: true
    };

    if (editing) {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', editing)
        .select();

      if (error) throw error;

      // Mise à jour optimiste de l'état local
      setVehicles(prevVehicles => 
        prevVehicles.map(v => v.id === editing ? { ...v, ...vehicleData } : v)
      );

      toast({
        title: '✅ Véhicule mis à jour',
        description: 'Les modifications ont été enregistrées avec succès.',
        className: 'bg-green-500 text-white'
      });
    } else {
      vehicleData.created_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select();

      if (error) throw error;

      // Ajout optimiste du nouveau véhicule
      if (data?.[0]) {
        setVehicles(prevVehicles => [data[0], ...prevVehicles]);
      }

      toast({
        title: '🚗 Véhicule ajouté',
        description: 'Le véhicule a été ajouté avec succès.',
        className: 'bg-green-500 text-white'
      });
    }

    resetForm();
    setShowForm(false);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: error.message || 'Une erreur est survenue lors de la sauvegarde.'
    });
  } finally {
    setSubmitting(false);
  }
};

// Gérer l'édition d'un véhicule
const handleEdit = (vehicle) => {
  setFormData({
    ...vehicle,
    year: vehicle.year?.toString() || new Date().getFullYear().toString(),
    price: vehicle.price?.toString() || '',
    mileage: vehicle.mileage?.toString() || '',
    fuel_type: vehicle.fuel_type || 'Essence',
    transmission: vehicle.transmission || 'Manuelle',
    location: vehicle.location || 'Bruxelles',
    description: vehicle.description || '',
    image_url: vehicle.image_url || '',
    features: vehicle.features || []
  });
  setEditing(vehicle.id);
  setShowForm(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Supprimer un véhicule
const handleDelete = async (id) => {
  try {
    // Vérifier d'abord s'il y a des réservations en cours
    const { data: reservations, error: reservationError } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', id)
      .in('status', ['pending', 'confirmed']);

    if (reservationError) throw reservationError;
    
    if (reservations && reservations.length > 0) {
      throw new Error('Impossible de supprimer ce véhicule car il a des réservations en cours.');
    }

    // Supprimer le véhicule
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Mise à jour optimiste
    setVehicles(prev => prev.filter(v => v.id !== id));

    toast({
      title: '🗑️ Véhicule supprimé',
      description: 'Le véhicule a été supprimé avec succès.',
      className: 'bg-green-500 text-white'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: error.message || 'Impossible de supprimer le véhicule.'
    });
  } finally {
    setDeleteConfirm(null);
  }
};

const resetForm = () => {
  setFormData(initialFormData);
  setEditing(null);
  setShowForm(false);
  setImagePreview('');
  setImageError(false);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleImageError = (e) => {
  setImageError(true);
  e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&h=300';
};

const handleImagePreviewError = () => {
  setImageError(true);
};

const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

// Composant pour afficher le statut d'une réservation
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800' }
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const menuItems = [
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
];

// Page de connexion
if (!isAuthenticated) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F4E79] to-[#2A5F8A] p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-[#1F4E79] rounded-full flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Espace Administrateur</h1>
            <p className="text-gray-600 mt-2">Veuillez vous identifier pour continuer</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                autoComplete="current-password"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] hover:from-[#2A5F8A] hover:to-[#1F4E79] text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Lock className="mr-2 h-5 w-5" />
              Se connecter
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Valtransauto</span> {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

return (
  <>
    <Helmet>
      <title>Admin Panel - VALTRANSAUTO</title>
      <meta name="description" content="Administration des véhicules VALTRANSAUTO" />
    </Helmet>

    <div className="flex min-h-screen bg-[#F4F5F7]">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        className="bg-[#1F4E79] text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#2A5F8A]">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white/20 p-2 rounded-xl">
                  <div className="h-8 w-8 relative">
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">VALTRANSAUTO</h2>
                  <p className="text-sm text-white/70">Admin Panel</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-[#2A5F8A] transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#FF0C00] text-white'
                        : 'hover:bg-[#2A5F8A]'
                    }`}
                  >
                    <Icon size={20} />
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        className="ml-3 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#2A5F8A]">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <p className="font-semibold">Administrateur</p>
              <p className="text-sm text-gray-300">Connecté</p>
            </motion.div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 w-full rounded-lg hover:bg-[#FF0C00] transition-colors"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                className="ml-3 whitespace-nowrap"
              >
                Déconnexion
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {activeTab === 'vehicle' && (
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#1F4E79]">Gestion des Véhicules</h1>
                <p className="text-gray-600 mt-2">
                  {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} enregistré{vehicles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (editing) resetForm();
                }}
                className="bg-[#FF0C00] hover:bg-[#FF0C00]/90 text-white shadow-lg"
              >
                {showForm ? <X className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                {showForm ? 'Fermer' : 'Ajouter Véhicule'}
              </Button>
            </div>

            {/* Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-100"
              >
                {/* ... */}
              </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {deleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                  >
                    {/* ... */}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des véhicules...</p>
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-16">
                  <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Aucun véhicule trouvé
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par ajouter votre premier véhicule.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter un véhicule
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A]">
                      {/* ... */}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {vehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          {/* ... */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reservation' && (
          <div className="h-full w-full justify-center items-center p-8">
            {/* code manquant: Reservation Content */}
            
          </div>
        )}





         <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#1F4E79]">Gestion des Véhicules</h1>
                <p className="text-gray-600 mt-2">
                  {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} enregistré{vehicles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (editing) resetForm();
                }}
                className="bg-[#FF0C00] hover:bg-[#FF0C00]/90 text-white shadow-lg"
              >
                {showForm ? <X className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                {showForm ? 'Fermer' : 'Ajouter Véhicule'}
              </Button>
            </div>

            {/* Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-100"
              >
                {/* ... */}
              </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {deleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                  >
                    {/* ... */}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des véhicules...</p>
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-16">
                  <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Aucun véhicule trouvé
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par ajouter votre premier véhicule.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter un véhicule
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A]">
                      {/* ... */}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {vehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          {/* ... */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
      </main>
    </div>
  </>
);
};

export default AdminPanel;