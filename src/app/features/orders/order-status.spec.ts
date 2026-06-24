import { describe, it, expect } from 'vitest';
import { ORDER_STATUS } from './order-status';

describe('ORDER_STATUS', () => {
  const stati = [
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ] as const;

  it('mappa ogni stato con etichetta e colore', () => {
    for (const s of stati) {
      expect(ORDER_STATUS[s].label).toBeTruthy();
      expect(ORDER_STATUS[s].color).toMatch(/^var\(--/);
    }
  });
});
