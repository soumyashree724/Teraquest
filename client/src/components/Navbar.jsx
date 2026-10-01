import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, logout, loginAsDemoTraveler, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Terra<span className="text-emerald-400">Quest</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Discover
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Curated Destinations & Insights</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-slate-800/80 text-emerald-400 border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Destinations
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 pl-3 pr-4 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-xs text-slate-950">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-emerald-400 font-medium capitalize">
                      {user.role === 'ADMIN' ? '🛡️ Administrator' : '✈️ Explorer'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Fast demo login pills */}
                <button
                  onClick={loginAsDemoTraveler}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-all"
                >
                  Demo User
                </button>
                <button
                  onClick={loginAsDemoAdmin}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 transition-all"
                >
                  Demo Admin
                </button>

                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-glow transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-slate-950/95 border-b border-slate-800 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900 font-medium text-sm"
          >
            Explore Destinations
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-emerald-400 hover:bg-emerald-950/40 font-medium text-sm"
            >
              🛡️ Admin Console
            </Link>
          )}

          {user ? (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-emerald-400">{user.email} ({user.role})</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-950/30 text-rose-300 border border-rose-900/50 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { loginAsDemoTraveler(); setMobileMenuOpen(false); }}
                  className="py-2 text-xs font-medium rounded-lg text-slate-300 bg-slate-900 border border-slate-800"
                >
                  ⚡ Demo User
                </button>
                <button
                  onClick={() => { loginAsDemoAdmin(); setMobileMenuOpen(false); }}
                  className="py-2 text-xs font-medium rounded-lg text-emerald-300 bg-emerald-950/60 border border-emerald-800"
                >
                  🛡️ Demo Admin
                </button>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl text-slate-200 bg-slate-900 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
