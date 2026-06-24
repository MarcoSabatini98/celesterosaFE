import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Paginated } from '../../models/common.models';
import { Order, OrderInvoice } from '../../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/orders`;

  myOrders(page = 1, limit = 10): Observable<Paginated<Order>> {
    return this.http
      .get<ApiResponse<Paginated<Order>>>(`${this.base}?page=${page}&limit=${limit}`)
      .pipe(map((r) => r.data));
  }

  myOrder(orderNumber: string): Observable<Order> {
    return this.http
      .get<ApiResponse<Order>>(`${this.base}/${orderNumber}`)
      .pipe(map((r) => r.data));
  }

  invoice(orderNumber: string): Observable<OrderInvoice & { invoice_number: string }> {
    return this.http
      .get<ApiResponse<OrderInvoice & { invoice_number: string }>>(
        `${this.base}/${orderNumber}/invoice`,
      )
      .pipe(map((r) => r.data));
  }
}
