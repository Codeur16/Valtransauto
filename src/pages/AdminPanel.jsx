// // AdminPanel.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';

// import {
//   Plus, Edit, Trash2, Save, X,
//   Car, Menu, Users, LogOut, Calendar,
//   ChevronLeft, ChevronRight, Home, Shield, Lock, 
//   AlertCircle, Clock, User, Phone, Mail, 
//   Car as CarIcon, Calendar as CalendarIcon, Check, XCircle, CheckCircle,
//   Search, Filter, Download, BarChart3, MessageSquare, Eye,
//   TrendingUp, DollarSign, CarFront, Activity, Bell,
//   Package, Settings, HelpCircle, Star, MoreVertical,
//   ChevronDown, Upload, EyeOff, RefreshCw, UserPlus, UserCog, UserCheck, UserX, Key, Pencil, User as UserIcon
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/components/ui/use-toast';
// import { supabase } from '@/lib/customSupabaseClient';
// import { format, parseISO, differenceInDays } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import { toast } from '@/components/ui/use-toast';
// import useProvideAuth from '@/hooks/useProvideAuth';

// // Composants UI personnalisés
// const CustomCard = ({ children, className = '', hover = false }) => (
//   <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''} ${className}`}>
//     {children}
//   </div>
// );

// const CustomCardHeader = ({ children, className = '' }) => (
//   <div className={`p-6 border-b border-gray-100 ${className}`}>
//     {children}
//   </div>
// );

// const CustomCardTitle = ({ children, className = '' }) => (
//   <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>
// );

// const CustomCardDescription = ({ children, className = '' }) => (
//   <p className={`text-gray-500 mt-1 ${className}`}>{children}</p>
// );

// const CustomCardContent = ({ children, className = '' }) => (
//   <div className={`p-6 ${className}`}>{children}</div>
// );

// const CustomBadge = ({ children, variant = 'default', className = '' }) => {
//   const variants = {
//     default: 'bg-blue-100 text-blue-800',
//     secondary: 'bg-gray-100 text-gray-800',
//     destructive: 'bg-red-100 text-red-800',
//     outline: 'border border-gray-300 text-gray-700',
//     success: 'bg-green-100 text-green-800'
//   };
  
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
//       {children}
//     </span>
//   );
// };

// const CustomTooltip = ({ children, content }) => {
//   const [show, setShow] = useState(false);
  
//   return (
//     <div className="relative inline-block">
//       <div
//         onMouseEnter={() => setShow(true)}
//         onMouseLeave={() => setShow(false)}
//       >
//         {children}
//       </div>
//       {show && (
//         <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
//           {content}
//           <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// const CustomSelect = ({ value, onChange, children, placeholder }) => {
//   const [open, setOpen] = useState(false);
  
//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79]"
//       >
//         <span className="block truncate">{value || placeholder}</span>
//         <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//           <ChevronDown className="h-5 w-5 text-gray-400" />
//         </span>
//       </button>
//       {open && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const CustomSelectItem = ({ children, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
//   >
//     {children}
//   </button>
// );

// const CustomProgress = ({ value, className = '' }) => (
//   <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
//     <div 
//       className="bg-[#1F4E79] h-2 rounded-full transition-all duration-500"
//       style={{ width: `${value}%` }}
//     ></div>
//   </div>
// );

// const CustomDialog = ({ open, onOpenChange, children }) => {
//   if (!open) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         {children}
//       </div>
//     </div>
//   );
// };

// const CustomDialogContent = ({ children }) => (
//   <div className="p-6">{children}</div>
// );

// const CustomDialogHeader = ({ children }) => (
//   <div className="mb-4">{children}</div>
// );

// const CustomDialogTitle = ({ children }) => (
//   <h2 className="text-xl font-bold text-gray-900">{children}</h2>
// );

// const CustomDialogDescription = ({ children }) => (
//   <p className="text-gray-500 mt-2">{children}</p>
// );

// const CustomDialogFooter = ({ children }) => (
//   <div className="flex justify-end space-x-3 mt-6">{children}</div>
// );

// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center p-8">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
//   </div>
// );

// const EmptyState = ({ icon: Icon, title, description, action }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="text-center py-16"
//   >
//     <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//     <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
//     <p className="text-gray-500 mb-6">{description}</p>
//     {action}
//   </motion.div>
// );

// const StatCard = ({ title, value, icon: Icon, change, color }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     whileHover={{ scale: 1.02 }}
//     transition={{ duration: 0.3 }}
//   >
//     <CustomCard hover>
//       <CustomCardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <h3 className="text-3xl font-bold mt-2">{value}</h3>
//             {change !== undefined && (
//               <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? '' : 'rotate-180'}`} />
//                 {change >= 0 ? '+' : ''}{change}%
//               </div>
//             )}
//           </div>
//           <div className={`p-3 rounded-full ${color}`}>
//             <Icon className="h-6 w-6 text-white" />
//           </div>
//         </div>
//       </CustomCardContent>
//     </CustomCard>
//   </motion.div>
// );

// const AdminPanel = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Utiliser le hook personnalisé
//   const {
//     user,
//     admin,
//     loading: authLoading,
//     logout,
//     dashboardStats,
//     fetchDashboardStats,
//     admins,
//     loadingAdmins,
//     fetchAdmins,
//     createAdmin,
//     updateAdmin,
//     deleteAdmin,
//     toggleAdminActive
//   } = useProvideAuth();

//   // États pour la gestion des véhicules
//   const [vehicles, setVehicles] = useState([]);
//   const [loadingVehicles, setLoadingVehicles] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState(null);
//   const [showVehicleForm, setShowVehicleForm] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [submitting, setSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // États pour les réservations
//   const [reservations, setReservations] = useState([]);
//   const [loadingReservations, setLoadingReservations] = useState(true);
  
//   // États pour les messages de contact
//   const [contactMessages, setContactMessages] = useState([]);
//   const [loadingContactMessages, setLoadingContactMessages] = useState(true);
  
//   // États pour la gestion des administrateurs
//   const [adminForm, setAdminForm] = useState({
//     email: '',
//     full_name: '',
//     role: 'admin',
//     is_active: true
//   });
//   useEffect(() => {
//   console.log('adminForm updated:', adminForm);
// }, [adminForm]);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [adminPassword, setAdminPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
  
//   // État pour le profil utilisateur
//   const [profileForm, setProfileForm] = useState({
//     full_name: '',
//     email: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
//   // Formulaire initial pour les véhicules
//   const initialVehicleForm = {
//     make: '',
//     model: '',
//     year: new Date().getFullYear().toString(),
//     price: '',
//     mileage: '',
//     fuel_type: 'Essence',
//     transmission: 'Manuelle',
//     location: 'Bruxelles',
//     description: '',
//     image_url: '',
//     features: [],
//     is_available: true
//   };

//   const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
//   const [imagePreview, setImagePreview] = useState('');
//   const [imageError, setImageError] = useState(false);

//   // Options pour les sélecteurs
//   const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
//   const transmissions = ['Manuelle', 'Automatique', 'Séquentielle'];
//   const locations = ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'];

//   const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

//   // Menu items
//   const menuItems = [
//     { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
//     { id: 'vehicles', label: 'Véhicules', icon: Car },
//     { id: 'reservations', label: 'Réservations', icon: Calendar },
//     { id: 'messages', label: 'Messages', icon: MessageSquare },
//     { id: 'account', label: 'Mon compte', icon: UserCog },
//   ];

//   // Ajouter l'onglet administrateurs seulement pour SuperAdmin
//   if (admin?.role === 'SuperAdmin') {
//     menuItems.push({ id: 'admins', label: 'Administrateurs', icon: Shield });
//   }

//   // Redirection si non connecté
//   useEffect(() => {
//     if (!authLoading && !user) {
//       navigate('/unauthorized', { state: { from: location } });
//     }
//   }, [user, authLoading, navigate, location]);

//   // Charger les données initiales
//   useEffect(() => {
//     if (user && admin) {
//       loadInitialData();
//     }
//   }, [user, admin]);

//   const loadInitialData = async () => {
//     try {
//       await Promise.all([
//         fetchVehicles(),
//         fetchReservations(),
//         fetchContactMessages(),
//         fetchDashboardStats()
//       ]);
      
//       // Charger les administrateurs seulement si SuperAdmin
//       if (admin?.role === 'SuperAdmin') {
//         await fetchAdmins();
//       }
      
//       // Initialiser le formulaire de profil
//       if (admin) {
//         setProfileForm({
//           full_name: admin.full_name || '',
//           email: admin.email || user?.email || '',
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des données initiales:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de charger les données initiales.'
//       });
//     }
//   };

//   // Charger les données spécifiques à l'onglet actif
//   useEffect(() => {
//     const loadTabData = async () => {
//       try {
//         switch (activeTab) {
//           case 'vehicles':
//             await fetchVehicles();
//             break;
//           case 'reservations':
//             await fetchReservations();
//             break;
//           case 'messages':
//             await fetchContactMessages();
//             break;
//           case 'admins':
//             if (admin?.role === 'SuperAdmin') {
//               await fetchAdmins();
//             }
//             break;
//           case 'dashboard':
//             await fetchDashboardStats();
//             break;
//         }
//       } catch (error) {
//         console.error(`Erreur lors du chargement de l'onglet ${activeTab}:`, error);
//       }
//     };

//     if (user && admin) {
//       loadTabData();
//     }
//   }, [activeTab, user, admin]);

//   // ============================================================================
//   // GESTION DES VÉHICULES
//   // ============================================================================
// const[totalVehicule, setTotalVehicule]=useState(0)
//   const fetchVehicles = useCallback(async () => {
//     setLoadingVehicles(true);
//     try {
//       const { data, error } = await supabase
//         .from('vehicles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setTotalVehicule(data.length)
//       setVehicles(data || []);
//       return data || [];
//     } catch (error) {
//       console.error('Erreur lors du chargement des véhicules:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de charger les véhicules.'
//       });
//       throw error;
//     } finally {
//       setLoadingVehicles(false);
//     }
//   }, []);

//   const handleVehicleInputChange = (field, value) => {
//     setVehicleForm(prev => ({ ...prev, [field]: value }));
    
//     if (field === 'image_url') {
//       setImagePreview(value);
//       setImageError(false);
//     }
//   };

//   const handleVehicleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const vehicleData = {
//         make: vehicleForm.make.trim(),
//         model: vehicleForm.model.trim(),
//         year: parseInt(vehicleForm.year),
//         price: parseFloat(vehicleForm.price),
//         mileage: parseInt(vehicleForm.mileage),
//         fuel_type: vehicleForm.fuel_type,
//         transmission: vehicleForm.transmission,
//         location: vehicleForm.location,
//         description: vehicleForm.description.trim() || null,
//         image_url: vehicleForm.image_url.trim(),
//         features: vehicleForm.features,
//         is_available: vehicleForm.is_available,
//         updated_at: new Date().toISOString()
//       };

//       if (editingVehicle) {
//         // Mise à jour
//         const { data, error } = await supabase
//           .from('vehicles')
//           .update(vehicleData)
//           .eq('id', editingVehicle)
//           .select();

//         if (error) throw error;

//         setVehicles(prev => 
//           prev.map(v => v.id === editingVehicle ? { ...v, ...vehicleData } : v)
//         );

