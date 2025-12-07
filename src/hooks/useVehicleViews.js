// hooks/useVehicleViews.js (version simplifiée)
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useVehicleViews = (vehicleId) => {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Générer un ID de session
  const getSessionId = () => {
    let sessionId = localStorage.getItem('vehicle_view_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('vehicle_view_session_id', sessionId);
    }
    return sessionId;
  };

  // Enregistrer une vue
  const trackView = useCallback(async () => {
    if (!vehicleId) return;

    try {
      const sessionId = getSessionId();
      const today = new Date().toISOString().split('T')[0];

      // Vérifier si vue déjà enregistrée aujourd'hui
      const { data: existingView } = await supabase
        .from('vehicle_views')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .eq('session_id', sessionId)
        .eq('view_date', today)
        .limit(1)
        .single();

      // Si pas de vue aujourd'hui
      if (!existingView) {
        await supabase
          .from('vehicle_views')
          .insert([
            {
              vehicle_id: vehicleId,
              session_id: sessionId,
              user_ip: 'unknown',
              user_agent: navigator.userAgent || 'unknown',
              view_date: today
            }
          ]);

        // Mettre à jour le compteur local
        setViews(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [vehicleId]);

  // Récupérer les vues
  const fetchViews = useCallback(async () => {
    if (!vehicleId) return;

    try {
      // Méthode 1: Récupérer depuis vehicles.views_count
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('views_count')
        .eq('id', vehicleId)
        .single();

      if (vehicle) {
        setViews(vehicle.views_count || 0);
      }

      // Méthode 2: Compter dans vehicle_views
      const { count } = await supabase
        .from('vehicle_views')
        .select('*', { count: 'exact', head: true })
        .eq('vehicle_id', vehicleId);

      if (count !== null) {
        setViews(count);
      }

    } catch (error) {
      console.error('Error fetching views:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicleId) {
      // Track view au chargement
      trackView();
      
      // Récupérer les vues existantes
      fetchViews();

      // Rafraîchir périodiquement (toutes les 2 minutes)
      const interval = setInterval(fetchViews, 120000);
      return () => clearInterval(interval);
    }
  }, [vehicleId, trackView, fetchViews]);

  return {
    views,
    loading,
    trackView,
    refreshViews: fetchViews
  };
};