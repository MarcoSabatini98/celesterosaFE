import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Paginated } from '../../models/common.models';
import { ProductDetail } from '../../models/catalog.models';
import { Order } from '../../models/order.models';
import {
  AdminBrand,
  AdminBrandInput,
  AdminCategory,
  AdminCategoryInput,
  AdminProductInput,
  AdminVariantInput,
  OrderStatusUpdate,
} from '../../models/admin.models';

// Accesso alle rotte /admin del backend (richiede ruolo admin).
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/admin`;

  private unwrap = <T>(o: Observable<ApiResponse<T>>) => o.pipe(map((r) => r.data));

  // Prodotti
  listProducts(page = 1, limit = 20, q?: string): Observable<Paginated<ProductDetail>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (q) params.set('q', q);
    return this.unwrap(
      this.http.get<ApiResponse<Paginated<ProductDetail>>>(`${this.base}/products?${params}`),
    );
  }

  getProduct(id: number): Observable<ProductDetail> {
    return this.unwrap(this.http.get<ApiResponse<ProductDetail>>(`${this.base}/products/${id}`));
  }

  createProduct(input: AdminProductInput): Observable<ProductDetail> {
    return this.unwrap(this.http.post<ApiResponse<ProductDetail>>(`${this.base}/products`, input));
  }

  updateProduct(id: number, input: Partial<AdminProductInput>): Observable<ProductDetail> {
    return this.unwrap(
      this.http.put<ApiResponse<ProductDetail>>(`${this.base}/products/${id}`, input),
    );
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.unwrap(this.http.delete<ApiResponse<unknown>>(`${this.base}/products/${id}`));
  }

  setAttributes(id: number, attributes: Record<string, unknown>): Observable<ProductDetail> {
    return this.unwrap(
      this.http.put<ApiResponse<ProductDetail>>(`${this.base}/products/${id}/attributes`, {
        attributes,
      }),
    );
  }

  // Varianti
  addVariant(productId: number, input: AdminVariantInput): Observable<unknown> {
    return this.unwrap(
      this.http.post<ApiResponse<unknown>>(`${this.base}/products/${productId}/variants`, input),
    );
  }

  deleteVariant(variantId: number): Observable<unknown> {
    return this.unwrap(this.http.delete<ApiResponse<unknown>>(`${this.base}/variants/${variantId}`));
  }

  // Immagini (multipart)
  uploadImages(productId: number, files: File[]): Observable<unknown> {
    const form = new FormData();
    for (const f of files) form.append('images', f);
    return this.unwrap(
      this.http.post<ApiResponse<unknown>>(`${this.base}/products/${productId}/images`, form),
    );
  }

  deleteImage(imageId: number): Observable<unknown> {
    return this.unwrap(this.http.delete<ApiResponse<unknown>>(`${this.base}/images/${imageId}`));
  }

  // Ordini
  listOrders(page = 1, limit = 20): Observable<Paginated<Order>> {
    return this.unwrap(
      this.http.get<ApiResponse<Paginated<Order>>>(`${this.base}/orders?page=${page}&limit=${limit}`),
    );
  }

  updateOrderStatus(orderNumber: string, status: OrderStatusUpdate): Observable<Order> {
    return this.unwrap(
      this.http.patch<ApiResponse<Order>>(`${this.base}/orders/${orderNumber}/status`, { status }),
    );
  }

  // Marche
  listBrands(): Observable<AdminBrand[]> {
    return this.unwrap(this.http.get<ApiResponse<AdminBrand[]>>(`${this.base}/brands`));
  }

  createBrand(input: AdminBrandInput): Observable<AdminBrand> {
    return this.unwrap(this.http.post<ApiResponse<AdminBrand>>(`${this.base}/brands`, input));
  }

  updateBrand(id: number, input: Partial<AdminBrandInput>): Observable<AdminBrand> {
    return this.unwrap(this.http.put<ApiResponse<AdminBrand>>(`${this.base}/brands/${id}`, input));
  }

  deleteBrand(id: number): Observable<unknown> {
    return this.unwrap(this.http.delete<ApiResponse<unknown>>(`${this.base}/brands/${id}`));
  }

  uploadBrandLogo(id: number, file: File): Observable<AdminBrand> {
    const form = new FormData();
    form.append('logo', file);
    return this.unwrap(this.http.post<ApiResponse<AdminBrand>>(`${this.base}/brands/${id}/logo`, form));
  }

  // Categorie
  listCategories(): Observable<AdminCategory[]> {
    return this.unwrap(this.http.get<ApiResponse<AdminCategory[]>>(`${this.base}/categories`));
  }

  createCategory(input: AdminCategoryInput): Observable<AdminCategory> {
    return this.unwrap(this.http.post<ApiResponse<AdminCategory>>(`${this.base}/categories`, input));
  }

  updateCategory(id: number, input: Partial<AdminCategoryInput>): Observable<AdminCategory> {
    return this.unwrap(
      this.http.put<ApiResponse<AdminCategory>>(`${this.base}/categories/${id}`, input),
    );
  }

  deleteCategory(id: number): Observable<unknown> {
    return this.unwrap(this.http.delete<ApiResponse<unknown>>(`${this.base}/categories/${id}`));
  }

  uploadCategoryImage(id: number, file: File): Observable<AdminCategory> {
    const form = new FormData();
    form.append('image', file);
    return this.unwrap(
      this.http.post<ApiResponse<AdminCategory>>(`${this.base}/categories/${id}/image`, form),
    );
  }
}
