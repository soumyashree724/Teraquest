import React from 'react';
import { Star, Clock, Tag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardVariant } from '../animations/variants';

export const AttractionCard = ({ attraction }) => {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -5 }}
      className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Attraction Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={attraction.imageUrl}
            alt={attraction.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/20 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-amber-400" />
            <span>{attraction.category}</span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{attraction.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h4 className="text-lg font-bold text-white leading-snug">{attraction.name}</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">{attraction.description}</p>
        </div>
      </div>

      {/* Best Time To Visit Footer */}
      <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 text-amber-300/90 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Optimal Time:</span>
        </div>
        <span className="font-semibold text-slate-200">{attraction.bestTimeOfDay}</span>
      </div>
    </motion.div>
  );
};
