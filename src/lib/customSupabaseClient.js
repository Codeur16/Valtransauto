import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? '✅ Défini' : '❌ Manquant');
console.log('Supabase Key:', supabaseKey ? '✅ Défini' : '❌ Manquant');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes pour Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Test de connexion
supabase
  .from('vehicles')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error);
    } else {
      console.log('✅ Connexion à Supabase réussie! Données reçues:', data);
    }
  });