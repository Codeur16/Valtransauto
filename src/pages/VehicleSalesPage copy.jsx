import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Fuel, Gauge, Calendar, MapPin, Phone,
  Search, Filter, Heart, Eye, ArrowLeft,
  ChevronRight, ChevronLeft, Star, CheckCircle,
  Shield, Users, X, Camera, PhoneCall, MessageCircle,
  Zap, Settings, Tag, Droplet, DoorOpen, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const PHONE_NUMBER = '+32 2 123 45 67'; // À remplacer par votre numéro

// Composant pour afficher les détails d'un véhicule
const VehicleDetails = ({ vehicle, onBack, onToggleFavorite, isFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.images || [vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const features = [
    { icon: Calendar, label: 'Année', value: vehicle.year },
    { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km` },
    { icon: Fuel, label: 'Carburant', value: vehicle.fuel_type },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: Zap, label: 'Puissance', value: vehicle.power || '---' },
    { icon: Droplet, label: 'Consommation', value: vehicle.consumption || '---' },
    { icon: Users, label: 'Places', value: vehicle.seats || '---' },
    { icon: DoorOpen, label: 'Portes', value: vehicle.doors || '---' },
    { icon: Palette, label: 'Couleur', value: vehicle.color || '---' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour à la liste
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-[500px]">
            <img
              src={images[currentImageIndex]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
              }}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === idx ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${vehicle.make} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails du véhicule */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center text-lg text-gray-600 mt-1">
                <span>{vehicle.year}</span>
                <span className="mx-2">•</span>
                <span>{vehicle.mileage?.toLocaleString()} km</span>
                <span className="mx-2">•</span>
                <span>{vehicle.fuel_type}</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-[#FF0C00]">
              €{vehicle.price?.toLocaleString()}
            </div>
          </div>

          {/* Caractéristiques principales */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              feature.value && (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-[#1F4E79]/10 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-[#1F4E79]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{feature.label}</div>
                    <div className="font-medium">{feature.value}</div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="prose max-w-none text-gray-700">
                {vehicle.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Équipements */}
          {vehicle.features?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Équipements</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#1F4E79] to-blue-600 hover:from-[#1F4E79]/90 hover:to-blue-600/90 text-white py-6 text-base"
            >
              <Link to="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Demander des informations
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="py-6 text-base"
              onClick={onToggleFavorite}
            >
              <Heart
                className={`mr-2 h-5 w-5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700'
                }`}
              />
              {isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de carte véhicule
const VehicleCard = ({ vehicle, isFavorite, onToggleFavorite, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.images || [vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full"
      onClick={onViewDetails}
    >
      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
          }}
        />

        {/* Navigation des images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
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
          {vehicle.transmission && (
            <div className="bg-blue-600/90 text-white px-2 py-1 rounded-md text-xs font-medium">
              {vehicle.transmission}
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
            <span className="text-xs text-white">{vehicle.views || 0}</span>
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
            <span>{vehicle.year}</span>
            <span className="mx-2">•</span>
            <span>{vehicle.mileage?.toLocaleString()} km</span>
            <span className="mx-2">•</span>
            <span>{vehicle.fuel_type}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Settings, label: 'Transmission', value: vehicle.transmission },
            { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km` },
            { icon: MapPin, label: 'Localisation', value: vehicle.location || 'Bruxelles' },
            { icon: Zap, label: 'Puissance', value: vehicle.power || '---' },
            { icon: Droplet, label: 'Carburant', value: vehicle.fuel_type },
            { icon: Calendar, label: 'Année', value: vehicle.year },
          ].map((item, index) => (
            item.value && (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <item.icon className="h-4 w-4 text-[#1F4E79]" />
                <span className="truncate" title={item.value}>{item.value}</span>
              </div>
            )
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

// Page principale
const VehicleSalesPage = () => {
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
    const loadVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformer les données pour gérer les images
        const transformed = data.map(vehicle => ({
          ...vehicle,
          images: vehicle.images || [vehicle.image_url].filter(Boolean),
          is_featured: vehicle.is_featured || false,
          views: vehicle.views || 0
        }));

        setVehicles(transformed);
        setFilteredVehicles(transformed);
      } catch (error) {
        console.error('Error loading vehicles:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les véhicules'
        });
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
    const savedFavorites = JSON.parse(localStorage.getItem('vehicle_favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Filtrer et trier les véhicules
  useEffect(() => {
    let result = [...vehicles];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle =>
        `${vehicle.make} ${vehicle.model} ${vehicle.description || ''} ${vehicle.features?.join(' ') || ''}`
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
        default: return new Date(b.created_at) - new Date(a.created_at);
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
    // Incrémenter le compteur de vues
    const updatedVehicles = vehicles.map(v =>
      v.id === vehicle.id ? { ...v, views: (v.views || 0) + 1 } : v
    );
    
    setVehicles(updatedVehicles);
    setSelectedVehicle({ ...vehicle, views: (vehicle.views || 0) + 1 });
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
      <Helmet>
        <title>Véhicules d'occasion - VALTRANSAUTO</title>
        <meta name="description" content="Découvrez notre sélection de véhicules d'occasion de qualité à Bruxelles. Large choix de marques et modèles au meilleur prix." />
      </Helmet>

      {/* En-tête */}
      <div className="bg-gradient-to-r from-[#1F4E79] to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Sélection de Véhicules</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez notre gamme de véhicules d'occasion rigoureusement sélectionnés pour leur qualité et leur fiabilité.
            </p>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un véhicule (marque, modèle, caractéristiques)..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau des filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Prix */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Prix (€)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Min: {filters.minPrice.toLocaleString()}€</span>
                      <span className="text-sm text-gray-600">Max: {filters.maxPrice.toLocaleString()}€</span>
                    </div>
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
                </div>

                {/* Année */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Année</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">De</label>
                      <select
                        value={filters.minYear}
                        onChange={(e) => setFilters({ ...filters, minYear: Number(e.target.value) })}
                        className="w-full rounded-lg border-gray-300"
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
                        className="w-full rounded-lg border-gray-300"
                      >
                        {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Carburant et transmission */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Options</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        value={filters.fuelType}
                        onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                        className="w-full rounded-lg border-gray-300"
                      >
                        <option value="">Tous carburants</option>
                        {['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={filters.transmission}
                        onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                        className="w-full rounded-lg border-gray-300"
                      >
                        <option value="">Toutes boîtes</option>
                        <option value="Manuelle">Manuelle</option>
                        <option value="Automatique">Automatique</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Kilométrage */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Kilométrage (km)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Min: {filters.minMileage.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">Max: {filters.maxMileage.toLocaleString()}</span>
                    </div>
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
                </div>

                {/* Tri */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Trier par</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full rounded-lg border-gray-300"
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

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  className="text-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="bg-[#1F4E79] hover:bg-[#1F4E79]/90"
                >
                  Afficher les résultats
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête des résultats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} disponible{filteredVehicles.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-gray-600">
              {searchTerm ? 'Résultats pour : ' + searchTerm : 'Nos dernières offres'}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full rounded-lg border-gray-300"
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
                ? 'Aucun véhicule ne correspond à votre recherche. Essayez de modifier vos critères.'
                : 'Aucun véhicule disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles arrivées !'}
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
      </main>

      {/* Section CTA */}
      <section className="bg-gradient-to-r from-[#1F4E79] to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous ne trouvez pas votre véhicule idéal ?</h2>
          <p className="text-xl text-blue-100 mb-8">
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














// //============================= v4 =======================================
// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Car, Fuel, Gauge, Calendar, MapPin, Phone,
//   Search, Filter, Heart, Eye, ArrowLeft,
//   ChevronRight, Star, CheckCircle, Shield,
//   Users, X, Camera, PhoneCall, MessageCircle,
//   Zap, Car as CarIcon, Settings, Tag,
//   Share2, MessageSquare, Copy, Check
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { supabase } from '@/lib/customSupabaseClient';
// import { useToast } from '@/components/ui/use-toast';
// import { Link } from 'react-router-dom';

// const VehicleSalesPage = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     minPrice: 0,
//     maxPrice: 100000,
//     year: '',
//     fuelType: '',
//     minMileage: 0,
//     maxMileage: 300000,
//     sortBy: 'newest'
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [copied, setCopied] = useState(false);
//   const { toast } = useToast();

//   // Fonction de test de connexion à Supabase
//   const testSupabaseConnection = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('vehicles')
//         .select('*')
//         .limit(1);
      
//       if (error) throw error;
      
//       console.log('Connexion à Supabase réussie ! Données récupérées :', data);
//       toast({
//         title: 'Connexion réussie',
//         description: `Connecté à Supabase. ${data?.length || 0} véhicule(s) trouvé(s).`,
//         variant: 'default',
//       });
//     } catch (error) {
//       console.error('Erreur de connexion à Supabase:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur de connexion',
//         description: 'Impossible de se connecter à Supabase: ' + error.message
//       });
//     }
//   };

//   // Fonction pour parser les URLs d'images séparées par des virgules
//   const parseImageUrls = (imageUrlString) => {
//     if (!imageUrlString || typeof imageUrlString !== 'string' || imageUrlString.trim() === '') {
//       return [];
//     }

//     const urls = imageUrlString.split(/\s*,\s*/).map(url => url.trim());
//     return urls.filter(url => url && url !== '');
//   };

//   useEffect(() => {
//     fetchVehicles();
//     const savedFavorites = JSON.parse(localStorage.getItem('vehicle_favorites') || '[]');
//     setFavorites(savedFavorites);
//   }, []);

//   useEffect(() => {
//     if (vehicles.length > 0) {
//       filterAndSortVehicles();
//     }
//   }, [vehicles, filters, searchTerm]);

//   const fetchVehicles = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('vehicles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const transformedVehicles = (data || []).map(vehicle => {
//         const imageUrls = parseImageUrls(vehicle.image_url);

//         return {
//           ...vehicle,
//           image_url: imageUrls[0] || vehicle.image_url || '',
//           images: imageUrls.length > 0 ? imageUrls : [vehicle.image_url || ''],
//           views: Math.floor(Math.random() * 200),
//           is_featured: Math.random() > 0.7
//         };
//       });

//       setVehicles(transformedVehicles);
//       setFilteredVehicles(transformedVehicles);

//     } catch (error) {
//       console.error('Error fetching vehicles:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Erreur',
//         description: 'Impossible de charger les véhicules: ' + error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAndSortVehicles = () => {
//     let result = [...vehicles];

//     if (searchTerm) {
//       result = result.filter(vehicle =>
//         `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.description || ''}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }

//     result = result.filter(vehicle =>
//       vehicle.price >= filters.minPrice &&
//       vehicle.price <= filters.maxPrice
//     );

//     if (filters.year) {
//       result = result.filter(vehicle => vehicle.year == filters.year);
//     }

//     if (filters.fuelType) {
//       result = result.filter(vehicle => vehicle.fuel_type === filters.fuelType);
//     }

//     result = result.filter(vehicle =>
//       vehicle.mileage >= filters.minMileage &&
//       vehicle.mileage <= filters.maxMileage
//     );

//     switch (filters.sortBy) {
//       case 'price-asc':
//         result.sort((a, b) => (a.price || 0) - (b.price || 0));
//         break;
//       case 'price-desc':
//         result.sort((a, b) => (b.price || 0) - (a.price || 0));
//         break;
//       case 'mileage-asc':
//         result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
//         break;
//       case 'mileage-desc':
//         result.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
//         break;
//       case 'year-desc':
//         result.sort((a, b) => (b.year || 0) - (a.year || 0));
//         break;
//       default:
//         result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//     }

//     setFilteredVehicles(result);
//   };

//   const toggleFavorite = (vehicleId) => {
//     let newFavorites;
//     if (favorites.includes(vehicleId)) {
//       newFavorites = favorites.filter(id => id !== vehicleId);
//       toast({
//         title: 'Retiré des favoris',
//         description: 'Le véhicule a été retiré de vos favoris'
//       });
//     } else {
//       newFavorites = [...favorites, vehicleId];
//       toast({
//         title: 'Ajouté aux favoris',
//         description: 'Le véhicule a été ajouté à vos favoris'
//       });
//     }
//     setFavorites(newFavorites);
//     localStorage.setItem('vehicle_favorites', JSON.stringify(newFavorites));
//   };

//   const handleViewDetails = (vehicle) => {
//     setSelectedVehicle({
//       ...vehicle,
//       views: (vehicle.views || 0) + 1
//     });
//   };

//   const resetFilters = () => {
//     setFilters({
//       minPrice: 0,
//       maxPrice: 100000,
//       year: '',
//       fuelType: '',
//       minMileage: 0,
//       maxMileage: 300000,
//       sortBy: 'newest'
//     });
//     setSearchTerm('');
//   };

//   const nextImage = () => {
//     if (selectedVehicle && selectedVehicle.images) {
//       setActiveImageIndex((prev) =>
//         prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const prevImage = () => {
//     if (selectedVehicle && selectedVehicle.images) {
//       setActiveImageIndex((prev) =>
//         prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Fonction pour partager le véhicule
//   const handleShare = async () => {
//     if (!selectedVehicle) return;

//     const vehicleUrl = `${window.location.origin}/vehicles/${selectedVehicle.id}`;
//     const shareText = `🚗 ${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year} - €${selectedVehicle.price?.toLocaleString()}\n\n${vehicleUrl}`;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `${selectedVehicle.make} ${selectedVehicle.model}`,
//           text: shareText,
//           url: vehicleUrl,
//         });
//       } catch (err) {
//         console.log('Erreur de partage:', err);
//       }
//     } else {
//       // Fallback: copier dans le presse-papier
//       navigator.clipboard.writeText(shareText);
//       setCopied(true);
//       toast({
//         title: 'Lien copié !',
//         description: 'Le lien du véhicule a été copié dans le presse-papier'
//       });

//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   // Fonction pour contacter sur WhatsApp
//   const handleWhatsAppContact = () => {
//     if (!selectedVehicle) return;

//     const phoneNumber = '+32456123456'; // Numéro WhatsApp du vendeur
//     const mainImage = selectedVehicle.images?.[0] || selectedVehicle.image_url || '';

//     const message = `Bonjour, je suis intéressé par votre véhicule :\n\n` +
//       `*${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}*\n` +
//       `Prix : €${selectedVehicle.price?.toLocaleString()}\n` +
//       `Kilométrage : ${(selectedVehicle.mileage || 0).toLocaleString()} km\n` +
//       `Carburant : ${selectedVehicle.fuel_type || ''}\n` +
//       `${selectedVehicle.description ? `Description : ${selectedVehicle.description}\n` : ''}\n` +
//       `Je souhaite en savoir plus sur ce véhicule et éventuellement organiser une visite.\n\n` +
//       `${mainImage ? `Image : ${mainImage}` : ''}`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

//     window.open(whatsappUrl, '_blank');
//   };

//   const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
//   const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

//   if (selectedVehicle) {
//     const vehicleImages = selectedVehicle.images || [];
//     const hasMultipleImages = vehicleImages.length > 1;

//     // Définir les informations à afficher (seulement si elles existent)
//     // const vehicleDetails = [
//     //   { icon: Calendar, label: 'Année', value: selectedVehicle.year, show: !!selectedVehicle.year },
//     //   { icon: Gauge, label: 'Kilométrage', value: `${(selectedVehicle.mileage || 0).toLocaleString()} km`, show: !!selectedVehicle.mileage },
//     //   { icon: Fuel, label: 'Carburant', value: selectedVehicle.fuel_type, show: !!selectedVehicle.fuel_type },
//     //   { icon: Settings, label: 'Transmission', value: selectedVehicle.transmission, show: !!selectedVehicle.transmission },
//     //   { icon: Zap, label: 'Puissance', value: selectedVehicle.power, show: !!selectedVehicle.power },
//     //   { icon: CarIcon, label: 'Couleur', value: selectedVehicle.color, show: !!selectedVehicle.color },
//     //   { icon: MapPin, label: 'Localisation', value: selectedVehicle.location, show: !!selectedVehicle.location },
//     //   { icon: Tag, label: 'État', value: 'Excellent', show: true }
//     // ].filter(item => item.show);
// const VehicleDetails = ({ vehicle, onBack, onToggleFavorite, isFavorite }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const images = vehicle.images || [vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const features = [
//     { icon: Calendar, label: 'Année', value: vehicle.year },
//     { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km` },
//     { icon: Fuel, label: 'Carburant', value: vehicle.fuel_type },
//     { icon: Settings, label: 'Transmission', value: vehicle.transmission },
//     { icon: Zap, label: 'Puissance', value: vehicle.power || '---' },
//     { icon: Droplet, label: 'Consommation', value: vehicle.consumption || '---' },
//     { icon: Users, label: 'Places', value: vehicle.seats || '---' },
//     { icon: DoorOpen, label: 'Portes', value: vehicle.doors || '---' },
//     { icon: Palette, label: 'Couleur', value: vehicle.color || '---' },
//   ];
//     return (
//       <>
//         <Helmet>
//           <title>{`${selectedVehicle.make} ${selectedVehicle.model} - VALTRANSAUTO`}</title>
//           <meta name="description" content={selectedVehicle.description} />
//         </Helmet>

//         <div className="min-h-screen bg-white">
//           {/* Header avec boutons de partage */}
//           <div className="bg-white border-b shadow-sm sticky top-0 z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//               <div className="flex items-center justify-between">
//                 <Button
//                   onClick={() => setSelectedVehicle(null)}
//                   variant="ghost"
//                   className="flex items-center gap-2"
//                 >
//                   <ArrowLeft className="h-5 w-5" />
//                   Retour
//                 </Button>

//                 <div className="flex items-center gap-3">
//                   <Button
//                     onClick={handleShare}
//                     variant="outline"
//                     className="flex items-center gap-2"
//                   >
//                     {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
//                     {copied ? 'Copié !' : 'Partager'}
//                   </Button>

//                   <Button
//                     onClick={handleWhatsAppContact}
//                     className="bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-2"
//                   >
//                     <MessageSquare className="h-4 w-4" />
//                     WhatsApp
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Vehicle Details */}
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               {/* Main Image & Gallery */}
//               <div className="grid lg:grid-cols-2 gap-8">
//                 <div className="space-y-4">
//                   <div className="relative rounded-2xl overflow-hidden bg-gray-100">
//                     <div className="relative">
//                       {vehicleImages.length > 0 && vehicleImages[0] ? (
//                         <>
//                           <img
//                             src={vehicleImages[activeImageIndex]}
//                             alt={`${selectedVehicle.make} ${activeImageIndex + 1}`}
//                             className="w-full h-[400px] md:h-[500px] object-cover"
//                             onError={(e) => {
//                               e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
//                             }}
//                           />

//                           {hasMultipleImages && (
//                             <>
//                               <button
//                                 onClick={prevImage}
//                                 className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
//                               >
//                                 <ArrowLeft className="h-5 w-5" />
//                               </button>
//                               <button
//                                 onClick={nextImage}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
//                               >
//                                 <ChevronRight className="h-5 w-5" />
//                               </button>

//                               <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
//                                 {activeImageIndex + 1} / {vehicleImages.length}
//                               </div>
//                             </>
//                           )}
//                         </>
//                       ) : (
//                         <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-200">
//                           <Camera className="h-16 w-16 text-gray-400" />
//                         </div>
//                       )}
//                     </div>

//                     {selectedVehicle.is_featured && (
//                       <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
//                         <Star className="inline h-4 w-4 mr-1" />
//                         Véhicule Premium
//                       </div>
//                     )}
//                     <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
//                       <Eye className="inline h-3 w-3 mr-1" />
//                       {selectedVehicle.views || 0} vues
//                     </div>
//                   </div>

//                   {hasMultipleImages && vehicleImages.length > 0 && (
//                     <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
//                       {vehicleImages.map((img, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setActiveImageIndex(index)}
//                           className={`relative rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
//                         >
//                           <img
//                             src={img}
//                             alt={`${selectedVehicle.make} ${index + 1}`}
//                             className="w-full h-16 md:h-20 object-cover"
//                             onError={(e) => {
//                               e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200';
//                             }}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Vehicle Info */}
//                 <div className="space-y-6">
//                   <div>
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//                       {selectedVehicle.make} {selectedVehicle.model}
//                     </h1>
//                     <p className="text-2xl font-bold text-[#FF0C00] mt-2">
//                       €{(selectedVehicle.price || 0).toLocaleString()}
//                     </p>
//                   </div>

//                   {vehicleDetails.length > 0 && (
//                     <div className="grid grid-cols-2 gap-4">
//                       {vehicleDetails.map((item, index) => (
//                         <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                           <div className="flex items-center gap-3">
//                             <div className="bg-[#1F4E79] p-2 rounded-lg">
//                               <item.icon className="h-5 w-5 text-white" />
//                             </div>
//                             <div>
//                               <div className="text-sm text-gray-500">{item.label}</div>
//                               <div className="font-semibold text-gray-900">{item.value}</div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {(selectedVehicle.description || selectedVehicle.description !== '') && (
//                     <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
//                       <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
//                       <p className="text-gray-700 leading-relaxed">
//                         {selectedVehicle.description || 'Véhicule en excellent état, parfaitement entretenu.'}
//                       </p>
//                     </div>
//                   )}

//                   {/* Action Buttons avec WhatsApp */}
//                   <div className="grid md:grid-cols-3 gap-4 pt-6">
//                     <Button
//                       onClick={handleWhatsAppContact}
//                       className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white py-4 rounded-xl flex items-center justify-center gap-2"
//                     >
//                       <MessageSquare className="h-5 w-5" />
//                       WhatsApp
//                     </Button>

//                     <Button
//                       asChild
//                       className="bg-gradient-to-r from-[#1F4E79] to-blue-600 hover:opacity-90 text-white py-4 rounded-xl"
//                     >
//                       <Link to="/book-appointment">
//                         <Calendar className="mr-2 h-5 w-5" />
//                         RDV Visite
//                       </Link>
//                     </Button>

//                     <Button
//                       onClick={() => toggleFavorite(selectedVehicle.id)}
//                       className={`py-4 rounded-xl ${favorites.includes(selectedVehicle.id) ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                     >
//                       <Heart className={`mr-2 h-5 w-5 ${favorites.includes(selectedVehicle.id) ? 'fill-white' : ''}`} />
//                       {favorites.includes(selectedVehicle.id) ? 'Favori' : 'Favoris'}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Page principale avec liste des véhicules
//   return (
//     <>
//       <Helmet>
//         <title>Véhicules d'Occasion - VALTRANSAUTO</title>
//         <meta name="description" content="Découvrez notre sélection de véhicules d'occasion de qualité." />
//       </Helmet>

//       <div className="min-h-screen bg-white">
//         <section className="bg-[#1F4E79] text-white py-12 md:py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="text-center"
//             >
//               <h1 className="text-3xl md:text-5xl font-bold mb-4">
//                 Véhicules d'Occasion
//               </h1>
//               <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
//                 Découvrez notre sélection de véhicules expertisés et garantis
//               </p>

//               <div className="max-w-3xl mx-auto">
//                 <div className="flex items-center bg-white rounded-lg p-2">
//                   <Search className="h-5 w-5 text-gray-400 ml-2" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Rechercher un véhicule..."
//                     className="flex-1 bg-transparent border-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 py-2 px-3"
//                   />
//                   <Button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="bg-[#FF0C00] hover:bg-[#FF0C00]/90 text-white"
//                   >
//                     <Filter className="h-4 w-4 mr-2" />
//                     Filtres
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         <AnimatePresence>
//           {showFilters && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="bg-white border-b"
//             >
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="grid md:grid-cols-4 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Prix max (€)</label>
//                     <input
//                       type="range"
//                       min="0"
//                       max="100000"
//                       step="1000"
//                       value={filters.maxPrice}
//                       onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
//                       className="w-full"
//                     />
//                     <div className="flex justify-between text-sm text-gray-500 mt-1">
//                       <span>0€</span>
//                       <span>{filters.maxPrice.toLocaleString()}€</span>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
//                     <select
//                       value={filters.year}
//                       onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//                       className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Toutes</option>
//                       {years.map(year => (
//                         <option key={year} value={year}>{year}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Carburant</label>
//                     <select
//                       value={filters.fuelType}
//                       onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
//                       className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Tous</option>
//                       {fuelTypes.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Tri</label>
//                     <select
//                       value={filters.sortBy}
//                       onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
//                       className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="newest">Plus récent</option>
//                       <option value="price-asc">Prix croissant</option>
//                       <option value="price-desc">Prix décroissant</option>
//                       <option value="year-desc">Année récente</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center mt-6">
//                   <div className="text-sm text-gray-600">
//                     {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={resetFilters}
//                       variant="outline"
//                       size="sm"
//                       className="border-gray-300"
//                     >
//                       <X className="h-4 w-4 mr-1" />
//                       Réinitialiser
//                     </Button>
//                     <Button
//                       onClick={() => setShowFilters(false)}
//                       size="sm"
//                       className="bg-[#1F4E79] text-white"
//                     >
//                       Appliquer
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <section className="py-8">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {loading ? (
//               <div className="text-center py-20">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1F4E79] border-t-transparent"></div>
//                 <p className="mt-4 text-gray-600">Chargement des véhicules...</p>
//               </div>
//             ) : filteredVehicles.length === 0 ? (
//               <div className="text-center py-20">
//                 <Car className="h-24 w-24 text-gray-300 mx-auto mb-6" />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun véhicule trouvé</h2>
//                 <Button
//                   onClick={resetFilters}
//                   className="bg-[#1F4E79] text-white"
//                 >
//                   Voir tous
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredVehicles.map((vehicle) => (
//                   <VehicleCard
//                     key={vehicle.id}
//                     vehicle={vehicle}
//                     isFavorite={favorites.includes(vehicle.id)}
//                     onToggleFavorite={() => toggleFavorite(vehicle.id)}
//                     onViewDetails={() => handleViewDetails(vehicle)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//         {/* Bouton de test de connexion - à supprimer en production */}
//         <button 
//           onClick={testSupabaseConnection}
//           className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
//           title="Tester la connexion Supabase"
//         >
//           <Zap className="h-5 w-5" />
//         </button>
//       </div>
//     </>
//   );
// };

// // Composant de carte véhicule
// // const VehicleCard = ({ vehicle, isFavorite, onToggleFavorite, onViewDetails }) => {
// //   const mainImage = vehicle.images?.[0] || vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
// //   const hasMultipleImages = vehicle.images && vehicle.images.length > 1;

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.4 }}
// //       className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200"
// //     >
// //       <div className="relative h-48 md:h-56">
// //         <img
// //           src={mainImage}
// //           alt={`${vehicle.make} ${vehicle.model}`}
// //           className="w-full h-full object-cover"
// //           onError={(e) => {
// //             e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
// //           }}
// //         />

// //         {hasMultipleImages && (
// //           <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded">
// //             +{vehicle.images.length - 1} photos
// //           </div>
// //         )}

// //         <div className="absolute top-3 right-3">
// //           <button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               onToggleFavorite();
// //             }}
// //             className="bg-white/90 rounded-full p-2 hover:bg-white"
// //           >
// //             <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
// //           </button>
// //         </div>

// //         <div className="absolute bottom-3 right-3">
// //           <div className="bg-[#FF0C00] text-white px-3 py-1 rounded-lg font-bold">
// //             €{(vehicle.price || 0).toLocaleString()}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="p-4">
// //         <h3 className="text-xl font-bold text-gray-900 mb-2">
// //           {vehicle.make} {vehicle.model}
// //         </h3>

// //         <div className="grid grid-cols-2 gap-2 mb-3">
// //           {vehicle.year && (
// //             <div className="flex items-center text-gray-600 text-sm">
// //               <Calendar className="h-4 w-4 text-[#FF0C00] mr-1" />
// //               {vehicle.year}
// //             </div>
// //           )}
// //           {vehicle.mileage && (
// //             <div className="flex items-center text-gray-600 text-sm">
// //               <Gauge className="h-4 w-4 text-[#FF0C00] mr-1" />
// //               {(vehicle.mileage || 0).toLocaleString()} km
// //             </div>
// //           )}
// //           {vehicle.fuel_type && (
// //             <div className="flex items-center text-gray-600 text-sm">
// //               <Fuel className="h-4 w-4 text-[#FF0C00] mr-1" />
// //               {vehicle.fuel_type}
// //             </div>
// //           )}
// //           {vehicle.location && (
// //             <div className="flex items-center text-gray-600 text-sm">
// //               <MapPin className="h-4 w-4 text-[#FF0C00] mr-1" />
// //               {vehicle.location}
// //             </div>
// //           )}
// //         </div>

// //         {vehicle.description && (
// //           <p className="text-gray-600 text-sm mb-4 line-clamp-2">
// //             {vehicle.description}
// //           </p>
// //         )}

// //         <Button
// //           onClick={onViewDetails}
// //           className="w-full bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white"
// //         >
// //           Voir Détails
// //         </Button>
// //       </div>
// //     </motion.div>
// //   );
// // };

// const VehicleCard = ({ vehicle, isFavorite, onToggleFavorite, onViewDetails }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const images = vehicle.images || [vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800'];

//   const nextImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       viewport={{ once: true }}
//       className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full"
//     >
//       {/* Image Gallery */}
//       <div className="relative h-64 overflow-hidden">
//         <img
//           src={images[currentImageIndex]}
//           alt={`${vehicle.make} ${vehicle.model}`}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//           onError={(e) => {
//             e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800';
//           }}
//         />

//         {/* Navigation des images */}
//         {images.length > 1 && (
//           <>
//             <button
//               onClick={prevImage}
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <button
//               onClick={nextImage}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>
//             <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
//               {images.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentImageIndex(index);
//                   }}
//                   className={`w-2 h-2 rounded-full transition-all ${
//                     index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
//                   }`}
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//           {vehicle.is_featured && (
//             <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
//               <Star className="h-3 w-3 mr-1" />
// +             <span>Premium</span>
//             </div>
//           )}
//           {vehicle.transmission && (
//             <div className="bg-blue-600/90 text-white px-2 py-1 rounded-md text-xs font-medium">
//               {vehicle.transmission}
//             </div>
//           )}
//         </div>

//         {/* Favori et vues */}
//         <div className="absolute top-3 right-3 flex flex-col gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleFavorite();
//             }}
//             className={`p-2 rounded-full backdrop-blur-sm ${
//               isFavorite 
//                 ? 'bg-rose-500/90 text-white' 
//                 : 'bg-white/90 text-gray-700 hover:bg-white'
//             }`}
//           >
//             <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
//           </button>
//           <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
//             <Eye className="h-3 w-3 text-white mr-1" />
//             <span className="text-xs text-white">{vehicle.views || 0}</span>
//           </div>
//         </div>

//         {/* Prix */}
//         <div className="absolute bottom-3 right-3">
//           <div className="bg-gradient-to-r from-[#FF0C00] to-orange-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
//             €{vehicle.price?.toLocaleString()}
//           </div>
//         </div>
//       </div>

//       {/* Détails du véhicule */}
//       <div className="p-5 flex-1 flex flex-col">
//         <div className="mb-3">
//           <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
//             {vehicle.make} {vehicle.model}
//           </h3>
//           <div className="flex items-center text-sm text-gray-600">
//             <span>{vehicle.year}</span>
//             <span className="mx-2">•</span>
//             <span>{vehicle.mileage?.toLocaleString()} km</span>
//             <span className="mx-2">•</span>
//             <span>{vehicle.fuel_type}</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-3 mb-4">
//           {[
//             { icon: Settings, label: 'Transmission', value: vehicle.transmission },
//             { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km` },
//             { icon: MapPin, label: 'Localisation', value: vehicle.location || 'Bruxelles' },
//             { icon: Zap, label: 'Puissance', value: vehicle.power || '---' },
//             { icon: Droplet, label: 'Carburant', value: vehicle.fuel_type },
//             { icon: Calendar, label: 'Année', value: vehicle.year },
//           ].map((item, index) => (
//             item.value && (
//               <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
//                 <item.icon className="h-4 w-4 text-[#1F4E79]" />
//                 <span className="truncate" title={item.value}>{item.value}</span>
//               </div>
//             )
//           ))}
//         </div>

//         {vehicle.description && (
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
//             {vehicle.description}
//           </p>
//         )}

//         <div className="flex gap-3 mt-auto">
//           <Button
//             onClick={onViewDetails}
//             className="flex-1 bg-gradient-to-r from-[#1F4E79] to-blue-600 hover:from-[#1F4E79]/90 hover:to-blue-600/90 text-white rounded-xl"
//           >
//             Voir Détails
//           </Button>
//           <Button
//             asChild
//             variant="outline"
//             className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <a href={`tel:${PHONE_NUMBER}`}>
//               <Phone className="h-4 w-4" />
//             </a>
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default VehicleSalesPage;


