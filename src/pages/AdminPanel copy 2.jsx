import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Save, X,
  Car, Menu, Users, LogOut, Calendar,
  ChevronLeft, ChevronRight, Home, Shield, Lock, 
  AlertCircle, Clock, User, Phone, Mail, 
  Car as CarIcon, Calendar as CalendarIcon, Check, XCircle, CheckCircle,
  Search, Filter, Download, BarChart3, MessageSquare, Eye,
  TrendingUp, DollarSign, CarFront, Activity, Bell,
  Package, Settings, HelpCircle, Star, MoreVertical,
  ChevronDown, Upload, EyeOff, RefreshCw, UserPlus, UserCog, UserCheck, UserX, Key, Pencil, User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { useUserAuth } from '@/hooks/useUserAuth';

// Composants UI personnalisés pour remplacer shadcn
const CustomCard = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const CustomCardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CustomCardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>
);

const CustomCardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-500 mt-1 ${className}`}>{children}</p>
);

const CustomCardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CustomBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-700',
    success: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const CustomTooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

const CustomSelect = ({ value, onChange, children, placeholder }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79]"
      >
        <span className="block truncate">{value || placeholder}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </span>
      </button>
      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

const CustomSelectItem = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
  >
    {children}
  </button>
);

const CustomProgress = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-[#1F4E79] h-2 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const CustomDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

const CustomDialogContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

const CustomDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CustomDialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900">{children}</h2>
);

const CustomDialogDescription = ({ children }) => (
  <p className="text-gray-500 mt-2">{children}</p>
);

const CustomDialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-3 mt-6">{children}</div>
);

// Composants UI réutilisables
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    {action}
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <CustomCard hover>
      <CustomCardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? '' : 'rotate-180'}`} />
                {change >= 0 ? '+' : ''}{change}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CustomCardContent>
    </CustomCard>
  </motion.div>
);

const AdminPanel = () => {
  const { user, logout } = useUserAuth();
    if (!user) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to="/unauthorized"  />;
  }
  useEffect(()=>{
    if(!user){
      return <Navigate to="/unauthorized"  />;
    }
  })


// ============================================================================


// Add these state variables at the beginning of your AdminPanel component, with other state declarations
const [adminUsers, setAdminUsers] = useState([]);
const [loadingAdmins, setLoadingAdmins] = useState(true);
const [adminForm, setAdminForm] = useState({
  email: '',
  full_name: '',
  role: 'admin',
  is_active: true
});
const [editingAdmin, setEditingAdmin] = useState(null);
// const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
// const [submitting, setSubmitting] = useState(false);

// Add these functions inside your AdminPanel component, before the return statement
const fetchAdminUsers = useCallback(async () => {
  try {
    setLoadingAdmins(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setAdminUsers(data || []);
    return data || [];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: 'Impossible de charger la liste des administrateurs.'
    });
    throw error; // Propager l'erreur pour la gestion dans les appels parents
  } finally {
    setLoadingAdmins(false);
  }
}, []);

const handleAdminFormChange = (field, value) => {
  setAdminForm(prev => ({ ...prev, [field]: value }));
};

const handleCreateAdmin = async () => {
  if (!adminForm.email || !adminForm.full_name) {
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: 'Veuillez remplir tous les champs obligatoires.'
    });
    return;
  }

  try {
    setSubmitting(true);
    
    // Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminForm.email,
      password: password || generateRandomPassword(),
      email_confirm: true,
      user_metadata: {
        full_name: adminForm.full_name,
        role: adminForm.role
      }
    });

    if (authError) throw authError;

    // Create the admin user in the database
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        id: authData.user.id,
        email: adminForm.email,
        full_name: adminForm.full_name,
        role: adminForm.role,
        is_active: adminForm.is_active
      }])
      .select()
      .single();

    if (error) throw error;

    // Refresh the admin list
    await fetchAdminUsers();
    
    // Reset form
    setAdminForm({
      email: '',
      full_name: '',
      role: 'admin',
      is_active: true
    });
    setPassword('');

    toast({
      title: 'Succès',
      description: 'Administrateur créé avec succès.'
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de la création de l\'administrateur.'
    });
  } finally {
    setSubmitting(false);
  }
};

