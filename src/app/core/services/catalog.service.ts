import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/common.models';
import {
  Brand,
  Category,
  CategoryDetail,
  ProductCard,
  ProductDetail,
  ProductQuery,
} from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  categories(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<Category[]>>(`${this.base}/categories`)
      .pipe(map((r) => r.data));
  }

  category(slug: string): Observable<CategoryDetail> {
    return this.http
      .get<ApiResponse<CategoryDetail>>(`${this.base}/categories/${slug}`)
      .pipe(map((r) => r.data));
  }

  brands(): Observable<Brand[]> {
    return this.http.get<ApiResponse<Brand[]>>(`${this.base}/brands`).pipe(map((r) => r.data));
  }

  products(query: ProductQuery = {}): Observable<Paginated<ProductCard>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http
      .get<ApiResponse<Paginated<ProductCard>>>(`${this.base}/products`, { params })
      .pipe(map((r) => r.data));
  }

  product(slug: string): Observable<ProductDetail> {
    return this.http
      .get<ApiResponse<ProductDetail>>(`${this.base}/products/${slug}`)
      .pipe(map((r) => r.data));
  }
}
