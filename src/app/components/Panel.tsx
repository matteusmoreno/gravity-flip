import type { ReactNode } from 'react';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-cyan-neon/40 bg-night/85 p-6 shadow-[0_0_40px_rgba(25,240,255,0.15)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
