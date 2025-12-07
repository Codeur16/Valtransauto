import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, ArrowUpRight, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  const services = [
    { name: 'Transport de véhicules', icon: '' },
    { name: 'Réparation mécanique', icon: '' },
    { name: 'Service d\'urgence', icon: '' },
    { name: 'Maintenance préventive', icon: '' },
  ];

  const certifications = [
    { name: 'Certifié ISO 9001', icon: Award },
    { name: 'Garantie 24 mois', icon: Shield },
    { name: 'Assuré tous risques', icon: '' },
  ];

  const quickLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Vente de Véhicules', path: '/vehicles' },
    { name: 'Rendez-vous', path: '/book-appointment' },
    { name: 'À propos', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Mentions légales', path: '/legal' },
    { name: 'Politique de confidentialité', path: '/privacy' },
    { name: 'Admin', path: '/admin' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const IconComponent = ({ icon }) => {
    if (typeof icon === 'string') {
      return <span className="text-2xl">{icon}</span>;
    }
    const Icon = icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-[#1F4E79] text-white">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Vague décorative en haut */}
      <div className="absolute top-0 left-0 right-0 h-12">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="currentColor" 
            className="text-gray-900" 
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Colonne Logo et Description */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              className="flex items-center space-x-4 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={scrollToTop}
            >
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-white to-gray-200 rounded-full p-2 flex-shrink-0 relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500">
                  <img 
                    src={logoUrl} 
                    alt="VALTRANSAUTO Logo" 
                    className="h-full w-full object-contain relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-[#1F4E79] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  VALTRANSAUTO
                </span>
                <span className="text-sm text-blue-200 uppercase tracking-wider mt-1">
                  Transport & Réparation
                </span>
              </div>
            </motion.div>

            <p className="text-white/80 leading-relaxed">
              Votre partenaire de confiance pour le transport et la réparation automobile en Belgique. 
              Expertise, qualité et service depuis plus de 15 ans.
            </p>

            {/* Certifications */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-200 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Nos garanties
              </h4>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                    {typeof cert.icon === 'string' ? (
                      <span className="text-blue-400 text-xl">{cert.icon}</span>
                    ) : (
                      <cert.icon className="h-5 w-5 text-blue-400" />
                    )}
                    <span>{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne Liens Rapides */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 pb-2 border-b border-white/20 relative">
              Navigation
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-[#FF0C00]" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    to={link.path}
                    className="group flex items-center justify-between text-white/80 hover:text-white transition-all duration-300 py-1"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-[#FF0C00] group-hover:w-full transition-all duration-300" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Colonne Services */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-6 pb-2 border-b border-white/20 relative">
              Nos Services
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-[#FF0C00]" />
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
                >
                  <span className="text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                  <span>{service.name}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Colonne Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-6 pb-2 border-b border-white/20 relative">
              Contactez-nous
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-[#FF0C00]" />
            </h3>
            <ul className="space-y-4">
              <motion.li
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5 " />
                </div>
                <div>
                  <p className="text-sm text-white/60">Téléphone</p>
                  <a
                    href="tel:+32123456789"
                    className="text-lg font-semibold group-hover:text-blue-300 transition-colors block"
                  >
                    +32 123 456 789
                  </a>
                </div>
              </motion.li>

              <motion.li
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-[#FF0C00] to-orange-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 " />
                </div>
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <a
                    href="mailto:info@valtransauto.be"
                    className="text-lg font-semibold group-hover:text-blue-300 transition-colors block"
                  >
                    contact@valtransauto.com
                  </a>
                </div>
              </motion.li>

              <motion.li
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Adresse</p>
                  <p className="text-lg font-semibold group-hover:text-blue-300 transition-colors">
                    Belgique
                  </p>
                </div>
              </motion.li>

              <motion.li
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 " />
                </div>
                <div>
                  <p className="text-sm text-white/60">Horaires</p>
                  <div className="space-y-1">
                    <p className="text-white/90">Lun-Ven: 8h00 - 18h00</p>
                    <p className="text-white/70 text-sm">Sam: 9h00 - 13h00</p>
                    <p className="text-white/70 text-sm">Dim: Fermé</p>
                  </div>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Réseaux sociaux et Copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">Suivez-nous :</span>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="p-3 bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 rounded-full group transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right space-y-2">
              <p className="text-white/60 text-sm">
                &copy; {currentYear} VALTRANSAUTO. Tous droits réservés.
              </p>
              <p className="text-white/40 text-xs">
                SIRET: 123 456 789 00012 | TVA: BE0123.456.789
              </p>
            </div>

            {/* Bouton retour en haut */}
            <motion.button
              onClick={scrollToTop}
              className="p-3 bg-gradient-to-br from-blue-500 to-[#1F4E79] rounded-full hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retour en haut"
            >
              <svg 
                className="h-5 w-5 text-white group-hover:-translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Newsletter */}
      
      </div>
    </footer>
  );
};

export default Footer;






// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Phone, Mail, MapPin, Clock } from 'lucide-react';

// const Footer = () => {
//   const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

//   return (
//     <footer className="bg-[#1F4E79] text-white mt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3">
//               <div className="h-12 w-12 bg-white rounded-full p-1 flex-shrink-0">
//                 <img 
//                   src={logoUrl} 
//                   alt="VALTRANSAUTO Logo" 
//                   className="h-full w-full object-contain"
//                 />
//               </div>
//               <span className="text-xl font-bold">VALTRANSAUTO</span>
//             </div>
//             <p className="text-white/80 text-sm">
//               Votre partenaire de confiance pour le transport et la réparation automobile en Belgique.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
//             <ul className="space-y-2 text-sm">
//               <li><Link to="/services" className="text-white/80 hover:text-white transition-colors">Services</Link></li>
//               <li><Link to="/vehicles" className="text-white/80 hover:text-white transition-colors">Véhicules</Link></li>
//               <li><Link to="/book-appointment" className="text-white/80 hover:text-white transition-colors">Rendez-vous</Link></li>
//               <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">À propos</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Contact</h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center space-x-2">
//                 <Phone className="h-4 w-4 text-[#FF0C00]" />
//                 <span className="text-white/80">+32 123 456 789</span>
//               </li>
//               <li className="flex items-center space-x-2">
//                 <Mail className="h-4 w-4 text-[#FF0C00]" />
//                 <span className="text-white/80">info@valtransauto.be</span>
//               </li>
//               <li className="flex items-start space-x-2">
//                 <MapPin className="h-4 w-4 text-[#FF0C00] mt-1" />
//                 <span className="text-white/80">Rue des caches-après 91, 7033 CUESMES, Belgique</span>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Horaires</h3>
//             <ul className="space-y-2 text-sm text-white/80">
//               <li className="flex items-center space-x-2">
//                 <Clock className="h-4 w-4 text-[#FF0C00]" />
//                 <span>Lun-Ven: 8h00 - 18h00</span>
//               </li>
//               <li className="ml-6">Sam: 9h00 - 13h00</li>
//               <li className="ml-6">Dim: Fermé</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
//           <p>&copy; {new Date().getFullYear()} VALTRANSAUTO. Tous droits réservés.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;