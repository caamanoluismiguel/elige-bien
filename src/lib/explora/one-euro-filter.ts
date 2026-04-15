// 1€ filter (Casiez, Roussel, Vogel 2012) — smooths noisy signals with low lag.
// https://cristal.univ-lille.fr/~casiez/1euro/

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xPrev: number | null = null;
  private dxPrev = 0;
  private tPrev: number | null = null;

  constructor(minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  filter(x: number, tMs: number): number {
    if (this.tPrev === null || this.xPrev === null) {
      this.tPrev = tMs;
      this.xPrev = x;
      return x;
    }
    const dt = Math.max(1, tMs - this.tPrev) / 1000;
    const dx = (x - this.xPrev) / dt;
    const edx = lowPass(dx, this.dxPrev, alpha(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const ex = lowPass(x, this.xPrev, alpha(cutoff, dt));
    this.xPrev = ex;
    this.dxPrev = edx;
    this.tPrev = tMs;
    return ex;
  }

  reset() {
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }
}

function alpha(cutoff: number, dt: number) {
  const tau = 1 / (2 * Math.PI * cutoff);
  return 1 / (1 + tau / dt);
}
function lowPass(x: number, xPrev: number, a: number) {
  return a * x + (1 - a) * xPrev;
}
