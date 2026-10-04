import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types/index.js';
import { useFavorites } from '../../context/FavoritesContext.js';
import { Heart, Sparkles, MapPin, Gauge, Fuel, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge.js';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, viewMode = 'grid' }) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(vehicle.id);

  // Approximate monthly payment (60 months, 5.9% APR, 10% down)
  const estMonthly = Math.round((vehicle.price * 0.9 * (0.059 / 12)) / (1 - Math.pow(1 + 0.059 / 12, -60)));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id);
  };

  const imageSrc = vehicle.primary_image || vehicle.images?.[0]?.url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80';

  if (viewMode === 'list') {
    return (
      <div className="group rounded-2xl bg-[#0d1424]/75 backdrop-blur-xl border border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-cyan-glow transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Media */}
        <Link to={`/vehicle/${vehicle.id}`} className="relative md:w-80 h-52 shrink-0 overflow-hidden block">
          <img
            src={imageSrc}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          
          {/* 3D Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>3D TWIN</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-red-400 backdrop-blur-md transition-transform hover:scale-110"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm" icon="certified">
                  {vehicle.condition_score}/100 Verified
                </Badge>
                {vehicle.fuel === 'Electric' && (
                  <Badge variant="purple" size="sm" icon="ev">
                    EV {vehicle.specs?.battery_health ? `${vehicle.specs.battery_health}% Health` : ''}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold font-mono text-white">${vehicle.price.toLocaleString()}</div>
                <div className="text-[10px] text-cyan-400 font-mono">est. ${estMonthly}/mo</div>
              </div>
            </div>

            <Link to={`/vehicle/${vehicle.id}`}>
              <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{vehicle.trim || vehicle.description}</p>
            </Link>

            {/* Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>{vehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>{vehicle.fuel}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>{vehicle.specs?.horsepower || 400} HP</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{vehicle.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Seller: <span className="text-white">{vehicle.seller_name || 'Verified Ambassador'}</span>
            </span>
            <Link
              to={`/vehicle/${vehicle.id}`}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              INSPECT 3D VIEW & OFFERS →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group rounded-2xl bg-[#0d1424]/75 backdrop-blur-xl border border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-cyan-glow transition-all duration-300 overflow-hidden flex flex-col">
      {/* Media Container */}
      <Link to={`/vehicle/${vehicle.id}`} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={imageSrc}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-80" />

        {/* 3D Model Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-sm">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>3D STAGE</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-red-400 backdrop-blur-md transition-transform hover:scale-110 z-10"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Condition Score Overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="cyan" size="sm" icon="condition">
            {vehicle.condition_score}/100 Condition
          </Badge>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 text-right">
          <div className="text-lg font-extrabold font-mono text-white drop-shadow-md">
            ${vehicle.price.toLocaleString()}
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {vehicle.location.split(',')[0]}
            </span>
            <span className="text-cyan-400">est. ${estMonthly}/mo</span>
          </div>

          <Link to={`/vehicle/${vehicle.id}`}>
            <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {vehicle.trim || vehicle.description}
            </p>
          </Link>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300">
            <div className="p-1.5 rounded-lg bg-slate-900/60 text-center border border-slate-800">
              <div className="text-slate-400 text-[9px] uppercase">Mileage</div>
              <div>{vehicle.mileage.toLocaleString()} mi</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/60 text-center border border-slate-800">
              <div className="text-slate-400 text-[9px] uppercase">Power</div>
              <div>{vehicle.specs?.horsepower || 400} HP</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/60 text-center border border-slate-800">
              <div className="text-slate-400 text-[9px] uppercase">Fuel</div>
              <div>{vehicle.fuel}</div>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clean Title
          </span>
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            EXPLORE 3D →
          </Link>
        </div>
      </div>
    </div>
  );
};
