import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Fuel, Gauge, Calendar, MapPin, Phone,
  Search, Filter, Heart, Eye, ArrowLeft,
  ChevronRight, ChevronLeft, Star, CheckCircle,
  Shield, Users, X, Camera, PhoneCall, MessageCircle,
  Zap, Settings, Tag, Droplet, DoorOpen, Palette,
  ChevronDown, ChevronUp, Menu, X as XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import VehicleViewTracker from '@/components/VehicleViewTracker';

const PHONE_NUMBER = ' +32 465 71 62 51';
const WHATSAPP_NUMBER = '32465716251'; // Sans le + pour WhatsApp

// Fonction pour parser les URLs d'images séparées par des virgules
const parseImageUrls = (imageUrlString) => {
  if (!imageUrlString || typeof imageUrlString !== 'string') {
    return [];
  }
  
  // Supprimer les espaces et diviser par les virgules
  const urls = imageUrlString
    .split(',')
    .map(url => url.trim())
    .filter(url => url && url.length > 0);
  
  return urls;
};

// Composant pour afficher les détails d'un véhicule
const VehicleDetails = ({ vehicle, onBack, onToggleFavorite, isFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = parseImageUrls(vehicle.image_url);
  
  // Si pas d'images, utiliser une image par défaut
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Fonction pour contacter sur WhatsApp
  const handleWhatsAppContact = () => {
    const message = `Bonjour, je suis intéressé(e) par votre véhicule :\n\n` +
                   `*${vehicle.make} ${vehicle.model} ${vehicle.year}*\n` +
                   `Prix : €${vehicle.price?.toLocaleString()}\n` +
                   `Kilométrage : ${(vehicle.mileage || 0).toLocaleString()} km\n` +
                   `Carburant : ${vehicle.fuel_type || ''}\n` +
                   `${vehicle.description ? `Description : ${vehicle.description.substring(0, 100)}...\n` : ''}\n` +
                   `Je souhaite en savoir plus sur ce véhicule et éventuellement organiser une visite.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Fonction pour partager le véhicule
  const handleShare = async () => {
    const shareText = `🚗 ${vehicle.make} ${vehicle.model} ${vehicle.year} - €${vehicle.price?.toLocaleString()}\n\nVoir sur VALTRANSAUTO`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.make} ${vehicle.model}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur de partage:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const features = [
    { icon: Calendar, label: 'Année', value: vehicle.year, show: vehicle.year },
    { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km`, show: vehicle.mileage },
    { icon: Fuel, label: 'Carburant', value: vehicle.fuel_type, show: vehicle.fuel_type },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission, show: vehicle.transmission },
    { icon: Zap, label: 'Puissance', value: vehicle.power, show: vehicle.power },
    { icon: Droplet, label: 'Consommation', value: vehicle.consumption, show: vehicle.consumption },
    { icon: Users, label: 'Places', value: vehicle.seats, show: vehicle.seats },
    { icon: DoorOpen, label: 'Portes', value: vehicle.doors, show: vehicle.doors },
    { icon: Palette, label: 'Couleur', value: vehicle.color, show: vehicle.color },
    { icon: MapPin, label: 'Localisation', value: vehicle.location, show: vehicle.location },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-white">
      <div>
        <title>{`${vehicle.make} ${vehicle.model} - VALTRANSAUTO`}</title>
        <meta name="description" content={vehicle.description} />
      </div>

      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour à la liste
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700">
                {vehicle.make} {vehicle.model}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100">
              <div className="relative">
                <img
                  src={displayImages[currentImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model} - Image ${currentImageIndex + 1}`}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
                  }}
                />
                
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Miniatures */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === idx ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vehicle.make} ${idx + 1}`}
                      className="w-full h-16 md:h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails du véhicule */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    {vehicle.year && <span>{vehicle.year}</span>}
                    {vehicle.mileage && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{vehicle.mileage?.toLocaleString()} km</span>
                      </>
                    )}
                    {vehicle.fuel_type && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{vehicle.fuel_type}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#FF0C00]">
                  €{vehicle.price?.toLocaleString()}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-5 w-5" />
                  Partager
                </Button>
                <Button
                  variant="ghost"
                  onClick={onToggleFavorite}
                  className={`flex items-center gap-2 ${
                    isFavorite ? 'text-rose-500' : 'text-gray-700'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  {isFavorite ? 'Favori' : 'Favoris'}
                </Button>
              </div>
            </div>

            {/* Caractéristiques */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1F4E79] p-2 rounded-lg">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{feature.label}</div>
                        <div className="font-semibold text-gray-900">{feature.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="grid md:grid-cols-2 gap-4 pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-[#1F4E79] to-blue-600 hover:opacity-90 text-white py-4 rounded-xl"
              >
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Réserver une visite
                </Link>
              </Button>

              <Button
                asChild
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white py-4 rounded-xl"
              >
                <a href={`tel:${PHONE_NUMBER}`}>
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Appeler maintenant
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de carte véhicule
const VehicleCard = ({ vehicle, isFavorite, onToggleFavorite, onViewDetails, props }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = parseImageUrls(vehicle.image_url);
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full cursor-pointer"
      onClick={onViewDetails}
    >
 
    <VehicleViewTracker vehicleId={vehicle.id} />

      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={displayImages[currentImageIndex]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Navigation des images */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Indicateur du nombre d'images */}
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {displayImages.length} photo{displayImages.length > 1 ? 's' : ''}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.is_featured && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Star className="h-3 w-3 mr-1" />
              <span>Premium</span>
            </div>
          )}
        </div>

        {/* Favori et vues */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              isFavorite 
                ? 'bg-rose-500/90 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
            <Eye className="h-3 w-3 text-white mr-1" />
            <span className="text-xs text-white">{vehicle.views_count || 0}</span>
          </div>
        </div>

        {/* Prix */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-gradient-to-r from-[#FF0C00] to-orange-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
            €{vehicle.price?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Détails du véhicule */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            {vehicle.year && <span>{vehicle.year}</span>}
            {vehicle.mileage && (
              <>
                <span className="mx-2">•</span>
                <span>{vehicle.mileage?.toLocaleString()} km</span>
              </>
            )}
            {vehicle.fuel_type && (
              <>
                <span className="mx-2">•</span>
                <span>{vehicle.fuel_type}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Calendar, label: 'Année', value: vehicle.year, show: vehicle.year },
            { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km`, show: vehicle.mileage },
            { icon: Fuel, label: 'Carburant', value: vehicle.fuel_type, show: vehicle.fuel_type },
            { icon: Settings, label: 'Transmission', value: vehicle.transmission, show: vehicle.transmission },
            { icon: MapPin, label: 'Localisation', value: vehicle.location, show: vehicle.location },
            { icon: Zap, label: 'Puissance', value: vehicle.power, show: vehicle.power },
          ]
          .filter(item => item.show)
          .map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <item.icon className="h-4 w-4 text-[#1F4E79] flex-shrink-0" />
              <span className="truncate" title={item.value}>{item.value}</span>
            </div>
          ))}
        </div>

        {vehicle.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {vehicle.description}
          </p>
        )}

        <div className="flex gap-3 mt-auto">
          <Button
            onClick={onViewDetails}
            className="flex-1 bg-gradient-to-r from-[#1F4E79] to-blue-600 hover:from-[#1F4E79]/90 hover:to-blue-600/90 text-white rounded-xl"
          >
            Voir Détails
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <a href={`tel:${PHONE_NUMBER}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Sidebar pour les filtres
const FiltersSidebar = ({ filters, setFilters, resetFilters, vehicleCount, showFilters, setShowFilters }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Bouton mobile pour ouvrir les filtres */}
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full bg-[#1F4E79] text-white flex items-center justify-center"
        >
          {isMobileOpen ? <XIcon className="h-5 w-5 mr-2" /> : <Filter className="h-5 w-5 mr-2" />}
          {isMobileOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'} ({vehicleCount})
        </Button>
      </div>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar des filtres */}
      <div className={`
        ${isMobileOpen ? 'fixed inset-y-0 left-0 z-50 w-80' : 'hidden'}
        md:block md:relative md:w-72
        bg-white border-r border-gray-200 overflow-y-auto
      `}>
        <div className="p-4 md:p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
            <Button
              onClick={resetFilters}
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              Réinitialiser
            </Button>
          </div>

          {/* Prix */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <span>Prix (€)</span>
              <span className="ml-auto text-xs text-gray-500">
                {filters.minPrice.toLocaleString()}€ - {filters.maxPrice.toLocaleString()}€
              </span>
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Année */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Année</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">De</label>
                <select
                  value={filters.minYear}
                  onChange={(e) => setFilters({ ...filters, minYear: Number(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 text-sm py-2"
                >
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">À</label>
                <select
                  value={filters.maxYear}
                  onChange={(e) => setFilters({ ...filters, maxYear: Number(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 text-sm py-2"
                >
                  {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Carburant */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Carburant</h3>
            <select
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              className="w-full rounded-lg border-gray-300 text-sm py-2"
            >
              <option value="">Tous carburants</option>
              {['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Transmission</h3>
            <select
              value={filters.transmission}
              onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
              className="w-full rounded-lg border-gray-300 text-sm py-2"
            >
              <option value="">Toutes boîtes</option>
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>

          {/* Kilométrage */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Kilométrage (km)
              <span className="ml-auto text-xs text-gray-500">
                Jusqu'à {filters.maxMileage.toLocaleString()} km
              </span>
            </h3>
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={filters.maxMileage}
              onChange={(e) => setFilters({ ...filters, maxMileage: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Tri */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Trier par</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full rounded-lg border-gray-300 text-sm py-2"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year-desc">Année récente</option>
              <option value="mileage-asc">Kilométrage croissant</option>
              <option value="mileage-desc">Kilométrage décroissant</option>
            </select>
          </div>

          {/* Bouton fermer mobile */}
          {isMobileOpen && (
            <Button
              onClick={() => setIsMobileOpen(false)}
              className="w-full bg-[#1F4E79] text-white mt-6 md:hidden"
            >
              Afficher {vehicleCount} véhicule{vehicleCount !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

// Page principale
function VehicleSalesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    minYear: 1990,
    maxYear: new Date().getFullYear() + 1,
    fuelType: '',
    transmission: '',
    minMileage: 0,
    maxMileage: 300000,
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Charger les véhicules
  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log("vehicles:", data);

        // Transformer les données
        const transformed = (data || []).map(vehicle => ({
          ...vehicle,
          views: vehicle.views_count || 0,
          is_featured: vehicle.features || false
        }));

        if (isMounted) {
          setVehicles(transformed);
          setFilteredVehicles(transformed);
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Impossible de charger les véhicules: ' + (error.message || 'Erreur inconnue')
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Charger les favoris depuis le stockage local
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('vehicle_favorites') || '[]');
      setFavorites(savedFavorites);
    } catch (e) {
      console.error('Error loading favorites:', e);
    }

    loadVehicles();

    // Nettoyage
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Filtrer et trier les véhicules
  useEffect(() => {
    let result = [...vehicles];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle =>
        `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.description || ''}`
          .toLowerCase()
          .includes(term)
      );
    }

    // Filtres avancés
    result = result.filter(vehicle => {
      return (
        vehicle.price >= filters.minPrice &&
        vehicle.price <= filters.maxPrice &&
        vehicle.year >= filters.minYear &&
        vehicle.year <= filters.maxYear &&
        vehicle.mileage >= filters.minMileage &&
        vehicle.mileage <= filters.maxMileage &&
        (filters.fuelType ? vehicle.fuel_type === filters.fuelType : true) &&
        (filters.transmission ? vehicle.transmission === filters.transmission : true)
      );
    });

    // Tri
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': return (a.price || 0) - (b.price || 0);
        case 'price-desc': return (b.price || 0) - (a.price || 0);
        case 'year-desc': return (b.year || 0) - (a.year || 0);
        case 'mileage-asc': return (a.mileage || 0) - (b.mileage || 0);
        case 'mileage-desc': return (b.mileage || 0) - (a.mileage || 0);
        default: return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    setFilteredVehicles(result);
  }, [vehicles, filters, searchTerm]);

  // Gestion des favoris
  const toggleFavorite = (vehicleId) => {
    const newFavorites = favorites.includes(vehicleId)
      ? favorites.filter(id => id !== vehicleId)
      : [...favorites, vehicleId];
    
    setFavorites(newFavorites);
    localStorage.setItem('vehicle_favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(vehicleId) ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: favorites.includes(vehicleId)
        ? 'Le véhicule a été retiré de vos favoris'
        : 'Le véhicule a été ajouté à vos favoris'
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      minYear: 1990,
      maxYear: new Date().getFullYear() + 1,
      fuelType: '',
      transmission: '',
      minMileage: 0,
      maxMileage: 300000,
      sortBy: 'newest'
    });
    setSearchTerm('');
  };

  // Afficher les détails d'un véhicule
  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si un véhicule est sélectionné, afficher sa page de détails
  if (selectedVehicle) {
    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
        onToggleFavorite={() => toggleFavorite(selectedVehicle.id)}
        isFavorite={favorites.includes(selectedVehicle.id)}
      />
    );
  }

  // Afficher la liste des véhicules
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <title>Véhicules d'occasion - VALTRANSAUTO</title>
        <meta name="description" content="Découvrez notre sélection de véhicules d'occasion de qualité à Bruxelles. Large choix de marques et modèles au meilleur prix." />
      </div>

      {/* En-tête */}
      <div className="bg-gradient-to-r from-[#1F4E79] to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Notre Sélection de Véhicules</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Découvrez notre gamme de véhicules d'occasion rigoureusement sélectionnés
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un véhicule..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar des filtres */}
          <FiltersSidebar 
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            vehicleCount={filteredVehicles.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Liste des véhicules */}
          <div className="flex-1">
            {/* En-tête des résultats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} disponible{filteredVehicles.length !== 1 ? 's' : ''}
                </h2>
                {searchTerm && (
                  <p className="text-gray-600 text-sm">
                    Résultats pour : "{searchTerm}"
                  </p>
                )}
              </div>
              
              {/* Sélecteur de tri pour mobile */}
              <div className="w-full md:w-auto">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full md:w-auto rounded-lg border-gray-300 text-sm py-2"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="year-desc">Année récente</option>
                  <option value="mileage-asc">Kilométrage croissant</option>
                  <option value="mileage-desc">Kilométrage décroissant</option>
                </select>
              </div>
            </div>

            {/* Liste des véhicules */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? 'Aucun véhicule ne correspond à votre recherche.'
                    : 'Aucun véhicule disponible pour le moment.'}
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isFavorite={favorites.includes(vehicle.id)}
                    onToggleFavorite={() => toggleFavorite(vehicle.id)}
                    onViewDetails={() => handleViewDetails(vehicle)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Section CTA */}
      <section className="bg-gradient-to-r from-[#1F4E79] to-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous ne trouvez pas votre véhicule idéal ?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Notre équipe est à votre écoute pour vous aider à trouver le véhicule qui correspond à vos attentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1F4E79] hover:bg-gray-100"
            >
              <Link to="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Nous contacter
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href={`tel:${PHONE_NUMBER}`}>
                <Phone className="mr-2 h-5 w-5" />
                {PHONE_NUMBER}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VehicleSalesPage;