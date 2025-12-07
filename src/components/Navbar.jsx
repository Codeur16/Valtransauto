import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = ({ admin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Détecter automatiquement si on est dans l'admin via l'URL
  const isAdminPath = location.pathname.includes('/admin');
  const shouldHideLogo = admin || isAdminPath;

  const navItems = [
    { name: 'Accueil', path: '/' },
    {
      name: 'Services',
      path: '/services',
      // submenu: [
      //   { name: 'Transport', path: '/services/transport' },
      //   { name: 'Réparation', path: '/services/repair' },
      //   { name: 'Maintenance', path: '/services/maintenance' },
      //   { name: 'Dépannage', path: '/services/emergency' },
      // ]
    },
    {
      name: 'Vente de Véhicules',
      path: '/vehicles',
      // submenu: [
      //   { name: 'Notre flotte', path: '/vehicles/fleet' },
      //   { name: 'Location', path: '/vehicles/rental' },
      //   { name: 'Véhicules d\'occasion', path: '/vehicles/used' },
      // ]
    },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Rendez-vous', path: '/book-appointment', highlight: true },
  ];

  // Filtrer les items de navigation pour l'admin (optionnel)
  const filteredNavItems = shouldHideLogo
    ? navItems.filter(item => !['Véhicules', 'Rendez-vous'].includes(item.name))
    : navItems;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const logoUrl = "https://horizons-cdn.hostinger.com/1dcba081-6b5b-4a9f-a514-f86c17a0b858/ca31526bd36dcef6f37c7eeb78a690a6.png";

  // Fermer le menu mobile en changeant de page
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'glass-effect shadow-2xl'
            : 'bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Effet de lumière décoratif */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F4E79]/5 via-transparent to-[#1F4E79]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo avec effet hover - Conditionnel pour admin */}
            {!shouldHideLogo && (
              <Link
                to="/"
                className="flex items-center space-x-3 group relative"
              >
                <motion.div
                  className="h-14 w-14 lg:h-16 lg:w-16 relative flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1F4E79] to-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <img
                    src={logoUrl}
                    alt="VALTRANSAUTO Logo"
                    className="h-full w-full object-contain relative z-10"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1F4E79] to-blue-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                </motion.div>

                <div className="flex flex-col relative">
                  <span className="text-xl md:text-2xl font-bold text-[#1F4E79] tracking-tight relative">
                    VALTRANSAUTO
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F4E79] to-blue-600 group-hover:w-full transition-all duration-500" />
                  </span>
                  <span className="text-xs text-[#5C5C5C] uuppercase tracking-wider mt-1">
                    Vente & Transport  Auto
                  </span>
                </div>
              </Link>
            )}

            {/* Navigation Desktop */}
            <div className={`${shouldHideLogo ? 'flex-1 flex justify-center' : ''} hidden lg:flex items-center space-x-1 relative`}>
              {filteredNavItems.map((item) => (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.submenu ? (
                    <div className="relative">
                      <Link
                        to={item.path}
                        className={`
                          relative px-5 py-3 text-sm font-semibold transition-all duration-300
                          ${isActive(item.path)
                            ? 'text-[#1F4E79]'
                            : 'text-gray-700 hover:text-[#1F4E79]'
                          }
                          ${item.highlight
                            ? 'hover:bg-gradient-to-r hover:from-[#1F4E79] hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/25'
                            : ''
                          }
                          group/navitem
                        `}
                      >
                        <span className="flex items-center gap-1">
                          {item.name}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${hoveredItem === item.path ? 'rotate-180' : ''
                            }`} />
                        </span>

                        {/* Ligne active */}
                        <div className={`
                          absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0
                          bg-gradient-to-r from-[#1F4E79] to-blue-600
                          transition-all duration-500
                          ${isActive(item.path) ? 'w-3/4' : 'group-hover/navitem:w-3/4'}
                        `} />
                      </Link>

                      {/* Submenu */}
                      <AnimatePresence>
                        {hoveredItem === item.path && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 top-full pt-2 min-w-[200px]"
                          >
                            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                              <div className="p-2">
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#1F4E79]/10 hover:text-[#1F4E79] transition-all duration-200 group/subitem"
                                  >
                                    <div className="flex items-center justify-between">
                                      {subItem.name}
                                      <div className="h-1 w-1 rounded-full bg-[#1F4E79] opacity-0 group-hover/subitem:opacity-100 transition-opacity" />
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        relative px-5 py-3 text-sm font-semibold transition-all duration-300
                        ${isActive(item.path)
                          ? 'text-[#1F4E79]'
                          : 'text-gray-700 hover:text-[#1F4E79]'
                        }
                        ${item.highlight
                          ? 'bg-gradient-to-r from-[#1F4E79] to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 rounded-lg'
                          : 'rounded-lg hover:bg-gradient-to-r hover:from-[#1F4E79]/10 hover:to-blue-600/10'
                        }
                        group/navitem
                      `}
                    >
                      {item.name}

                      {/* Effet de fond au hover (sauf pour les boutons highlight) */}
                      {!item.highlight && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F4E79] to-blue-600 rounded-lg opacity-0 group-hover/navitem:opacity-5 transition-opacity duration-300" />
                      )}

                      {/* Ligne active */}
                      <div className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0
                        bg-gradient-to-r from-[#1F4E79] to-blue-600
                        transition-all duration-500
                        ${isActive(item.path) ? 'w-3/4' : 'group-hover/navitem:w-3/4'}
                      `} />
                    </Link>
                  )}
                </div>
              ))}

              {/* Bouton téléphone (masqué en mode admin) */}
              {!shouldHideLogo && (
                <motion.div
                  className="ml-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="tel:+33123456789"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 group/phone"
                  >
                    <Phone className="h-4 w-4 group-hover/phone:animate-pulse" />
                    <span>+32 465 681 845</span>
                  </a>
                </motion.div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-[#1F4E79] group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-[#1F4E79] group-hover:rotate-180 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header menu mobile */}
                <div className="flex justify-between items-center mb-8">
                  {!shouldHideLogo && (
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3"
                    >
                      <div className="h-12 w-12 relative">
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight relative bg-clip-text text-transparent bg-gradient-to-r from-[#004AAD] via-[#ff0c00] to-[#ff0c00]">
  VALTRANSAUTO
</span>
                        <span className="text-xs text-gray-500 uppercase">Transport & Réparation</span>
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation mobile */}
                <div className="space-y-2">
                  {filteredNavItems.map((item) => (
                    <div key={item.path} className="overflow-hidden">
                      {item.submenu ? (
                        <details className="group">
                          <summary className={`
                            flex items-center justify-between p-4 rounded-lg cursor-pointer
                            ${isActive(item.path)
                              ? 'bg-gradient-to-r from-[#1F4E79]/10 to-blue-600/10 text-[#1F4E79] border-l-4 border-[#1F4E79]'
                              : 'hover:bg-gray-100 text-gray-700'
                            }
                            transition-all duration-200
                          `}>
                            <span className="font-semibold">{item.name}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="ml-4 mt-1 space-y-1">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => setIsOpen(false)}
                                className="block p-3 rounded-lg text-gray-600 hover:bg-[#1F4E79]/10 hover:text-[#1F4E79] transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`
                            block p-4 rounded-lg font-semibold transition-all duration-200
                            ${isActive(item.path)
                              ? 'bg-gradient-to-r from-[#1F4E79] to-blue-600 text-white shadow-lg'
                              : item.highlight
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#1F4E79]/10 hover:to-blue-600/10 hover:text-[#1F4E79]'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            {item.name}
                            {item.highlight && (
                              <Phone className="h-4 w-4" />
                            )}
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact mobile (masqué en mode admin) */}
                {!shouldHideLogo && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <a
                      href="tel:+33123456789"
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-5 w-5 animate-pulse" />
                      <div className="text-center">
                        <div className="text-sm opacity-90">Appelez-nous</div>
                        <div className="text-lg">01 23 45 67 89</div>
                      </div>
                    </a>

                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Lun - Ven: 8h - 19h</p>
                      <p>Sam: 9h - 17h</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Espace pour la navbar fixe */}
      <div className="h-20 lg:h-24" />
    </>
  );
};

export default Navbar;