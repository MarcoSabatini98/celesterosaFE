export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  children: Category[];
}

export interface AttributeDef {
  code: string;
  label: string;
  data_type: 'string' | 'number' | 'date' | 'boolean' | 'enum';
  unit: string | null;
  options: string[] | null;
  is_filterable: boolean;
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  attributes: AttributeDef[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  is_primary: boolean;
  variant_id: number | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  color: string | null;
  finish: string | null;
  handedness: 'right' | 'left' | 'na';
  size: string | null;
  price: number;
  stock: number;
  in_stock: boolean;
  is_default: boolean;
}

export interface ProductAttributeValue {
  code: string;
  label: string;
  unit: string | null;
  value: string | number | boolean | null;
}

export interface ProductCard {
  id: number;
  sku: string;
  name: string;
  slug: string;
  short_description: string | null;
  condition: 'new' | 'used' | 'refurbished';
  base_price: number;
  price_from: number;
  vat_rate: number;
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  brand: { id: number; name: string; slug: string } | null;
  category: { id: number; name: string; slug: string } | null;
  primary_image: ProductImage | null;
  total_stock: number;
}

export interface ProductDetail extends ProductCard {
  description: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttributeValue[];
}

export interface ProductQuery {
  q?: string;
  category?: string;
  brand?: string;
  condition?: 'new' | 'used' | 'refurbished';
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  page?: number;
  limit?: number;
}
