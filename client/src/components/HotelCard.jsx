import React from 'react';
import { Star, MapPin, CheckCircle2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardVariant } from '../animations/variants';

export const HotelCard = ({ hotel }) => {
  const amenitiesList = hotel.amenities ? hotel.amenities.split(',').map((a) => a.trim()) : [];

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -5 }}
      className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-sky-500/40 hover:shadow-glow-ocean transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Hotel Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/20 flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
          </div>

          {/* Price Range Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-400/20">
            {hotel.priceRange}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <div>
            <h4 className="text-lg font-bold text-white leading-snug">{hotel.name}</h4>
            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="line-clamp-1">{hotel.address}</span>
            </p>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {amenitiesList.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700/50 flex items-center space-x-1"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Price & Booking Indicator */}
      <div className="px-5 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium">Estimated Rate</span>
          <p className="text-base font-bold text-emerald-400">
            ${hotel.pricePerNight} <span className="text-xs text-slate-400 font-normal">/ night</span>
          </p>
        </div>

        <button
          onClick={() => alert(`Hotel Details: ${hotel.name}\nAddress: ${hotel.address}\nRating: ${hotel.rating} Stars\nEst. Rate: $${hotel.pricePerNight}/night`)}
          className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-300 hover:text-slate-950 text-xs font-bold border border-sky-500/30 transition-all"
        >
          View Rates
        </button>
      </div>
    </motion.div>
  );
};
