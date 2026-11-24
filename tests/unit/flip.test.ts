import { describe, expect, it } from 'vitest';
import { FlipController } from '@/core/flip';

describe('FlipController', () => {
  it('começa no chão e inverte ao pedir', () => {
    const f = new FlipController(300, 100);
    expect(f.side).toBe('floor');
    expect(f.requestFlip()).toBe(true);
    expect(f.side).toBe('ceiling');
  });

  it('ignora pedido logo no início da recarga', () => {
    const f = new FlipController(300, 100);
    f.requestFlip();
    expect(f.requestFlip()).toBe(false);
    f.update(150);
    expect(f.side).toBe('ceiling');
    f.update(200);
    expect(f.side).toBe('ceiling');
  });

  it('executa a inversão guardada quando o pedido veio até 100 ms antes do fim', () => {
    const f = new FlipController(300, 100);
    f.requestFlip();
    f.update(220); // faltam 80 ms
    expect(f.requestFlip()).toBe(false);
    expect(f.update(80)).toBe(true);
    expect(f.side).toBe('floor');
  });

  it('ignora o pedido feito antes da janela do buffer (mais de 100 ms para o fim)', () => {
    const f = new FlipController(300, 100);
    f.requestFlip();
    f.update(150); // faltam 150 ms
    f.requestFlip();
    f.update(150);
    expect(f.side).toBe('ceiling');
    f.update(100);
    expect(f.side).toBe('ceiling');
  });

  it('readiness vai de 0 a 1 durante a recarga', () => {
    const f = new FlipController(300, 100);
    f.requestFlip();
    expect(f.readiness).toBe(0);
    f.update(150);
    expect(f.readiness).toBeCloseTo(0.5);
    f.update(150);
    expect(f.readiness).toBe(1);
  });

  it('permite inverter de novo depois da recarga', () => {
    const f = new FlipController(300, 100);
    f.requestFlip();
    f.update(300);
    expect(f.requestFlip()).toBe(true);
    expect(f.side).toBe('floor');
  });
});
