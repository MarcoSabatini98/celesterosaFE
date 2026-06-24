import { Order } from '../../core/models/order.models';

// Etichette e colore (token CSS) per ogni stato ordine.
export const ORDER_STATUS: Record<Order['status'], { label: string; color: string }> = {
  pending: { label: 'In attesa', color: 'var(--warn)' },
  paid: { label: 'Pagato', color: 'var(--ok)' },
  processing: { label: 'In lavorazione', color: 'var(--accent)' },
  shipped: { label: 'Spedito', color: 'var(--accent)' },
  delivered: { label: 'Consegnato', color: 'var(--ok)' },
  cancelled: { label: 'Annullato', color: 'var(--danger)' },
  refunded: { label: 'Rimborsato', color: 'var(--text-muted)' },
};