const handleUpdateAdmin = async (adminId) => {
  try {
    setSubmitting(true);
    
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        full_name: adminForm.full_name,
        role: adminForm.role,
        is_active: adminForm.is_active
      })
      .eq('id', adminId)
      .select()
      .single();

    if (error) throw error;

    // Update auth user metadata if needed
    await supabase.auth.admin.updateUserById(adminId, {
      user_metadata: {
        full_name: adminForm.full_name,
        role: adminForm.role
      }
    });

    // Refresh the admin list
    await fetchAdminUsers();
    
    // Reset form
    setAdminForm({
      email: '',
      full_name: '',
      role: 'admin',
      is_active: true
    });
    setEditingAdmin(null);

    toast({
      title: 'Succès',
      description: 'Administrateur mis à jour avec succès.'
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de la mise à jour de l\'administrateur.'
    });
  } finally {
    setSubmitting(false);
  }
};

const handleDeleteAdmin = async (adminId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) return;

  try {
    setSubmitting(true);
    
    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(adminId);
    if (authError) throw authError;

    // Delete from admin_users
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (error) throw error;

    // Refresh the admin list
    await fetchAdminUsers();

    toast({
      title: 'Succès',
      description: 'Administrateur supprimé avec succès.'
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de la suppression de l\'administrateur.'
    });
  } finally {
    setSubmitting(false);
  }
};

const handleResetPassword = async (adminId, email) => {
  const newPassword = prompt('Entrez le nouveau mot de passe (laissez vide pour générer un mot de passe aléatoire)');
  if (newPassword === null) return;

  try {
    const password = newPassword || generateRandomPassword();
    
    // Update password in auth
    const { error: authError } = await supabase.auth.admin.updateUserById(adminId, {
      password: password
    });

    if (authError) throw authError;

    // Show the password to the user (in production, you would send it by email)
    if (!newPassword) {
      alert(`Le mot de passe a été réinitialisé. Le nouveau mot de passe est : ${password}`);
    } else {
      alert('Le mot de passe a été mis à jour avec succès.');
    }

  } catch (error) {
    console.error('Error resetting password:', error);
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
    });
  }
};

// Helper function to generate a random password
const generateRandomPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};


