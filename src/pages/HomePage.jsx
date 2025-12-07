import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Wrench, Truck, Shield, Clock, CheckCircle,
  Phone, Sparkles, Star, MapPin, ChevronLeft, ChevronRight,
  Users, Award, Globe, Zap, Heart, Calendar, MessageSquare,
  Car, Settings, Battery, AlertCircle, ShoppingBag, Target,
  Euro, Key, Navigation, Check, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    experience: 0,
    clients: 0,
    satisfaction: 0,
    availability: 0
  });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  // Services - avec la vente de véhicules en premier
  const services = [
    {
      icon: ShoppingBag,
      title: 'Vente de Véhicules',
      description: 'Large sélection de véhicules d\'occasion garantis. Trouvez votre prochaine voiture chez nous.',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      button: 'Voir nos véhicules',
      link: '/vehicles',
      isFeatured: true
    },
    {
      icon: Shield,
      title: 'Contrôle Technique',
      description: 'Inspection complète selon les normes belges avec certification officielle.',
      image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f',
      button: 'Découvrir',
      link: '/services#control'
    },
    {
      icon: Truck,
      title: 'Transport & Remorquage',
      description: 'Service de transport professionnel et remorquage 24/7 partout en Belgique.',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
      button: 'En savoir plus',
      link: '/services#transport'
    },
    {
      icon: Wrench,
      title: 'Réparation Mécanique',
      description: 'Experts certifiés utilisant des pièces d\'origine garanties 2 ans.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
      button: 'Diagnostic',
      link: '/services#repair'
    }
  ];

  const stats = [
    {
      id: 'experience',
      number: 15,
      suffix: '+',
      label: 'Années d\'expérience',
      icon: Award,
      duration: 2.5
    },
    {
      id: 'clients',
      number: 5000,
      suffix: '+',
      label: 'Clients satisfaits',
      icon: Users,
      duration: 2.5
    },
    {
      id: 'satisfaction',
      number: 99,
      suffix: '%',
      label: 'Taux de satisfaction',
      icon: Heart,
      duration: 2.5
    },
    {
      id: 'vehicles',
      number: 500,
      suffix: '+',
      label: 'Véhicules vendus',
      icon: Car,
      duration: 2.5
    }
  ];

  const heroHighlights = [
    { label: 'Véhicules en stock', value: '50+', suffix: '', detail: 'disponibles immédiatement' },
    { label: 'Taux de satisfaction', value: '4.9', suffix: '/5', detail: 'sur la vente de véhicules' },
    { label: 'Garantie minimum', value: '12', suffix: ' mois', detail: 'sur tous nos véhicules' }
  ];

  const vehicleBenefits = [
    {
      icon: Target,
      title: 'Inspection Rigoureuse',
      description: 'Chaque véhicule passe une inspection complète de 150 points'
    },
    {
      icon: Shield,
      title: 'Garantie Étendue',
      description: 'Garantie minimale de 12 mois sur tous nos véhicules'
    },
    {
      icon: Key,
      title: 'Essai Gratuit',
      description: 'Testez le véhicule de votre choix sans engagement'
    },
    {
      icon: Euro,
      title: 'Financement Facile',
      description: 'Solutions de financement adaptées à votre budget'
    }
  ];

  const testimonials = [
    {
      name: 'Laura De Vries',
      title: 'Particulier',
      quote: 'Excellent service pour l\'achat de ma voiture. Transparence totale et suivi impeccable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786'
    },
    {
      name: 'Marc Lemaire',
      title: 'Acheteur professionnel',
      quote: 'J\'ai acheté 3 véhicules chez VALTRANSAUTO. Toujours satisfait de la qualité et du service.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    {
      name: 'Sophie Vander',
      title: 'Particulier',
      quote: 'Un service haut de gamme jusque dans les détails : essai, financement, livraison à domicile.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    {
      name: 'Thomas Bernard',
      title: 'Commerçant',
      quote: 'Service impeccable pour notre véhicule utilitaire. Réactivité et professionnalisme au rendez-vous.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Recherche & Sélection',
      description: 'Trouvez le véhicule idéal dans notre large catalogue en ligne.',
      icon: ShoppingBag
    },
    {
      step: '02',
      title: 'Essai & Inspection',
      description: 'Testez le véhicule et découvrez son historique complet.',
      icon: CheckSquare
    },
    {
      step: '03',
      title: 'Financement & Paperasse',
      description: 'Nous gérons tout : crédit, assurance, immatriculation.',
      icon: Euro
    },
    {
      step: '04',
      title: 'Livraison & Suivi',
      description: 'Livraison à domicile et service après-vente inclus.',
      icon: Truck
    }
  ];

  const coverageAreas = [
    { 
      region: 'Bruxelles & Brabant',
      areas: ['Bruxelles', 'Wavre', 'Louvain-la-Neuve', 'Nivelles', 'Tubize', 'Waterloo'],
      icon: '🏛️',
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      region: 'Flandre',
      areas: ['Anvers', 'Gand', 'Bruges', 'Louvain', 'Malines', 'Hasselt'],
      icon: '⚓',
      color: 'from-green-500 to-emerald-400'
    },
    { 
      region: 'Wallonie',
      areas: ['Liège', 'Charleroi', 'Namur', 'Mons', 'Tournai', 'Verviers'],
      icon: '🏔️',
      color: 'from-red-500 to-orange-400'
    },
    { 
      region: 'Luxembourg Belge',
      areas: ['Arlon', 'Bastogne', 'Marche-en-Famenne', 'Neufchâteau', 'Virton'],
      icon: '🌲',
      color: 'from-purple-500 to-pink-400'
    }
  ];

  // Animation des statistiques avec Framer Motion
  useEffect(() => {
    if (statsInView) {
      stats.forEach((stat) => {
        const controls = animate(0, stat.number, {
          duration: stat.duration,
          ease: "easeOut",
          onUpdate(value) {
            setAnimatedStats(prev => ({
              ...prev,
              [stat.id]: Math.floor(value)
            }));
          }
        });

        return () => controls.stop();
      });
    }
  }, [statsInView]);

  // Auto-scroll pour les témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Composant de compteur personnalisé avec Framer Motion
  const AnimatedCounter = ({ end, suffix = "", duration = 2.5, startOnView = false }) => {
    const [count, setCount] = useState(0);
    const counterRef = useRef(null);
    const isInView = useInView(counterRef, { once: true, amount: 0.5 });

    useEffect(() => {
      if (isInView) {
        const controls = animate(0, end, {
          duration: duration,
          ease: "easeOut",
          onUpdate(value) {
            setCount(Math.floor(value));
          }
        });

        return () => controls.stop();
      }
    }, [isInView, end, duration]);

    return (
      <span ref={counterRef}>
        {startOnView && !isInView ? `0${suffix}` : `${count}${suffix}`}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>VALTRANSAUTO - Vente de véhicules & Services Automobiles en Belgique</title>
        <meta name="description" content="VALTRANSAUTO : vente de véhicules d'occasion garantis, transport, réparation, dépannage et entretien automobile en Belgique. Contactez-nous 24/7." />
      </Helmet>

      <div className="bg-white" ref={containerRef}>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] md:h-[95vh] overflow-hidden">
          <div className="absolute inset-0">
            <motion.img
              style={{ y }}
              className="w-full h-full object-cover"
              alt="Sélection de véhicules d'occasion de qualité"
              src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2000&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1F2E]/95 via-[#132F4B]/90 to-[#23496C]/80" />
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF0C00]/20 blur-[200px]" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-60 animate-pulse" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center pt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white space-y-6"
              >
                <h1 className="text-3xl md:text-[64px] font-bold leading-[1.1] mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Votre Expert Auto
                  </span>
                  <br />
                  <span className="text-[#FF0C00] font-semibold">en Belgique</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl font-light">
                  <span className="font-semibold text-cyan-200">Vente de véhicules garantis</span> et services automobiles complets aux standards des meilleurs professionnels européens.
                  <span className="block mt-2 text-white/80 text-lg">
                    Trouvez votre prochaine voiture chez nous et profitez de notre expertise.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-[#FF0C00] hover:bg-[#FF0C00]/90 text-white text-lg px-8 py-6 shadow-[0_20px_80px_-20px_rgba(255,12,0,0.8)] group relative overflow-hidden">
                    <Link to="/vehicles" className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      <span className="relative z-10">Voir nos véhicules</span>
                      <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF0C00] to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur group">
                    <Link to="/services" className="flex items-center">
                      <span>Nos services</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-12 grid sm:grid-cols-3 gap-4">
                  {heroHighlights.map((highlight, index) => (
                    <motion.div
                      key={highlight.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur hover:bg-white/15 transition-colors group"
                    >
                      <div className="text-3xl font-bold text-white mb-1 flex items-baseline">
                        <span>{highlight.value}</span>
                        <span className="text-[#FF0C00] ml-1">{highlight.suffix}</span>
                      </div>
                      <p className="text-white/80 text-sm font-medium">{highlight.label}</p>
                      <p className="text-white/60 text-xs mt-2">{highlight.detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
                className="hidden md:flex justify-center items-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 w-52 h-52 bg-[#FF0C00]/30 blur-[100px] animate-pulse" />
                  <div className="relative bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0C00] via-yellow-500 to-[#FF0C00] animate-shimmer" />
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-white/60 text-sm uppercase tracking-[0.4em]">Vente de Véhicules</p>
                        <p className="text-white text-2xl font-bold">Stock disponible</p>
                      </div>
                      <Car className="h-12 w-12 text-white/90 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="space-y-5">
                      {[
                        { label: 'Véhicules disponibles', count: '50+', trend: '+5 cette semaine' },
                        { label: 'Prix moyen', value: '€25,000', note: 'Large gamme disponible' },
                        { label: 'Garantie incluse', value: '12 mois', icon: '🛡️' },
                        { label: 'Financement', value: 'Sur mesure', icon: '💳' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between group/item">
                          <div className="flex items-center gap-3">
                            {item.icon && <span className="text-xl">{item.icon}</span>}
                            <div>
                              <span className="text-white/70 text-sm">{item.label}</span>
                              {item.trend && (
                                <p className="text-green-400 text-xs">{item.trend}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-medium text-white">
                            {item.count || item.value}
                          </span>
                        </div>
                      ))}
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <Button asChild className="w-full bg-gradient-to-r from-[#FF0C00] to-orange-500 text-white">
                          <Link to="/vehicles" className="flex items-center justify-center">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Explorer le catalogue
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-12 md:py-20 bg-gradient-to-b from-white to-[#F8FAFC] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F4E79]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F4E79]/10 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F4E79] mb-3">
                Notre Impact en Chiffres
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Des années d'expertise au service de votre satisfaction automobile
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative group"
                  >
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:border-[#1F4E79]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1F4E79]/10 h-full">
                      <div className="inline-flex items-center justify-center w-14 h-14 md:w-18 md:h-18 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#1F4E79]/5 to-[#1F4E79]/10 mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-300 group-hover:from-[#1F4E79]/10 group-hover:to-[#1F4E79]/20">
                        <Icon className="h-7 w-7 md:h-9 md:w-9 text-[#1F4E79] group-hover:text-[#FF0C00] transition-colors duration-300" />
                      </div>

                      <div className="mb-1 md:mb-2">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F4E79] group-hover:text-[#1F4E79]/90 transition-colors duration-300">
                          <AnimatedCounter
                            end={stat.number}
                            suffix={stat.suffix}
                            duration={stat.duration}
                            startOnView={true}
                          />
                        </div>

                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-3 mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(100, (stat.number / 100) * 10)}%` }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="h-full bg-gradient-to-r from-[#1F4E79] to-[#1F4E79]/80 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="text-gray-700 font-medium text-sm md:text-base lg:text-lg leading-tight group-hover:text-[#1F4E79] transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1F4E79]/10 text-[#1F4E79] uppercase text-xs tracking-[0.3em] mb-6 relative z-10">
                <ShoppingBag className="h-3 w-3 mr-2" />
                Nos Expertises
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A2A] mb-6 relative z-10">
                Vente & <span className="text-[#FF0C00]">Services</span>
              </h2>
              <p className="text-xl text-[#5C5C5C] max-w-2xl mx-auto relative z-10">
                Une offre complète pour tous vos besoins automobiles, de l'achat à l'entretien.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative h-[400px]"
                  >
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 ${service.isFeatured ? 'from-[#FF0C00]/20' : ''}`} />
                    </div>

                    <div className="relative h-full p-8 flex flex-col justify-end">
                      {service.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#FF0C00] text-white text-xs font-bold rounded-full">
                            ★ Service principal
                          </span>
                        </div>
                      )}

                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-t ${service.isFeatured ? 'from-[#FF0C00]' : 'from-[#1F4E79]'} to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                        initial={false}
                      />

                      <div className="relative z-20">
                        <div className="mb-4">
                          <div className={`w-14 h-14 rounded-xl ${service.isFeatured ? 'bg-[#FF0C00]' : 'bg-white/20'} backdrop-blur flex items-center justify-center mb-4 ${service.isFeatured ? '' : 'group-hover:bg-[#FF0C00]'} transition-colors duration-300`}>
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                          <p className="text-white/90 text-sm leading-relaxed mb-6">
                            {service.description}
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Button asChild variant="outline" className={`border-white text-white hover:bg-white ${service.isFeatured ? 'hover:text-[#FF0C00]' : 'hover:text-[#1F4E79]'} w-full relative z-30`}>
                            <Link to={service.link}>
                              {service.button} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12 relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {vehicleBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF0C00]/10 to-transparent">
                        <benefit.icon className="h-6 w-6 text-[#FF0C00]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button asChild size="lg" className="bg-gradient-to-r from-[#FF0C00] to-orange-500 hover:from-[#FF0C00]/90 hover:to-orange-600 text-white px-10 py-6 text-lg group relative z-20">
                <Link to="/vehicles" className="flex items-center">
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Découvrir tous nos véhicules
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-gradient-to-b from-[#0C1F30] to-[#0A1725] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553440569-bcc63803a83d')] opacity-10 bg-cover bg-center" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/90 uppercase text-xs tracking-[0.3em] mb-6">
                <Zap className="h-3 w-3 mr-2 text-[#FF0C00]" />
                Processus d'Achat
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Votre véhicule en 4 étapes
              </h2>
              <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
                Un parcours simplifié et transparent pour l'achat de votre véhicule.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 h-full">
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#FF0C00] to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="mt-8 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#FF0C00]/20 transition-colors">
                          <Icon className="h-6 w-6 text-white group-hover:text-[#FF0C00] transition-colors" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-b from-[#F6F7FB] to-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F4E79]/10 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1F4E79]/10 text-[#1F4E79] uppercase text-xs tracking-[0.3em] mb-6">
                <Star className="h-3 w-3 mr-2 fill-current" />
                Témoignages Clients
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F4E79] mb-6">
                Ils nous ont fait <span className="text-[#FF0C00]">confiance</span>
              </h2>
              <p className="text-xl text-[#5C5C5C] max-w-3xl mx-auto">
                Découvrez ce que nos clients disent de leur expérience d'achat et de service.
              </p>
            </motion.div>

            <div className="relative">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {testimonials.slice(currentSlide, currentSlide + 3).map((testimonial, index) => (
                      <motion.div
                        key={testimonial.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 h-full group"
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <div className="relative">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF0C00] rounded-full flex items-center justify-center">
                              <Star className="h-3 w-3 text-white fill-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-[#1F4E79] font-bold text-lg">{testimonial.name}</p>
                            <p className="text-[#5C5C5C] text-sm">{testimonial.title}</p>
                            <div className="flex text-[#FFB703] mt-2">
                              {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                                <Star key={starIndex} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-[#1F1F1F] text-lg leading-relaxed italic relative pl-6">
                          <span className="absolute left-0 top-0 text-4xl text-[#FF0C00]/30 font-serif">"</span>
                          {testimonial.quote}
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Achat vérifié</span>
                            <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                              Client satisfait
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-4 mt-12">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-[#FF0C00] w-8' : 'bg-gray-300'}`}
                    aria-label={`Aller au témoignage ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Areas Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F4E79]/10 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#FF0C00]/10 to-orange-500/10 text-[#FF0C00] uppercase text-xs tracking-[0.3em] mb-6">
                <Globe className="h-3 w-3 mr-2" />
                Zones de Couverture
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A2A] mb-6">
                Présents dans toute la <span className="text-[#FF0C00]">Belgique</span>
              </h2>
              <p className="text-xl text-[#4A5666] max-w-3xl mx-auto">
                Nous intervenons et livrons partout en Belgique. Découvrez notre couverture nationale.
              </p>
            </motion.div>

            

            {/* Carte interactive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#1F4E79] to-blue-600 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12 text-white">
                  <h3 className="text-3xl font-bold mb-6">Siège Opérationnel & Showroom</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/80 uppercase tracking-[0.4em] text-sm mb-2">Notre adresse principale</p>
                      <p className="text-2xl font-semibold">Rue des caches-après 91</p>
                      <p className="text-white/90 text-lg">7033 CUESMES - Belgique</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-white/80 text-sm mb-1">Téléphone</p>
                        <p className="text-xl font-semibold">+32 123 456 789</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm mb-1">Email</p>
                        <p className="text-xl font-semibold">contact@valtransauto.com</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <p className="text-white/90">
                        <strong>Horaires d'ouverture :</strong><br />
                        Lundi - Vendredi : 8h00 - 18h00<br />
                        Samedi : 9h00 - 16h00<br />
                        Dimanche : Sur rendez-vous
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-6">
                      <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#1F4E79]">
                        <Link to="/contact">
                          Nous rendre visite <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild className="bg-[#FF0C00] hover:bg-[#FF0C00]/90 text-white">
                        <a href="tel:+32123456789">
                          <Phone className="mr-2 h-4 w-4" />
                          Nous appeler
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="relative min-h-[400px] bg-gray-100">
                  <iframe
                    title="Localisation VALTRANSAUTO"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2528.987440287365!2d3.9194154767991454!3d50.66592047167404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2f4088f116a8b%3A0x501d10c0b8e7e90!2sRue%20des%20Caches-Apr%C3%A8s%2091%2C%207033%20Cuesmes%2C%20Belgique!5e0!3m2!1sfr!2sfr!4v1701967899566!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    className="absolute inset-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#1F4E79] via-transparent to-transparent opacity-20 pointer-events-none" />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FF0C00] rounded-full animate-pulse" />
                      <span className="font-semibold text-gray-900">Notre showroom</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Venez voir nos véhicules !</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Nous proposons également un service de <strong>livraison à domicile</strong> partout en Belgique 
                et des <strong>essais sur rendez-vous</strong> dans votre région.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-[#FF0C00] to-orange-500 hover:from-[#FF0C00]/90 hover:to-orange-600 text-white px-10 py-6">
                <Link to="/contact" className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5" />
                  Demander une démonstration près de chez vous
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#0C1F30] to-[#0A1725] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553440569-bcc63803a83d')] bg-cover bg-center" />
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <ShoppingBag className="h-16 w-16 text-[#FF0C00] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à trouver votre <span className="text-cyan-300">véhicule idéal</span> ?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Découvrez notre sélection de véhicules garantis et profitez de notre expertise pour un achat en toute confiance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group bg-gradient-to-r from-[#FF0C00] to-orange-600 hover:from-[#FF0C00]/90 hover:to-orange-700 text-white px-10 py-7 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <Link to="/vehicles" className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5" />
                    Explorer notre catalogue
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-10 py-7 rounded-xl text-lg font-semibold">
                  <Link to="/contact" className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    Être rappelé
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;