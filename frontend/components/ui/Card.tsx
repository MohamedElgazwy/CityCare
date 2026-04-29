import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_10px_45px_rgba(15,23,42,0.1)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}