//         toast({
//           title: 'Succès',
//           description: 'Véhicule mis à jour avec succès.',
//           className: 'bg-green-500 text-white'
//         });
//       } else {
//         // Création
//         vehicleData.created_at = new Date().toISOString();

//         const { data, error } = await supabase
//           .from('vehicles')
//           .insert([vehicleData])
//           .select();

//         if (error) throw error;

//         if (data?.[0]) {
//           setVehicles(prev => [data[0], ...prev]);
//         }

//         toast({
//           title: 'Succès',
//           description: 'Véhicule ajouté avec succès.',
//           className: 'bg-green-500 text-white'
//         });
//       }

//       resetVehicleForm();
//       setShowVehicleForm(false);
//       await fetchDashboardStats();
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEditVehicle = (vehicle) => {
//     setVehicleForm({
//       ...vehicle,
//       year: vehicle.year?.toString() || new Date().getFullYear().toString(),
//       price: vehicle.price?.toString() || '',
//       mileage: vehicle.mileage?.toString() || '',
//       fuel_type: vehicle.fuel_type || 'Essence',
//       transmission: vehicle.transmission || 'Manuelle',
//       location: vehicle.location || 'Bruxelles',
//       description: vehicle.description || '',
//       image_url: vehicle.image_url || '',
//       features: vehicle.features || [],
//       is_available: vehicle.is_available !== false
//     });
//     setEditingVehicle(vehicle.id);
//     setShowVehicleForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDeleteVehicle = async (id) => {
//     try {
//       const { error } = await supabase
//         .from('vehicles')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;

//       setVehicles(prev => prev.filter(v => v.id !== id));
//       toast({
//         title: 'Succès',
//         description: 'Véhicule supprimé avec succès.',
//         className: 'bg-green-500 text-white'
//       });
      
//       await fetchDashboardStats();
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Impossible de supprimer le véhicule.'
//       });
//     } finally {
//       setDeleteConfirm(null);
//     }
//   };

//   const resetVehicleForm = () => {
//     setVehicleForm(initialVehicleForm);
//     setEditingVehicle(null);
//     setShowVehicleForm(false);
//     setImagePreview('');
//     setImageError(false);
//   };

//   // ============================================================================
//   // GESTION DES RÉSERVATIONS
//   // ============================================================================
// const[totalRservation, setTotalRservation]=useState(0)
//   const fetchReservations = useCallback(async () => {
//     setLoadingReservations(true);
//     try {
//       const { data, error } = await supabase
//         .from('reservations')
//         .select('*')
//         .order('date', { ascending: false });

//       if (error) throw error;
//        setTotalRservation(data.length)
//       setReservations(data || []);
//       return data || [];
//     } catch (error) {
//       console.error('Erreur lors du chargement des réservations:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de charger les réservations.'
//       });
//       throw error;
//     } finally {
//       setLoadingReservations(false);
//     }
//   }, []);

//   const handleUpdateReservationStatus = async (id, status) => {
//     try {
//       const { error } = await supabase
//         .from('reservations')
//         .update({ status })
//         .eq('id', id);

//       if (error) throw error;

//       setReservations(prev => 
//         prev.map(r => r.id === id ? { ...r, status } : r)
//       );

//       toast({
//         title: 'Succès',
//         description: `Statut mis à jour avec succès.`,
//         className: 'bg-green-500 text-white'
//       });
      
//       await fetchDashboardStats();
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du statut:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de mettre à jour le statut.'
//       });
//     }
//   };

//   // ============================================================================
//   // GESTION DES MESSAGES
//   // ============================================================================

//   const fetchContactMessages = useCallback(async () => {
//     setLoadingContactMessages(true);
//     try {
//       const { data, error } = await supabase
//         .from('contact_messages')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       setContactMessages(data || []);
//       return data || [];
//     } catch (error) {
//       console.error('Erreur lors du chargement des messages:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de charger les messages.'
//       });
//       throw error;
//     } finally {
//       setLoadingContactMessages(false);
//     }
//   }, []);

//   const handleMarkMessageAsRead = async (id) => {
//     try {
//       const { error } = await supabase
//         .from('contact_messages')
//         .update({ status: 'lu' })
//         .eq('id', id);

//       if (error) throw error;

//       setContactMessages(prev => 
//         prev.map(msg => 
//           msg.id === id ? { ...msg, status: 'lu' } : msg
//         )
//       );

//       toast({
//         title: 'Succès',
//         description: 'Message marqué comme lu.',
//         className: 'bg-green-500 text-white'
//       });
      
//       await fetchDashboardStats();
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du message:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de mettre à jour le message.'
//       });
//     }
//   };

//   // ============================================================================
//   // GESTION DES ADMINISTRATEURS
//   // ============================================================================

// const handleAdminFormChange = (field, value) => {
//   setAdminForm(prev => ({
//     ...prev,
//     [field]: value
//   }));
// };

//   const handleCreateAdmin = async () => {
//     if (!adminForm.email || !adminForm.full_name) {
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Veuillez remplir tous les champs obligatoires.'
//       });
//       return;
//     }

//     try {
//       setSubmitting(true);
      
//       const password = adminPassword || generateRandomPassword();
      
//       await createAdmin({
//         email: adminForm.email,
//         password: password,
//         full_name: adminForm.full_name,
//         role: adminForm.role
//       });

//       // Réinitialiser le formulaire
//       setAdminForm({
//         email: '',
//         full_name: '',
//         role: 'admin',
//         is_active: true
//       });
//       setAdminPassword('');
//       setEditingAdmin(null);

//       if (!adminPassword) {
//         toast({
//           title: 'Information',
//           description: `Mot de passe généré: ${password}`,
//           className: 'bg-blue-500 text-white'
//         });
//       }
//     } catch (error) {
//       console.error('Erreur lors de la création:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdateAdmin = async (adminId) => {
//     try {
//       setSubmitting(true);
      
//       await updateAdmin(adminId, {
//         full_name: adminForm.full_name,
//         role: adminForm.role,
//         is_active: adminForm.is_active
//       });

//       // Réinitialiser le formulaire
//       setAdminForm({
//         email: '',
//         full_name: '',
//         role: 'admin',
//         is_active: true
//       });
//       setEditingAdmin(null);
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteAdmin = async (adminId) => {
//     if (adminId === admin?.id) {
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Vous ne pouvez pas supprimer votre propre compte.'
//       });
//       return;
//     }

//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
//       return;
//     }

//     try {
//       await deleteAdmin(adminId);
      
//       // Si on supprime l'admin en cours d'édition, réinitialiser le formulaire
//       if (editingAdmin === adminId) {
//         setAdminForm({
//           email: '',
//           full_name: '',
//           role: 'admin',
//           is_active: true
//         });
//         setEditingAdmin(null);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     }
//   };

//   const handleToggleAdminActive = async (adminId, isActive) => {
//     try {
//       await toggleAdminActive(adminId, isActive);
//     } catch (error) {
//       console.error('Erreur lors du changement de statut:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     }
//   };

//   const handleResetAdminPassword = async (adminId, email) => {
//     const newPassword = prompt('Entrez le nouveau mot de passe (laissez vide pour générer un mot de passe aléatoire)');
//     if (newPassword === null) return;

//     try {
//       const password = newPassword || generateRandomPassword();
      
//       // Update password in auth
//       const { error: authError } = await supabase.auth.admin.updateUserById(adminId, {
//         password: password
//       });

//       if (authError) throw authError;

//       if (!newPassword) {
//         alert(`Le mot de passe a été réinitialisé. Le nouveau mot de passe est : ${password}`);
//       } else {
//         alert('Le mot de passe a été mis à jour avec succès.');
//       }
//     } catch (error) {
//       console.error('Error resetting password:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     }
//   };

//   const generateRandomPassword = () => {
//     const length = 12;
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       password += charset[randomIndex];
//     }
//     return password;
//   };

//   // ============================================================================
//   // GESTION DU PROFIL UTILISATEUR
//   // ============================================================================

//   const handleProfileChange = (field, value) => {
//     setProfileForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleUpdateProfile = async () => {
//     if (!profileForm.full_name) {
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Le nom complet est obligatoire.'
//       });
//       return;
//     }

//     try {
//       setIsUpdatingProfile(true);
      
//       const { error: authError } = await supabase.auth.updateUser({
//         data: { full_name: profileForm.full_name },
//         email: profileForm.email
//       });

//       if (authError) throw authError;

//       const { error } = await supabase
//         .from('admin_users')
//         .update({
//           full_name: profileForm.full_name,
//           email: profileForm.email,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', user.id);

//       if (error) throw error;

//       toast({
//         title: 'Succès',
//         description: 'Profil mis à jour avec succès.',
//         className: 'bg-green-500 text-white'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du profil:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     } finally {
//       setIsUpdatingProfile(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     if (!profileForm.currentPassword || !profileForm.newPassword) {
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Veuillez saisir tous les champs.'
//       });
//       return;
//     }

//     if (profileForm.newPassword !== profileForm.confirmPassword) {
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Les mots de passe ne correspondent pas.'
//       });
//       return;
//     }

//     try {
//       setIsUpdatingPassword(true);
      
//       const { error } = await supabase.auth.updateUser({
//         password: profileForm.newPassword
//       });

//       if (error) throw error;

//       toast({
//         title: 'Succès',
//         description: 'Mot de passe mis à jour avec succès.',
//         className: 'bg-green-500 text-white'
//       });

//       setProfileForm(prev => ({
//         ...prev,
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       }));
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du mot de passe:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: error.message || 'Une erreur est survenue.'
//       });
//     } finally {
//       setIsUpdatingPassword(false);
//     }
//   };

//   // ============================================================================
//   // COMPOSANTS UTILITAIRES
//   // ============================================================================

//   const StatusBadge = ({ status }) => {
//     const statusConfig = {
//       pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
//       confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
//       confirmée: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
//       cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
//       annulée: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
//       completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800' }
//     };

//     const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

//     return (
//       <CustomBadge className={config.color}>
//         {config.label}
//       </CustomBadge>
//     );
//   };

//   const handleLogout = () => {
//     logout();
//     toast({
//       title: 'Déconnexion réussie',
//       description: 'Vous avez été déconnecté avec succès.'
//     });
//   };

//   // Filtre des véhicules
//   const filteredVehicles = vehicles.filter(vehicle => {
//     if (!searchTerm) return true;
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       vehicle.make?.toLowerCase().includes(searchLower) ||
//       vehicle.model?.toLowerCase().includes(searchLower) ||
//       vehicle.year?.toString().includes(searchTerm) ||
//       vehicle.location?.toLowerCase().includes(searchLower) ||
//       vehicle.fuel_type?.toLowerCase().includes(searchLower)
//     );
//   });

//   // ============================================================================
//   // RENDU
//   // ============================================================================

//   // Afficher le chargement initial
//   if (authLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1F4E79]"></div>
//       </div>
//     );
//   }

//   // Rediriger si non connecté
//   if (!user || !admin) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return (
//     <>
//       <div>
//         <title>Admin Panel - VALTRANSAUTO</title>
//         <meta name="description" content="Administration des véhicules VALTRANSAUTO" />
//       </div>

