import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Shield, Lock, User, Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, quickDemoLogin, user } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('demo@motorvault.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await quickDemoLogin(demoEmail);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#07090e] text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 cyber-grid-bg">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-cyan-glow">
            <Shield className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white">
            {isRegisterMode ? 'Create MotorVault Account' : 'Access Your Vault Portal'}
          </h2>
          <p className="text-xs text-slate-400">
            Local JWT authentication backed by SQLite. Instant demo access available below.
          </p>
        </div>

        {/* 1-Click Demo Logins Card */}
        <div className="p-4 rounded-2xl bg-[#0d1629]/90 border border-cyan-500/30 shadow-cyan-sm space-y-2.5">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Pre-Seeded Demo Access
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('demo@motorvault.com')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-400 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                Alex Mercer
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">Demo Seller</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('buyer@motorvault.com')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-400 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                Jordan Vance
              </div>
              <div className="text-[10px] text-purple-400 font-mono">Demo Buyer</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1424]/85 border border-cyan-500/25 shadow-glass backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {isRegisterMode && (
              <div>
                <label className="block text-slate-400 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Sterling"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@motorvault.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-cyan-glow transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting
                ? 'Authenticating...'
                : isRegisterMode
                ? 'Create New Account'
                : 'Sign In to Portal'}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {isRegisterMode ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Register Now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
