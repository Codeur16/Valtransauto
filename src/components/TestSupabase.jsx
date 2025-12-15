// src/components/TestSupabase.jsx
import { useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export default function TestSupabase() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('Erreur Supabase:', error);
        } else {
          console.log('Données récupérées:', data);
        }
      } catch (err) {
        console.error('Exception:', err);
      }
    };

    testConnection();
  }, []);

  return <div>Test de connexion en cours... Voir la console</div>;
}