//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         {/* Sidebar */}
//         <motion.aside
//           initial={{ x: -300 }}
//           animate={{ x: 0 }}
//           className={`bg-gradient-to-b from-[#1F4E79] to-[#2A5F8A] text-white flex flex-col fixed left-0 top-0 h-screen z-50 shadow-2xl ${
//             sidebarCollapsed ? 'w-20' : 'w-64'
//           }`}
//         >
//           {/* Logo */}
//           <div className="p-6 border-b border-white/10">
//             <div className="flex items-center justify-between">
//               {!sidebarCollapsed && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex items-center gap-3"
//                 >
//                   <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
//                     <div className="h-8 w-8 relative">
//                       <img 
//                         src={logoUrl} 
//                         alt="Logo" 
//                         className="h-full w-full object-contain"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
//                       VALTRANSAUTO
//                     </h2>
//                     <p className="text-sm text-white/70">Admin Pro</p>
//                   </div>
//                 </motion.div>
//               )}
//               <button
//                 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                 className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
//               >
//                 {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4">
//             <ul className="space-y-1">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeTab === item.id;
//                 return (
//                   <li key={item.id}>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setActiveTab(item.id)}
//                       className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
//                         isActive
//                           ? 'bg-gradient-to-r from-[#FF0C00] to-[#FF4D4D] text-white shadow-lg'
//                           : 'hover:bg-white/10 text-white/80'
//                       }`}
//                     >
//                       <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
//                       {!sidebarCollapsed && (
//                         <motion.span
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           className="ml-3 whitespace-nowrap font-medium"
//                         >
//                           {item.label}
//                         </motion.span>
//                       )}
//                     </motion.button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* User Profile */}
//           <div className="p-4 border-t border-white/10">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
//                 <User className="h-5 w-5 text-white" />
//               </div>
//               {!sidebarCollapsed && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex-1 min-w-0"
//                 >
//                   <p className="font-semibold truncate">{admin?.full_name || 'Administrateur'}</p>
//                   <p className="text-sm text-white/60 truncate">{admin?.email || user?.email}</p>
//                   <p className="text-xs text-white/40 truncate">
//                     {admin?.role === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
//                   </p>
//                 </motion.div>
//               )}
//               <CustomTooltip content="Déconnexion">
//                 <button
//                   onClick={handleLogout}
//                   className="p-2 rounded-lg hover:bg-white/10 transition-colors"
//                 >
//                   <LogOut size={18} />
//                 </button>
//               </CustomTooltip>
//             </div>
//           </div>
//         </motion.aside>

//         {/* Main Content */}
//         <main
//           className={`flex-1 transition-all duration-300 ${
//             sidebarCollapsed ? 'ml-20' : 'ml-64'
//           }`}
//         >
//           {/* Top Bar */}
//           <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
//             <div className="px-8 py-4 flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {activeTab === 'dashboard' && 'Tableau de bord'}
//                   {activeTab === 'vehicles' && 'Gestion des véhicules'}
//                   {activeTab === 'reservations' && 'Réservations'}
//                   {activeTab === 'messages' && 'Messages de contact'}
//                   {activeTab === 'account' && 'Mon compte'}
//                   {activeTab === 'admins' && 'Gestion des administrateurs'}
//                 </h1>
//                 <p className="text-gray-500 mt-1">
//                   {activeTab === 'dashboard' && 'Aperçu global de votre activité'}
//                   {activeTab === 'vehicles' && 'Gérez votre parc automobile'}
//                   {activeTab === 'reservations' && 'Suivez toutes les réservations'}
//                   {activeTab === 'messages' && 'Consultez les messages clients'}
//                   {activeTab === 'account' && 'Gérez vos informations personnelles'}
//                   {activeTab === 'admins' && 'Gérez les comptes administrateurs'}
//                 </p>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                   <Input
//                     placeholder="Rechercher..."
//                     className="pl-10 w-64"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Dashboard Content */}
//           <div className="p-8">
//             <AnimatePresence mode="wait">
//               {activeTab === 'dashboard' && (
//                 <motion.div
//                   key="dashboard"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   {/* Stats Grid - DONNÉES RÉELLES */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <StatCard
//                       title="Véhicules total"
//                       value={dashboardStats.totalVehicles === 0? totalVehicule : dashboardStats.totalVehicles}
//                       icon={CarFront}
//                       change={dashboardStats.monthlyGrowth}
//                       color="bg-blue-500"
//                     />
//                     <StatCard
//                       title="Réservations"
//                       value={dashboardStats.totalReservations ===0? totalRservation : dashboardStats.totalReservations }
//                       icon={Calendar}
//                       change={8.2}
//                       color="bg-green-500"
//                     />
//                     {/* <StatCard
//                       title="Revenu total"
//                       value={`${dashboardStats.totalRevenue} €`}
//                       icon={DollarSign}
//                       change={15.3}
//                       color="bg-purple-500"
//                     /> */}
//                     <StatCard
//                       title="Messages en attente"
//                       value={dashboardStats.pendingMessages}
//                       icon={MessageSquare}
//                       change={-3.1}
//                       color="bg-orange-500"
//                     />
//                   </div>

//                   {/* Recent Activity & Quick Actions */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Recent Reservations */}
//                     <CustomCard className="lg:col-span-2">
//                       <CustomCardHeader>
//                         <CustomCardTitle>Réservations récentes</CustomCardTitle>
//                         <CustomCardDescription>Les 5 dernières réservations</CustomCardDescription>
//                       </CustomCardHeader>
//                       <CustomCardContent>
//                         {reservations.slice(0, 5).map((reservation, index) => (
//                           <motion.div
//                             key={reservation.id}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                 <User className="h-5 w-5 text-blue-600" />
//                               </div>
//                               <div>
//                                 <p className="font-medium">{reservation.name}</p>
//                                 <p className="text-sm text-gray-500">{reservation.vehicle}</p>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <StatusBadge status={reservation.status} />
//                               <p className="text-sm text-gray-500 mt-1">
//                                 {new Date(reservation.date).toLocaleDateString('fr-FR')}
//                               </p>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </CustomCardContent>
//                     </CustomCard>

//                     {/* Quick Actions */}
//                     <CustomCard>
//                       <CustomCardHeader>
//                         <CustomCardTitle>Actions rapides</CustomCardTitle>
//                         <CustomCardDescription>Accès direct aux fonctionnalités</CustomCardDescription>
//                       </CustomCardHeader>
//                       <CustomCardContent className="space-y-3">
//                         <Button 
//                           onClick={() => setActiveTab('vehicles')}
//                           className="w-full justify-start"
//                           variant="outline"
//                         >
//                           <Plus className="mr-2 h-4 w-4" />
//                           Ajouter un véhicule
//                         </Button>
//                         <Button 
//                           onClick={() => setActiveTab('reservations')}
//                           className="w-full justify-start"
//                           variant="outline"
//                         >
//                           <Calendar className="mr-2 h-4 w-4" />
//                           Voir les réservations
//                         </Button>
//                         <Button 
//                           onClick={() => setActiveTab('messages')}
//                           className="w-full justify-start"
//                           variant="outline"
//                         >
//                           <MessageSquare className="mr-2 h-4 w-4" />
//                           Consulter les messages
//                         </Button>
//                       </CustomCardContent>
//                     </CustomCard>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Vehicles Tab */}
//               {activeTab === 'vehicles' && (
//                 <motion.div
//                   key="vehicles"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   {/* Header with Stats */}
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                       <h1 className="text-3xl font-bold text-gray-900">Gestion des Véhicules</h1>
//                       <div className="flex items-center gap-4 mt-2">
//                         <CustomBadge variant="outline" className="text-sm">
//                           {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}
//                         </CustomBadge>
//                         <CustomBadge variant="secondary" className="text-sm">
//                           {filteredVehicles.length} visible{filteredVehicles.length !== 1 ? 's' : ''}
//                         </CustomBadge>
//                       </div>
//                     </div>
                    
//                     <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                       <Button
//                         onClick={() => {
//                           setShowVehicleForm(!showVehicleForm);
//                           if (editingVehicle) resetVehicleForm();
//                         }}
//                         className="bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] hover:from-[#2A5F8A] hover:to-[#1F4E79] text-white shadow-lg"
//                       >
//                         {showVehicleForm ? (
//                           <X className="h-5 w-5" />
//                         ) : (
//                           <Plus className="h-5 w-5" />
//                         )}
//                         <span className="ml-2">{showVehicleForm ? 'Fermer' : 'Ajouter un véhicule'}</span>
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Vehicle Form */}
//                   <AnimatePresence>
//                     {showVehicleForm && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
//                       >
//                         <div className="p-6">
//                           <h2 className="text-xl font-semibold text-gray-800 mb-6">
//                             {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
//                           </h2>
                          
//                           <form onSubmit={handleVehicleSubmit}>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                               {/* Colonne gauche */}
//                               <div className="space-y-4">
//                                 <div>
//                                   <Label htmlFor="make">Marque *</Label>
//                                   <Input
//                                     id="make"
//                                     value={vehicleForm.make}
//                                     onChange={(e) => handleVehicleInputChange('make', e.target.value)}
//                                     placeholder="Ex: Toyota"
//                                     className="mt-1"
//                                     required
//                                   />
//                                 </div>

//                                 <div>
//                                   <Label htmlFor="model">Modèle *</Label>
//                                   <Input
//                                     id="model"
//                                     value={vehicleForm.model}
//                                     onChange={(e) => handleVehicleInputChange('model', e.target.value)}
//                                     placeholder="Ex: Corolla"
//                                     className="mt-1"
//                                     required
//                                   />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <Label htmlFor="year">Année *</Label>
//                                     <Input
//                                       type="number"
//                                       id="year"
//                                       min="1990"
//                                       max={new Date().getFullYear() + 1}
//                                       value={vehicleForm.year}
//                                       onChange={(e) => handleVehicleInputChange('year', e.target.value)}
//                                       className="mt-1"
//                                       required
//                                     />
//                                   </div>
//                                   <div>
//                                     <Label htmlFor="price">Prix (€) *</Label>
//                                     <div className="relative mt-1">
//                                       <Input
//                                         type="number"
//                                         id="price"
//                                         min="0"
//                                         step="0.01"
//                                         value={vehicleForm.price}
//                                         onChange={(e) => handleVehicleInputChange('price', e.target.value)}
//                                         className="pl-8"
//                                         required
//                                       />
//                                       <span className="absolute left-3 top-2.5 text-gray-500">€</span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <Label htmlFor="fuel_type">Carburant *</Label>
//                                     <select
//                                       id="fuel_type"
//                                       value={vehicleForm.fuel_type}
//                                       onChange={(e) => handleVehicleInputChange('fuel_type', e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
//                                       required
//                                     >
//                                       {fuelTypes.map((type) => (
//                                         <option key={type} value={type}>
//                                           {type}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>
//                                   <div>
//                                     <Label htmlFor="transmission">Transmission *</Label>
//                                     <select
//                                       id="transmission"
//                                       value={vehicleForm.transmission}
//                                       onChange={(e) => handleVehicleInputChange('transmission', e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
//                                       required
//                                     >
//                                       {transmissions.map((type) => (
//                                         <option key={type} value={type}>
//                                           {type}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Colonne droite */}
//                               <div className="space-y-4">
//                                 <div>
//                                   <Label>Image du véhicule *</Label>
//                                   <div className="mt-1 flex items-center gap-4">
//                                     <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
//                                       {imagePreview ? (
//                                         <img
//                                           src={imagePreview}
//                                           alt="Aperçu"
//                                           className="w-full h-full object-cover"
//                                           onError={() => setImageError(true)}
//                                         />
//                                       ) : (
//                                         <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                           <Car className="w-8 h-8" />
//                                         </div>
//                                       )}
//                                     </div>
//                                     <div className="flex-1">
//                                       <Input
//                                         type="url"
//                                         placeholder="URL de l'image"
//                                         value={vehicleForm.image_url}
//                                         onChange={(e) => handleVehicleInputChange('image_url', e.target.value)}
//                                         className={imageError ? 'border-red-500' : ''}
//                                         required
//                                       />
//                                       {imageError && (
//                                         <p className="mt-1 text-sm text-red-600">
//                                           Impossible de charger l'image. Vérifiez l'URL.
//                                         </p>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <Label htmlFor="location">Localisation *</Label>
//                                   <select
//                                     id="location"
//                                     value={vehicleForm.location}
//                                     onChange={(e) => handleVehicleInputChange('location', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1"
//                                     required
//                                   >
//                                     {locations.map((loc) => (
//                                       <option key={loc} value={loc}>
//                                         {loc}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>

