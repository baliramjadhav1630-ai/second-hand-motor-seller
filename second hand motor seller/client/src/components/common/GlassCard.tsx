import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glow?: 'cyan' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = false,
  glow = 'none',
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl bg-[#0d1424]/70 backdrop-blur-xl border border-cyan-500/15 text-slate-100 overflow-hidden',
          hoverEffect && 'transition-all duration-300 hover:border-cyan-400/40 hover:shadow-cyan-glow hover:-translate-y-0.5',
          glow === 'cyan' && 'shadow-cyan-glow border-cyan-500/30',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
