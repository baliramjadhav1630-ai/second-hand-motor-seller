import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Vehicle } from '../types/index.js';
import { apiRequest } from '../api/client.js';
import { VehicleCard } from '../components/common/VehicleCard.js';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode: grid or list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || 'All');
  const [selectedBodyType, setSelectedBodyType] = useState(searchParams.get('bodyType') || 'All');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || 'All');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get('maxPrice')) || 250000);
  const [maxMileage, setMaxMileage] = useState<number>(Number(searchParams.get('maxMileage')) || 100000);
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(searchParams.get('isCertified') === 'true');
  const [sortOption, setSortOption] = useState<string>(searchParams.get('sort') || 'newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch from API
  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.set('q', searchQuery);
        if (selectedMake !== 'All') queryParams.set('make', selectedMake);
        if (selectedBodyType !== 'All') queryParams.set('bodyType', selectedBodyType);
        if (selectedFuel !== 'All') queryParams.set('fuel', selectedFuel);
        if (selectedTransmission !== 'All') queryParams.set('transmission', selectedTransmission);
        if (maxPrice < 250000) queryParams.set('maxPrice', maxPrice.toString());
        if (maxMileage < 100000) queryParams.set('maxMileage', maxMileage.toString());
        if (certifiedOnly) queryParams.set('isCertified', '1');
        queryParams.set('sort', sortOption);

        const res = await apiRequest<{ vehicles: Vehicle[] }>(`/vehicles?${queryParams.toString()}`);
        setVehicles(res.vehicles);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load vehicles:', err);
        setError(err.message || 'Failed to load vehicle listings');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadVehicles, 150); // slight debounce for smooth feel
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedMake,
    selectedBodyType,
    selectedFuel,
    selectedTransmission,
    maxPrice,
    maxMileage,
    certifiedOnly,
    sortOption
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('All');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setMaxPrice(250000);
    setMaxMileage(100000);
    setCertifiedOnly(false);
    setSortOption('newest');
    setSearchParams({});
  };

  const makes = ['All', 'Porsche', 'Tesla', 'Audi', 'BMW', 'Mercedes-Benz', 'Rivian', 'Lucid', 'Hyundai', 'Ford', 'Chevrolet'];
  const bodyTypes = ['All', 'Coupe', 'Sedan', 'SUV', 'Truck'];
  const fuelTypes = ['All', 'Electric', 'Petrol', 'Hybrid'];
  const transmissions = ['All', 'Automatic', 'Manual', 'Dual-Clutch'];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-cyan-500/15">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              AUTHENTICATED INVENTORY
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white">
              MotorVault Marketplace
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore 3D-scanned performance, luxury, and electric pre-owned vehicles.
            </p>
          </div>

          {/* Search Bar & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search make, model, trim..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400"
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className={`lg:block ${mobileFiltersOpen ? 'block fixed inset-0 z-50 p-6 bg-[#090d16] overflow-y-auto' : 'hidden'}`}>
            <div className="p-5 rounded-2xl bg-[#0c1322]/80 backdrop-blur-xl border border-cyan-500/20 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Vehicle Filters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  {mobileFiltersOpen && (
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="lg:hidden p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Make Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Manufacturer
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {makes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMake(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedMake === m
                          ? 'bg-cyan-500 text-black font-semibold shadow-cyan-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Body Style
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {bodyTypes.map((bt) => (
                    <button
                      key={bt}
                      onClick={() => setSelectedBodyType(bt)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center ${
                        selectedBodyType === bt
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Powertrain
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {fuelTypes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFuel(f)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center ${
                        selectedFuel === f
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300 uppercase">Max Price</span>
                  <span className="text-cyan-400 font-bold">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={250000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>$30k</span>
                  <span>$250k+</span>
                </div>
              </div>

              {/* Max Mileage Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300 uppercase">Max Mileage</span>
                  <span className="text-cyan-400 font-bold">{maxMileage.toLocaleString()} mi</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={5000}
                  value={maxMileage}
                  onChange={(e) => setMaxMileage(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>5k mi</span>
                  <span>100k mi</span>
                </div>
              </div>

              {/* Certified Only Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={certifiedOnly}
                    onChange={(e) => setCertifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>MotorVault 150-Pt Certified Only</span>
                </label>
              </div>

              {mobileFiltersOpen && (
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                >
                  Apply Filters ({vehicles.length} Results)
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT COLUMN: LISTINGS & SORTING */}
          <main className="lg:col-span-3">
            {/* Control Bar: Result Count, Sort Dropdown & View Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b101c]/80 border border-cyan-500/15 mb-6 text-xs font-mono">
              <div className="text-slate-300">
                SHOWING <span className="text-cyan-400 font-bold">{vehicles.length}</span> VEHICLES IN VAULT
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 uppercase">Sort:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="mileage_asc">Lowest Mileage</option>
                    <option value="year_desc">Newest Model Year</option>
                  </select>
                </div>

                {/* View Mode Toggle: Grid / List */}
                <div className="flex items-center border border-slate-800 rounded-xl p-0.5 bg-slate-900">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 rounded-2xl bg-slate-900/40 border border-slate-800/80 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-8 rounded-2xl bg-red-950/40 border border-red-500/30 text-center">
                <p className="text-sm text-red-300 mb-3">{error}</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs hover:bg-slate-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Empty State UI */}
            {!loading && !error && vehicles.length === 0 && (
              <div className="p-12 rounded-3xl bg-[#0a0f1d] border border-cyan-500/20 text-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">
                  No Matching Vehicles Found
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  None of our pre-owned vehicles matched all active criteria (Make: {selectedMake}, Max Price: ${maxPrice.toLocaleString()}, Fuel: {selectedFuel}). Try expanding your price slider or choosing 'All'.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs shadow-cyan-glow transition-all"
                >
                  Reset Filters & View All ({makes.length} Brands)
                </button>
              </div>
            )}

            {/* Vehicles Cards Grid or List */}
            {!loading && !error && vehicles.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
