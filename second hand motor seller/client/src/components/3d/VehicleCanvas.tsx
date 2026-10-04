import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { RealVehicleModel } from './RealVehicleModel.js';
import { ProceduralVehicle } from './ProceduralVehicle.js';
import { TurntableStage } from './TurntableStage.js';
import { VehicleHotspot } from './VehicleHotspot.js';
import { CameraControls, CameraPreset } from './CameraControls.js';
import { VehicleHotspot as HotspotType } from '../../types/index.js';
import { RotateCw, Maximize2, Minimize2, Eye, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface VehicleCanvasProps {
  color?: string;
  onColorChange?: (newColor: string) => void;
  modelType?: 'hyper_ev' | 'cyber_coupe' | 'm_spec' | 'sport_suv' | 'gran_turismo';
  hotspots?: HotspotType[];
  showControls?: boolean;
  showColorPicker?: boolean;
  interactiveHotspots?: boolean;
  className?: string;
  fallbackImage?: string;
}

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.warn('3D Model loader fallback:', err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const VehicleCanvas: React.FC<VehicleCanvasProps> = ({
  color = '#00f0ff',
  onColorChange,
  modelType = 'hyper_ev',
  hotspots = [],
  showControls = true,
  showColorPicker = true,
  interactiveHotspots = true,
  className = 'h-[520px]',
  fallbackImage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('reset');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [currentColor, setCurrentColor] = useState<string>(color);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleColorSelect = (newCol: string) => {
    setCurrentColor(newCol);
    if (onColorChange) {
      onColorChange(newCol);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Color Swatches
  const colorOptions = [
    { label: 'Cyber Cyan', hex: '#00f0ff' },
    { label: 'Obsidian Black', hex: '#161b26' },
    { label: 'Apex Red', hex: '#e11d48' },
    { label: 'Solar Silver', hex: '#94a3b8' },
    { label: 'Emerald Green', hex: '#10b981' }
  ];

  // Graceful 2D Fallback if WebGL fails
  if (!hasWebGL) {
    return (
      <div className={`relative w-full ${className} rounded-2xl bg-[#090d16] border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center p-6 text-center`}>
        <img
          src={fallbackImage || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'}
          alt="2D Vehicle Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 p-6 rounded-2xl bg-black/80 backdrop-blur-md max-w-md border border-cyan-500/30">
          <ShieldAlert className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">High-Definition 2D Gallery Mode</h3>
          <p className="text-xs text-slate-300 mb-4">
            WebGL acceleration is inactive in this browser environment. The full vehicle catalog, 150-point report, and marketplace purchase flows remain fully functional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} rounded-2xl bg-[#06090f] border border-cyan-500/20 overflow-hidden shadow-glass select-none`}
    >
      {/* Three.js Canvas */}
      <Canvas
        shadows
        camera={{ position: [4.0, 2.0, 4.0], fov: 40 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={<ProceduralVehicle color={currentColor} modelType={modelType} />}>
          <TurntableStage />

          {/* Real 3D Car Model with physical clearcoat paint */}
          <ModelErrorBoundary fallback={<ProceduralVehicle color={currentColor} modelType={modelType} />}>
            <RealVehicleModel color={currentColor} isRotating={autoRotate} />
          </ModelErrorBoundary>
          
          {/* Dynamic 3D Hotspots */}
          {interactiveHotspots && hotspots.map((hs, index) => (
            <VehicleHotspot key={hs.id || `hs-${index}`} hotspot={hs} />
          ))}

          <CameraControls preset={cameraPreset} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>

      {/* Floating 3D Badge HUD */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-cyan-300 text-xs font-mono tracking-wider shadow-cyan-sm pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>MOTORVAULT 3D STAGE</span>
        </div>
      </div>

      {/* Top Right Tool Buttons */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 ${
              autoRotate
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-sm'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
            title={autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
            aria-label="Toggle auto rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 backdrop-blur-md transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Bottom HUD: Camera View Presets */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/25 shadow-cyan-glow">
          <span className="px-2 text-[10px] font-mono text-cyan-400 uppercase tracking-wider hidden sm:inline flex items-center gap-1">
            <Compass className="w-3 h-3" /> Angle
          </span>
          {(['reset', 'front', 'side', 'rear', 'interior'] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setCameraPreset(preset);
                setAutoRotate(false);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                cameraPreset === preset
                  ? 'bg-cyan-500 text-black font-semibold shadow-cyan-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {preset === 'reset' ? '3/4 Iso' : preset}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Left: Paint Color Swatches */}
      {showColorPicker && (
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/20">
          <Eye className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <div className="flex items-center gap-1.5">
            {colorOptions.map((c) => (
              <button
                key={c.hex}
                onClick={() => handleColorSelect(c.hex)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  currentColor === c.hex
                    ? 'scale-125 border-cyan-400 shadow-cyan-sm ring-2 ring-cyan-400/40'
                    : 'border-slate-600 hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
                aria-label={`Change vehicle color to ${c.label}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drag & Orbit Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[11px] font-mono text-slate-500 tracking-wider pointer-events-none hidden sm:block">
        REAL CAR 3D TWIN • DRAG TO ORBIT • SCROLL TO ZOOM
      </div>
    </div>
  );
};
