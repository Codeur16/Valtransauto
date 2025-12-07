import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, Mail, Phone, MessageSquare,
  CheckCircle, ArrowRight, Sparkles, Shield, Star,
  Car, Settings, Wrench, Zap, Navigation, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { dbService } from '@/services/dbService';
import { supabase } from '@/lib/customSupabaseClient'; // ou l'endroit où se trouve votre client Supabase
const BookAppointmentPage = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const loadVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, make') // On ne récupère que l'ID et le nom
        .order('make', { ascending: true }); // Tri par nom

      if (error) throw error;
      setVehicles(data || []);
      console.log("vehicles", vehicles)
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des véhicules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  loadVehicles();
}, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicle: '',
    date: '',
    time: '',
    message: ''
  });

// Dans votre composant BookAppointmentPage, modifiez la fonction handleSubmit :
// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   try {
//     // Enregistrer la réservation dans la base de données
//     const reservation = await dbService.createReservation(formData);
    
//     // Envoyer les notifications
//     await notificationService.sendEmailNotification('reservation', {
//       to: formData.email,
//       name: formData.name,
//       service: formData.service,
//       date: formData.date,
//       time: formData.time
//     });

//     await notificationService.sendWhatsAppNotification(
//       formData.phone,
//       `Bonjour ${formData.name}, votre réservation pour ${formData.service} le ${formData.date} à ${formData.time} a été confirmée.`
//     );

//     // Afficher un message de succès
//     toast({
//       title: 'Rendez-vous confirmé !',
//       description: 'Nous avons reçu votre demande et vous avons envoyé une confirmation par email et WhatsApp.',
//       className: 'bg-green-500 text-white'
//     });

//     // Réinitialiser le formulaire
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       service: '',
//       vehicle: '',
//       date: '',
//       time: '',
//       message: ''
//     });

//   } catch (error) {
//     console.error('Erreur lors de la réservation:', error);
//     toast({
//       title: 'Erreur',
//       description: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
//       variant: 'destructive'
//     });
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Vérifier si toutes les informations requises sont présentes
    if (!formData.name || !formData.email || !formData.phone || !formData.service || 
        !formData.vehicle || !formData.date || !formData.time) {
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Enregistrer la réservation dans la table reservations
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        vehicle: formData.vehicle,
        date: formData.date,
        time: formData.time,
        message: formData.message || '',
        status: 'en_attente' // Statut par défaut
      }])
      .select();

    if (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }

    // Afficher un message de succès
    toast({
      title: 'Rendez-vous confirmé !',
      description: 'Votre réservation a été enregistrée avec succès.',
      className: 'bg-green-500 text-white'
    });

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      vehicle: '',
      date: '',
      time: '',
      message: ''
    });

    // Ici, vous pouvez ajouter l'envoi d'emails ou de notifications
    // via votre service de notification si nécessaire

  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    toast({
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
      variant: 'destructive'
    });
  }
};


  const handleSubmit2 = (e) => {
    e.preventDefault();

    // Simuler une intégration Google Calendar
    toast({
      title: ' Rendez-vous Confirmé!',
      description: 'Nous vous avons envoyé une confirmation par email avec les détails.',
      className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    });

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      vehicle: '',
      date: '',
      time: '',
      message: ''
    });
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};
  const services = [
    { value: 'sale', label: 'Achat de vehicule', icon: Car },
    { value: 'control', label: 'Contrôle Technique', icon: Shield },
    { value: 'repair', label: 'Réparation Mécanique', icon: Settings },
    { value: 'maintenance', label: 'Entretien & Maintenance', icon: Wrench },
    { value: 'diagnostic', label: 'Diagnostic Avancé', icon: Zap },
    { value: 'towing', label: 'Remorquage & Dépannage', icon: Car },
    { value: 'other', label: 'Autre Service', icon: MessageSquare }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const whatsappNumber = "+32465681845";
  const whatsappMessage = `Bonjour, je souhaite prendre un rendez-vous pour ${formData.service || 'un service'} le ${formData.date} à ${formData.time}.`;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Helmet>
        <title>Réservez votre Rendez-vous - VALTRANSAUTO | Service Premium</title>
        <meta name="description" content="Réservez votre rendez-vous en ligne avec VALTRANSAUTO. Service rapide, confirmation instantanée et rappels automatiques." />
      </Helmet>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Réservation Premium</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                  Réservez Votre Créneau
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                Planifiez votre visite en quelques clics avec notre
                <span className="font-semibold text-cyan-200"> système de réservation intelligent </span>
                et bénéficiez d'une expérience sans attente
              </p>
            </motion.div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Formulaire de <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-cyan-600">Réservation</span>
                    </h2>
                    <p className="text-gray-600">
                      Remplissez ce formulaire pour réserver votre créneau en toute simplicité
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Nom Complet *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Jean Dupont"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="jean.dupont@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Téléphone *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="+32 123 456 789"
                          />
                        </div>
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="vehicle" className="text-gray-700 font-medium">
                          Véhicule *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Car className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="vehicle"
                            name="vehicle"
                            type="text"
                            required
                            value={formData.vehicle}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ex: Audi A4 2020"
                          />
                        </div>
                      </div> */}


                      <div className="space-y-2">
  <Label htmlFor="vehicle">Véhicule *</Label>
  <select
    id="vehicle"
    name="vehicle"
    value={formData.vehicle}
    onChange={handleChange}
    required
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="">Sélectionnez un véhicule</option>
    {loading ? (
      <option disabled>Chargement des véhicules...</option>
    ) : (
      vehicles.map((vehicle) => (
        <option key={vehicle.id} value={vehicle.make}>
          {vehicle.make}
        </option>
      ))
    )}
  </select>
