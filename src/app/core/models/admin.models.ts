export interface AdminProductInput {
  category_id: number;
  brand_id?: number | null;
  sku: string;
  name: string;
  short_description?: string;
  description?: string;
  condition?: 'new' | 'used' | 'refurbished';
  base_price: number;
  vat_rate?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface AdminVariantInput {
  sku: string;
  name: string;
  color?: string;
  finish?: string;
  handedness?: 'right' | 'left' | 'na';
  size?: string;
  price?: number | null;
  stock?: number;
  is_default?: boolean;
  is_active?: boolean;
}

export type OrderStatusUpdate =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
