import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  Shield,
  Bell,
  PlusCircle,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  Car
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Offer Received', desc: 'Jordan Vance made an offer on your Model S Plaid.', time: '10m ago', unread: true },
    { id: 2, title: 'Inspection Complete', desc: 'Taycan Turbo S 150-point report verified at 98/100.', time: '1h ago', unread: false },
    { id: 3, title: 'Price Drop Alert', desc: '2023 Audi RS e-tron GT was reduced by $3,500.', time: '3h ago', unread: false }
  ];

  const navLinks = [
    { name: '3D Showroom', path: '/' },
    { name: 'Marketplace', path: '/buy' },
    { name: 'Sell Vehicle', path: '/sell' },
    { name: 'About & Trust', path: '/about' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/85 backdrop-blur-xl border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 text-black stroke-[2.5]" />
            <span className="absolute inset-0 rounded-xl bg-cyan-400 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
          </div>
          <div>
            <div className="text-xl font-extrabold font-display tracking-widest text-white flex items-center gap-1.5">
              MOTOR<span className="text-cyan-400">VAULT</span>
            </div>
            <div className="text-[10px] font-mono tracking-wider text-slate-400 -mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              3D PRE-OWNED MARKETPLACE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            {/* Notification Drawer Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0d1424] border border-cyan-500/30 shadow-cyan-glow-lg p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Vault Alerts
                  </span>
                  <span className="text-[11px] text-slate-400">Mark all read</span>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sell Vehicle Glowing Button */}
          <Link
            to="/sell"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-sm shadow-cyan-glow transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>List Your Vehicle</span>
          </Link>

          {/* User Account / Demo Switcher */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-400/40 text-xs transition-colors"
                title="Open Seller Dashboard"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                />
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-white leading-tight flex items-center gap-1">
                    {user.name.split(' ')[0]}
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-sm font-medium transition-colors"
            >
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/sell"
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-bold"
          >
            Sell
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1c] border-b border-cyan-500/20 px-4 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.path)
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-cyan-400"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Seller Dashboard ({user.name})</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center rounded-xl bg-slate-800 text-cyan-400 font-medium text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
