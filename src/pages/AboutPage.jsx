import React from 'react';
import { motion } from 'framer-motion';
import {
  Award, Users, Target, Shield, Clock, CheckCircle,
  Star, Quote, Heart, Car, Wrench, MapPin,
  Phone, Mail, Linkedin, Facebook, Instagram,
  Sparkles, ArrowRight, BadgeCheck, TrendingUp, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  // Définition de imageMosaic
  const imageMosaic = [
    'https://69355664f89ee454602ca7e4.imgix.net/KiavengaBlanche4.jpeg',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&h=400&q=80'
  ];

  // Définition de milestones
  const milestones = [
    {
      year: '2008',
      title: 'Fondation',
      description: 'Ouverture du premier atelier avec 2 employés passionnés'
    },
    {
      year: '2012',
      title: 'Expansion',
      description: 'Ouverture du deuxième site et agrandissement de l\'équipe'
    },
    {
      year: '2015',
      title: 'Innovation',
      description: 'Introduction des technologies de diagnostic avancées'
    },
    {
      year: '2020',
      title: 'Leader Régional',
      description: 'Reconnu comme leader des services automobiles en Belgique'
    }
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Prestations de qualité élevés dans chaque intervention',
      color: 'from-blue-500 to-cyan-400',
      stats: '99% de satisfaction'
    },
    {
      icon: Shield,
      title: 'Fiabilité',
      description: 'Service transparent sur lequel vous pouvez compter',
      color: 'from-emerald-500 to-green-400',
      stats: '10 ans d\'expérience'
    },
    {
      icon: Users,
      title: 'Proximité',
      description: 'Relation de confiance avec chacun de nos clients',
      color: 'from-blue-500 to-cyan-400',
      stats: '500+ clients'
    },
    {
      icon: Target,
      title: 'Expertise',
      description: 'Techniciens qualifiés avec expertise reconnue',
      color: 'from-violet-500 to-purple-400',
      stats: ''
    }
  ];

  return (
    <>
      <div>
        <title>À Propos de VALTRANSAUTO | Excellence Automobile depuis 2008</title>
        <meta name="description" content="Découvrez VALTRANSAUTO : notre histoire, nos valeurs, notre équipe passionnée. Leader des services automobiles en Belgique depuis plus de 15 ans." />
      </div>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A] text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Depuis 2008</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                  Notre Histoire
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                De la passion pour l'automobile à l'excellence du service, découvrez
                <span className="font-semibold text-cyan-200"> l'aventure VALTRANSAUTO </span>
                à travers les années
              </p>
            </motion.div>
          </div>
        </section>

   

      
        {/* Next Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-cyan-600">
                    Des solutions personnalisées
                  </span>
                </h2>

                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  {/* par <span className="font-semibold text-blue-700">Marc Dubois</span> */}
                  <p>
                   VALTRANSAUTO offre un ensemble de services personnalisés à une variété de clientèle à l'international. A côté des principales offres se greffent des services particuliers qui visent tous à singulariser les prestations. Notre offre repose sur trois piliers fondamentaux: - La qualité de service L'entreprise est managée par une équipe de professionnels qui répondent chacun à une demande particulière. Chaque prestation de l'entreprise est adossée sur l'expertise des collaborateurs expérimentés, flexibles pour offrir un service de qualité selon les standards de coûts et de délais. - La sécurité Orientée vers les prestations à l'international, l'entreprise fait de la sécurité un point d'honneur. Aux conditions de coût et de délai, s'ajoute la sécurité des prestations (réparations, dépannage, entretien, …)faites dans les conditions requises. La sécurité s'invite à partir du diagnostic qui lui-même est tributaire à la nature des pannes jusqu’à la résolutiondu problème (livraison du véhicule au client) sans surcoût encore moins de la détérioration du véhicule. - La confiance et la satisfaction L'objectif principal de l'entreprise est de satisfaire l'ensemble de ses clients. Le caractère personnalisé des prestations impose une certaine flexibilité des actifs de la structure. Celle-ci entretien une confiance entre les partenaires (vendeurs de pièces de rechanges, partenaires techniques, …) pour un meilleur rendu au client.
                   </p>
                </div>
              </motion.div>

             
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 h-full">
                  {imageMosaic.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative rounded-2xl overflow-hidden group ${
                        [0, 3].includes(index) ? 'md:row-span-2' : ''
                      } ${index === 0 ? 'md:col-span-2' : ''}`}
                    >
                      <img
                        src={img}
                        alt={`VALTRANSAUTO ${index + 1}`}
                        className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>


  {/* Notre Histoire */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Box with Hover Effect */}
              <motion.div 
                className="relative rounded-2xl overflow-hidden group h-full min-h-[400px]"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://69355664f89ee454602ca7e4.imgix.net/about-val.png"
                  alt="Équipe Valtransauto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-cyan-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <h3 className="text-2xl font-bold mb-2">Notre Expertise</h3>
                    <p className="text-blue-100">15 ans d'expérience moyenne par expert</p>
                  </div>
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-cyan-600">
                    Expérience internationale
                  </span>
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Notre équipe est dotée d'individus dont l'expérience moyenne est de 15 ans dans le domaine d'expertise auto, de dépannage, de carrosserie, de peinture auto. Leur expérience leur permet de diagnostiquer les marques et modèles des plus anciens aux plus récents grâce à un recyclage continu effectué auprès des concessionnaires européens.
                  </p>
                  <p>
                    Equipé d'un matériel de travail de dernière génération, l'équipe effectue pour le compte de nos clients des interventions d'enlèvement, de diagnostic, de réparation des véhicules. A l'aide de son dynamisme, elle élargie son rayon d'intervention au-delà de la Belgique. L'équipe opère une expertise sur tout véhicule avant sa mise en ligne sur notre site pour les véhicules en vente.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Message du Directeur */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-center">

                <div className="lg:w-1/3 flex justify-center">
                  <div className="flex items-center justify-center rounded-full w-64 h-64 bg-blue-100 shadow-lg border-4 border-blue-200">
                    <User className="w-32 h-32 text-blue-600" />
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <div className="mb-8">
                    <Quote className="h-12 w-12 text-blue-600 mb-4" />
                    <p className="text-2xl md:text-3xl text-gray-900 italic leading-relaxed">
                      "Notre passion pour l'automobile nous pousse chaque jour à dépasser les attentes de nos clients."
                    </p>
                  </div>

                  <p className="text-blue-600 font-medium mb-6">Directeur</p>

                  {/* Statistiques */}
                  {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700 mb-2">10 ans</div>
                      <div className="text-gray-600">d'expérience</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700 mb-2">30+</div>
                      <div className="text-gray-600">collaborateurs</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700 mb-2">2</div>
                      <div className="text-gray-600">sites en Belgique</div>
                    </div>
                  </div> */}

                  {/* Spécialités */}
                  {/* <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">Spécialités :</h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                        Stratégie
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                        Management
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                        Relations Clients
                      </span>
                    </div>
                  </div> */}

                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nos <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-cyan-600">Valeurs</span> Fondamentales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Les principes qui guident chaque décision et chaque action au sein de VALTRANSAUTO
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 h-full border border-gray-100 group-hover:border-transparent group-hover:shadow-2xl transition-all duration-500">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 mb-4">{value.description}</p>
                    <div className="text-sm font-semibold text-gray-500">{value.stats}</div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-5 -z-10 transition-opacity duration-500`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F4E79] via-blue-900 to-[#0A2A4A]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêts à <span className="text-cyan-300">Collaborer</span> avec Nous ?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Rejoignez la grande famille VALTRANSAUTO et découvrez pourquoi des milliers de clients nous font confiance chaque année
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-7 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <Link to="/contact" className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    Prendre Contact
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-10 py-7 rounded-xl text-lg font-semibold">
                  <Link to="/services" className="flex items-center gap-3">
                    <Car className="h-5 w-5" />
                    Découvrir Nos Services
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Heart, value: '99%', label: 'Satisfaction' },
                  { icon: Users, value: '500+', label: 'Clients' },
                  { icon: Clock, value: '24/7', label: 'Disponibilité' },
                  { icon: Award, value: '10+', label: 'Années Expérience' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;