import { supabase } from '../lib/customSupabaseClient';

export const dbService = {
  // Gestion des réservations
  async createReservation(reservationData) {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Gestion des messages de contact
  async createContactMessage(messageData) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Récupérer toutes les réservations (pour l'admin)
  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Récupérer tous les messages (pour l'admin)
  async getAllContactMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
