import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogIn, Sparkles, AlertCircle, Check, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations/variants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemoTraveler, loginAsDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFastLogin = async (demoFn) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await demoFn();
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="min-h-[85vh] flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-glow mx-auto mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your travel discoveries and session history.
          </p>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFastLogin(loginAsDemoTraveler)}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => handleFastLogin(loginAsDemoAdmin)}
              className="py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-700/60 text-xs font-semibold text-emerald-300 flex items-center justify-center space-x-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@travel.com"
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-glow transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:underline">
            Create Free Account
          </Link>
        </div>

      </div>
    </motion.div>
  );
};
