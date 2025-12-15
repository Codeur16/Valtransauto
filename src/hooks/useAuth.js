import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';


export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, password, userData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || userData.fullName,
            role: userData.role || 'admin'
          },
          emailRedirectTo: `${window.location.origin}/verification-success`
        }
      });

      if (signUpError) throw signUpError;

      await supabase
        .from('admin_users')
        .insert([{
          id: data.user.id,
          email,
          full_name: userData.full_name || userData.fullName,
          role: userData.role || 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      toast({
        title: 'Inscription réussie',
        description: 'Veuillez vérifier votre email pour confirmer votre compte.'
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // First, try to sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle specific authentication errors
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw signInError;
      }

      // Then verify if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Accès non autorisé. Vous devez être administrateur.');
      }

      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);

      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${adminData.full_name || 'Admin'}!`,
      });

      return { 
        success: true, 
        user: { 
          ...data.user, 
          ...adminData,
          isAdmin: true,
          role: adminData.role || 'admin'
        } 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive'
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };















  
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast({
        title: 'Email envoyé',
        description: 'Un lien de réinitialisation a été envoyé à votre adresse email.'
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'envoyer l\'email de réinitialisation',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour avec succès.'
      });

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le mot de passe',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès.',
      });
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error };
    }
  };

  return {
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}