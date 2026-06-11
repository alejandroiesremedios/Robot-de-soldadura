import { describe, expect, it } from 'vitest';
import { buildWeavingSheet } from './weavingSheet';

describe('buildWeavingSheet — triangular con paradas', () => {
  it('caso simétrico 1 Hz, 0,2 s por lado → paradas del 20 % y tiempos 0/15/35/65/85/100', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.2, paradaDchaS: 0.2 });
    expect(r.error).toBeUndefined();
    expect(r.points.map((p) => p.tiempoPct)).toEqual([0, 15, 35, 65, 85, 100]);
    expect(r.points.map((p) => p.yPct)).toEqual([0, 100, 100, -100, -100, 0]);
  });

  it('asimétrico +0,1 s a la izquierda (1 Hz): parada izquierda 30 %, derecha 20 %', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.3, paradaDchaS: 0.2 });
    const t = r.points.map((p) => p.tiempoPct);
    expect(t[2] - t[1]).toBe(30); // parada izquierda
    expect(t[4] - t[3]).toBe(20); // parada derecha
    expect(t[0]).toBe(0);
    expect(t[5]).toBe(100);
  });

  it('a 0,8 Hz un ciclo dura 1,25 s → 0,1 s = 8 % de parada', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 0.8, paradaIzqS: 0.1, paradaDchaS: 0 });
    const t = r.points.map((p) => p.tiempoPct);
    expect(t[2] - t[1]).toBe(8);
  });

  it('paradas que no caben en el ciclo → error', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.6, paradaDchaS: 0.6 });
    expect(r.error).toBeDefined();
  });

  it('boost de corriente solo en los puntos de parada', () => {
    const r = buildWeavingSheet({
      frecuenciaHz: 1,
      paradaIzqS: 0.2,
      paradaDchaS: 0.2,
      boostCorrientePct: 20,
    });
    expect(r.points.map((p) => p.boostCorrientePct ?? 0)).toEqual([0, 20, 20, 20, 20, 0]);
  });

  it('parada central opcional inserta dos puntos a Y=0 entre izquierda y derecha', () => {
    const r = buildWeavingSheet({
      frecuenciaHz: 1,
      paradaIzqS: 0.2,
      paradaDchaS: 0.2,
      paradaCentroS: 0.1,
    });
    expect(r.points).toHaveLength(8);
    const centro = r.points.slice(3, 5);
    expect(centro.map((p) => p.yPct)).toEqual([0, 0]);
    expect(centro[1].tiempoPct - centro[0].tiempoPct).toBe(10);
  });

  it('aviso (no error) si las paradas superan el 60 % del ciclo', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.35, paradaDchaS: 0.35 });
    expect(r.error).toBeUndefined();
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
