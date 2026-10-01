import React from 'react';
import {
  Calendar,
  Coins,
  Languages,
  ShieldAlert,
  Lightbulb,
  Clock3,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TravelInfoCard = ({ travelInfo }) => {
  if (!travelInfo) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Essential Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Traveler’s Field Guide & Advisory
          </h2>
        </div>

        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          Curated by TerraQuest Admins
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Best Season */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
            <Calendar className="w-4 h-4" />
            <span>Best Season to Visit</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {travelInfo.bestTimeToVisit}
          </p>
        </div>

        {/* Currency & Payments */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
            <Coins className="w-4 h-4" />
            <span>Currency & Payment</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {travelInfo.currency}
          </p>
        </div>

        {/* Language */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
            <Languages className="w-4 h-4" />
            <span>Spoken Languages</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {travelInfo.language}
          </p>
        </div>

        {/* Local Tips & Etiquette */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Insider Tips & Cultural Etiquette</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {travelInfo.localTips}
          </p>
        </div>

        {/* Safety Notes */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Safety Advisory</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {travelInfo.safetyNotes}
          </p>
        </div>

        {/* Time Zone & Emergency Contacts */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-2 md:col-span-3 lg:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
              <Clock3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Local Time Zone</p>
              <p className="text-sm font-semibold text-white">{travelInfo.timeZone || 'UTC+0'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
              <PhoneCall className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Emergency Services Helpline</p>
              <p className="text-sm font-semibold text-rose-400">{travelInfo.emergencyContact || '112 / 911'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
