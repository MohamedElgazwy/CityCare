'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-violet-500/90 to-cyan-500/90 text-white shadow-[0_8px_30px_rgba(76,29,149,0.25)] hover:shadow-[0_12px_36px_rgba(6,182,212,0.3)]',
  secondary: 'border border-white/60 bg-white/70 text-slate-700 shadow-[0_8px_30px_rgba(148,163,184,0.2)] hover:bg-white/90',
  ghost: 'bg-transparent text-slate-700 hover:bg-white/50',
};

export default function Button({ variant = 'primary', className = '', icon, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
