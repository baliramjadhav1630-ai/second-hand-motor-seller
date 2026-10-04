import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, RefreshCw, Sparkles, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070c] border-t border-cyan-500/15 text-slate-400 text-sm">
      {/* Trust Badges Bar */}
      <div className="border-b border-cyan-500/10 bg-[#080d1a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-cyan-sm">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold font-display">150-Point Digital Inspection</h4>
              <p className="text-xs text-slate-400 mt-0.5">Every vehicle undergoes structural, powertrain, and 3D digital telemetry analysis.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-cyan-sm">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold font-display">Escrow Protected Deposits</h4>
              <p className="text-xs text-slate-400 mt-0.5">Funds are safeguarded until you physically inspect and accept the vehicle.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-cyan-sm">
              <RefreshCw className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold font-display">7-Day Test-Own Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Drive it for a week or 250 miles. If you're not completely thrilled, return it for a full refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="text-xl font-extrabold font-display tracking-wider text-white">
            MOTOR<span className="text-cyan-400">VAULT</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            The next-generation marketplace for premium pre-owned and collector motor vehicles. Powered by interactive 3D digital twins and verified vehicle history.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LOCAL NODE API: READY</span>
          </div>
        </div>

        {/* Col 2: Marketplace */}
        <div>
          <h5 className="text-white font-semibold font-display mb-4 text-xs tracking-wider uppercase text-cyan-400">
            Inventory
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/buy?fuel=Electric" className="hover:text-cyan-400 transition-colors">Electric Vehicles (EVs)</Link></li>
            <li><Link to="/buy?bodyType=Coupe" className="hover:text-cyan-400 transition-colors">Performance Coupes</Link></li>
            <li><Link to="/buy?bodyType=Sedan" className="hover:text-cyan-400 transition-colors">Luxury Sport Sedans</Link></li>
            <li><Link to="/buy?bodyType=SUV" className="hover:text-cyan-400 transition-colors">Performance SUVs & Trucks</Link></li>
            <li><Link to="/buy?isCertified=true" className="hover:text-cyan-400 transition-colors">MotorVault Certified Only</Link></li>
          </ul>
        </div>

        {/* Col 3: Sellers & Tools */}
        <div>
          <h5 className="text-white font-semibold font-display mb-4 text-xs tracking-wider uppercase text-cyan-400">
            Sellers & Platform
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/sell" className="hover:text-cyan-400 transition-colors">List Your Vehicle</Link></li>
            <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Seller Dashboard</Link></li>
            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Inspection Standards</Link></li>
            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Buyer Protection Policy</Link></li>
            <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Demo Auth Switcher</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h5 className="text-white font-semibold font-display mb-4 text-xs tracking-wider uppercase text-cyan-400">
            Vault Drop Alerts
          </h5>
          <p className="text-xs text-slate-400 mb-3">
            Receive instant notifications when rare sports cars or low-mileage EVs are listed.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 w-full"
            />
            <button
              onClick={() => alert('Subscribed to MotorVault Drop Alerts!')}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black shrink-0 transition-colors"
              aria-label="Subscribe to newsletter"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <div>© {new Date().getFullYear()} MotorVault Technologies Inc. All rights reserved.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono text-[11px]">
          <span>LOCAL ENGINE v1.0</span>
          <span>•</span>
          <span>SQLITE PERSISTENCE</span>
          <span>•</span>
          <span className="text-cyan-400">THREE.JS FIBER</span>
        </div>
      </div>
    </footer>
  );
};
