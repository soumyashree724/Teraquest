import React, { useState, useEffect } from 'react';
import { destinationAPI } from '../services/api';
import { HeroSearch } from '../components/HeroSearch';
import { DestinationCard } from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, History, SearchX, Globe2, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../animations/variants';

export const HomePage = () => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [searchHistory, setSearchHistory] = useState([]);

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedContinent !== 'All') params.continent = selectedContinent;
        if (searchQuery.trim()) params.query = searchQuery.trim();

        const res = await destinationAPI.getAll(params);
        if (res.data && res.data.data) {
          setDestinations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDestinations();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedContinent]);

  // Fetch search history if user is logged in
  useEffect(() => {
    if (user) {
      destinationAPI.getSearchHistory()
        .then((res) => {
          if (res.data && res.data.data) {
            setSearchHistory(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Autocomplete suggestions based on query
  const suggestions = searchQuery.trim()
    ? destinations.slice(0, 5)
    : [];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero with Interactive Search */}
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedContinent={selectedContinent}
        setSelectedContinent={setSelectedContinent}
        suggestions={suggestions}
        totalCount={destinations.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Recent Search History if logged in */}
        {user && searchHistory.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Your Recent Searches:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSearchQuery(item.destination.name)}
                  className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-slate-700/50 text-xs font-medium text-slate-200 hover:text-emerald-300 transition-all flex items-center space-x-1.5"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{item.destination.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Destination Gallery Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-800/80 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Globe2 className="w-4 h-4" />
                <span>Featured Destinations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {selectedContinent === 'All' ? 'All Global Destinations' : `${selectedContinent} Destinations`}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Showing <strong className="text-emerald-400">{destinations.length}</strong> curated places
            </p>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-slate-900/60 rounded-3xl h-96 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            /* Empty State */
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No destinations found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No destinations matched "{searchQuery}" in {selectedContinent}. Try adjusting your search query or reset the filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedContinent('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow hover:bg-emerald-400 transition-all"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            /* Destination Grid */
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Feature Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/20 p-8 sm:p-12 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 inline-flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Self-Maintained Travel Infrastructure</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Zero External Travel APIs. 100% Curated Quality.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              TerraQuest operates on an independent, verified dataset of hand-picked accommodations, authentic attractions, and real traveler advisories.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
