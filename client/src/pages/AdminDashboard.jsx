import React, { useState, useEffect } from 'react';
import { adminAPI, destinationAPI } from '../services/api';
import { AdminModal } from '../components/AdminModal';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Landmark,
  Globe2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Compass,
  RefreshCw,
  Info,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation tabs: 'overview' | 'destinations' | 'hotels' | 'attractions' | 'travelInfo' | 'users'
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter within tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestinationId, setFilterDestinationId] = useState('ALL');
  const [filterContinent, setFilterContinent] = useState('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('destination');
  const [modalTitle, setModalTitle] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Success toast feedback
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, destRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        destinationAPI.getAll(),
        adminAPI.getUsers(),
      ]);

      if (statsRes.data?.data) {
        setStats(statsRes.data.data.stats);
      }
      if (destRes.data?.data) {
        setDestinations(destRes.data.data);
      }
      if (usersRes.data?.data) {
        setUsersList(usersRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Opening Modals
  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'destination') setModalTitle('Add New Curated Destination');
    if (type === 'hotel') setModalTitle('Add Accommodation to Destination');
    if (type === 'attraction') setModalTitle('Add Attraction / Landmark');
    if (type === 'travelInfo') setModalTitle('Edit Essential Travel Intelligence');
    setModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'destination') setModalTitle(`Edit Destination: ${item.name}`);
    if (type === 'hotel') setModalTitle(`Edit Hotel: ${item.name}`);
    if (type === 'attraction') setModalTitle(`Edit Attraction: ${item.name}`);
    if (type === 'travelInfo') setModalTitle(`Edit Travel Info: ${item.name}`);
    setModalOpen(true);
  };

  // Modal Submit
  const handleModalSubmit = async (formData) => {
    if (modalType === 'destination') {
      if (editingItem) {
        await adminAPI.updateDestination(editingItem.id, formData);
        showToast(`Destination "${formData.name}" updated successfully!`);
      } else {
        await adminAPI.createDestination(formData);
        showToast(`Destination "${formData.name}" created successfully!`);
      }
    } else if (modalType === 'hotel') {
      if (editingItem) {
        await adminAPI.updateHotel(editingItem.id, formData);
        showToast(`Hotel "${formData.name}" updated successfully!`);
      } else {
        await adminAPI.createHotel(formData);
        showToast(`Hotel "${formData.name}" added successfully!`);
      }
    } else if (modalType === 'attraction') {
      if (editingItem) {
        await adminAPI.updateAttraction(editingItem.id, formData);
        showToast(`Attraction "${formData.name}" updated successfully!`);
      } else {
        await adminAPI.createAttraction(formData);
        showToast(`Attraction "${formData.name}" added successfully!`);
      }
    } else if (modalType === 'travelInfo') {
      await adminAPI.upsertTravelInfo(formData.destinationId, formData);
      showToast('Travel intelligence advisory updated successfully!');
    }
    await loadData();
  };

  // Delete Handlers
  const handleDeleteDestination = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" and all associated hotels/attractions?`)) {
      try {
        await adminAPI.deleteDestination(id);
        showToast(`Destination "${name}" deleted.`);
        await loadData();
      } catch (err) {
        alert('Failed to delete destination: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteHotel = async (id, name) => {
    if (window.confirm(`Delete hotel "${name}"?`)) {
      try {
        await adminAPI.deleteHotel(id);
        showToast(`Hotel "${name}" deleted.`);
        await loadData();
      } catch (err) {
        alert('Failed to delete hotel: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteAttraction = async (id, name) => {
    if (window.confirm(`Delete attraction "${name}"?`)) {
      try {
        await adminAPI.deleteAttraction(id);
        showToast(`Attraction "${name}" deleted.`);
        await loadData();
      } catch (err) {
        alert('Failed to delete attraction: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // User Role Management
  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (targetUser.id === currentAdmin?.id) {
      alert('You cannot change your own admin role.');
      return;
    }
    try {
      await adminAPI.updateUserRole(targetUser.id, newRole);
      showToast(`User ${targetUser.name} role changed to ${newRole}.`);
      await loadData();
    } catch (err) {
      alert('Failed to update user role: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      alert('You cannot delete your own account.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})?`)) {
      try {
        await adminAPI.deleteUser(targetUser.id);
        showToast(`User "${targetUser.name}" removed.`);
        await loadData();
      } catch (err) {
        alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Flattened lists for table views with filters
  const allHotels = destinations.flatMap((d) =>
    (d.hotels || []).map((h) => ({ ...h, destinationName: d.name, destinationCountry: d.country }))
  );

  const allAttractions = destinations.flatMap((d) =>
    (d.attractions || []).map((a) => ({ ...a, destinationName: d.name, destinationCountry: d.country }))
  );

  // Filtered lists
  const filteredDestinations = destinations.filter((dest) => {
    const matchSearch = searchTerm.trim() === '' ||
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchContinent = filterContinent === 'ALL' || dest.continent === filterContinent;
    return matchSearch && matchContinent;
  });

  const filteredHotels = allHotels.filter((hotel) => {
    const matchSearch = searchTerm.trim() === '' ||
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDest = filterDestinationId === 'ALL' || hotel.destinationId === filterDestinationId;
    return matchSearch && matchDest;
  });

  const filteredAttractions = allAttractions.filter((attraction) => {
    const matchSearch = searchTerm.trim() === '' ||
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDest = filterDestinationId === 'ALL' || attraction.destinationId === filterDestinationId;
    return matchSearch && matchDest;
  });

  const filteredUsers = usersList.filter((u) => {
    return searchTerm.trim() === '' ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && !stats) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Compass className="w-12 h-12 text-emerald-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Initializing Administrator Command Center...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8"
    >
      {/* Toast notification feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Header */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </span>
            <span className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{currentAdmin?.name}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Discovery Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Manage self-maintained destination records, hotel rates, landmarks, traveler advisories, and system users.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleOpenAdd('destination')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Destination</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {[
          { id: 'overview', label: '📊 Overview', count: null },
          { id: 'destinations', label: '🌍 Destinations', count: destinations.length },
          { id: 'hotels', label: '🏨 Accommodations', count: allHotels.length },
          { id: 'attractions', label: '📍 Attractions', count: allAttractions.length },
          { id: 'travelInfo', label: '📖 Travel Intelligence', count: destinations.length },
          { id: 'users', label: '👥 User Accounts', count: usersList.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
              setFilterDestinationId('ALL');
              setFilterContinent('ALL');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-glow'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 0: OVERVIEW ANALYTICS DASHBOARD */}
      {/* ==================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Core Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Curated Destinations</p>
                <p className="text-3xl font-bold font-display text-white">{stats?.destinations || 0}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Across 5 continents</p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Hotels Curated</p>
                <p className="text-3xl font-bold font-display text-white">{stats?.hotels || 0}</p>
                <p className="text-[10px] text-sky-400 mt-0.5">With price tiers & ratings</p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Landmark className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Points of Interest</p>
                <p className="text-3xl font-bold font-display text-white">{stats?.attractions || 0}</p>
                <p className="text-[10px] text-amber-400 mt-0.5">Landmarks & sights</p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Registered Users</p>
                <p className="text-3xl font-bold font-display text-white">{stats?.users || 0}</p>
                <p className="text-[10px] text-purple-400 mt-0.5">RBAC authenticated</p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Destinations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions Card */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleOpenAdd('destination')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    <span>Create New Destination</span>
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </button>

                <button
                  onClick={() => handleOpenAdd('hotel')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <span>Add Accommodation</span>
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </button>

                <button
                  onClick={() => handleOpenAdd('attraction')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>Add Landmark Attraction</span>
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-[11px] text-slate-400">
                  Data entered here is saved in the local database and immediately reflected across all user search results.
                </p>
              </div>
            </div>

            {/* Destinations Coverage List */}
            <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Curated Coverage ({destinations.length} Places)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('destinations')}
                  className="text-xs text-emerald-400 hover:underline font-semibold flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destinations.slice(0, 6).map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <p className="font-bold text-white text-xs leading-snug">{d.name}</p>
                        <p className="text-[11px] text-slate-400">{d.country} · {d.continent}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                          {d._count?.hotels || d.hotels?.length || 0} Hotels · {d._count?.attractions || d.attractions?.length || 0} Sights
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit('destination', d)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <Link
                        to={`/destination/${d.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Preview"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: DESTINATIONS MANAGER */}
      {/* ==================================================================== */}
      {activeTab === 'destinations' && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destination, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <select
                value={filterContinent}
                onChange={(e) => setFilterContinent(e.target.value)}
                className="glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
              >
                <option value="ALL">All Continents</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>

              <button
                onClick={() => handleOpenAdd('destination')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shrink-0 shadow-glow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>
          </div>

          {/* Destinations Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Destination & Region</th>
                    <th className="px-4 py-4">Continent</th>
                    <th className="px-4 py-4">Geo Coordinates</th>
                    <th className="px-4 py-4">Rating</th>
                    <th className="px-4 py-4">Data Coverage</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDestinations.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm flex items-center space-x-2">
                            <span>{dest.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                              {dest.country}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {dest.tagline || dest.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-300">
                        {dest.continent}
                      </td>
                      <td className="px-4 py-4 font-mono text-[11px] text-slate-400">
                        {dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                          ★ {dest.rating}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300 font-medium">
                        🏨 {dest._count?.hotels || dest.hotels?.length || 0} Hotels · 📍 {dest._count?.attractions || dest.attractions?.length || 0} Sights
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit('travelInfo', { ...dest.travelInfo, destinationId: dest.id, name: dest.name })}
                          title="Edit Travel Intelligence Advisory"
                          className="p-2 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 transition-all"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit('destination', dest)}
                          title="Edit Destination Info"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/destination/${dest.id}`}
                          target="_blank"
                          title="Preview User View"
                          className="p-2 inline-block rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        </Link>
                        <button
                          onClick={() => handleDeleteDestination(dest.id, dest.name)}
                          title="Delete Destination"
                          className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: HOTELS MANAGER */}
      {/* ==================================================================== */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hotel name, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <select
                value={filterDestinationId}
                onChange={(e) => setFilterDestinationId(e.target.value)}
                className="glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
              >
                <option value="ALL">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleOpenAdd('hotel')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs shrink-0 shadow-glow-ocean"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hotel</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Hotel Property</th>
                    <th className="px-4 py-4">Destination</th>
                    <th className="px-4 py-4">Price / Night</th>
                    <th className="px-4 py-4">Rating</th>
                    <th className="px-4 py-4">Amenities</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredHotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{hotel.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{hotel.address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-emerald-400">
                        {hotel.destinationName}
                      </td>
                      <td className="px-4 py-4 font-bold text-white">
                        ${hotel.pricePerNight} <span className="text-slate-400 text-[10px]">({hotel.priceRange})</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                          ★ {hotel.rating}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {hotel.amenities}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit('hotel', hotel)}
                          title="Edit Hotel"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                          title="Delete Hotel"
                          className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: ATTRACTIONS MANAGER */}
      {/* ==================================================================== */}
      {activeTab === 'attractions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attraction name, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <select
                value={filterDestinationId}
                onChange={(e) => setFilterDestinationId(e.target.value)}
                className="glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
              >
                <option value="ALL">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleOpenAdd('attraction')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Attraction</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Attraction</th>
                    <th className="px-4 py-4">Destination</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Optimal Hours</th>
                    <th className="px-4 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAttractions.map((attraction) => (
                    <tr key={attraction.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={attraction.imageUrl}
                          alt={attraction.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{attraction.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{attraction.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-emerald-400">
                        {attraction.destinationName}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-semibold text-[11px]">
                          {attraction.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300 text-[11px]">
                        {attraction.bestTimeOfDay}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                          ★ {attraction.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit('attraction', attraction)}
                          title="Edit Attraction"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttraction(attraction.id, attraction.name)}
                          title="Delete Attraction"
                          className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: TRAVEL INTELLIGENCE ADVISORIES */}
      {/* ==================================================================== */}
      {activeTab === 'travelInfo' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-300 flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0 text-purple-400" />
            <span>
              Travel intelligence cards power the field guide shown to users, including seasonality, currencies, cultural tips, and emergency contacts.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <h4 className="font-bold text-white text-base">{d.name}</h4>
                        <p className="text-xs text-slate-400">{d.country} ({d.continent})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEdit('travelInfo', { ...d.travelInfo, destinationId: d.id, name: d.name })}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Advisory</span>
                    </button>
                  </div>

                  {d.travelInfo ? (
                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <p><strong className="text-emerald-400">📅 Best Season:</strong> {d.travelInfo.bestTimeToVisit}</p>
                      <p><strong className="text-amber-400">💶 Currency:</strong> {d.travelInfo.currency}</p>
                      <p><strong className="text-sky-400">🗣️ Language:</strong> {d.travelInfo.language}</p>
                      <p><strong className="text-purple-400">💡 Local Tips:</strong> {d.travelInfo.localTips}</p>
                      <p><strong className="text-rose-400">🛡️ Safety:</strong> {d.travelInfo.safetyNotes}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500 italic">No travel advisory defined yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: USER & ROLE MANAGEMENT */}
      {/* ==================================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>

            <p className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredUsers.length}</strong> registered user accounts
            </p>
          </div>

          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Role & Access</th>
                    <th className="px-4 py-4">Searches Recorded</th>
                    <th className="px-4 py-4">Registered Date</th>
                    <th className="px-6 py-4 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentAdmin?.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-xs text-slate-950">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm flex items-center space-x-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400">ID: {u.id.substring(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-slate-300">
                          {u.email}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              u.role === 'ADMIN'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {u.role === 'ADMIN' ? '🛡️ ADMIN' : '✈️ USER'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {u._count?.searchHistory || 0} searches
                        </td>
                        <td className="px-4 py-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot change own role' : `Change to ${u.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isSelf
                                ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                            }`}
                          >
                            {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot delete own account' : 'Delete user'}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isSelf
                                ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                                : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-800/50 text-rose-300'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        type={modalType}
        initialData={editingItem}
        destinationsList={destinations}
        onSubmit={handleModalSubmit}
      />
    </motion.div>
  );
};
