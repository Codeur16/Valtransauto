// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/customSupabaseClient';

// export default function useProvideAuth() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setUser(data.session?.user ?? null);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const register = async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//     return data;
//   };

//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//     setUser(data.user);
//     return data;
//   };

//   const logout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//     setUser(null);
//     // navigation vers le login
//     window.location.href = '/admin/login';
//   };

//   return { user, loading, register, login, logout };
// }




import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export default function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // 🔹 Initialisation : récupération session + admin_users
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        setAdmin(adminData ?? null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        setAdmin(adminData ?? null);
      } else {
        setAdmin(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Register admin
  const registerAdmin = async ({ email, password, full_name, role = 'admin' }) => {
    // 1️⃣ Créer l’utilisateur Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user.id;

    // 2️⃣ Créer l’entrée admin_users
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: userId,
          email,
          full_name,
          role,
          is_active: true,
        }
      ]);

    if (adminError) throw adminError;

    return data;
  };

  // 🔹 Login
  const login = async (email, password) => {
    // Validation des champs
    if (!email || !password) {
      throw new Error("Veuillez fournir un email et un mot de passe");
    }

    // Tenter la connexion
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(),
      password: password
    });
    
    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

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

    if (adminError) {
      console.error('Erreur lors de la vérification admin:', adminError);
      // On déconnecte l'utilisateur s'il n'est pas un admin
      await supabase.auth.signOut();
      throw new Error("Accès non autorisé. Seuls les administrateurs peuvent se connecter.");
    }

    if (!adminData) {
      // Si aucun enregistrement admin n'est trouvé
      await supabase.auth.signOut();
      throw new Error("Accès non autorisé. Compte administrateur introuvable.");
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
    window.location.href = '/admin/login';
  };

  // 🔹 Récupérer tous les administrateurs
  const fetchAdmins = useCallback(async () => {
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
  }, []);

  // 🔹 Créer un nouvel administrateur
  const createAdmin = async ({ email, password, full_name, role = 'admin' }) => {
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
      
      return adminData;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  // 🔹 Mettre à jour un administrateur
  const updateAdmin = async (id, updates) => {
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
      
      return data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  };

  // 🔹 Supprimer un administrateur
  const deleteAdmin = async (id) => {
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
      
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  };

  // 🔹 Activer / Désactiver un administrateur
  const toggleAdminActive = async (id, isActive) => {
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
    
    // Admin management
    admins,
    loadingAdmins,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminActive,
    
    // Legacy (à supprimer une fois la migration terminée)
    registerAdmin
  };
}
