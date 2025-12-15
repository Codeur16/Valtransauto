import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X,
  Car, Menu, Users, LogOut, Calendar,
  ChevronLeft, ChevronRight, Home, Shield, Lock, 
  AlertCircle, Clock, User, Phone, Mail, 
  Car as CarIcon, Calendar as CalendarIcon, Check, XCircle, CheckCircle,
  Search, Filter, Download, BarChart3, MessageSquare, Eye,
  TrendingUp, DollarSign, CarFront, Activity, Bell,
  Package, Settings, HelpCircle, Star, MoreVertical,
  ChevronDown, Upload, EyeOff, RefreshCw
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  </motion.div>
);

const AdminPanel = () => {
  const { user, logout } = useUserAuth();
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
  
  // Options pour les sélecteurs
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
  const transmissions = ['Manuelle', 'Automatique', 'Séquentielle'];
  const locations = ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'];

  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  // const loadDashboardData = async () => {
  //   await Promise.all([
  //     fetchVehicles(),
  //     fetchReservations(),
  //     fetchContactMessages(),
  //     calculateStats()
  //   ]);
  // };
const loadDashboardData = async () => {
  try {
    await Promise.all([
      fetchVehicles(),
      fetchReservations(),
      fetchContactMessages()
    ]);
    // Recalculer les statistiques après le chargement des données
    await calculateStats();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: 'Une erreur est survenue lors du chargement des données.'
    });
  }
};



  const calculateStats = async () => {
    try {
      // Calculer les statistiques
      const totalVehicles = vehicles.length;
      const totalReservations = reservations.length;
      const activeReservations = reservations.filter(r => r.status === 'confirmée').length;
      
      // Calculer le revenu total (exemple simplifié)
      const totalRevenue = vehicles.reduce((sum, vehicle) => {
        const vehicleReservations = reservations.filter(r => r.vehicle === `${vehicle.make} ${vehicle.model}`);
        const revenue = vehicleReservations.length * vehicle.price;
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
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
    }
  };

  // useEffect(() => {
  //   if (activeTab === 'reservations') {
  //     fetchReservations();
  //   }
  // }, [activeTab]);

  useEffect(() => {
    if (formData.image_url && formData.image_url.trim() !== '') {
      setImagePreview(formData.image_url);
      setImageError(false);
    } else {
      setImagePreview('');
      setImageError(false);
    }
  }, [formData.image_url]);

  // const handleLogin = async () => {
  //   if (password === 'ValtransautoAdmin2025') {
  //     setIsAuthenticated(true);
  //     localStorage.setItem('admin_authenticated', 'true');
  //     await loadDashboardData();
  //     toast({
  //       title: 'Authentification réussie',
  //       description: 'Bienvenue dans le panel admin',
  //       className: 'bg-green-500 text-white'
  //     });
  //   } else {
  //     toast({
  //       title: '❌ Mot de passe incorrect',
  //       description: 'Veuillez réessayer',
  //       variant: 'destructive'
  //     });
  //   }
  // };


  
  const handleLogout = () => {
    setIsAuthenticated(false);
    logout();
    setVehicles([]);
    toast({
      title: '👋 Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.'
    });
  };

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'image_url') {
      setImagePreview(value);
    }
  };



  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReservations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: 'Impossible de charger les véhicules. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  }, []);


  // const fetchReservations = useCallback(async () => {
  //   setLoadingReservations(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from('reservations')
  //       .select(`
  //         *,
  //         vehicle:vehicles(*)
  //       `)
  //       .order('start_date', { ascending: false });

  //     if (error) throw error;
      
  //     setReservations(data || []);
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des réservations:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Erreur',
  //       description: 'Impossible de charger les réservations. Veuillez réessayer.'
  //     });
  //   } finally {
  //     setLoadingReservations(false);
  //   }
  // }, []);

// Récupérer la liste des réservations
// const fetchReservations = useCallback(async () => {
//   setLoadingReservations(true);
//   try {
//     const { data, error } = await supabase
//       .from('reservations')
//       .select(`
//         *,
//         vehicle:vehicles(*)
//       `)
//       .order('start_date', { ascending: false });

//     if (error) throw error;
    
