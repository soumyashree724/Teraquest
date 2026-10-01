import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Compass, ArrowRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTINENTS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];

export const HeroSearch = ({
  searchQuery,
  setSearchQuery,
  selectedContinent,
  setSelectedContinent,
  suggestions = [],
  totalCount = 0,
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (destination) => {
    setShowDropdown(false);
    navigate(`/destination/${destination.id}`);
  };

  return (
    <div className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Animated Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Self-Maintained Travel Discovery Engine</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
        >
          Explore Handpicked Destinations, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Hotels & Insider Travel Intelligence
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Instant destination search with curated hotel listings, must-visit attractions, interactive OpenStreetMap routes, and essential local advisory.
        </motion.p>

        {/* Search Bar Container */}
        <div ref={searchRef} className="relative max-w-3xl mx-auto mb-8">
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border-2 border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-emerald-500 focus-within:shadow-glow transition-all duration-300">
            <div className="pl-4 pr-3 text-slate-400">
              <Search className="w-6 h-6 text-emerald-400" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search destination, city, region or country (e.g., Kyoto, Santorini, Banff, Rome)..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-base sm:text-lg font-medium outline-none py-2"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold px-2.5 py-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 mr-2"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => {
                if (suggestions.length > 0) {
                  handleSelectSuggestion(suggestions[0]);
                }
              }}
              className="hidden sm:flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {showDropdown && suggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
              >
                <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Found {suggestions.length} destination matches</span>
                  <span className="text-emerald-400">Press on a destination to open</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                  {suggestions.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleSelectSuggestion(dest)}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-emerald-950/40 transition-colors text-left group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-emerald-500/50 transition-all"
                        />
                        <div>
                          <p className="text-white font-semibold text-base group-hover:text-emerald-300 transition-colors flex items-center space-x-2">
                            <span>{dest.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                              {dest.country}
                            </span>
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dest.tagline || dest.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ★ {dest.rating}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Pills by Continent */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Region:</span>
          </span>
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedContinent === continent
                  ? 'bg-emerald-500 text-slate-950 shadow-glow font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
