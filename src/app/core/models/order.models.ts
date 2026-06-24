export interface CartItem {
  item_id: number;
  variant_id: number;
  product_name: string;
  product_slug: string;
  variant_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  vat_rate: number;
  line_total: number;
  line_taxable: number;
  line_vat: number;
  stock: number;
  in_stock: boolean;
  image: string | null;
}

export interface Cart {
  cart_token: string | null;
  item_count: number;
  items: CartItem[];
  subtotal: number;
  vat_total: number;
  shipping_total: number;
  grand_total: number;
}

export interface Address {
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface CheckoutPayload {
  email?: string;
  shipping: Address;
  same_billing?: boolean;
  billing?: Address;
  billing_vat?: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  variant_name: string | null;
  sku: string;
  unit_price: number;
  quantity: number;
  vat_rate: number;
  line_total: number;
}

export interface OrderPayment {
  status: string;
  provider: string;
  paid_at: string | null;
}

export interface OrderInvoice {
  number: string;
  status: string;
  pdf_url: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  email: string;
  currency: string;
  subtotal: number;
  vat_total: number;
  shipping_total: number;
  grand_total: number;
  placed_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping: Partial<Address> & { recipient?: string };
  items: OrderItem[];
  payment: OrderPayment | null;
  invoice: OrderInvoice | null;
}

export interface CheckoutResult {
  order: Order;
  payment: {
    client_secret: string;
    payment_intent_id: string;
    simulated: boolean;
    publishable_key: string | null;
  };
}
