import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { VehicleHotspot as HotspotType } from '../../types/index.js';
import { X, CheckCircle2, ShieldCheck, Zap, Disc, Wind, Cpu } from 'lucide-react';

interface VehicleHotspotProps {
  hotspot: HotspotType;
}

export const VehicleHotspot: React.FC<VehicleHotspotProps> = ({ hotspot }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'battery':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'brakes':
        return <Disc className="w-3.5 h-3.5 text-cyan-400" />;
      case 'aero':
        return <Wind className="w-3.5 h-3.5 text-cyan-400" />;
      case 'interior':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'powertrain':
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <group position={[hotspot.x, hotspot.y, hotspot.z]}>
      <Html distanceFactor={12} position={[0, 0, 0]} zIndexRange={[100, 0]}>
        <div className="relative">
          {/* Pulsing Hotspot Marker Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
            aria-label={`Inspection detail: ${hotspot.title}`}
          >
            {/* Outer Ripple Rings */}
            <span className="absolute w-7 h-7 rounded-full bg-cyan-400/30 animate-ping" />
            <span className="absolute w-5 h-5 rounded-full bg-cyan-500/50 shadow-cyan-glow" />

            {/* Center Core Dot */}
            <span className="relative w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-125" />

            {/* Label Chip */}
            <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/90 text-cyan-300 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-cyan-500/30 backdrop-blur-md opacity-90 group-hover:opacity-100 shadow-sm pointer-events-none transition-opacity">
              {hotspot.label}
            </span>
          </button>

          {/* Expanded Glass Callout Popover */}
          {isOpen && (
            <div className="absolute left-5 bottom-5 w-64 p-3.5 rounded-xl bg-[#0c1322]/95 backdrop-blur-xl border border-cyan-500/40 shadow-cyan-glow-lg text-slate-100 z-50 animate-fadeIn pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">
                  {getCategoryIcon(hotspot.category)}
                  <span>{hotspot.label} Telemetry</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                  aria-label="Close callout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-bold text-white mb-1 font-display tracking-wide">
                {hotspot.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {hotspot.description}
              </p>

              {/* Verified Inspection Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>MotorVault 150-Pt Verified</span>
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