</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-gray-700 font-medium">
                        Service Demandé *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {services.map((service) => {
                          const Icon = service.icon;
                          return (
                            <button
                              key={service.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, service: service.value })}
                              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${formData.service === service.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                            >
                              <Icon className="h-6 w-6 mb-2" />
                              <span className="text-sm font-medium">{service.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-gray-700 font-medium">
                          Date *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Heure de Préférence *
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setFormData({ ...formData, time: slot })}
                              className={`p-3 rounded-lg border transition-all duration-300 ${formData.time === slot
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Informations Complémentaires
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="pl-10 min-h-[100px] rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Décrivez votre problème ou besoins spécifiques..."
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Calendar className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Confirmer le Rendez-vous
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {/* WhatsApp Alternative */}
                    <div className="text-center mt-6">
                      <p className="text-gray-600 mb-3">Ou réservez directement sur WhatsApp :</p>
                      <Button
                        asChild
                        variant="outline"
                        className="group border-green-500 text-green-600 hover:bg-green-50 w-full"
                      >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                          Réserver sur WhatsApp
                        </a>
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Sidebar Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Opening Hours */}
                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-6 shadow-lg border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-emerald-600" />
                    Horaires d'Ouverture
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: 'Lundi - Vendredi', hours: '8h00 - 18h00', note: 'Plein service' },
                      { day: 'Samedi', hours: '9h00 - 13h00', note: 'Service express' },
                      { day: 'Dimanche', hours: 'Urgences 24/7', note: 'Sur appel' }
                    ].map((schedule, index) => (
                      <div key={index} className="bg-white/80 rounded-xl p-4 border border-emerald-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{schedule.day}</span>
                          <span className="font-bold text-emerald-700">{schedule.hours}</span>
                        </div>
                        <p className="text-sm text-gray-600">{schedule.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-lg border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                    Contact Rapide
                  </h3>
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="mr-3 h-5 w-5" />
                        WhatsApp Instantané
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <a href="tel:+32123456789">
                        <PhoneCall className="mr-3 h-5 w-5" />
                        Appeler +32 123 456 789
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full text-gray-600 hover:text-blue-600"
                    >
                      <a href="mailto:info@valtransauto.be">
                        <Mail className="mr-3 h-5 w-5" />
                        info@valtransauto.be
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Benefits */}
                {/* <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-6 shadow-lg border border-amber-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Star className="h-6 w-6 text-amber-600" />
                    Avantages
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle, text: 'Confirmation immédiate', color: 'text-green-500' },
                      { icon: Shield, text: 'Garantie satisfaction', color: 'text-blue-500' },
                      { icon: Clock, text: 'Pas d\'attente', color: 'text-amber-500' },
                      { icon: Navigation, text: 'Rappels SMS', color: 'text-purple-500' }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                        <span className="text-gray-700">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-cyan-300">Une Question ?</span> Nous Sommes Là
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Notre équipe est disponible pour vous conseiller et vous aider à choisir le meilleur créneau pour votre véhicule
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    WhatsApp Direct
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                  <a href="tel:+32123456789">
                    <Phone className="mr-3 h-5 w-5" />
                    Appeler Maintenant
                  </a>
                </Button>
              </div>

              <p className="mt-8 text-white/70 text-sm">
                Réponse garantie dans les 5 minutes pendant les heures d'ouverture
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookAppointmentPage;