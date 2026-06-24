import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/common.models';
import { ProductDetail } from '../models/catalog.models';
import { Order } from '../models/order.models';
import { AdminProductInput, AdminVariantInput, OrderStatusUpdate } from '../models/admin.models';

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
}
