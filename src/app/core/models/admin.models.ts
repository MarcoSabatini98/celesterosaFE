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

// ── Marche & categorie (gestione admin) ──────────────────────
export interface AdminBrand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
  product_count: number;
}

export interface AdminBrandInput {
  name: string;
  description?: string | null;
  website?: string | null;
  is_active?: boolean;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  children: AdminCategory[];
}

export interface AdminCategoryInput {
  name: string;
  description?: string | null;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}
