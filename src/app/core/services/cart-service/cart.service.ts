import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/common.models';
import { Cart } from '../../models/order.models';
import { SessionService } from '../session-service/session.service';

const EMPTY: Cart = {
  cart_token: null,
  item_count: 0,
  items: [],
  subtotal: 0,
  vat_total: 0,
  shipping_total: 0,
  grand_total: 0,
};

// Stato del carrello (signal) + chiamate API. Il token guest viene persistito
// in sessione e reiniettato dall'interceptor come header X-Cart-Token.
@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private session = inject(SessionService);
  private base = `${environment.apiBase}/cart`;

  readonly cart = signal<Cart>(EMPTY);
  readonly count = computed(() => this.cart().item_count);

  private store(cart: Cart): Cart {
    this.cart.set(cart);
    this.session.setCartToken(cart.cart_token);
    return cart;
  }

  load(): Observable<Cart> {
    return this.http.get<ApiResponse<Cart>>(this.base).pipe(
      map((r) => r.data),
      tap((c) => this.store(c)),
    );
  }

  add(variantId: number, quantity = 1): Observable<Cart> {
    return this.http
      .post<ApiResponse<Cart>>(`${this.base}/items`, { variant_id: variantId, quantity })
      .pipe(
        map((r) => r.data),
        tap((c) => this.store(c)),
      );
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http
      .put<ApiResponse<Cart>>(`${this.base}/items/${itemId}`, { quantity })
      .pipe(
        map((r) => r.data),
        tap((c) => this.store(c)),
      );
  }

  remove(itemId: number): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(`${this.base}/items/${itemId}`).pipe(
      map((r) => r.data),
      tap((c) => this.store(c)),
    );
  }

  clear(): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(this.base).pipe(
      map((r) => r.data),
      tap((c) => this.store(c)),
    );
  }

  // Azzera lo stato locale del carrello e il token guest (es. al logout).
  reset(): void {
    this.cart.set(EMPTY);
    this.session.clearCartToken();
  }
}
