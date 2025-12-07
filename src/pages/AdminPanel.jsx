import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X,
  Car, Menu, Users, LogOut, Calendar,
  ChevronLeft, ChevronRight, Home, Shield, Lock, 
  AlertCircle, Clock, User, Phone, Mail, 
  Car as CarIcon, Calendar as CalendarIcon, Check, XCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

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
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
const [reservations, setReservations] = useState([]);
const [loadingReservations, setLoadingReservations] = useState(true);
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
  const loadReservations = async () => {
    try {
      setLoadingReservations(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        // .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("reservations", data);
      setReservations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les réservations',
        variant: 'destructive'
      });
    } finally {
      setLoadingReservations(false);
    }
  };

  if (activeTab === 'reservations') {
    loadReservations();
  }
}, [activeTab]);



useEffect(() => {
  // Vérifier si l'utilisateur est déjà authentifié
  const authStatus = localStorage.getItem('admin_authenticated');
  if (authStatus === 'true') {
    setIsAuthenticated(true);
    fetchVehicles();
  }
}, []);
// Move this useEffect inside the component, before any returns
  useEffect(() => {
    setActiveTab('vehicles');
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

// // États supplémentaires nécessaires
// const [searchTerm, setSearchTerm] = useState('');
// const [currentPage, setCurrentPage] = useState(1);
// const itemsPerPage = 10;

// Filtrer les véhicules en fonction du terme de recherche
const filteredVehicles = vehicles.filter(vehicle => {
  if (!searchTerm) return true;
  const searchLower = searchTerm.toLowerCase();
  return (
    vehicle.make.toLowerCase().includes(searchLower) ||
    vehicle.model.toLowerCase().includes(searchLower) ||
    vehicle.year.toString().includes(searchTerm) ||
    vehicle.location.toLowerCase().includes(searchLower) ||
    vehicle.fuel_type.toLowerCase().includes(searchLower)
  );
});

// Fonction pour gérer les changements de champ
const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // Mise à jour de l'aperçu de l'image
  if (field === 'image_url') {
    setImagePreview(value);
  }
};

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


const handleUpdateStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // Mettre à jour l'état local
    setReservations(prev => 
      prev.map(res => 
        res.id === id ? { ...res, status } : res
      )
    );

    toast({
      title: 'Succès',
      description: `La réservation a été marquée comme ${status}.`,
      className: 'bg-green-500 text-white'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    toast({
      title: 'Erreur',
      description: 'Impossible de mettre à jour le statut de la réservation',
      variant: 'destructive'
    });
  }
};

const [contactMessages, setContactMessages] = useState([]);
const [loadingContactMessages, setLoadingContactMessages] = useState(true);


const loadContactMessages = async () => {
  try {
    setLoadingContactMessages(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setContactMessages(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    toast({
      title: 'Erreur',
      description: 'Impossible de charger les messages',
      variant: 'destructive'
    });
  } finally {
    setLoadingContactMessages(false);
  }
};

useEffect(() => {
  if (activeTab === 'messages') {
    loadContactMessages();
  }
}, [activeTab]);

const menuItems = [
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: Mail }
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
const handleMarkAsRead = async (id) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'lu' })
      .eq('id', id);

    if (error) throw error;

    setContactMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, status: 'lu' } : msg
      )
    );

    toast({
      title: 'Succès',
      description: 'Message marqué comme lu',
      className: 'bg-green-500 text-white'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    toast({
      title: 'Erreur',
      description: 'Impossible de mettre à jour le statut du message',
      variant: 'destructive'
    });
  }
};




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
         {activeTab === 'vehicles' && (
  <div className="p-8">
    {/* En-tête avec recherche et bouton d'ajout */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#1F4E79]">Gestion des Véhicules</h1>
        <p className="text-gray-600 mt-2">
          {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} enregistré{vehicles.length !== 1 ? 's' : ''}
          {searchTerm && ` (${filteredVehicles.length} résultat${filteredVehicles.length !== 1 ? 's' : ''} trouvé${filteredVehicles.length !== 1 ? 's' : ''})`}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Input
          placeholder="Rechercher un véhicule..."
          className="w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (editing) resetForm();
          }}
          className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white shadow-lg whitespace-nowrap"
          disabled={loading}
        >
          {showForm ? (
            <X className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span className="ml-2">{showForm ? 'Fermer' : 'Ajouter un véhicule'}</span>
        </Button>
      </div>
    </div>

    {/* Formulaire d'ajout/édition */}
    <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editing ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="make">Marque *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Ex: Toyota"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="model">Modèle *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="Ex: Corolla"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Année *</Label>
                    <Input
                      type="number"
                      id="year"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Prix (€) *</Label>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        id="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500">€</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuel_type">Carburant *</Label>
                    <select
                      id="fuel_type"
                      value={formData.fuel_type}
                      onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
                    >
                      {fuelTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission *</Label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
                    >
                      {transmissions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                <div>
                  <Label>Image du véhicule *</Label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Car className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="URL de l'image"
                        value={formData.image_url}
                        onChange={(e) => {
                          handleInputChange('image_url', e.target.value);
                          setImageError(false);
                        }}
                        className={imageError ? 'border-red-500' : ''}
                      />
                      {imageError && (
                        <p className="mt-1 text-sm text-red-600">
                          Impossible de charger l'image. Vérifiez l'URL.
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        URL d'une image (ex: https://example.com/image.jpg)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Localisation *</Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="mileage">Kilométrage (km) *</Label>
                  <Input
                    type="number"
                    id="mileage"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description détaillée du véhicule..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editing ? 'Mise à jour...' : 'Ajout en cours...'}
                  </>
                ) : (
                  <>{editing ? 'Mettre à jour' : 'Ajouter le véhicule'}</>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Liste des véhicules */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des véhicules...</p>
          </div>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-16">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Aucun résultat' : 'Aucun véhicule trouvé'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Aucun véhicule ne correspond à votre recherche.'
              : 'Commencez par ajouter votre premier véhicule.'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => {
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un véhicule
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] text-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Véhicule
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Détails
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Prix
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-24 rounded-md overflow-hidden bg-gray-100">
                        <img
                          className="h-full w-full object-cover"
                          src={vehicle.image_url || 'https://via.placeholder.com/96'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/96';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.year} • {vehicle.fuel_type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vehicle.transmission} • {vehicle.mileage.toLocaleString()} km
                    </div>
                    <div className="text-sm text-gray-500">
                      {vehicle.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      }).format(vehicle.price)}
                    </div>
                    <div className="text-sm text-gray-500">TTC/jour</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.is_available ? 'Disponible' : 'Non disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-[#1F4E79] hover:text-[#1F4E79]/80"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(vehicle.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Pagination */}
    {filteredVehicles.length > 0 && (
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">
          Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredVehicles.length)}
          </span>{' '}
          sur <span className="font-medium">{filteredVehicles.length}</span> résultats
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage * itemsPerPage >= filteredVehicles.length}
          >
            Suivant
          </Button>
        </div>
      </div>
    )}
  </div>
)}

        {activeTab === 'reservations' && (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Réservations</h2>
      
      {loadingReservations ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reservation.status === 'confirmée' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.status === 'annulée'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateStatus(reservation.id, 'confirmée')}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Confirmer"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reservation.id, 'annulée')}
                        className="text-red-600 hover:text-red-900"
                        title="Annuler"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

        {activeTab === 'messages' && (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages de contact</h2>
      
      {loadingContactMessages ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun message pour le moment</p>
          ) : (
            contactMessages.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-lg p-4 ${
                  message.status === 'non_lu' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {message.name} 
                      <span className="ml-2 text-sm text-gray-500">{message.email}</span>
                      {message.phone && (
                        <span className="ml-2 text-sm text-gray-500">• {message.phone}</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <h4 className="font-medium text-gray-800 mt-2">{message.subject}</h4>
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{message.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Marquer comme lu"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-gray-400 hover:text-blue-600"
                      title="Répondre"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  </div>
)}



      </main>
    </div>
  </>
);
};

export default AdminPanel;