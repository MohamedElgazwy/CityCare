import type { InputHTMLAttributes } from 'react';

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-slate-800 shadow-inner outline-none transition focus:-translate-y-0.5 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 ${className}`}
      {...props}
    />
  );
}