//                                 <div>
//                                   <Label htmlFor="mileage">Kilométrage (km) *</Label>
//                                   <Input
//                                     type="number"
//                                     id="mileage"
//                                     min="0"
//                                     value={vehicleForm.mileage}
//                                     onChange={(e) => handleVehicleInputChange('mileage', e.target.value)}
//                                     className="mt-1"
//                                     required
//                                   />
//                                 </div>

//                                 <div>
//                                   <Label htmlFor="description">Description</Label>
//                                   <Textarea
//                                     id="description"
//                                     rows={3}
//                                     value={vehicleForm.description}
//                                     onChange={(e) => handleVehicleInputChange('description', e.target.value)}
//                                     placeholder="Description détaillée du véhicule..."
//                                     className="mt-1"
//                                   />
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => {
//                                   setShowVehicleForm(false);
//                                   resetVehicleForm();
//                                 }}
//                                 disabled={submitting}
//                               >
//                                 Annuler
//                               </Button>
//                               <Button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
//                               >
//                                 {submitting ? (
//                                   <>
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                   </svg>
//                                     {editingVehicle ? 'Mise à jour...' : 'Ajout en cours...'}
//                                   </>
//                                 ) : (
//                                   <>{editingVehicle ? 'Mettre à jour' : 'Ajouter le véhicule'}</>
//                                 )}
//                               </Button>
//                             </div>
//                           </form>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Vehicles Grid */}
//                   {loadingVehicles ? (
//                     <LoadingSpinner />
//                   ) : filteredVehicles.length === 0 ? (
//                     <EmptyState
//                       icon={Car}
//                       title={searchTerm ? 'Aucun résultat' : 'Aucun véhicule trouvé'}
//                       description={searchTerm 
//                         ? 'Aucun véhicule ne correspond à votre recherche.' 
//                         : 'Commencez par ajouter votre premier véhicule.'}
//                       action={!searchTerm && (
//                         <Button
//                           onClick={() => {
//                             setShowVehicleForm(true);
//                             window.scrollTo({ top: 0, behavior: 'smooth' });
//                           }}
//                           className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
//                         >
//                           <Plus className="mr-2 h-5 w-5" />
//                           Ajouter un véhicule
//                         </Button>
//                       )}
//                     />
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {filteredVehicles.map((vehicle, index) => (
//                         <motion.div
//                           key={vehicle.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           whileHover={{ y: -5 }}
//                         >
//                           <CustomCard className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
//                             <div className="relative h-48 overflow-hidden">
//                               <img
//                                 src={vehicle.image_url || 'https://via.placeholder.com/400x300'}
//                                 alt={`${vehicle.make} ${vehicle.model}`}
//                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   e.target.src = 'https://via.placeholder.com/400x300';
//                                 }}
//                               />
//                               <div className="absolute top-4 right-4">
//                                 <CustomBadge variant={vehicle.is_available ? "default" : "secondary"}>
//                                   {vehicle.is_available ? 'Disponible' : 'Indisponible'}
//                                 </CustomBadge>
//                               </div>
//                             </div>
//                             <CustomCardContent className="p-6">
//                               <div className="flex justify-between items-start mb-4">
//                                 <div>
//                                   <h3 className="text-xl font-bold text-gray-900">
//                                     {vehicle.make} {vehicle.model}
//                                   </h3>
//                                   <p className="text-gray-500">{vehicle.year}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-2xl font-bold text-[#1F4E79]">
//                                     {new Intl.NumberFormat('fr-FR', {
//                                       style: 'currency',
//                                       currency: 'EUR',
//                                       maximumFractionDigits: 0
//                                     }).format(vehicle.price)}
//                                   </div>
//                                   <div className="text-sm text-gray-500">TTC/jour</div>
//                                 </div>
//                               </div>
                              
//                               <div className="grid grid-cols-2 gap-3 mb-4">
//                                 <div className="text-center p-3 bg-gray-50 rounded-lg">
//                                   <Car className="h-5 w-5 text-gray-500 mx-auto mb-1" />
//                                   <div className="text-sm font-medium">{vehicle.fuel_type}</div>
//                                 </div>
//                                 <div className="text-center p-3 bg-gray-50 rounded-lg">
//                                   <Activity className="h-5 w-5 text-gray-500 mx-auto mb-1" />
//                                   <div className="text-sm font-medium">{vehicle.mileage?.toLocaleString() || 0} km</div>
//                                 </div>
//                               </div>
                              
//                               <div className="flex items-center justify-between pt-4 border-t">
//                                 <div className="text-sm text-gray-500">
//                                   {vehicle.location} • {vehicle.transmission}
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <CustomTooltip content="Modifier">
//                                     <Button
//                                       size="icon"
//                                       variant="outline"
//                                       onClick={() => handleEditVehicle(vehicle)}
//                                     >
//                                       <Edit className="h-4 w-4" />
//                                     </Button>
//                                   </CustomTooltip>
                                  
//                                   <CustomTooltip content="Supprimer">
//                                     <Button
//                                       size="icon"
//                                       variant="outline"
//                                       onClick={() => setDeleteConfirm(vehicle.id)}
//                                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                   </CustomTooltip>
//                                 </div>
//                               </div>
//                             </CustomCardContent>
//                           </CustomCard>
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reservations Tab */}
//               {activeTab === 'reservations' && (
//                 <motion.div
//                   key="reservations"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   <CustomCard>
//                     <CustomCardHeader>
//                       <CustomCardTitle>Gestion des Réservations</CustomCardTitle>
//                       <CustomCardDescription>
//                         {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total
//                       </CustomCardDescription>
//                     </CustomCardHeader>
//                     <CustomCardContent>
//                       {loadingReservations ? (
//                         <LoadingSpinner />
//                       ) : reservations.length === 0 ? (
//                         <EmptyState
//                           icon={Calendar}
//                           title="Aucune réservation"
//                           description="Aucune réservation n'a été trouvée pour le moment."
//                           action={
//                             <Button
//                               onClick={fetchReservations}
//                               variant="outline"
//                             >
//                               <RefreshCw className="mr-2 h-4 w-4" />
//                               Rafraîchir
//                             </Button>
//                           }
//                         />
//                       ) : (
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {reservations.map((reservation) => (
//                                 <tr key={reservation.id} className="hover:bg-gray-50">
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {reservation.name}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {reservation.email}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {reservation.phone}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {reservation.vehicle}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {new Date(reservation.date).toLocaleDateString('fr-FR')}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <StatusBadge status={reservation.status} />
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                     <div className="flex space-x-2">
//                                       <CustomTooltip content="Confirmer">
//                                         <button
//                                           onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmée')}
//                                           className="text-green-600 hover:text-green-900"
//                                         >
//                                           <CheckCircle className="h-5 w-5" />
//                                         </button>
//                                       </CustomTooltip>
//                                       <CustomTooltip content="Annuler">
//                                         <button
//                                           onClick={() => handleUpdateReservationStatus(reservation.id, 'annulée')}
//                                           className="text-red-600 hover:text-red-900"
//                                         >
//                                           <XCircle className="h-5 w-5" />
//                                         </button>
//                                       </CustomTooltip>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       )}
//                     </CustomCardContent>
//                   </CustomCard>
//                 </motion.div>
//               )}

//               {/* Messages Tab */}
//               {activeTab === 'messages' && (
//                 <motion.div
//                   key="messages"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   <CustomCard>
//                     <CustomCardHeader>
//                       <CustomCardTitle>Messages de contact</CustomCardTitle>
//                       <CustomCardDescription>
//                         {contactMessages.length} message{contactMessages.length !== 1 ? 's' : ''} reçu{contactMessages.length !== 1 ? 's' : ''}
//                       </CustomCardDescription>
//                     </CustomCardHeader>
//                     <CustomCardContent>
//                       {loadingContactMessages ? (
//                         <LoadingSpinner />
//                       ) : contactMessages.length === 0 ? (
//                         <EmptyState
//                           icon={MessageSquare}
//                           title="Aucun message"
//                           description="Aucun message de contact n'a été reçu pour le moment."
//                           action={
//                             <Button
//                               onClick={fetchContactMessages}
//                               variant="outline"
//                             >
//                               <RefreshCw className="mr-2 h-4 w-4" />
//                               Rafraîchir
//                             </Button>
//                           }
//                         />
//                       ) : (
//                         <div className="space-y-4">
//                           {contactMessages.map((message) => (
//                             <div 
//                               key={message.id} 
//                               className={`border rounded-lg p-4 ${
//                                 message.status === 'non_lu' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
//                               }`}
//                             >
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h3 className="font-medium text-gray-900">
//                                     {message.name} 
//                                     <span className="ml-2 text-sm text-gray-500">{message.email}</span>
//                                     {message.phone && (
//                                       <span className="ml-2 text-sm text-gray-500">• {message.phone}</span>
//                                     )}
//                                   </h3>
//                                   <p className="text-sm text-gray-500 mt-1">
//                                     {new Date(message.created_at).toLocaleString('fr-FR', {
//                                       day: '2-digit',
//                                       month: '2-digit',
//                                       year: 'numeric',
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })}
//                                   </p>
//                                   <h4 className="font-medium text-gray-800 mt-2">{message.subject}</h4>
//                                   <p className="text-gray-700 mt-2 whitespace-pre-line">{message.message}</p>
//                                 </div>
//                                 <div className="flex space-x-2">
//                                   {message.status === 'non_lu' && (
//                                     <CustomTooltip content="Marquer comme lu">
//                                       <button
//                                         onClick={() => handleMarkMessageAsRead(message.id)}
//                                         className="text-gray-400 hover:text-blue-600"
//                                       >
//                                         <CheckCircle className="h-5 w-5" />
//                                       </button>
//                                     </CustomTooltip>
//                                   )}
//                                   <CustomTooltip content="Répondre">
//                                     <a
//                                       href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
//                                       className="text-gray-400 hover:text-blue-600"
//                                     >
//                                       <Mail className="h-5 w-5" />
//                                     </a>
//                                   </CustomTooltip>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </CustomCardContent>
//                   </CustomCard>
//                 </motion.div>
//               )}

//               {/* Account Tab */}
//               {activeTab === 'account' && (
//                 <motion.div
//                   key="account"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   <CustomCard>
//                     <CustomCardHeader>
//                       <CustomCardTitle>Mon Profil</CustomCardTitle>
//                       <CustomCardDescription>
//                         Gérez vos informations personnelles et vos paramètres de compte.
//                       </CustomCardDescription>
//                     </CustomCardHeader>
//                     <CustomCardContent className="space-y-8">
//                       <div className="space-y-6">
//                         <div className="flex items-center space-x-4">
//                           <div className="relative">
//                             <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                               <UserIcon className="h-10 w-10 text-blue-600" />
//                             </div>
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-medium text-gray-900">{profileForm.full_name || 'Utilisateur'}</h3>
//                             <p className="text-sm text-gray-500">{profileForm.email}</p>
//                             <p className="mt-1 text-sm text-gray-500">
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 <CheckCircle className="h-3 w-3 mr-1" />
//                                 {admin?.role === 'SuperAdmin' ? 'Super Administrateur' : 'Administrateur'}
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="border-t border-gray-200 pt-6">
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                             <Label htmlFor="full_name">Nom complet</Label>
//                             <Input
//                               id="full_name"
//                               value={profileForm.full_name}
//                               onChange={(e) => handleProfileChange('full_name', e.target.value)}
//                               className="mt-1"
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="email">Adresse e-mail</Label>
//                             <Input
//                               id="email"
//                               type="email"
//                               value={profileForm.email}
//                               onChange={(e) => handleProfileChange('email', e.target.value)}
//                               className="mt-1"
//                             />
//                           </div>
//                         </div>
//                         <div className="mt-6">
//                           <Button 
//                             onClick={handleUpdateProfile}
//                             disabled={isUpdatingProfile}
//                             className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
//                           >
//                             {isUpdatingProfile ? (
//                               <>
//                                 <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                                 Mise à jour...
//                               </>
//                             ) : (
//                               'Mettre à jour le profil'
//                             )}
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="border-t border-gray-200 pt-6">
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="current_password">Mot de passe actuel</Label>
//                             <div className="relative mt-1">
//                               <Input
//                                 id="current_password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={profileForm.currentPassword}
//                                 onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
//                               >
//                                 {showPassword ? (
//                                   <EyeOff className="h-5 w-5" />
//                                 ) : (
//                                   <Eye className="h-5 w-5" />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <Label htmlFor="new_password">Nouveau mot de passe</Label>
//                               <Input
//                                 id="new_password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={profileForm.newPassword}
//                                 onChange={(e) => handleProfileChange('newPassword', e.target.value)}
//                                 className="mt-1"
//                               />
//                             </div>
//                             <div>
//                               <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
//                               <Input
//                                 id="confirm_password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={profileForm.confirmPassword}
//                                 onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
//                                 className="mt-1"
//                               />
//                             </div>
//                           </div>
//                           <div>
//                             <Button 
//                               onClick={handleUpdatePassword}
//                               disabled={isUpdatingPassword}
//                               variant="outline"
//                               className="border-blue-200 text-blue-700 hover:bg-blue-50"
//                             >
//                               {isUpdatingPassword ? (
//                                 <>
//                                   <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                                   Mise à jour...
//                                 </>
//                               ) : (
//                                 'Changer le mot de passe'
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </CustomCardContent>
//                   </CustomCard>
//                 </motion.div>
//               )}

//               {/* Admins Tab - Only visible for SuperAdmin */}
//               {activeTab === 'admins' && admin?.role === 'SuperAdmin' && (
//                 <motion.div
//                   key="admins"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="space-y-6"
//                 >
//                   <CustomCard>
//                     <CustomCardHeader>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <CustomCardTitle>Gestion des administrateurs</CustomCardTitle>
//                           <CustomCardDescription>
//                             Gérez les comptes administrateurs et leurs autorisations.
//                           </CustomCardDescription>
//                         </div>
//                         <Button 
//                           onClick={() => {
//                             navigate("/admin/signup")
//                             // setAdminForm({
//                             //   email: '',
//                             //   full_name: '',
//                             //   role: 'admin',
//                             //   is_active: true
//                             // });
//                             // setAdminPassword('');
//                             // setEditingAdmin(null);
                          
//                           }}
//                           className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
//                         >
//                           <UserPlus className="mr-2 h-4 w-4 text-white " />
//                           Ajouter un administrateur
//                         </Button>
//                       </div>
//                     </CustomCardHeader>
//                     <CustomCardContent>
//                       {loadingAdmins ? (
//                         <LoadingSpinner />
//                       ) : admins.length === 0 ? (
//                         <EmptyState
//                           icon={Users}
//                           title="Aucun administrateur"
//                           description="Aucun administrateur n'a été trouvé."
//                           action={
//                             <Button
//                               onClick={fetchAdmins}
//                               variant="outline"
//                             >
//                               <RefreshCw className="mr-2 h-4 w-4" />
//                               Rafraîchir
//                             </Button>
//                           }
//                         />
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Admin List */}
//                           <div className="overflow-hidden border border-gray-200 rounded-lg">
//                             <table className="min-w-full divide-y divide-gray-200">
//                               <thead className="bg-gray-50">
//                                 <tr>
//                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Nom
//                                   </th>
//                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Email
//                                   </th>
//                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Rôle
//                                   </th>
//                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Statut
//                                   </th>
//                                   <th scope="col" className="relative px-6 py-3">
//                                     <span className="sr-only">Actions</span>
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className="bg-white divide-y divide-gray-200">
//                                 {admins.map((adminUser) => (
//                                   <tr key={adminUser.id} className={adminUser.id === admin.id ? 'bg-blue-50' : ''}>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <div className="flex items-center">
//                                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                           <UserIcon className="h-5 w-5 text-blue-600" />
//                                         </div>
//                                         <div className="ml-4">
//                                           <div className="text-sm font-medium text-gray-900">
//                                             {adminUser.full_name}
//                                             {adminUser.id === admin.id && (
//                                               <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                 Vous
//                                               </span>
//                                             )}
//                                           </div>
//                                           <div className="text-sm text-gray-500">
//                                             {new Date(adminUser.created_at).toLocaleDateString('fr-FR')}
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                       {adminUser.email}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         adminUser.role === 'SuperAdmin' 
//                                           ? 'bg-purple-100 text-purple-800' 
//                                           : 'bg-green-100 text-green-800'
//                                       }`}>
//                                         {adminUser.role === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
//                                       </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         adminUser.is_active 
//                                           ? 'bg-green-100 text-green-800' 
//                                           : 'bg-red-100 text-red-800'
//                                       }`}>
//                                         {adminUser.is_active ? 'Actif' : 'Désactivé'}
//                                       </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                       <div className="flex items-center justify-end space-x-2">
//                                         <CustomTooltip content="Modifier">
//                                           <button
//                                             onClick={() => {
//                                               setAdminForm({
//                                                 email: adminUser.email,
//                                                 full_name: adminUser.full_name,
//                                                 role: adminUser.role,
//                                                 is_active: adminUser.is_active
//                                               });
//                                               setEditingAdmin(adminUser.id);
//                                             }}
//                                             className="text-blue-600 hover:text-blue-900"
//                                           >
//                                             <Pencil className="h-4 w-4" />
//                                           </button>
//                                         </CustomTooltip>
                                        
//                                         <CustomTooltip content="Réinitialiser le mot de passe">
//                                           <button
//                                             onClick={() => handleResetAdminPassword(adminUser.id, adminUser.email)}
//                                             className="text-yellow-600 hover:text-yellow-900"
//                                           >
//                                             <Key className="h-4 w-4" />
//                                           </button>
//                                         </CustomTooltip>
                                        
//                                         {adminUser.id !== admin.id && (
//                                           <CustomTooltip content={adminUser.is_active ? 'Désactiver' : 'Activer'}>
//                                             <button
//                                               onClick={() => handleToggleAdminActive(adminUser.id, !adminUser.is_active)}
//                                               className={`${adminUser.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
//                                             >
//                                               {adminUser.is_active ? (
//                                                 <UserX className="h-4 w-4" />
//                                               ) : (
//                                                 <UserCheck className="h-4 w-4" />
//                                               )}
//                                             </button>
//                                           </CustomTooltip>
//                                         )}

//                                         {adminUser.id !== admin.id && (
//                                           <CustomTooltip content="Supprimer">
//                                             <button
//                                               onClick={() => handleDeleteAdmin(adminUser.id)}
//                                               className="text-red-600 hover:text-red-900"
//                                             >
//                                               <Trash2 className="h-4 w-4" />
//                                             </button>
//                                           </CustomTooltip>
//                                         )}
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>

//                           {/* Add/Edit Admin Form */}
//                           {(editingAdmin || !editingAdmin) && (
//                             <div className="mt-12">
//                               <CustomCard>
//                                 <CustomCardHeader>
//                                   <CustomCardTitle>
//                                     {editingAdmin ? 'Modifier un administrateur' : 'Ajouter un nouvel administrateur'}
//                                   </CustomCardTitle>
//                                   <CustomCardDescription>
//                                     {editingAdmin 
//                                       ? 'Mettez à jour les informations de l\'administrateur.'
//                                       : 'Remplissez les champs pour créer un nouveau compte administrateur.'}
//                                   </CustomCardDescription>
//                                 </CustomCardHeader>
//                                 <CustomCardContent>
//                                   <div className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                       <div>
//                                         <Label htmlFor="admin_full_name">Nom complet *</Label>
//                                         <Input
//                                           id="admin_full_name"
//                                           value={adminForm.full_name}
//                                           onChange={(e) => handleAdminFormChange('full_name', e.target.value)}
//                                           className="mt-1"
//                                           placeholder="Jean Dupont"
//                                           required
//                                         />
//                                       </div>
//                                       <div>
//                                         <Label htmlFor="admin_email">Adresse e-mail *</Label>
//                                         <Input
//   id="admin_email"
//   type="email"
//   value={adminForm.email || ''}
//   onChange={(e) => handleAdminFormChange('email', e.target.value)}
//   className="mt-1"
//   placeholder="admin@example.com"
//   disabled={!!editingAdmin}
//   required
// />
//                                       </div>
//                                     </div>
                                    
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                       <div>
//                                         <Label htmlFor="admin_role">Rôle</Label>
//                                         <select
//                                           id="admin_role"
//                                           value={adminForm.role}
//                                           onChange={(e) => handleAdminFormChange('role', e.target.value)}
//                                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                                         >
//                                           <option value="admin">Administrateur</option>
//                                           <option value="SuperAdmin">Super Administrateur</option>
//                                         </select>
//                                       </div>
//                                       <div>
//                                         <Label htmlFor="admin_status">Statut</Label>
//                                         <select
//                                           id="admin_status"
//                                           value={adminForm.is_active ? 'active' : 'inactive'}
//                                           onChange={(e) => handleAdminFormChange('is_active', e.target.value === 'active')}
//                                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                                         >
//                                           <option value="active">Actif</option>
//                                           <option value="inactive">Inactif</option>
//                                         </select>
//                                       </div>
//                                     </div>

//                                     {!editingAdmin && (
//                                       <div>
//                                         <Label htmlFor="admin_password">
//                                           Mot de passe {!editingAdmin && '*'}
//                                           <span className="text-xs text-gray-500 ml-1">(laisser vide pour générer un mot de passe aléatoire)</span>
//                                         </Label>
//                                         <div className="mt-1 relative">
//                                           <Input
//                                             id="admin_password"
//                                             type={showPassword ? 'text' : 'password'}
//                                             value={adminPassword}
//                                             onChange={(e) => setAdminPassword(e.target.value)}
//                                             placeholder="••••••••"
//                                           />
//                                           <button
//                                             type="button"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
//                                           >
//                                             {showPassword ? (
//                                               <EyeOff className="h-5 w-5" />
//                                             ) : (
//                                               <Eye className="h-5 w-5" />
//                                             )}
//                                           </button>
//                                         </div>
//                                       </div>
//                                     )}

//                                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                                       {editingAdmin && (
//                                         <Button
//                                           type="button"
//                                           variant="outline"
//                                           onClick={() => {
//                                             setEditingAdmin(null);
//                                             setAdminForm({
//                                               email: '',
//                                               full_name: '',
//                                               role: 'admin',
//                                               is_active: true
//                                             });
//                                           }}
//                                         >
//                                           Annuler
//                                         </Button>
//                                       )}
//                                       <Button
//                                         type="button"
//                                         onClick={editingAdmin ? () => handleUpdateAdmin(editingAdmin) : handleCreateAdmin}
//                                         disabled={submitting || !adminForm.email || !adminForm.full_name}
//                                         className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
//                                       >
//                                         {submitting ? (
//                                           <>
//                                             <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                                             {editingAdmin ? 'Mise à jour...' : 'Création...'}
//                                           </>
//                                         ) : editingAdmin ? (
//                                           'Mettre à jour l\'administrateur'
//                                         ) : (
//                                           'Créer l\'administrateur'
//                                         )}
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 </CustomCardContent>
//                               </CustomCard>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CustomCardContent>
//                   </CustomCard>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </main>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <CustomDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
//         <CustomDialogContent>
//           <CustomDialogHeader>
//             <CustomDialogTitle>Confirmer la suppression</CustomDialogTitle>
//             <CustomDialogDescription>
//               Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
//             </CustomDialogDescription>
//           </CustomDialogHeader>
//           <CustomDialogFooter>
//             <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
//               Annuler
//             </Button>
//             <Button variant="destructive" onClick={() => handleDeleteVehicle(deleteConfirm)}>
//               Supprimer
//             </Button>
//           </CustomDialogFooter>
//         </CustomDialogContent>
//       </CustomDialog>
//     </>
//   );
// };

// export default AdminPanel;



// AdminPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

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
import useProvideAuth from '@/hooks/useProvideAuth';

// Composants UI personnalisés
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
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
  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
    {children}
  </div>
);

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
      <CustomCardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">{value}</h3>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? '' : 'rotate-180'}`} />
                {change >= 0 ? '+' : ''}{change}%
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${color} ml-4`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </CustomCardContent>
    </CustomCard>
  </motion.div>
);

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Utiliser le hook personnalisé
  const {
    user,
    admin,
    loading: authLoading,
    logout,
    dashboardStats,
    fetchDashboardStats,
    admins,
    loadingAdmins,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminActive
  } = useProvideAuth();

  // États pour la gestion des véhicules
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les réservations
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  
  // États pour les messages de contact
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);
  
  // États pour la gestion des administrateurs
  const [adminForm, setAdminForm] = useState({
    email: '',
    full_name: '',
    role: 'admin',
    is_active: true
  });
  useEffect(() => {
    console.log('adminForm updated:', adminForm);
  }, [adminForm]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // État pour le profil utilisateur
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Formulaire initial pour les véhicules
  const initialVehicleForm = {
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
    features: [],
    is_available: true
  };

  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);

  // Options pour les sélecteurs
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
  const transmissions = ['Manuelle', 'Automatique', 'Séquentielle'];
  const locations = ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'];

  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles', label: 'Véhicules', icon: Car },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'account', label: 'Mon compte', icon: UserCog },
  ];

  // Ajouter l'onglet administrateurs seulement pour SuperAdmin
  if (admin?.role === 'SuperAdmin') {
    menuItems.push({ id: 'admins', label: 'Administrateurs', icon: Shield });
  }

  // Redirection si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/unauthorized', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  // Charger les données initiales
  useEffect(() => {
    if (user && admin) {
      loadInitialData();
    }
  }, [user, admin]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchVehicles(),
        fetchReservations(),
        fetchContactMessages(),
        fetchDashboardStats()
      ]);
      
      // Charger les administrateurs seulement si SuperAdmin
      if (admin?.role === 'SuperAdmin') {
        await fetchAdmins();
      }
      
      // Initialiser le formulaire de profil
      if (admin) {
        setProfileForm({
          full_name: admin.full_name || '',
          email: admin.email || user?.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données initiales:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les données initiales.'
      });
    }
  };

  // Charger les données spécifiques à l'onglet actif
  useEffect(() => {
    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case 'vehicles':
            await fetchVehicles();
            break;
          case 'reservations':
            await fetchReservations();
            break;
          case 'messages':
            await fetchContactMessages();
            break;
          case 'admins':
            if (admin?.role === 'SuperAdmin') {
              await fetchAdmins();
            }
            break;
          case 'dashboard':
            await fetchDashboardStats();
            break;
        }
      } catch (error) {
        console.error(`Erreur lors du chargement de l'onglet ${activeTab}:`, error);
      }
    };

    if (user && admin) {
      loadTabData();
    }
  }, [activeTab, user, admin]);

  // ============================================================================
  // GESTION DES VÉHICULES
  // ============================================================================
  const[totalVehicule, setTotalVehicule]=useState(0)
  const fetchVehicles = useCallback(async () => {
    setLoadingVehicles(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTotalVehicule(data.length)
      setVehicles(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les véhicules.'
      });
      throw error;
    } finally {
      setLoadingVehicles(false);
    }
  }, []);

  const handleVehicleInputChange = (field, value) => {
    setVehicleForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'image_url') {
      setImagePreview(value);
      setImageError(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const vehicleData = {
        make: vehicleForm.make.trim(),
        model: vehicleForm.model.trim(),
        year: parseInt(vehicleForm.year),
        price: parseFloat(vehicleForm.price),
        mileage: parseInt(vehicleForm.mileage),
        fuel_type: vehicleForm.fuel_type,
        transmission: vehicleForm.transmission,
        location: vehicleForm.location,
        description: vehicleForm.description.trim() || null,
        image_url: vehicleForm.image_url.trim(),
        features: vehicleForm.features,
        is_available: vehicleForm.is_available,
        updated_at: new Date().toISOString()
      };

      if (editingVehicle) {
        // Mise à jour
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle)
          .select();

        if (error) throw error;

        setVehicles(prev => 
          prev.map(v => v.id === editingVehicle ? { ...v, ...vehicleData } : v)
        );

        toast({
          title: 'Succès',
          description: 'Véhicule mis à jour avec succès.',
          className: 'bg-green-500 text-white'
        });
      } else {
        // Création
        vehicleData.created_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select();

        if (error) throw error;

        if (data?.[0]) {
          setVehicles(prev => [data[0], ...prev]);
        }

        toast({
          title: 'Succès',
          description: 'Véhicule ajouté avec succès.',
          className: 'bg-green-500 text-white'
        });
      }

      resetVehicleForm();
      setShowVehicleForm(false);
      await fetchDashboardStats();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setVehicleForm({
      ...vehicle,
      year: vehicle.year?.toString() || new Date().getFullYear().toString(),
      price: vehicle.price?.toString() || '',
      mileage: vehicle.mileage?.toString() || '',
      fuel_type: vehicle.fuel_type || 'Essence',
      transmission: vehicle.transmission || 'Manuelle',
      location: vehicle.location || 'Bruxelles',
      description: vehicle.description || '',
      image_url: vehicle.image_url || '',
      features: vehicle.features || [],
      is_available: vehicle.is_available !== false
    });
    setEditingVehicle(vehicle.id);
    setShowVehicleForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: 'Succès',
        description: 'Véhicule supprimé avec succès.',
        className: 'bg-green-500 text-white'
      });
      
      await fetchDashboardStats();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le véhicule.'
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetVehicleForm = () => {
    setVehicleForm(initialVehicleForm);
    setEditingVehicle(null);
    setShowVehicleForm(false);
    setImagePreview('');
    setImageError(false);
  };

  // ============================================================================
  // GESTION DES RÉSERVATIONS
  // ============================================================================
  const[totalRservation, setTotalRservation]=useState(0)
  const fetchReservations = useCallback(async () => {
    setLoadingReservations(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
       setTotalRservation(data.length)
      setReservations(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les réservations.'
      });
      throw error;
    } finally {
      setLoadingReservations(false);
    }
  }, []);

  const handleUpdateReservationStatus = async (id, status) => {
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
        title: 'Succès',
        description: `Statut mis à jour avec succès.`,
        className: 'bg-green-500 text-white'
      });
      
      await fetchDashboardStats();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut.'
      });
    }
  };

  // ============================================================================
  // GESTION DES MESSAGES
  // ============================================================================

  const fetchContactMessages = useCallback(async () => {
    setLoadingContactMessages(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setContactMessages(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les messages.'
      });
      throw error;
    } finally {
      setLoadingContactMessages(false);
    }
  }, []);

  const handleMarkMessageAsRead = async (id) => {
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
        description: 'Message marqué comme lu.',
        className: 'bg-green-500 text-white'
      });
      
      await fetchDashboardStats();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le message.'
      });
    }
  };

  // ============================================================================
  // GESTION DES ADMINISTRATEURS
  // ============================================================================

  const handleAdminFormChange = (field, value) => {
    setAdminForm(prev => ({
      ...prev,
      [field]: value
    }));
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
      
      const password = adminPassword || generateRandomPassword();
      
      await createAdmin({
        email: adminForm.email,
        password: password,
        full_name: adminForm.full_name,
        role: adminForm.role
      });

      // Réinitialiser le formulaire
      setAdminForm({
        email: '',
        full_name: '',
        role: 'admin',
        is_active: true
      });
      setAdminPassword('');
      setEditingAdmin(null);

      if (!adminPassword) {
        toast({
          title: 'Information',
          description: `Mot de passe généré: ${password}`,
          className: 'bg-blue-500 text-white'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (adminId) => {
    try {
      setSubmitting(true);
      
      await updateAdmin(adminId, {
        full_name: adminForm.full_name,
        role: adminForm.role,
        is_active: adminForm.is_active
      });

      // Réinitialiser le formulaire
      setAdminForm({
        email: '',
        full_name: '',
        role: 'admin',
        is_active: true
      });
      setEditingAdmin(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (adminId === admin?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous ne pouvez pas supprimer votre propre compte.'
      });
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return;
    }

    try {
      await deleteAdmin(adminId);
      
      // Si on supprime l'admin en cours d'édition, réinitialiser le formulaire
      if (editingAdmin === adminId) {
        setAdminForm({
          email: '',
          full_name: '',
          role: 'admin',
          is_active: true
        });
        setEditingAdmin(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    }
  };

  const handleToggleAdminActive = async (adminId, isActive) => {
    try {
      await toggleAdminActive(adminId, isActive);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    }
  };

  const handleResetAdminPassword = async (adminId, email) => {
    const newPassword = prompt('Entrez le nouveau mot de passe (laissez vide pour générer un mot de passe aléatoire)');
    if (newPassword === null) return;

    try {
      const password = newPassword || generateRandomPassword();
      
      // Update password in auth
      const { error: authError } = await supabase.auth.admin.updateUserById(adminId, {
        password: password
      });

      if (authError) throw authError;

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
        description: error.message || 'Une erreur est survenue.'
      });
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // ============================================================================
  // GESTION DU PROFIL UTILISATEUR
  // ============================================================================

  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.full_name) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
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
        title: 'Succès',
        description: 'Profil mis à jour avec succès.',
        className: 'bg-green-500 text-white'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez saisir tous les champs.'
      });
      return;
    }

    if (profileForm.newPassword !== profileForm.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.'
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
        title: 'Succès',
        description: 'Mot de passe mis à jour avec succès.',
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
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ============================================================================
  // COMPOSANTS UTILITAIRES
  // ============================================================================

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
      <CustomBadge className={config.color}>
        {config.label}
      </CustomBadge>
    );
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.'
    });
  };

  // Filtre des véhicules
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

  // ============================================================================
  // RENDU
  // ============================================================================

  // Afficher le chargement initial
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1F4E79]"></div>
      </div>
    );
  }

  // Rediriger si non connecté
  if (!user || !admin) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      <div>
        <title>Admin Panel - VALTRANSAUTO</title>
        <meta name="description" content="Administration des véhicules VALTRANSAUTO" />
      </div>

      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Sidebar - Cachée sur mobile, affichée via un menu hamburger */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`bg-gradient-to-b from-[#1F4E79] to-[#2A5F8A] text-white flex flex-col fixed left-0 top-0 h-screen z-50 shadow-2xl transition-all duration-300 ${
            sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Logo */}
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 relative">
                      <img 
                        src={logoUrl} 
                        alt="Logo" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      VALTRANSAUTO
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70">Admin Pro</p>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF0C00] to-[#FF4D4D] text-white shadow-lg'
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-3 whitespace-nowrap font-medium text-sm sm:text-base"
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
          <div className="p-3 sm:p-4 border-t border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-semibold truncate text-sm sm:text-base">{admin?.full_name || 'Administrateur'}</p>
                  <p className="text-xs sm:text-sm text-white/60 truncate">{admin?.email || user?.email}</p>
                  <p className="text-xs text-white/40 truncate">
                    {admin?.role === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
                  </p>
                </motion.div>
              )}
              <CustomTooltip content="Déconnexion">
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <LogOut size={16} className="sm:w-5 sm:h-5" />
                </button>
              </CustomTooltip>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${
            sidebarCollapsed ? 'lg:ml-16 sm:ml-20' : 'lg:ml-64'
          } ${isMobileMenuOpen ? 'ml-64' : ''}`}
        >
          {/* Top Bar */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Menu hamburger pour mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {activeTab === 'dashboard' && 'Tableau de bord'}
                    {activeTab === 'vehicles' && 'Véhicules'}
                    {activeTab === 'reservations' && 'Réservations'}
                    {activeTab === 'messages' && 'Messages'}
                    {activeTab === 'account' && 'Mon compte'}
                    {activeTab === 'admins' && 'Administrateurs'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate max-w-[200px] sm:max-w-none">
                    {activeTab === 'dashboard' && 'Aperçu global de votre activité'}
                    {activeTab === 'vehicles' && 'Gérez votre parc automobile'}
                    {activeTab === 'reservations' && 'Suivez toutes les réservations'}
                    {activeTab === 'messages' && 'Consultez les messages clients'}
                    {activeTab === 'account' && 'Gérez vos informations personnelles'}
                    {activeTab === 'admins' && 'Gérez les comptes administrateurs'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 sm:pl-10 w-32 sm:w-40 md:w-64 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Stats Grid - DONNÉES RÉELLES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <StatCard
                      title="Véhicules total"
                      value={dashboardStats.totalVehicles === 0? totalVehicule : dashboardStats.totalVehicles}
                      icon={CarFront}
                      change={dashboardStats.monthlyGrowth}
                      color="bg-blue-500"
                    />
                    <StatCard
                      title="Réservations"
                      value={dashboardStats.totalReservations ===0? totalRservation : dashboardStats.totalReservations }
                      icon={Calendar}
                      change={8.2}
                      color="bg-green-500"
                    />
                    <StatCard
                      title="Messages en attente"
                      value={dashboardStats.pendingMessages}
                      icon={MessageSquare}
                      change={-3.1}
                      color="bg-orange-500"
                    />
                  </div>

                  {/* Recent Activity & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Recent Reservations */}
                    <CustomCard className="lg:col-span-2">
                      <CustomCardHeader className="p-4 sm:p-6">
                        <CustomCardTitle className="text-lg sm:text-xl">Réservations récentes</CustomCardTitle>
                        <CustomCardDescription className="text-sm">Les 5 dernières réservations</CustomCardDescription>
                      </CustomCardHeader>
                      <CustomCardContent className="p-4 sm:p-6">
                        {reservations.slice(0, 5).map((reservation, index) => (
                          <motion.div
                            key={reservation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm sm:text-base truncate">{reservation.name}</p>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{reservation.vehicle}</p>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <div className="mb-1">
                                <StatusBadge status={reservation.status} />
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(reservation.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </CustomCardContent>
                    </CustomCard>

                    {/* Quick Actions */}
                    <CustomCard>
                      <CustomCardHeader className="p-4 sm:p-6">
                        <CustomCardTitle className="text-lg sm:text-xl">Actions rapides</CustomCardTitle>
                        <CustomCardDescription className="text-sm">Accès direct aux fonctionnalités</CustomCardDescription>
                      </CustomCardHeader>
                      <CustomCardContent className="p-4 sm:p-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Button 
                            onClick={() => setActiveTab('vehicles')}
                            className="w-full justify-start text-sm sm:text-base"
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un véhicule
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('reservations')}
                            className="w-full justify-start text-sm sm:text-base"
                            variant="outline"
                            size="sm"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Voir les réservations
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('messages')}
                            className="w-full justify-start text-sm sm:text-base"
                            variant="outline"
                            size="sm"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Consulter les messages
                          </Button>
                        </div>
                      </CustomCardContent>
                    </CustomCard>
                  </div>
                </motion.div>
              )}

              {/* Vehicles Tab */}
              {activeTab === 'vehicles' && (
                <motion.div
                  key="vehicles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Header with Stats */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-full">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gestion des Véhicules</h1>
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                        <CustomBadge variant="outline" className="text-xs sm:text-sm">
                          {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}
                        </CustomBadge>
                        <CustomBadge variant="secondary" className="text-xs sm:text-sm">
                          {filteredVehicles.length} visible{filteredVehicles.length !== 1 ? 's' : ''}
                        </CustomBadge>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto mt-3 sm:mt-0">
                      <Button
                        onClick={() => {
                          setShowVehicleForm(!showVehicleForm);
                          if (editingVehicle) resetVehicleForm();
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#1F4E79] to-[#2A5F8A] hover:from-[#2A5F8A] hover:to-[#1F4E79] text-white shadow-lg text-sm sm:text-base"
                        size="sm"
                      >
                        {showVehicleForm ? (
                          <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                        <span className="ml-2">{showVehicleForm ? 'Fermer' : 'Ajouter un véhicule'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Vehicle Form */}
                  <AnimatePresence>
                    {showVehicleForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-4 sm:p-6">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                            {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
                          </h2>
                          
                          <form onSubmit={handleVehicleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              {/* Colonne gauche */}
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <Label htmlFor="make" className="text-sm sm:text-base">Marque *</Label>
                                  <Input
                                    id="make"
                                    value={vehicleForm.make}
                                    onChange={(e) => handleVehicleInputChange('make', e.target.value)}
                                    placeholder="Ex: Toyota"
                                    className="mt-1 text-sm sm:text-base"
                                    required
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="model" className="text-sm sm:text-base">Modèle *</Label>
                                  <Input
                                    id="model"
                                    value={vehicleForm.model}
                                    onChange={(e) => handleVehicleInputChange('model', e.target.value)}
                                    placeholder="Ex: Corolla"
                                    className="mt-1 text-sm sm:text-base"
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <div>
                                    <Label htmlFor="year" className="text-sm sm:text-base">Année *</Label>
                                    <Input
                                      type="number"
                                      id="year"
                                      min="1990"
                                      max={new Date().getFullYear() + 1}
                                      value={vehicleForm.year}
                                      onChange={(e) => handleVehicleInputChange('year', e.target.value)}
                                      className="mt-1 text-sm sm:text-base"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="price" className="text-sm sm:text-base">Prix (€) *</Label>
                                    <div className="relative mt-1">
                                      <Input
                                        type="number"
                                        id="price"
                                        min="0"
                                        step="0.01"
                                        value={vehicleForm.price}
                                        onChange={(e) => handleVehicleInputChange('price', e.target.value)}
                                        className="pl-8 text-sm sm:text-base"
                                        required
                                      />
                                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <div>
                                    <Label htmlFor="fuel_type" className="text-sm sm:text-base">Carburant *</Label>
                                    <select
                                      id="fuel_type"
                                      value={vehicleForm.fuel_type}
                                      onChange={(e) => handleVehicleInputChange('fuel_type', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1 text-sm sm:text-base"
                                      required
                                    >
                                      {fuelTypes.map((type) => (
                                        <option key={type} value={type}>
                                          {type}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <Label htmlFor="transmission" className="text-sm sm:text-base">Transmission *</Label>
                                    <select
                                      id="transmission"
                                      value={vehicleForm.transmission}
                                      onChange={(e) => handleVehicleInputChange('transmission', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1 text-sm sm:text-base"
                                      required
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
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <Label className="text-sm sm:text-base">Image du véhicule *</Label>
                                  <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="relative w-full sm:w-32 h-40 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
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
                                    <div className="flex-1 w-full">
                                      <Input
                                        type="url"
                                        placeholder="URL de l'image"
                                        value={vehicleForm.image_url}
                                        onChange={(e) => handleVehicleInputChange('image_url', e.target.value)}
                                        className={imageError ? 'border-red-500' : ''}
                                        required
                                      />
                                      {imageError && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                          Impossible de charger l'image. Vérifiez l'URL.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="location" className="text-sm sm:text-base">Localisation *</Label>
                                  <select
                                    id="location"
                                    value={vehicleForm.location}
                                    onChange={(e) => handleVehicleInputChange('location', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] mt-1 text-sm sm:text-base"
                                    required
                                  >
                                    {locations.map((loc) => (
                                      <option key={loc} value={loc}>
                                        {loc}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <Label htmlFor="mileage" className="text-sm sm:text-base">Kilométrage (km) *</Label>
                                  <Input
                                    type="number"
                                    id="mileage"
                                    min="0"
                                    value={vehicleForm.mileage}
                                    onChange={(e) => handleVehicleInputChange('mileage', e.target.value)}
                                    className="mt-1 text-sm sm:text-base"
                                    required
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                                  <Textarea
                                    id="description"
                                    rows={3}
                                    value={vehicleForm.description}
                                    onChange={(e) => handleVehicleInputChange('description', e.target.value)}
                                    placeholder="Description détaillée du véhicule..."
                                    className="mt-1 text-sm sm:text-base"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowVehicleForm(false);
                                  resetVehicleForm();
                                }}
                                disabled={submitting}
                                className="w-full sm:w-auto"
                                size="sm"
                              >
                                Annuler
                              </Button>
                              <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 w-full sm:w-auto"
                                size="sm"
                              >
                                {submitting ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                    {editingVehicle ? 'Mise à jour...' : 'Ajout en cours...'}
                                  </>
                                ) : (
                                  <>{editingVehicle ? 'Mettre à jour' : 'Ajouter le véhicule'}</>
                                )}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Vehicles Grid */}
                  {loadingVehicles ? (
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
                            setShowVehicleForm(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un véhicule
                        </Button>
                      )}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredVehicles.map((vehicle, index) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -5 }}
                        >
                          <CustomCard className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                              <img
                                src={vehicle.image_url || 'https://via.placeholder.com/400x300'}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/400x300';
                                }}
                              />
                              <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                                <CustomBadge variant={vehicle.is_available ? "default" : "secondary"} className="text-xs">
                                  {vehicle.is_available ? 'Disponible' : 'Indisponible'}
                                </CustomBadge>
                              </div>
                            </div>
                            <CustomCardContent className="p-4 sm:p-6">
                              <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="min-w-0">
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                    {vehicle.make} {vehicle.model}
                                  </h3>
                                  <p className="text-gray-500 text-sm">{vehicle.year}</p>
                                </div>
                                <div className="text-right ml-2">
                                  <div className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR',
                                      maximumFractionDigits: 0
                                    }).format(vehicle.price)}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500">TTC/jour</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mx-auto mb-1" />
                                  <div className="text-xs sm:text-sm font-medium">{vehicle.fuel_type}</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mx-auto mb-1" />
                                  <div className="text-xs sm:text-sm font-medium">{vehicle.mileage?.toLocaleString() || 0} km</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t">
                                <div className="text-xs sm:text-sm text-gray-500 truncate">
                                  {vehicle.location} • {vehicle.transmission}
                                </div>
                                <div className="flex gap-1 sm:gap-2">
                                  <CustomTooltip content="Modifier">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => handleEditVehicle(vehicle)}
                                      className="h-8 w-8 sm:h-9 sm:w-9"
                                    >
                                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                  </CustomTooltip>
                                  
                                  <CustomTooltip content="Supprimer">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setDeleteConfirm(vehicle.id)}
                                      className="h-8 w-8 sm:h-9 sm:w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  className="space-y-4 sm:space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader className="p-4 sm:p-6">
                      <CustomCardTitle className="text-lg sm:text-xl">Gestion des Réservations</CustomCardTitle>
                      <CustomCardDescription className="text-sm">
                        {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent className="p-0 sm:p-6">
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
                              size="sm"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {reservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50">
                                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex flex-col">
                                      <span>{reservation.name}</span>
                                      <span className="text-xs text-gray-500 sm:hidden">{reservation.email}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    {reservation.email}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {reservation.phone}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <span className="truncate max-w-[100px] block">{reservation.vehicle}</span>
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(reservation.date).toLocaleDateString('fr-FR')}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <StatusBadge status={reservation.status} />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-1 sm:space-x-2">
                                      <CustomTooltip content="Confirmer">
                                        <button
                                          onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmée')}
                                          className="text-green-600 hover:text-green-900 p-1"
                                        >
                                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                      </CustomTooltip>
                                      <CustomTooltip content="Annuler">
                                        <button
                                          onClick={() => handleUpdateReservationStatus(reservation.id, 'annulée')}
                                          className="text-red-600 hover:text-red-900 p-1"
                                        >
                                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  className="space-y-4 sm:space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader className="p-4 sm:p-6">
                      <CustomCardTitle className="text-lg sm:text-xl">Messages de contact</CustomCardTitle>
                      <CustomCardDescription className="text-sm">
                        {contactMessages.length} message{contactMessages.length !== 1 ? 's' : ''} reçu{contactMessages.length !== 1 ? 's' : ''}
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent className="p-4 sm:p-6">
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
                              size="sm"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {contactMessages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`border rounded-lg p-3 sm:p-4 ${
                                message.status === 'non_lu' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{message.name}</h3>
                                    <span className="text-xs sm:text-sm text-gray-500">{message.email}</span>
                                    {message.phone && (
                                      <span className="text-xs sm:text-sm text-gray-500">• {message.phone}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {new Date(message.created_at).toLocaleString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-1">{message.subject}</h4>
                                  <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line break-words">{message.message}</p>
                                </div>
                                <div className="flex space-x-2 sm:space-x-2 self-end sm:self-start">
                                  {message.status === 'non_lu' && (
                                    <CustomTooltip content="Marquer comme lu">
                                      <button
                                        onClick={() => handleMarkMessageAsRead(message.id)}
                                        className="text-gray-400 hover:text-blue-600 p-1"
                                      >
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                      </button>
                                    </CustomTooltip>
                                  )}
                                  <CustomTooltip content="Répondre">
                                    <a
                                      href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                                      className="text-gray-400 hover:text-blue-600 p-1"
                                    >
                                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  className="space-y-4 sm:space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader className="p-4 sm:p-6">
                      <CustomCardTitle className="text-lg sm:text-xl">Mon Profil</CustomCardTitle>
                      <CustomCardDescription className="text-sm">
                        Gérez vos informations personnelles et vos paramètres de compte.
                      </CustomCardDescription>
                    </CustomCardHeader>
                    <CustomCardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="relative">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">{profileForm.full_name || 'Utilisateur'}</h3>
                            <p className="text-sm text-gray-500">{profileForm.email}</p>
                            <p className="mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {admin?.role === 'SuperAdmin' ? 'Super Administrateur' : 'Administrateur'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 sm:pt-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <Label htmlFor="full_name" className="text-sm sm:text-base">Nom complet</Label>
                            <Input
                              id="full_name"
                              value={profileForm.full_name}
                              onChange={(e) => handleProfileChange('full_name', e.target.value)}
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm sm:text-base">Adresse e-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-6">
                          <Button 
                            onClick={handleUpdateProfile}
                            disabled={isUpdatingProfile}
                            className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 w-full sm:w-auto"
                            size="sm"
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

                      <div className="border-t border-gray-200 pt-4 sm:pt-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Changer le mot de passe</h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <Label htmlFor="current_password" className="text-sm sm:text-base">Mot de passe actuel</Label>
                            <div className="relative mt-1">
                              <Input
                                id="current_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.currentPassword}
                                onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                                className="text-sm sm:text-base"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label htmlFor="new_password" className="text-sm sm:text-base">Nouveau mot de passe</Label>
                              <Input
                                id="new_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.newPassword}
                                onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                                className="mt-1 text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirm_password" className="text-sm sm:text-base">Confirmer le mot de passe</Label>
                              <Input
                                id="confirm_password"
                                type={showPassword ? 'text' : 'password'}
                                value={profileForm.confirmPassword}
                                onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                                className="mt-1 text-sm sm:text-base"
                              />
                            </div>
                          </div>
                          <div>
                            <Button 
                              onClick={handleUpdatePassword}
                              disabled={isUpdatingPassword}
                              variant="outline"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
                              size="sm"
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
                    </CustomCardContent>
                  </CustomCard>
                </motion.div>
              )}

              {/* Admins Tab - Only visible for SuperAdmin */}
              {activeTab === 'admins' && admin?.role === 'SuperAdmin' && (
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <CustomCard>
                    <CustomCardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                          <CustomCardTitle className="text-lg sm:text-xl">Gestion des administrateurs</CustomCardTitle>
                          <CustomCardDescription className="text-sm">
                            Gérez les comptes administrateurs et leurs autorisations.
                          </CustomCardDescription>
                        </div>
                        <Button 
                          onClick={() => {
                            navigate("/admin/signup")
                          }}
                          className="bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white w-full sm:w-auto"
                          size="sm"
                        >
                          <UserPlus className="mr-2 h-4 w-4 text-white" />
                          Ajouter un administrateur
                        </Button>
                      </div>
                    </CustomCardHeader>
                    <CustomCardContent className="p-4 sm:p-6">
                      {loadingAdmins ? (
                        <LoadingSpinner />
                      ) : admins.length === 0 ? (
                        <EmptyState
                          icon={Users}
                          title="Aucun administrateur"
                          description="Aucun administrateur n'a été trouvé."
                          action={
                            <Button
                              onClick={fetchAdmins}
                              variant="outline"
                              size="sm"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rafraîchir
                            </Button>
                          }
                        />
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
                          {/* Admin List */}
                          <div className="overflow-hidden border border-gray-200 rounded-lg -mx-2 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                  </th>
                                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Email
                                  </th>
                                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rôle
                                  </th>
                                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                  </th>
                                  <th scope="col" className="relative px-3 py-3">
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map((adminUser) => (
                                  <tr key={adminUser.id} className={adminUser.id === admin.id ? 'bg-blue-50' : ''}>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                          <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            <div className="flex items-center">
                                              <span className="truncate max-w-[120px] sm:max-w-none">{adminUser.full_name}</span>
                                              {adminUser.id === admin.id && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                  Vous
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-xs text-gray-500 sm:hidden truncate max-w-[120px]">
                                            {adminUser.email}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {new Date(adminUser.created_at).toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                      {adminUser.email}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        adminUser.role === 'SuperAdmin' 
                                          ? 'bg-purple-100 text-purple-800' 
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {adminUser.role === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        adminUser.is_active 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {adminUser.is_active ? 'Actif' : 'Désactivé'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                                        <CustomTooltip content="Modifier">
                                          <button
                                            onClick={() => {
                                              setAdminForm({
                                                email: adminUser.email,
                                                full_name: adminUser.full_name,
                                                role: adminUser.role,
                                                is_active: adminUser.is_active
                                              });
                                              setEditingAdmin(adminUser.id);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </button>
                                        </CustomTooltip>
                                        
                                        <CustomTooltip content="Réinitialiser le mot de passe">
                                          <button
                                            onClick={() => handleResetAdminPassword(adminUser.id, adminUser.email)}
                                            className="text-yellow-600 hover:text-yellow-900 p-1"
                                          >
                                            <Key className="h-4 w-4" />
                                          </button>
                                        </CustomTooltip>
                                        
                                        {adminUser.id !== admin.id && (
                                          <CustomTooltip content={adminUser.is_active ? 'Désactiver' : 'Activer'}>
                                            <button
                                              onClick={() => handleToggleAdminActive(adminUser.id, !adminUser.is_active)}
                                              className={`${adminUser.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} p-1`}
                                            >
                                              {adminUser.is_active ? (
                                                <UserX className="h-4 w-4" />
                                              ) : (
                                                <UserCheck className="h-4 w-4" />
                                              )}
                                            </button>
                                          </CustomTooltip>
                                        )}

                                        {adminUser.id !== admin.id && (
                                          <CustomTooltip content="Supprimer">
                                            <button
                                              onClick={() => handleDeleteAdmin(adminUser.id)}
                                              className="text-red-600 hover:text-red-900 p-1"
                                            >
                                              <Trash2 className="h-4 w-4" />
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
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} size="sm">
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteVehicle(deleteConfirm)} size="sm">
              Supprimer
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
};

export default AdminPanel;