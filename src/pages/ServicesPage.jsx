import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Shield, Truck, Wrench, Calendar, MapPin,
  ClipboardCheck, Car, Package, ChevronRight,
  Clock, CheckCircle, Users, Award, Phone,
  Sparkles, ArrowRight, ShoppingBag, Target,
  TrendingUp, Key, Euro
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const [hoveredService, setHoveredService] = useState(null);

  // Vente de véhicules - Service principal en grand
  const featuredServices = [
    {
      icon: ShoppingBag,
      title: 'Vente de Véhicules',
      description: 'Large sélection de véhicules d\'occasion de qualité, inspectés et garantis. Trouvez la voiture parfaite avec notre expertise.',
      features: [
        'Large sélection de véhicules',
        'Inspection complète 150 points',
        'Garantie minimale 12 mois',
        'Financement sur mesure',
        'Reprise de votre ancien véhicule',
        'Service après-vente inclus'
      ],
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
      color: 'from-[#FF0C00] to-orange-500',
      accentColor: 'bg-gradient-to-r from-[#FF0C00] to-orange-500',
      stats: '100+ véhicules disponibles',
      duration: 'Visite sur rendez-vous',
      ctaText: 'Voir les véhicules',
      ctaLink: '/vehicles',
      isFeatured: true
    }
  ];

  // Autres services
  const secondaryServices = [
    {
      icon: Truck,
      title: 'Transport & Remorquage',
      description: 'Service de transport automobile professionnel et remorquage d\'urgence disponible 24h/24.',
      features: [
        'Transport sécurisé',
        'Remorquage 24/7',
        'Assurance complète',
        'Livraison à domicile',
        'Couverture nationale'
      ],
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      color: 'from-gray-900 to-gray-700',
      accentColor: 'bg-gradient-to-r from-gray-900 to-gray-700',
      stats: '30 min max',
      duration: 'Disponible 24/7'
    },
    {
      icon: Wrench,
      title: 'Réparation Mécanique',
      description: 'Expertise complète avec diagnostic électronique avancé et garantie sur pièces.',
      features: [
        'Diagnostic électronique',
        'Réparation moteur/transmission',
        'Système de freinage',
        'Électricité automobile',
        'Garantie 2 ans'
      ],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      color: 'from-emerald-500 to-green-400',
      accentColor: 'bg-gradient-to-r from-emerald-500 to-green-400',
      stats: 'Garantie 2 ans',
      duration: 'Sur devis'
    },
    {
      icon: Shield,
      title: 'Contrôle Technique',
      description: 'Inspection complète selon les normes belges les plus strictes avec rapport détaillé instantané.',
      features: [
        'Contrôle périodique obligatoire',
        'Inspection pré-achat',
        'Vérification sécurité complète',
        'Rapport détaillé instantané',
        'Conseils personnalisés'
      ],
      image: 'https://images.unsplash.com/photo-1595872018818-97555653a011?auto=format&fit=crop&w=800&q=80',
      color: 'from-blue-500 to-cyan-400',
      accentColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
      stats: '99% de satisfaction',
      duration: '45 min'
    },
    {
      icon: Calendar,
      title: 'Entretien & Maintenance',
      description: 'Services d\'entretien préventif pour maximiser la durée de vie de votre véhicule.',
      features: [
        'Vidange et filtres',
        'Révision complète',
        'Contrôle pneumatiques',
        'Climatisation',
        'Rappels automatiques'
      ],
      image: 'https://images.unsplash.com/photo-1563720223484-21c6c2d3c634?auto=format&fit=crop&w=800&q=80',
      color: 'from-violet-500 to-purple-400',
      accentColor: 'bg-gradient-to-r from-violet-500 to-purple-400',
      stats: 'Clients fidèles',
      duration: '1-2 heures'
    },
    {
      icon: ClipboardCheck,
      title: 'Dépannage Assistance',
      description: 'Aide immédiate en cas de panne avec diagnostic et réparation sur place.',
      features: [
        'Diagnostic sur place',
        'Réparation d\'urgence',
        'Disponibilité 24/7',
        'Équipe expérimentée',
        'Tarifs fixes'
      ],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      color: 'from-amber-500 to-orange-400',
      accentColor: 'bg-gradient-to-r from-amber-500 to-orange-400',
      stats: '15 min réponse',
      duration: 'Sur devis'
    },
    {
      icon: Package,
      title: 'Plaques Garage',
      description: 'Gestion simplifiée des plaques professionnelles avec assistance administrative.',
      features: [
        'Demande simplifiée',
        'Plaques temporaires',
        'Conformité légale',
        'Assistance administrative',
        'Renouvellement facile'
      ],
      image: 'https://images.unsplash.com/photo-1568668392983-97bb8768d29f?auto=format&fit=crop&w=800&q=80',
      color: 'from-rose-500 to-pink-400',
      accentColor: 'bg-gradient-to-r from-rose-500 to-pink-400',
      stats: '48h traitement',
      duration: 'Administratif'
    },
    {
      icon: MapPin,
      title: 'Service Mobile',
      description: 'Nos mécaniciens se déplacent à votre domicile ou bureau pour un gain de temps optimal.',
      features: [
        'Intervention à domicile',
        'Diagnostic sur place',
        'Réparations mineures',
        'Entretien régulier',
        'Gain de temps'
      ],
      image: 'https://images.unsplash.com/photo-1492144434756-4c6f0e6e7bca?auto=format&fit=crop&w=800&q=80',
      color: 'from-indigo-500 to-blue-400',
      accentColor: 'bg-gradient-to-r from-indigo-500 to-blue-400',
      stats: 'Service Premium',
      duration: 'Sur rendez-vous'
    }
  ];

  const stats = [
    { icon: ShoppingBag, value: '500+', label: 'Véhicules vendus' },
    { icon: Clock, value: '24/7', label: 'Disponibilité' },
    { icon: Users, value: '10K+', label: 'Clients satisfaits' },
    { icon: Award, value: '15+', label: "Années d'expérience" },
    { icon: CheckCircle, value: '100%', label: 'Garantie qualité' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction' }
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

  return (
    <>
      <Helmet>
        <title>Nos Services - VALTRANSAUTO | Excellence Automobile en Belgique</title>
        <meta name="description" content="Services automobiles complets : vente de véhicules d'occasion, transport et remorquage, réparations garanties, entretien professionnel." />
      </Helmet>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white py-28 md:py-36">
          <div className="absolute inset-0 bg-black/20 z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-15 mix-blend-overlay" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm font-medium">Service Principal</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                  Vente & Services
                </span>
                <br />
                <span className="text-3xl md:text-5xl text-cyan-200">
                  Automobiles
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                Trouvez votre <span className="font-semibold text-cyan-200">véhicule idéal</span> et profitez de nos
                <span className="font-semibold text-cyan-200"> services experts</span> pour l'entretenir et le réparer
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="group bg-gradient-to-r from-[#FF0C00] to-orange-600 hover:from-[#FF0C00]/90 hover:to-orange-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/vehicles" className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Voir nos véhicules
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl">
                  <Link to="/contact" className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Demander un service
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats floating cards */}
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-default"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 mb-2 md:mb-3">
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Vente de Véhicules - Mise en avant */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#FF0C00]/10 border border-[#FF0C00]/20">
                <ShoppingBag className="h-4 w-4 text-[#FF0C00]" />
                <span className="text-sm font-medium text-[#FF0C00]">Notre spécialité</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Trouvez votre <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF0C00] to-orange-500">véhicule idéal</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Une sélection rigoureuse de véhicules d'occasion garantis, prêts à vous accompagner
              </p>
            </motion.div>

            {/* Carte principale de vente */}
            <div className="mb-16">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
                >
                  <div className="grid lg:grid-cols-2">
                    {/* Image side */}
                    <div className="relative h-64 lg:h-auto min-h-[400px] overflow-hidden">
                      <div className={`absolute inset-0 ${service.color} opacity-90`} />
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-6 left-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                          <service.icon className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4">
                          <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-white/90">{service.stats}</span>
                            <ChevronRight className="h-6 w-6 text-white/80" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="p-8 md:p-12">
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0C00]/10 mb-4">
                          <Sparkles className="h-4 w-4 text-[#FF0C00]" />
                          <span className="text-sm font-medium text-[#FF0C00]">Service premium</span>
                        </div>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Features grid */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF0C00] to-orange-500 mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Benefits */}
                      <div className="bg-gradient-to-r from-[#1F4E79]/5 to-transparent rounded-2xl p-6 mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pourquoi choisir VALTRANSAUTO ?</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {vehicleBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white">
                                <benefit.icon className="h-5 w-5 text-[#FF0C00]" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{benefit.title}</p>
                                <p className="text-xs text-gray-600">{benefit.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="space-y-4">
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-[#FF0C00] to-orange-500 hover:from-[#FF0C00]/90 hover:to-orange-600 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link to={service.ctaLink}>
                            <span className="flex items-center justify-center gap-3">
                              <ShoppingBag className="h-5 w-5" />
                              {service.ctaText}
                              <ArrowRight className="h-5 w-5" />
                            </span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-2 border-[#1F4E79] text-[#1F4E79] hover:bg-[#1F4E79] hover:text-white py-6 rounded-xl text-lg font-semibold"
                        >
                          <Link to="/contact">
                            <span className="flex items-center justify-center gap-3">
                              <Phone className="h-5 w-5" />
                              Demander une démonstration
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Section Autres Services */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos <span className="text-[#1F4E79]">Services Complémentaires</span>
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pour entretenir, réparer et transporter votre véhicule en toute confiance
              </p>
            </motion.div>

            {/* Grid des autres services */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                >
                  {/* Card Header */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 ${service.color} opacity-90`} />
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </span>
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/90">{service.stats}</span>
                        <ChevronRight className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={{
                            opacity: hoveredService === index ? 1 : 0.8,
                            x: hoveredService === index ? 0 : -5
                          }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-2 h-2 rounded-full ${service.accentColor} mt-2 flex-shrink-0`} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      asChild
                      className={`w-full group relative overflow-hidden ${service.accentColor} hover:opacity-90 text-white rounded-xl py-6 transition-all duration-300`}
                    >
                      <Link to="/book-appointment">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Réserver ce Service
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144434756-4c6f0e6e7bca?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Besoin d'un <span className="text-cyan-300">véhicule</span> ou d'un <span className="text-cyan-300">service</span> ?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Notre équipe est là pour vous accompagner dans tous vos projets automobiles
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="group bg-gradient-to-r from-[#FF0C00] to-orange-600 hover:from-[#FF0C00]/90 hover:to-orange-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <Link to="/vehicles" className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5" />
                      Découvrir nos véhicules
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 rounded-xl text-lg font-semibold">
                    <Link to="/book-appointment" className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      Prendre rendez-vous
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;