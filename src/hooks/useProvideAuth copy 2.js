// hooks/useProvideAuth.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export default function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalVehicles: 0,
    totalReservations: 0,
    totalRevenue: 0,
    pendingMessages: 0,
    activeReservations: 0,
    monthlyGrowth: 0
  });

  // 🔹 Initialisation : récupération session + admin_users
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchAdminProfile(currentUser.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchAdminProfile(currentUser.id);
      } else {
        setAdmin(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Récupérer le profil admin
  const fetchAdminProfile = async (userId) => {
    try {
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setAdmin(adminData ?? null);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil admin:', error);
      setAdmin(null);
    }
  };

  // 🔹 Récupérer les statistiques réelles
  const fetchDashboardStats = useCallback(async () => {
    try {
      // Récupérer tous les véhicules
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, price');

      if (vehiclesError) throw vehiclesError;

      // Récupérer toutes les réservations
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('id, status, vehicle');

      if (reservationsError) throw reservationsError;

      // Récupérer les messages non lus
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('id')
        .eq('is_read', false);

      if (messagesError) throw messagesError;

      // Calculer le revenu total
      const totalRevenue = reservations.reduce((sum, reservation) => {
        // Si vehicle_price existe dans la réservation, l'utiliser
        // Sinon, chercher le prix dans les véhicules
        
          const vehicle = vehicles.find(v => v.id === reservation.vehicle);
          return sum + (vehicle?.price || 0);
        
        // return sum;
      }, 0);

      // Réservations actives (confirmées)
      const activeReservations = reservations.filter(r => 
        r.status === 'confirmed' || r.status === 'confirmée'
      ).length;

      // Calculer la croissance mensuelle (placeholder - à adapter)
      const monthlyGrowth = reservations.length > 0 ? 
        ((reservations.filter(r => {
          const reservationDate = new Date(r.created_at || r.date);
          const now = new Date();
          return reservationDate.getMonth() === now.getMonth() && 
                 reservationDate.getFullYear() === now.getFullYear();
        }).length / reservations.length) * 100).toFixed(1) : 0;

      setDashboardStats({
        totalVehicles: vehicles.length || 0,
        totalReservations: reservations.length || 0,
        totalRevenue: totalRevenue || 0,
        pendingMessages: messages.length || 0,
        activeReservations: activeReservations || 0,
        monthlyGrowth: parseFloat(monthlyGrowth) || 0
      });

      return {
        totalVehicles: vehicles.length,
        totalReservations: reservations.length,
        totalRevenue,
        pendingMessages: messages.length,
        activeReservations,
        monthlyGrowth: parseFloat(monthlyGrowth)
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      return dashboardStats;
    }
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Veuillez fournir un email et un mot de passe");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(),
      password: password
    });
    
    if (error) throw error;

    if (!data?.user) {
      throw new Error("Aucun utilisateur trouvé après connexion");
    }

    setUser(data.user);

    // Vérifier que l'utilisateur est bien un admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      throw new Error("Accès non autorisé. Seuls les administrateurs peuvent se connecter.");
    }

    setAdmin(adminData);
    return data;
  };

  // 🔹 Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setAdmin(null);
    setAdmins([]);
    setDashboardStats({
      totalVehicles: 0,
      totalReservations: 0,
      totalRevenue: 0,
      pendingMessages: 0,
      activeReservations: 0,
      monthlyGrowth: 0
    });
    
    window.location.href = '/admin/login';
  };

  // 🔹 Récupérer tous les administrateurs (seulement pour SuperAdmin)
  const fetchAdmins = useCallback(async () => {
    if (admin?.role !== 'SuperAdmin') {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous n\'avez pas les permissions nécessaires.'
      });
      return [];
    }

    try {
      setLoadingAdmins(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAdmins(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger la liste des administrateurs.'
      });
      throw error;
    } finally {
      setLoadingAdmins(false);
    }
  }, [admin]);

  // 🔹 Créer un nouvel administrateur (seulement SuperAdmin)
  const createAdmin = async ({ email, password, full_name, role = 'admin' }) => {
    if (admin?.role !== 'SuperAdmin') {
      throw new Error('Seuls les SuperAdmin peuvent créer des administrateurs');
    }

    try {
      // 1. Créer l'utilisateur dans l'authentification
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role
        }
      });

      if (authError) throw authError;

      // 2. Créer l'entrée dans la table admin_users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .insert([{
          id: authData.user.id,
          email,
          full_name,
          role,
          is_active: true
        }])
        .select()
        .single();

      if (adminError) throw adminError;

      // 3. Mettre à jour la liste des administrateurs
      await fetchAdmins();
      
      toast({
        title: 'Succès',
        description: 'Administrateur créé avec succès.'
      });

      return adminData;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  // 🔹 Mettre à jour un administrateur (seulement SuperAdmin)
  const updateAdmin = async (id, updates) => {
    if (admin?.role !== 'SuperAdmin') {
      throw new Error('Seuls les SuperAdmin peuvent modifier des administrateurs');
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour les métadonnées de l'utilisateur si nécessaire
      if (updates.full_name || updates.role) {
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            full_name: updates.full_name,
            role: updates.role
          }
        });
      }

      // Mettre à jour la liste des administrateurs
      await fetchAdmins();
      
      toast({
        title: 'Succès',
        description: 'Administrateur mis à jour avec succès.'
      });
      
      return data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  };

  // 🔹 Supprimer un administrateur (seulement SuperAdmin)
  const deleteAdmin = async (id) => {
    if (admin?.role !== 'SuperAdmin') {
      throw new Error('Seuls les SuperAdmin peuvent supprimer des administrateurs');
    }

    if (id === admin?.id) {
      throw new Error('Vous ne pouvez pas supprimer votre propre compte');
    }

    try {
      // Supprimer d'abord l'utilisateur de l'authentification
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // Puis supprimer de la table admin_users
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      // Mettre à jour la liste des administrateurs
      await fetchAdmins();
      
      toast({
        title: 'Succès',
        description: 'Administrateur supprimé avec succès.'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  };

  // 🔹 Activer / Désactiver un administrateur
  const toggleAdminActive = async (id, isActive) => {
    if (admin?.role !== 'SuperAdmin') {
      throw new Error('Seuls les SuperAdmin peuvent modifier le statut des administrateurs');
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Mettre à jour la liste des administrateurs
      await fetchAdmins();
      
      return data;
    } catch (error) {
      console.error('Error toggling admin active status:', error);
      throw error;
    }
  };

  return {
    // Authentication
    user,
    admin,
    loading,
    login,
    logout,
    
    // Dashboard
    dashboardStats,
    fetchDashboardStats,
    
    // Admin management (uniquement pour SuperAdmin)
    admins,
    loadingAdmins,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminActive
  };
}