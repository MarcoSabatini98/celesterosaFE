import { describe, it, expect } from 'vitest';
import { EuroPipe } from './euro.pipe';

describe('EuroPipe', () => {
  const pipe = new EuroPipe();

  it('formatta un numero in euro con virgola decimale e simbolo', () => {
    const out = pipe.transform(1234.5);
    expect(out).toContain('€');
    expect(out).toContain(',50');
    expect(out).toContain('234');
  });

  it('gestisce valori nulli o non numerici come 0', () => {
    expect(pipe.transform(null)).toContain('0,00');
    expect(pipe.transform(undefined)).toContain('0,00');
  });
});
