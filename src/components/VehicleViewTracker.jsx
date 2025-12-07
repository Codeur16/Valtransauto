// components/VehicleViewTracker.jsx
import { useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const VehicleViewTracker = ({ vehicleId }) => {  // Notez le 'v' minuscule
  useEffect(() => {
    if (!vehicleId) return;

    const trackView = async () => {
      try {
        // Générer un ID de session
        let sessionId = localStorage.getItem('vehicle_view_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('vehicle_view_session_id', sessionId);
        }

        const today = new Date().toISOString().split('T')[0];

        // Vérifier si vue déjà enregistrée aujourd'hui
        const { data: existingView, error: checkError } = await supabase
          .from('vehicle_views')
          .select('id')
          .eq('vehicle_id', vehicleId)
          .eq('session_id', sessionId)
          .eq('view_date', today)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing view:', checkError);
          return;
        }

        // Si pas de vue aujourd'hui, enregistrer
        if (!existingView) {
          const { error: insertError } = await supabase
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

          if (insertError) {
            console.error('Error inserting view:', insertError);
            return;
          }

          // Mettre à jour le compteur dans la table vehicles
          const { error: updateError } = await supabase.rpc('increment_views', {
            vehicle_id: vehicleId
          });

          if (updateError) {
            console.error('Error updating view count:', updateError);
          }
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [vehicleId]);

  return null; // Ce composant ne rend rien
};

export default VehicleViewTracker;