// ============================================================================










































  const { toast } = useToast();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la gestion des véhicules
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalReservations: 0,
    totalRevenue: 0,
    pendingMessages: 0,
    monthlyGrowth: 12.5,
    activeReservations: 0
  });

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
  
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);

  // Options pour les sélecteurs
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
  const transmissions = ['Manuelle', 'Automatique', 'Séquentielle'];
  const locations = ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'];

  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      // setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      fetchVehicles(),
      fetchReservations(),
      fetchContactMessages()
    ]);
    calculateStats();
  };

  const calculateStats = () => {
    const totalVehicles = vehicles.length;
    const totalReservations = reservations.length;
    const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'confirmée').length;
    
    const totalRevenue = vehicles.reduce((sum, vehicle) => {
      const vehicleReservations = reservations.filter(r => {
        const vehicleName = `${vehicle.make} ${vehicle.model}`;
        return r.vehicle === vehicleName || r.vehicle_id === vehicle.id;
      });
      const revenue = vehicleReservations.length * (vehicle.price || 0);
      return sum + revenue;
    }, 0);

    setStats({
      totalVehicles,
      totalReservations,
      totalRevenue: totalRevenue.toFixed(2),
      pendingMessages: contactMessages.filter(m => m.status === 'non_lu').length,
      monthlyGrowth: 12.5,
      activeReservations
    });
   };

  //         await fetchAdminUsers();
  //       if(activeTab === 'reservations') {
  //         await fetchReservations();
  //       }
  //     } catch (error) {
  //       console.error(`Erreur lors du chargement des données de l'onglet ${activeTab}:`, error);
  //       toast({
  //         variant: 'destructive',
  //         title: 'Erreur',
  //         description: `Impossible de charger les données de l'onglet ${activeTab}.`
  //       });
  //     }
  //   };

  //   loadTabData();
  // }, [activeTab, fetchVehicles, fetchAdminUsers, fetchReservations]);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVehicles(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Impossible de charger les véhicules. Veuillez réessayer.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Déclarer fetchReservations avant son utilisation
  const fetchReservations = useCallback(async () => {
    setLoadingReservations(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setReservations(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Impossible de charger les réservations. Veuillez réessayer.'
      });
      throw error;
    } finally {
      setLoadingReservations(false);
    }
  }, []);

  // Charger les données initiales au montage du composant
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchVehicles(),
          fetchReservations(),
          fetchAdminUsers(),
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données initiales:', error);
      }
    };

    loadInitialData();
  }, [fetchVehicles, fetchReservations, fetchAdminUsers]);

  useEffect(() => {
    if (formData.image_url && formData.image_url.trim() !== '') {
      setImagePreview(formData.image_url);
      setImageError(false);
    } else {
      setImagePreview('');
      setImageError(false);
    }
  }, [formData.image_url]);



  const handleLogout = () => {
    // setIsAuthenticated(false);
    logout();
    setVehicles([]);
    toast({
      title: '👋 Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.'
    });
    navigate('/admin/login');
  };


  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.make?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.year?.toString().includes(searchTerm) ||
      vehicle.location?.toLowerCase().includes(searchLower) ||
      vehicle.fuel_type?.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'image_url') {
      setImagePreview(value);
    }
  };


  const fetchContactMessages = async () => {
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
      fetchContactMessages();
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles', label: 'Véhicules', icon: Car },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'account', label: 'Mon compte', icon: UserCog },
    { id: 'admins', label: 'Administrateurs', icon: Shield }
  ];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
      confirmée: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
      annulée: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <CustomBadge className={config.color.replace('bg-', '')}>
        {config.label}
      </CustomBadge>
    );
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const resetForm = () => {
    setFormData(initialFormData);
    setEditing(null);
    setShowForm(false);
    setImagePreview('');
    setImageError(false);
  };

  // const [adminUsers, setAdminUsers] = useState([]);
  // const [loadingAdmins, setLoadingAdmins] = useState(false);
  // const [adminForm, setAdminForm] = useState({
  //   email: '',
  //   full_name: '',
  //   role: 'admin',
  //   is_active: true
  // });
  // const [editingAdmin, setEditingAdmin] = useState(null);
  // const [showPassword, setShowPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // const fetchAdminUsers = useCallback(async () => {
  //   setLoadingAdmins(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from('admin_users')
  //       .select('*')
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;
  //     setAdminUsers(data || []);
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des administrateurs:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: 'Impossible de charger la liste des administrateurs.'
  //     });
  //   } finally {
  //     setLoadingAdmins(false);
  //   }
  // }, []);

  // const handleAdminFormChange = (field, value) => {
  //   setAdminForm(prev => ({ ...prev, [field]: value }));
  // };

  // const handleCreateAdmin = async () => {
  //   if (!adminForm.email || !adminForm.full_name) {
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Champs requis',
  //       description: 'Veuillez remplir tous les champs obligatoires.'
  //     });
  //     return;
  //   }

  //   try {
  //     setSubmitting(true);
      
  //     const { data: authData, error: authError } = await supabase.auth.admin.createUser({
  //       email: adminForm.email,
  //       password: password || Math.random().toString(36).slice(-8),
  //       email_confirm: true,
  //       user_metadata: {
  //         full_name: adminForm.full_name,
  //         role: adminForm.role
  //       }
  //     });

  //     if (authError) throw authError;

  //     const { data, error } = await supabase
  //       .from('admin_users')
  //       .insert([{
  //         id: authData.user.id,
  //         email: adminForm.email,
  //         full_name: adminForm.full_name,
  //         role: adminForm.role,
  //         is_active: adminForm.is_active
  //       }])
  //       .select();

  //     if (error) throw error;

  //     toast({
  //       title: '✅ Administrateur ajouté',
  //       description: `L'administrateur ${adminForm.full_name} a été créé avec succès.`,
  //       className: 'bg-green-500 text-white'
  //     });

  //     setAdminForm({
  //       email: '',
  //       full_name: '',
  //       role: 'admin',
  //       is_active: true
  //     });
  //     setPassword('');
  //     fetchAdminUsers();
  //   } catch (error) {
  //     console.error('Erreur lors de la création de l\'administrateur:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: error.message || 'Une erreur est survenue lors de la création de l\'administrateur.'
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleUpdateAdmin = async (adminId) => {
  //   try {
  //     setSubmitting(true);
      
  //     const { error: authError } = await supabase.auth.admin.updateUserById(adminId, {
  //       user_metadata: {
  //         full_name: adminForm.full_name,
  //         role: adminForm.role
  //       }
  //     });

  //     if (authError) throw authError;

  //     const { data, error } = await supabase
  //       .from('admin_users')
  //       .update({
  //         full_name: adminForm.full_name,
  //         role: adminForm.role,
  //         is_active: adminForm.is_active,
  //         updated_at: new Date().toISOString()
  //       })
  //       .eq('id', adminId)
  //       .select();

  //     if (error) throw error;

  //     toast({
  //       title: '✅ Mise à jour réussie',
  //       description: 'Les informations de l\'administrateur ont été mises à jour.',
  //       className: 'bg-green-500 text-white'
  //     });

  //     setEditingAdmin(null);
  //     setAdminForm({
  //       email: '',
  //       full_name: '',
  //       role: 'admin',
  //       is_active: true
  //     });
  //     fetchAdminUsers();
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour de l\'administrateur:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: 'Une erreur est survenue lors de la mise à jour de l\'administrateur.'
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleDeleteAdmin = async (adminId) => {
  //   if (adminId === user.id) {
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Impossible de supprimer',
  //       description: 'Vous ne pouvez pas supprimer votre propre compte.'
  //     });
  //     return;
  //   }

  //   if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.')) {
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase
  //       .from('admin_users')
  //       .update({ 
  //         is_active: false,
  //         updated_at: new Date().toISOString()
  //       })
  //       .eq('id', adminId);

  //     if (error) throw error;

  //     toast({
  //       title: '✅ Administrateur désactivé',
  //       description: 'L\'administrateur a été désactivé avec succès.',
  //       className: 'bg-green-500 text-white'
  //     });

  //     fetchAdminUsers();
  //   } catch (error) {
  //     console.error('Erreur lors de la suppression de l\'administrateur:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: 'Une erreur est survenue lors de la suppression de l\'administrateur.'
  //     });
  //   }
  // };

  // const handleResetPassword = async (adminId, email) => {
  //   if (!window.confirm(`Êtes-vous sûr de vouloir réinitialiser le mot de passe de ${email} ?`)) {
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase.auth.admin.resetPasswordForEmail(email, {
  //       redirectTo: `${window.location.origin}/reset-password`
  //     });

  //     if (error) throw error;

  //     toast({
  //       title: '✅ E-mail de réinitialisation envoyé',
  //       description: `Un e-mail de réinitialisation a été envoyé à ${email}.`,
  //       className: 'bg-green-500 text-white'
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors de la réinitialisation du mot de passe:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: 'Une erreur est survenue lors de l\'envoi de l\'e-mail de réinitialisation.'
  //     });
  //   }
  // };

  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.full_name) {
      toast({
        variant: 'destructive',
        title: '❌ Champ requis',
        description: 'Le nom complet est obligatoire.'
      });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileForm.full_name },
        email: profileForm.email
      });

      if (authError) throw authError;

      const { error } = await supabase
        .from('admin_users')
        .update({
          full_name: profileForm.full_name,
          email: profileForm.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: '✅ Profil mis à jour',
        description: 'Vos informations de profil ont été mises à jour avec succès.',
        className: 'bg-green-500 text-white'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Une erreur est survenue lors de la mise à jour de votre profil.'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      toast({
        variant: 'destructive',
        title: '❌ Champs requis',
        description: 'Veuillez saisir votre mot de passe actuel et le nouveau mot de passe.'
      });
      return;
    }

    if (profileForm.newPassword !== profileForm.confirmPassword) {
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Les nouveaux mots de passe ne correspondent pas.'
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      
      const { error } = await supabase.auth.updateUser({
        password: profileForm.newPassword
      });

      if (error) throw error;

      toast({
        title: '✅ Mot de passe mis à jour',
        description: 'Votre mot de passe a été mis à jour avec succès.',
        className: 'bg-green-500 text-white'
      });

      setProfileForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: error.message || 'Une erreur est survenue lors de la mise à jour de votre mot de passe.'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      if (user.user_metadata?.role === 'super_admin') {
        fetchAdminUsers();
      }
    }
  }, [user, fetchAdminUsers]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );

      toast({
        title: '✅ Statut mis à jour',
        description: `La réservation a été marquée comme ${status}.`,
        className: 'bg-green-500 text-white'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Impossible de mettre à jour le statut de la réservation.'
      });
    }
  };

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

  // // Page de connexion
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F4E79] to-[#2A5F8A] p-4">
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
  //       >
  //         <div className="px-8 py-10">
  //           <div className="text-center mb-8">
  //             <motion.div
  //               initial={{ scale: 0 }}
  //               animate={{ scale: 1 }}
  //               transition={{ delay: 0.2 }}
  //               className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1F4E79] to-[#2A5F8A] rounded-full flex items-center justify-center mb-4 shadow-lg"
  //             >
  //               <Shield className="h-10 w-10 text-white" />
  //             </motion.div>
  //             <h1 className="text-3xl font-bold text-gray-900">Espace Administrateur</h1>
  //             <p className="text-gray-600 mt-2">Veuillez vous identifier pour continuer</p>
  //           </div>
            
  //           <div className="space-y-6">
  //             <div>
  //               <Label htmlFor="password" className="text-sm font-medium text-gray-700">
  //                 Mot de passe
  //               </Label>
  //               <Input
  //                 id="password"
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 placeholder="••••••••"
  //                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition-all mt-2"
  //                 onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
  //                 autoComplete="current-password"
  //               />
  //             </div>

  //             <Button
  //               onClick={handleLogin}
  //               className="w-full bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] hover:from-[#2A5F8A] hover:to-[#1F4E79] text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
  //             >
  //               <Lock className="mr-2 h-5 w-5" />
  //               Se connecter
  //             </Button>
  //           </div>
  //         </div>
          
  //         <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
  //           <p className="text-sm text-gray-500">
  //             <span className="font-medium">Valtransauto</span> {new Date().getFullYear()}
  //           </p>
  //         </div>
  //       </motion.div>
  //     </div>
  //   );
  // }

// Add this useEffect to load admin users when the component mounts
useEffect(() => {
  if (activeTab === 'admins' && user?.user_metadata?.role === 'SuperAdmin') {
    fetchAdminUsers();
  }
}, [activeTab, user]);


  return (
    <>
      <div>
        <title>Admin Panel - VALTRANSAUTO</title>
        <meta name="description" content="Administration des véhicules VALTRANSAUTO" />
      </div>

      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`bg-gradient-to-b from-[#1F4E79] to-[#2A5F8A] text-white flex flex-col fixed left-0 top-0 h-screen z-50 shadow-2xl ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                    <div className="h-8 w-8 relative">
                      <img 
                        src={logoUrl} 
                        alt="Logo" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      VALTRANSAUTO
                    </h2>
                    <p className="text-sm text-white/70">Admin Pro</p>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF0C00] to-[#FF4D4D] text-white shadow-lg'
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-3 whitespace-nowrap font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-semibold truncate">Administrateur</p>
                  <p className="text-sm text-white/60 truncate">{user?.email}</p>
                </motion.div>
              )}
              <CustomTooltip content="Déconnexion">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </CustomTooltip>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          {/* Top Bar */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Tableau de bord'}
                  {activeTab === 'vehicles' && 'Gestion des véhicules'}
                  {activeTab === 'reservations' && 'Réservations'}
                  {activeTab === 'messages' && 'Messages de contact'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {activeTab === 'dashboard' && 'Aperçu global de votre activité'}
                  {activeTab === 'vehicles' && 'Gérez votre parc automobile'}
                  {activeTab === 'reservations' && 'Suivez toutes les réservations'}
                  {activeTab === 'messages' && 'Consultez les messages clients'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <CustomTooltip content="Notifications">
                  <Button variant="outline" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                </CustomTooltip>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Véhicules total"
                      value={stats.totalVehicles}
                      icon={CarFront}
                      change={stats.monthlyGrowth}
                      color="bg-blue-500"
                    />
                    <StatCard
                      title="Réservations"
                      value={stats.totalReservations}
                      icon={Calendar}
                      change={8.2}
                      color="bg-green-500"
                    />
                    <StatCard
                      title="Revenu total"
                      value={`${stats.totalRevenue} €`}
                      icon={DollarSign}
                      change={15.3}
                      color="bg-purple-500"
                    />
                    <StatCard
                      title="Messages en attente"
                      value={stats.pendingMessages}
                      icon={MessageSquare}
                      change={-3.1}
                      color="bg-orange-500"
                    />
                  </div>

                  {/* Recent Activity & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Reservations */}
                    <CustomCard className="lg:col-span-2">
                      <CustomCardHeader>
                        <CustomCardTitle>Réservations récentes</CustomCardTitle>
                        <CustomCardDescription>Les 5 dernières réservations</CustomCardDescription>
                      </CustomCardHeader>
                      <CustomCardContent>
                        {reservations.slice(0, 5).map((reservation, index) => (
                          <motion.div
                            key={reservation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{reservation.name}</p>
                                <p className="text-sm text-gray-500">{reservation.vehicle}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={reservation.status} />
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(reservation.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </CustomCardContent>
                    </CustomCard>

                    {/* Quick Actions */}
                    <CustomCard>
                      <CustomCardHeader>
                        <CustomCardTitle>Actions rapides</CustomCardTitle>
                        <CustomCardDescription>Accès direct aux fonctionnalités</CustomCardDescription>
                      </CustomCardHeader>
                      <CustomCardContent className="space-y-3">
                        <Button 
                          onClick={() => setActiveTab('vehicles')}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un véhicule
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('reservations')}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Voir les réservations
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('messages')}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Consulter les messages
                        </Button>
                        <Button 
                          onClick={() => window.print()}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Exporter les rapports
                        </Button>
                      </CustomCardContent>
                    </CustomCard>
                  </div>

                  {/* Vehicle Status Overview */}
                  <CustomCard>
                    <CustomCardHeader>
                      <CustomCardTitle>État du parc automobile</CustomCardTitle>
                      <CustomCardDescription>Répartition par type de carburant</CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {fuelTypes.map((type) => {
                          const count = vehicles.filter(v => v.fuel_type === type).length;
                          const percentage = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
                          return (
                            <div key={type} className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{count}</div>
                              <div className="text-sm text-gray-500">{type}</div>
                              <CustomProgress value={percentage} className="mt-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}

              {/* Vehicles Tab */}
              {activeTab === 'vehicles' && (
                <motion.div
                  key="vehicles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Header with Stats */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Gestion des Véhicules</h1>
                      <div className="flex items-center gap-4 mt-2">
                        <CustomBadge variant="outline" className="text-sm">
                          {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}
                        </CustomBadge>
                        <CustomBadge variant="secondary" className="text-sm">
                          {filteredVehicles.length} visible{filteredVehicles.length !== 1 ? 's' : ''}
                        </CustomBadge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="Rechercher un véhicule..."
                          className="pl-10 w-full md:w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setShowForm(!showForm);
                          if (editing) resetForm();
                        }}
                        className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] hover:from-[#2A5F8A] hover:to-[#1F4E79] text-white shadow-lg"
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

                  {/* Vehicle Form */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-6">
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

                  {/* Vehicles Grid */}
                  {loading ? (
                    <LoadingSpinner />
                  ) : filteredVehicles.length === 0 ? (
                    <EmptyState
                      icon={Car}
                      title={searchTerm ? 'Aucun résultat' : 'Aucun véhicule trouvé'}
                      description={searchTerm 
                        ? 'Aucun véhicule ne correspond à votre recherche.' 
                        : 'Commencez par ajouter votre premier véhicule.'}
                      action={!searchTerm && (
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
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredVehicles.map((vehicle, index) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -5 }}
                        >
                          <CustomCard className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={vehicle.image_url || 'https://via.placeholder.com/400x300'}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/400x300';
                                }}
                              />
                              <div className="absolute top-4 right-4">
                                <CustomBadge variant={vehicle.is_available ? "default" : "secondary"}>
                                  {vehicle.is_available ? 'Disponible' : 'Indisponible'}
                                </CustomBadge>
                              </div>
                            </div>
                            <CustomCardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {vehicle.make} {vehicle.model}
                                  </h3>
                                  <p className="text-gray-500">{vehicle.year}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#1F4E79]">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR',
                                      maximumFractionDigits: 0
                                    }).format(vehicle.price)}
                                  </div>
                                  <div className="text-sm text-gray-500">TTC/jour</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <Car className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                                  <div className="text-sm font-medium">{vehicle.fuel_type}</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <Activity className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                                  <div className="text-sm font-medium">{vehicle.mileage?.toLocaleString() || 0} km</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                  {vehicle.location} • {vehicle.transmission}
                                </div>
                                <div className="flex gap-2">
                                  <CustomTooltip content="Modifier">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => handleEdit(vehicle)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </CustomTooltip>
                                  
                                  <CustomTooltip content="Supprimer">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setDeleteConfirm(vehicle.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </CustomTooltip>
                                </div>
                              </div>
                            </CustomCardContent>
                          </CustomCard>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <motion.div
                  key="reservations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader>
                      <CustomCardTitle>Gestion des Réservations</CustomCardTitle>
                      <CustomCardDescription>
                        {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent>
                      {loadingReservations ? (
                        <LoadingSpinner />
                      ) : reservations.length === 0 ? (
                        <EmptyState
                          icon={Calendar}
                          title="Aucune réservation"
                          description="Aucune réservation n'a été trouvée pour le moment."
                          action={
                            <Button
                              onClick={fetchReservations}
                              variant="outline"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {reservations.map((reservation) => (
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
                                    {new Date(reservation.date).toLocaleDateString('fr-FR')}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={reservation.status} />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <CustomTooltip content="Confirmer">
                                        <button
                                          onClick={() => handleUpdateStatus(reservation.id, 'confirmée')}
                                          className="text-green-600 hover:text-green-900"
                                        >
                                          <CheckCircle className="h-5 w-5" />
                                        </button>
                                      </CustomTooltip>
                                      <CustomTooltip content="Annuler">
                                        <button
                                          onClick={() => handleUpdateStatus(reservation.id, 'annulée')}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <XCircle className="h-5 w-5" />
                                        </button>
                                      </CustomTooltip>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader>
                      <CustomCardTitle>Messages de contact</CustomCardTitle>
                      <CustomCardDescription>
                        {contactMessages.length} message{contactMessages.length !== 1 ? 's' : ''} reçu{contactMessages.length !== 1 ? 's' : ''}
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent>
                      {loadingContactMessages ? (
                        <LoadingSpinner />
                      ) : contactMessages.length === 0 ? (
                        <EmptyState
                          icon={MessageSquare}
                          title="Aucun message"
                          description="Aucun message de contact n'a été reçu pour le moment."
                          action={
                            <Button
                              onClick={fetchContactMessages}
                              variant="outline"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="space-y-4">
                          {contactMessages.map((message) => (
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
                                  {message.status === 'non_lu' && (
                                    <CustomTooltip content="Marquer comme lu">
                                      <button
                                        onClick={() => handleMarkAsRead(message.id)}
                                        className="text-gray-400 hover:text-blue-600"
                                      >
                                        <CheckCircle className="h-5 w-5" />
                                      </button>
                                    </CustomTooltip>
                                  )}
                                  <CustomTooltip content="Répondre">
                                    <a
                                      href={`mailto:${message.email}`}
                                      className="text-gray-400 hover:text-blue-600"
                                    >
                                      <Mail className="h-5 w-5" />
                                    </a>
                                  </CustomTooltip>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader>
                      <CustomCardTitle>Mon Profil</CustomCardTitle>
                      <CustomCardDescription>
                        Gérez vos informations personnelles et vos paramètres de compte.
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent className="space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <UserIcon className="h-10 w-10 text-blue-600" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50">
                              <Pencil className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{profileForm.full_name || 'Utilisateur'}</h3>
                            <p className="text-sm text-gray-500">{profileForm.email}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {user?.user_metadata?.role === 'super_admin' ? 'Super Administrateur' : 'Administrateur'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="full_name">Nom complet</Label>
                            <Input
                              id="full_name"
                              value={profileForm.full_name}
                              onChange={(e) => handleProfileChange('full_name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Adresse e-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button 
                            onClick={handleUpdateProfile}
                            disabled={isUpdatingProfile}
                            className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour...
                              </>
                            ) : (
                              'Mettre à jour le profil'
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current_password">Mot de passe actuel</Label>
                            <div className="relative mt-1">
                              <Input
                                id="current_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.currentPassword}
                                onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new_password">Nouveau mot de passe</Label>
                              <Input
                                id="new_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.newPassword}
                                onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                              <Input
                                id="confirm_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.confirmPassword}
                                onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Button 
                              onClick={handleUpdatePassword}
                              disabled={isUpdatingPassword}
                              variant="outline"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              {isUpdatingPassword ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Mise à jour...
                                </>
                              ) : (
                                'Changer le mot de passe'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Connexion sécurisée</h4>
                              <p className="text-sm text-gray-500">Dernière connexion : {new Date().toLocaleString('fr-FR')}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Voir l'activité
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                              <p className="text-sm text-gray-500">Améliorez la sécurité de votre compte</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Activer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}

              {/* Admins Tab - Only visible for super_admin */}
              {activeTab === 'admins' && user?.user_metadata?.role === 'super_admin' && (
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CustomCardTitle>Gestion des administrateurs</CustomCardTitle>
                          <CustomCardDescription>
                            Gérez les comptes administrateurs et leurs autorisations.
                          </CustomCardDescription>
                        </div>
                        <Button 
                          onClick={() => {
                            setAdminForm({
                              email: '',
                              full_name: '',
                              role: 'admin',
                              is_active: true
                            });
                            setPassword('');
                            setEditingAdmin(null);
                            document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Ajouter un administrateur
                        </Button>
                      </div>
                    </CustomCardHeader>
                    <CustomCardContent>
                      {loadingAdmins ? (
                        <LoadingSpinner />
                      ) : adminUsers.length === 0 ? (
                        <EmptyState
                          icon={Users}
                          title="Aucun administrateur"
                          description="Aucun administrateur n'a été trouvé."
                          action={
                            <Button
                              onClick={fetchAdminUsers}
                              variant="outline"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="space-y-6">
                          {/* Admin List */}
                          <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rôle
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                  </th>
                                  <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {adminUsers.map((admin) => (
                                  <tr key={admin.id} className={admin.id === user.id ? 'bg-blue-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                          <UserIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {admin.full_name}
                                            {admin.id === user.id && (
                                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Vous
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {admin.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        admin.role === 'super_admin' 
                                          ? 'bg-purple-100 text-purple-800' 
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        admin.is_active 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {admin.is_active ? 'Actif' : 'Désactivé'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex items-center justify-end space-x-2">
                                        <CustomTooltip content="Modifier">
                                          <button
                                            onClick={() => {
                                              setAdminForm({
                                                email: admin.email,
                                                full_name: admin.full_name,
                                                role: admin.role,
                                                is_active: admin.is_active
                                              });
                                              setEditingAdmin(admin.id);
                                              document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </button>
                                        </CustomTooltip>
                                        
                                        <CustomTooltip content="Réinitialiser le mot de passe">
                                          <button
                                            onClick={() => handleResetPassword(admin.id, admin.email)}
                                            className="text-yellow-600 hover:text-yellow-900"
                                          >
                                            <Key className="h-4 w-4" />
                                          </button>
                                        </CustomTooltip>
                                        
                                        {admin.id !== user.id && (
                                          <CustomTooltip content={admin.is_active ? 'Désactiver' : 'Activer'}>
                                            <button
                                              onClick={() => handleDeleteAdmin(admin.id)}
                                              className={`${admin.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            >
                                              {admin.is_active ? (
                                                <UserX className="h-4 w-4" />
                                              ) : (
                                                <UserCheck className="h-4 w-4" />
                                              )}
                                            </button>
                                          </CustomTooltip>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Add/Edit Admin Form */}
                          <div id="admin-form" className="mt-12">
                            <CustomCard>
                              <CustomCardHeader>
                                <CustomCardTitle>
                                  {editingAdmin ? 'Modifier un administrateur' : 'Ajouter un nouvel administrateur'}
                                </CustomCardTitle>
                                <CustomCardDescription>
                                  {editingAdmin 
                                    ? 'Mettez à jour les informations de l\'administrateur.'
                                    : 'Remplissez les champs pour créer un nouveau compte administrateur.'}
                                </CustomCardDescription>
                              </CustomCardHeader>
                              <CustomCardContent>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <Label htmlFor="admin_full_name">Nom complet *</Label>
                                      <Input
                                        id="admin_full_name"
                                        value={adminForm.full_name}
                                        onChange={(e) => handleAdminFormChange('full_name', e.target.value)}
                                        className="mt-1"
                                        placeholder="Jean Dupont"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="admin_email">Adresse e-mail *</Label>
                                      <Input
                                        id="admin_email"
                                        type="email"
                                        value={adminForm.email}
                                        onChange={(e) => handleAdminFormChange('email', e.target.value)}
                                        className="mt-1"
                                        placeholder="jean.dupont@example.com"
                                        disabled={!!editingAdmin}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <Label htmlFor="admin_role">Rôle</Label>
                                      <select
                                        id="admin_role"
                                        value={adminForm.role}
                                        onChange={(e) => handleAdminFormChange('role', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                      >
                                        <option value="admin">Administrateur</option>
                                        <option value="super_admin">Super Administrateur</option>
                                      </select>
                                    </div>
                                    <div>
                                      <Label htmlFor="admin_status">Statut</Label>
                                      <select
                                        id="admin_status"
                                        value={adminForm.is_active ? 'active' : 'inactive'}
                                        onChange={(e) => handleAdminFormChange('is_active', e.target.value === 'active')}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                      >
                                        <option value="active">Actif</option>
                                        <option value="inactive">Inactif</option>
                                      </select>
                                    </div>
                                  </div>

                                  {!editingAdmin && (
                                    <div>
                                      <Label htmlFor="admin_password">
                                        Mot de passe {!editingAdmin && '*'}
                                        <span className="text-xs text-gray-500 ml-1">(laisser vide pour générer un mot de passe aléatoire)</span>
                                      </Label>
                                      <div className="mt-1 relative">
                                        <Input
                                          id="admin_password"
                                          type={showPassword ? 'text' : 'password'}
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          placeholder="••••••••"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                        >
                                          {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                          ) : (
                                            <Eye className="h-5 w-5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    {editingAdmin && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingAdmin(null);
                                          setAdminForm({
                                            email: '',
                                            full_name: '',
                                            role: 'admin',
                                            is_active: true
                                          });
                                        }}
                                      >
                                        Annuler
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      onClick={editingAdmin ? () => handleUpdateAdmin(editingAdmin) : handleCreateAdmin}
                                      disabled={submitting || !adminForm.email || !adminForm.full_name}
                                      className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
                                    >
                                      {submitting ? (
                                        <>
                                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                          {editingAdmin ? 'Mise à jour...' : 'Création...'}
                                        </>
                                      ) : editingAdmin ? (
                                        'Mettre à jour l\'administrateur'
                                      ) : (
                                        'Créer l\'administrateur'
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </CustomCardContent>
                            </CustomCard>
                          </div>
                        </div>
                      )}
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <CustomDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <CustomDialogContent>
          <CustomDialogHeader>
            <CustomDialogTitle>Confirmer la suppression</CustomDialogTitle>
            <CustomDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </CustomDialogDescription>
          </CustomDialogHeader>
          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
              Supprimer
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
};

export default AdminPanel;