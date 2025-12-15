import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Send,
  Navigation, Home, Globe, Shield, Sparkles, ArrowRight,
  CheckCircle, Star, Heart, Car, Users, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
const [captchaVerified, setCaptchaVerified] = useState(false);
const recaptchaRef = useRef(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Vérifier si le CAPTCHA est validé
    if (!captchaVerified) {
      throw new Error('Veuillez valider le CAPTCHA');
    }
    
    // Vérifier si toutes les informations requises sont présentes
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Enregistrer le message dans la table contact_messages
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null, // Le téléphone est optionnel
        subject: formData.subject || 'Sans objet', // Sujet par défaut si non fourni
        message: formData.message,
        is_read: false // Statut par défaut
      }])
      .select();

    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }

    // Afficher un message de succès
    toast({
      title: 'Message Envoyé!',
      description: 'Nous vous répondrons dans les plus brefs délais.',
      className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    });

    // Réinitialiser le formulaire et le CAPTCHA
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setCaptchaVerified(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    toast({
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',
      variant: 'destructive'
    });
  }
};

  const handleSubmit2 = (e) => {
    e.preventDefault();

    toast({
      title: 'Message Envoyé!',
      description: 'Nous vous répondrons dans les plus brefs délais.',
      className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone Urgence',
      content: '+32 465 71 62 51',
      link: 'tel:+32465716251',
      description: '24/7 - Dépannage & Urgences',
      color: 'from-red-500 to-orange-500',
      badge: 'Urgence'
    },
    // {
    //   icon: MessageSquare,
    //   title: 'WhatsApp',
    //   content: '+32 465 68 18 45',
    //   link: 'https://wa.me/32123456789',
    //   description: 'Réponse instantanée',
    //   color: 'from-green-500 to-emerald-600',
    //   badge: 'Direct'
    // },
    {
      icon: Mail,
      title: 'Email Professionnel',
      content: 'contact@valtransauto.be',
      link: 'mailto:contact@valtransauto.be',
      description: 'Réponse sous 24h',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Pro'
    },
    {
      icon: MapPin,
      title: 'Siège Principal',
      content: 'Rue de Cache-Après 91, 7033 Mons',
      link: '#map',
      description: 'Visitez notre atelier',
      color: 'from-violet-500 to-purple-500',
      badge: 'Visite'
    }
  ];

  const whatsappNumber = "+32465681845";
  const whatsappMessage = "Bonjour VALTRANSAUTO, j'aimerais obtenir des informations concernant vos services.";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div>
        <title>Contact - VALTRANSAUTO | Assistance 24/7 & Support Expert</title>
        <meta name="description" content="Contactez VALTRANSAUTO 24/7 via téléphone, WhatsApp, email ou visite. Service expert d'assistance automobile dans toute la Belgique." />
      </div>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
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
                <span className="text-sm font-medium">Support 24/7</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                  Contactez Nos Experts
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                Besoin d'assistance ? Notre équipe d'experts est disponible
                <span className="font-semibold text-cyan-200"> 24 heures sur 24, 7 jours sur 7 </span>
                pour répondre à toutes vos questions
              </p>

              {/* WhatsApp Quick Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-3 h-6 w-6" />
                    WhatsApp Instantané
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent"
                >
                  <div className={`absolute -top-3 -right-3 bg-gradient-to-br ${info.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {info.badge}
                  </div>

                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                  <p className="text-gray-700 font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {info.content}
                  </p>
                  <p className="text-sm text-gray-500">{info.description}</p>

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-white/5 group-hover:via-white/2 group-hover:to-white/1 rounded-2xl transition-all duration-500" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Google Maps & Contact Form */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Google Maps Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                  <div className="relative h-96">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.30672373887!2d4.35172967684518!3d50.85436627167634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c380e764e0db%3A0x4f7a3f2b4b3c3b3d!2sBruxelles%2C%20Belgique!5e0!3m2!1sfr!2sbe!4v1699456789015!5m2!1sfr!2sbe"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="VALTRANSAUTO - Siège Principal à Bruxelles"
                      className="absolute inset-0"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900">Siège Principal</h3>
                      </div>
                      <p className="text-gray-700">1000 Bruxelles, Belgique</p>
                      <p className="text-sm text-gray-500">Parking visiteurs disponible</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info Sidebar */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <h3 className="font-bold text-gray-900">Horaires</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { day: 'Lun - Ven', hours: '8h - 18h' },
                        { day: 'Samedi', hours: '9h - 13h' },
                        { day: 'Dimanche', hours: 'Urgences' }
                      ].map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{schedule.day}</span>
                          <span className="font-semibold text-blue-700">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-emerald-600" />
                      <h3 className="font-bold text-gray-900">Réponse Rapide</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-gray-700">WhatsApp: <strong>Instantané</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-gray-700">Téléphone: <strong>2 min</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-gray-700">Email: <strong>24h max</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Envoyez-nous un <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-cyan-600">Message</span>
                    </h2>
                    <p className="text-gray-600">
                      Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais
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
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50 placeholder-gray-500/70"
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
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50 placeholder-gray-500/70"
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
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50 placeholder-gray-500/70"
                            placeholder="+32 465 68 18 45"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700 font-medium">
                          Sujet *
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50 placeholder-gray-500/70"
                            placeholder="Sujet de votre message"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="min-h-[150px] rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white/50 placeholder-gray-500/70"
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </div>

                    <div className="w-full flex justify-center my-4">
                     <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey="6LeSbCYsAAAAALbarYeM-GFebalB_qXd4MOqdGCi"
                          onChange={() => setCaptchaVerified(true)}
                          onExpired={() => setCaptchaVerified(false)}
                          onErrored={() => setCaptchaVerified(false)}
                        />
                    </div>

      {/* <div class="g-recaptcha" data-sitekey="6LeSbCYsAAAAALbarYeM-GFebalB_qXd4MOqdGCi" data-action="LOGIN"></div>
      <br/> */}
                    <Button
                      type="submit"
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      disabled={!captchaVerified}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Envoyer le Message
                    </Button>
                  </form>

                  {/* WhatsApp Quick Button */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Besoin d'une réponse immédiate ?</p>
                      <Button
                        asChild
                        variant="outline"
                        className="group border-green-500 text-green-600 hover:bg-green-50 w-full"
                      >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                          Discuter sur WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-cyan-300">Confiance & Transparence</span>
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Chez VALTRANSAUTO, nous croyons que la relation client commence par une communication claire et efficace
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Shield, title: 'Garantie Réponse', desc: 'Sous 24h maximum' },
                  { icon: Star, title: 'Support Expert', desc: 'Équipe spécialisée' },
                  { icon: Heart, title: 'Satisfaction', desc: '99% de clients heureux' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    WhatsApp Instant
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                  <a href="tel:+32465716251">
                    <Phone className="mr-3 h-5 w-5" />
                    Appeler Maintenant
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

// Import nécessaire pour le composant User
const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default ContactPage;