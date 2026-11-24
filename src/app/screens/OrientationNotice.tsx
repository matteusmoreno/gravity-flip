/** Aviso para girar o aparelho. Só aparece em telas estreitas em retrato. */
export function OrientationNotice() {
  return (
    <div
      role="alert"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-night p-8 text-center"
    >
      <div className="text-6xl" aria-hidden="true">
        ⟳
      </div>
      <p className="neon-title text-2xl font-bold uppercase tracking-widest text-cyan-neon">Gire o aparelho</p>
      <p className="text-ink-dim">O Gravity Flip é jogado na horizontal.</p>
    </div>
  );
}
