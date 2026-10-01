import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Landmark, ArrowRight, Star } from 'lucide-react';
import { cardVariant } from '../animations/variants';

export const DestinationCard = ({ destination }) => {
  return (
    <motion.div
      variants={cardVariant}
      whileHover="hover"
      className="group relative bg-slate-900/70 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 hover:shadow-glow transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{destination.country}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/20 flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{destination.rating}</span>
          </span>
        </div>

        {/* Bottom Destination Title on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
            {destination.region} · {destination.continent}
          </p>
          <h3 className="text-2xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed font-normal">
          {destination.tagline || destination.description}
        </p>

        <div>
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-800/80 text-xs font-medium text-slate-300 mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{destination._count?.hotels || destination.hotels?.length || 0} Hotels</span>
            </div>
            <div className="flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span>{destination._count?.attractions || destination.attractions?.length || 0} Attractions</span>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to={`/destination/${destination.id}`}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-semibold text-sm transition-all duration-300 group/btn"
          >
            <span>View Full Details & Map</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
