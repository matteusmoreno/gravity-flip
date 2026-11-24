import type { ButtonHTMLAttributes } from 'react';
import { bus } from '@/services/events';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const base =
  'min-h-11 min-w-11 rounded-lg px-6 py-3 text-lg font-bold uppercase tracking-widest transition focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/80 active:scale-95';
const variants = {
  primary: 'bg-cyan-neon text-night shadow-[0_0_24px_rgba(25,240,255,0.55)] hover:brightness-110',
  secondary:
    'border-2 border-cyan-neon/70 bg-night/60 text-cyan-neon hover:bg-cyan-neon/10',
};

export function Button({ variant = 'secondary', className = '', onClick, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      onClick={(e) => {
        bus.emit('audio:sfx', { name: 'ui' });
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
