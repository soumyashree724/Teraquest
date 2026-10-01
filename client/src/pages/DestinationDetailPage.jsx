import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationAPI } from '../services/api';
import { MapPanel } from '../components/MapPanel';
import { HotelCard } from '../components/HotelCard';
import { AttractionCard } from '../components/AttractionCard';
import { TravelInfoCard } from '../components/TravelInfoCard';
import {
  ArrowLeft,
  MapPin,
  Star,
  Building2,
  Landmark,
  Compass,
  Sparkles,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';

export const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDestinationData = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const [destRes, nearbyRes] = await Promise.all([
          destinationAPI.getById(id),
          destinationAPI.getNearby(id),
        ]);

        if (destRes.data && destRes.data.data) {
          setDestination(destRes.data.data);
        }
        if (nearbyRes.data && nearbyRes.data.data) {
          setNearby(nearbyRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestinationData();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Compass className="w-12 h-12 text-emerald-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading destination intelligence & route map...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Destination Not Found</h2>
        <p className="text-slate-400 text-sm">The destination you are looking for might have been moved or updated.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Destinations</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="min-h-screen pb-24 space-y-12"
    >
      {/* Top Hero Banner */}
      <div className="relative h-[460px] sm:h-[540px] w-full overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

        {/* Floating Top Controls */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Explore All</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-all shadow-lg ${
                saved
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-semibold transition-all shadow-lg"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Hero Title and Meta Badges */}
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{destination.country}, {destination.region}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center space-x-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating} Overall Rating</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30 text-xs font-semibold">
              {destination.continent}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight">
            {destination.name}
          </h1>

          {destination.tagline && (
            <p className="text-lg sm:text-xl text-emerald-300/90 font-medium max-w-3xl">
              {destination.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Overview Description */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">About the Destination</h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {destination.description}
          </p>
        </div>

        {/* Interactive Leaflet Location Map & Landmark Proximity */}
        <MapPanel destination={destination} nearby={nearby} />

        {/* Essential Travel Intelligence Card */}
        {destination.travelInfo && (
          <TravelInfoCard travelInfo={destination.travelInfo} />
        )}

        {/* Curated Hotels Near Destination */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>Accommodations</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                Hotels & Stays in {destination.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {destination.hotels?.length || 0} verified accommodations in database
            </p>
          </div>

          {destination.hotels && destination.hotels.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {destination.hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </motion.div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/40 text-center text-slate-400 text-sm border border-slate-800">
              No hotels recorded for this destination yet.
            </div>
          )}
        </div>

        {/* Attractions & Landmarks */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Landmark className="w-4 h-4" />
                <span>Must-Visit Places</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                Top Attractions & Landmarks
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {destination.attractions?.length || 0} points of interest curated
            </p>
          </div>

          {destination.attractions && destination.attractions.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {destination.attractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </motion.div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/40 text-center text-slate-400 text-sm border border-slate-800">
              No attractions recorded for this destination yet.
            </div>
          )}
        </div>

        {/* Nearby Destination Recommendations */}
        {nearby && nearby.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Discover Nearby Regional Destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearby.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={`/destination/${item.id}`}
                  className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 flex items-center space-x-4 transition-all group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 group-hover:scale-105 transition-all"
                  />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400">{item.country}</p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      {item.distanceKm.toLocaleString()} km away
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
