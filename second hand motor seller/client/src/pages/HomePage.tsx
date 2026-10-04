import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vehicle } from '../types/index.js';
import { apiRequest } from '../api/client.js';
import { VehicleCanvas } from '../components/3d/VehicleCanvas.js';
import { VehicleCard } from '../components/common/VehicleCard.js';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Car
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [activeCarPaint, setActiveCarPaint] = useState<string>('#00f0ff');
  const [loading, setLoading] = useState(true);

  // Quick search overlay state
  const [searchMake, setSearchMake] = useState('All');
  const [searchBodyType, setSearchBodyType] = useState('All');
  const [searchFuel, setSearchFuel] = useState('All');
  const [searchMaxPrice, setSearchMaxPrice] = useState('150000');

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await apiRequest<{ vehicles: Vehicle[] }>('/vehicles');
        setVehicles(res.vehicles);
        const featured = res.vehicles.filter(v => v.is_featured);
        setFeaturedVehicles(featured.length > 0 ? featured : res.vehicles.slice(0, 4));
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const activeVehicle = featuredVehicles[activeVehicleIndex] || vehicles[0];

  // Sync default color when active vehicle switches
  useEffect(() => {
    if (!activeVehicle) return;
    const colorMap: Record<string, string> = {
      'Porsche': '#00f0ff',
      'Tesla': '#e11d48',
      'Audi': '#94a3b8',
      'BMW': '#10b981',
      'Mercedes-Benz': '#161b26',
      'Chevrolet': '#3b82f6',
      'Rivian': '#0284c7'
    };
    setActiveCarPaint(colorMap[activeVehicle.make] || '#00f0ff');
  }, [activeVehicleIndex, activeVehicle]);

  const handleNextVehicle = () => {
    if (featuredVehicles.length === 0) return;
    setActiveVehicleIndex((prev) => (prev + 1) % featuredVehicles.length);
  };

  const handlePrevVehicle = () => {
    if (featuredVehicles.length === 0) return;
    setActiveVehicleIndex((prev) => (prev - 1 + featuredVehicles.length) % featuredVehicles.length);
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchMake !== 'All') params.set('make', searchMake);
    if (searchBodyType !== 'All') params.set('bodyType', searchBodyType);
    if (searchFuel !== 'All') params.set('fuel', searchFuel);
    if (searchMaxPrice) params.set('maxPrice', searchMaxPrice);
    navigate(`/buy?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* 1. HERO 3D SHOWROOM VIEWPORT */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between pt-4 pb-12 overflow-hidden border-b border-cyan-500/15 cyber-grid-bg">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-700/10 blur-[110px] rounded-full pointer-events-none" />

        {/* Top Info Bar: Vehicle Metadata */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  MOTORVAULT DIGITAL SHOWROOM
                </span>
                {activeVehicle?.is_certified ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    150-PT CERTIFIED
                  </span>
                ) : null}
              </div>

              {activeVehicle ? (
                <div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-3">
                    {activeVehicle.year} {activeVehicle.make} <span className="text-cyan-400">{activeVehicle.model}</span>
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-xl line-clamp-1">
                    {activeVehicle.trim || activeVehicle.description}
                  </p>
                </div>
              ) : (
                <div className="h-12 w-64 bg-slate-800/60 rounded-xl animate-pulse" />
              )}
            </div>

            {/* Active Price & Quick Actions */}
            {activeVehicle && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono uppercase">Direct Vault Price</div>
                  <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    ${activeVehicle.price.toLocaleString()}
                  </div>
                </div>
                <Link
                  to={`/vehicle/${activeVehicle.id}`}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-cyan-glow transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Inspect & Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3D Interactive Stage Canvas with Left/Right Switcher */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto z-10 flex items-center justify-center">
          {/* Previous Vehicle Arrow Button */}
          <button
            onClick={handlePrevVehicle}
            className="absolute left-2 sm:left-6 z-30 p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-cyan-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Previous featured vehicle"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Master 3D Viewport */}
          <div className="w-full max-w-5xl">
            {activeVehicle ? (
              <VehicleCanvas
                color={activeCarPaint}
                onColorChange={(c) => setActiveCarPaint(c)}
                modelType={activeVehicle.model_3d_type || 'hyper_ev'}
                hotspots={activeVehicle.hotspots || []}
                className="h-[460px] sm:h-[540px]"
                fallbackImage={activeVehicle.primary_image}
              />
            ) : (
              <div className="h-[460px] rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-center">
                <div className="text-sm font-mono text-cyan-400 animate-pulse">BOOTING 3D ENVIRONMENT...</div>
              </div>
            )}
          </div>

          {/* Next Vehicle Arrow Button */}
          <button
            onClick={handleNextVehicle}
            className="absolute right-2 sm:right-6 z-30 p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-cyan-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Next featured vehicle"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Live Vehicle Switcher Dots & Telemetry Ribbon */}
        {activeVehicle && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              {/* Telemetry Pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeVehicle.mileage.toLocaleString()} MILES</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{activeVehicle.specs?.horsepower || 400} HP • 0-60 in {activeVehicle.specs?.acceleration || 3.5}s</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeVehicle.condition_score}/100 CONDITION SCORE</span>
                </div>
              </div>

              {/* Featured Carousel Indicators */}
              <div className="flex items-center gap-2">
                {featuredVehicles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVehicleIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeVehicleIndex === i
                        ? 'w-8 bg-cyan-400 shadow-cyan-sm'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`View vehicle ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. QUICK SEARCH OVERLAY CARD */}
      <section className="relative -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0c1222]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-cyan-glow-lg">
          <form onSubmit={handleQuickSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {/* Make */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">Make</label>
              <select
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Makes</option>
                <option value="Porsche">Porsche</option>
                <option value="Tesla">Tesla</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Rivian">Rivian</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Lucid">Lucid</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">Body Style</label>
              <select
                value={searchBodyType}
                onChange={(e) => setSearchBodyType(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Styles</option>
                <option value="Coupe">Performance Coupe</option>
                <option value="Sedan">Sport Sedan</option>
                <option value="SUV">Luxury SUV</option>
                <option value="Truck">Electric Truck</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">Powertrain</label>
              <select
                value={searchFuel}
                onChange={(e) => setSearchFuel(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Powertrains</option>
                <option value="Electric">Pure Electric (EV)</option>
                <option value="Petrol">Gasoline / Twin-Turbo</option>
                <option value="Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">Max Price</label>
              <select
                value={searchMaxPrice}
                onChange={(e) => setSearchMaxPrice(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="60000">Under $60,000</option>
                <option value="90000">Under $90,000</option>
                <option value="120000">Under $120,000</option>
                <option value="150000">Under $150,000</option>
                <option value="250000">Under $250,000</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 lg:col-span-1 pt-3 sm:pt-0">
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-cyan-glow transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Vault</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. FEATURED INVENTORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              CURATED INVENTORY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Featured Pre-Owned Vehicles
            </h2>
          </div>
          <Link
            to="/buy"
            className="text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2 sm:mt-0"
          >
            VIEW FULL MARKETPLACE ({vehicles.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.slice(0, 6).map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 4. BROWSE BY VEHICLE CLASS */}
      <section className="bg-[#090e1a]/60 border-y border-cyan-500/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-bold font-display text-white">
              Explore by Vehicle Class
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Engineered for thrill, refinement, and zero-compromise condition.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Pure Electric (EV)', count: '7 Listed', fuel: 'Electric', icon: '⚡' },
              { title: 'Performance Coupes', count: '4 Listed', bodyType: 'Coupe', icon: '🏎️' },
              { title: 'Luxury Sport Sedans', count: '4 Listed', bodyType: 'Sedan', icon: '🚀' },
              { title: 'Super SUVs & Trucks', count: '3 Listed', bodyType: 'SUV', icon: '🛡️' }
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/buy?${cat.fuel ? `fuel=${cat.fuel}` : `bodyType=${cat.bodyType}`}`}
                className="group p-5 rounded-2xl bg-[#0c1424]/80 border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-cyan-glow transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 font-display">{cat.title}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 150-POINT INSPECTION & TRUST PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              THE MOTORVAULT STANDARD
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
              Buying a Pre-Owned Vehicle with Zero Guesswork.
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Every motor vehicle listed on MotorVault undergoes our uncompromising 150-point digital verification process. We scan high-voltage battery health, measure paint micrometers for hidden resprays, and embed interactive 3D digital twin telemetry before approval.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'High-Voltage EV Battery Degradation & Thermal Analysis',
                'Computerized ECU Diagnostics with Zero Hidden Fault Codes',
                'Laser Paint Depth Measurement & Accident-Free Verification',
                'Brembo / Ceramic Brake Pad Life & Rotor Thickness Check',
                'Escrow Protection: Money Released Only After In-Person Inspection'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/about"
                className="px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs tracking-wider transition-colors"
              >
                READ INSPECTION PROTOCOL →
              </Link>
            </div>
          </div>

          {/* Right Visual Glass Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0b1220]/80 border border-cyan-500/25 shadow-cyan-glow">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-6">
              <div className="font-mono text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Verification
              </div>
              <span className="font-mono text-xs text-slate-400">PASSED: 150 / 150</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Traction Battery Pack SOH</div>
                  <div className="text-[11px] text-slate-400">Degradation: 1.0% | Voltage Balance: Normal</div>
                </div>
                <div className="text-right text-emerald-400 font-bold text-sm">99%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Braking System Telemetry</div>
                  <div className="text-[11px] text-slate-400">Front: 95% Pad | Rear: 92% Pad</div>
                </div>
                <div className="text-right text-emerald-400 font-bold text-sm">Optimal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Structural Chassis Alignment</div>
                  <div className="text-[11px] text-slate-400">Factory Laser Tolerances ±0.2mm</div>
                </div>
                <div className="text-right text-emerald-400 font-bold text-sm">Zero Flaws</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              Certified by MotorVault Master Automotive Technicians
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0c162d] to-[#081f3d] border border-cyan-500/30 overflow-hidden shadow-cyan-glow flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Ready to Sell Your Performance Vehicle?
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              List directly to qualified enthusiasts. Upload images, input your condition checklist, and publish in 5 minutes with local SQLite persistence.
            </p>
          </div>
          <Link
            to="/sell"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-cyan-glow transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Start Listing Vehicle →
          </Link>
        </div>
      </section>
    </div>
  );
};
