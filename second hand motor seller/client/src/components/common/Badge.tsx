import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShieldCheck, Zap, Fuel, Award } from 'lucide-react';

interface BadgeProps {
  variant?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: 'certified' | 'ev' | 'fuel' | 'condition' | 'custom';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  size = 'md',
  children,
  icon,
  className
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
    slate: 'bg-slate-900/60 text-slate-300 border-slate-700/50'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 rounded-lg gap-1.5'
  };

  const renderIcon = () => {
    switch (icon) {
      case 'certified':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ev':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 text-amber-400" />;
      case 'condition':
        return <Award className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium border backdrop-blur-md',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {renderIcon()}
      {children}
    </span>
  );
};