//     setReservations(data || []);
//   } catch (error) {
//     console.error('Erreur lors du chargement des réservations:', error);
//     toast({
//       variant: 'destructive',
//       title: '❌ Erreur',
//       description: 'Impossible de charger les réservations. Veuillez réessayer.'
//     });
//   } finally {
//     setLoadingReservations(false);
//   }
// }, []);



  // const [contactMessages, setContactMessages] = useState([]);
  // const [loadingContactMessages, setLoadingContactMessages] = useState(true);

  // const fetchContactMessages = async () => {
  //   try {
  //     setLoadingContactMessages(true);
  //     const { data, error } = await supabase
  //       .from('contact_messages')
  //       .select('*')
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;
  //     setContactMessages(data || []);
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des messages:', error);
  //     toast({
  //       title: 'Erreur',
  //       description: 'Impossible de charger les messages',
  //       variant: 'destructive'
  //     });
  //   } finally {
  //     setLoadingContactMessages(false);
  //   }
  // };


const [contactMessages, setContactMessages] = useState([]);
const [loadingContactMessages, setLoadingContactMessages] = useState(true);

const fetchContactMessages = async () => {
  setLoadingContactMessages(true);
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setContactMessages(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    toast({
      variant: 'destructive',
      title: '❌ Erreur',
      description: 'Impossible de charger les messages. Veuillez réessayer.'
    });
  } finally {
    setLoadingContactMessages(false);
  }
};

  // useEffect(() => {
  //   if (activeTab === 'messages') {
  //     fetchContactMessages();
  //   }
  // }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchReservations();
    } else if (activeTab === 'messages') {
      fetchContactMessages();
    
  }
}, activeTab);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles', label: 'Véhicules', icon: Car },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <title>Admin Panel - VALTRANSAUTO</title>
        <meta name="description" content="Administration des véhicules VALTRANSAUTO" />

        <div className="flex min-h-screen">
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
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Déconnexion</p>
                  </TooltipContent>
                </Tooltip>
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
                    {activeTab === 'settings' && 'Paramètres'}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {activeTab === 'dashboard' && 'Aperçu global de votre activité'}
                    {activeTab === 'vehicles' && 'Gérez votre parc automobile'}
                    {activeTab === 'reservations' && 'Suivez toutes les réservations'}
                    {activeTab === 'messages' && 'Consultez les messages clients'}
                    {activeTab === 'settings' && 'Configurez votre espace admin'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="relative">
                        <Bell size={18} />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                  
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
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Réservations récentes</CardTitle>
                          <CardDescription>Les 5 dernières réservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {reservations.slice(0, 5).map((reservation, index) => (
                            <motion.div
                              key={reservation.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {reservation.name?.charAt(0) || 'C'}
                                  </AvatarFallback>
                                </Avatar>
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
                        </CardContent>
                      </Card>

                      {/* Quick Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Actions rapides</CardTitle>
                          <CardDescription>Accès direct aux fonctionnalités</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
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
                        </CardContent>
                      </Card>
                    </div>

                    {/* Vehicle Status Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>État du parc automobile</CardTitle>
                        <CardDescription>Répartition par type de carburant</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {fuelTypes.map((type) => {
                            const count = vehicles.filter(v => v.fuel_type === type).length;
                            const percentage = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
                            return (
                              <div key={type} className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{count}</div>
                                <div className="text-sm text-gray-500">{type}</div>
                                <Progress value={percentage} className="mt-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
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
                          <Badge variant="outline" className="text-sm">
                            {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}
                          </Badge>
                          <Badge variant="secondary" className="text-sm">
                            {filteredVehicles.length} visible{filteredVehicles.length !== 1 ? 's' : ''}
                          </Badge>
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
                          {/* Rest of your vehicle form remains the same */}
                          {/* ... */}
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
                            <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
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
                                  <Badge variant={vehicle.is_available ? "default" : "secondary"}>
                                    {vehicle.is_available ? 'Disponible' : 'Indisponible'}
                                  </Badge>
                                </div>
                              </div>
                              <CardContent className="p-6">
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
                                    <div className="text-sm font-medium">{vehicle.mileage.toLocaleString()} km</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="text-sm text-gray-500">
                                    {vehicle.location} • {vehicle.transmission}
                                  </div>
                                  <div className="flex gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => handleEdit(vehicle)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Modifier</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => setDeleteConfirm(vehicle.id)}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Supprimer</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Other tabs remain similar but with improved styling */}
                {/* ... (Reservations, Messages, Settings tabs) */}
                
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AdminPanel;