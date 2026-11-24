interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, description, checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-ink">{label}</div>
        {description && <div className="text-sm text-ink-dim">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 min-h-11 shrink-0 rounded-full border-2 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/80 ${
          checked ? 'border-cyan-neon bg-cyan-neon/30' : 'border-ink-dim/60 bg-night'
        }`}
      >
        <span
          className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all ${
            checked ? 'left-7 bg-cyan-neon' : 'left-1 bg-ink-dim'
          }`}
        />
      </button>
    </div>
  );
}
