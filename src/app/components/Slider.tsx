import { useId } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, onChange }: Props) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex justify-between text-ink">
        <span>{label}</span>
        <span className="text-ink-dim">{Math.round(value * 100)}%</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="h-11 w-full cursor-pointer accent-cyan-neon"
      />
    </div>
  );
}
