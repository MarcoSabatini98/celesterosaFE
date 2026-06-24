import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/common.models';
import { CheckoutPayload, CheckoutResult, Order } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  createCheckout(payload: CheckoutPayload): Observable<CheckoutResult> {
    return this.http
      .post<ApiResponse<CheckoutResult>>(`${this.base}/checkout`, payload)
      .pipe(map((r) => r.data));
  }

  // Conferma del pagamento in modalità sandbox simulata.
  simulatePayment(paymentIntentId: string): Observable<Order> {
    return this.http
      .post<ApiResponse<Order>>(`${this.base}/stripe/simulate-payment`, {
        payment_intent_id: paymentIntentId,
      })
      .pipe(map((r) => r.data));
  }
}
