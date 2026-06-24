import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { SessionService } from '../../core/services/session.service';
import { Address, CheckoutPayload, Order } from '../../core/models/order.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink, EuroPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutPage implements OnInit {
  protected cart = inject(CartService);
  protected session = inject(SessionService);
  private checkout = inject(CheckoutService);
  private router = inject(Router);

  protected readonly model = this.cart.cart;
  protected readonly state = signal<'form' | 'processing' | 'done'>('form');
  protected readonly error = signal<string | null>(null);
  protected readonly order = signal<Order | null>(null);

  protected email = '';
  protected sameBilling = true;
  protected billingVat = '';
  protected notes = '';
  protected shipping: Address = {
    recipient: '',
    line1: '',
    line2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'IT',
    phone: '',
  };
  protected billing: Address = { ...this.shipping };

  ngOnInit(): void {
    this.cart.load().subscribe({ error: () => {} });
  }

  submit(): void {
    this.error.set(null);
    this.state.set('processing');

    const payload: CheckoutPayload = {
      shipping: this.shipping,
      same_billing: this.sameBilling,
      billing: this.sameBilling ? undefined : this.billing,
      billing_vat: this.billingVat || undefined,
      notes: this.notes || undefined,
    };
    if (!this.session.isAuthenticated()) payload.email = this.email;

    this.checkout.createCheckout(payload).subscribe({
      next: (res) => {
        // Sandbox: conferma il pagamento simulato. Con Stripe reale qui si userebbe
        // il client_secret con Stripe.js prima della conferma.
        this.checkout.simulatePayment(res.payment.payment_intent_id).subscribe({
          next: (order) => {
            this.order.set(order);
            this.cart.load().subscribe({ error: () => {} });
            this.state.set('done');
          },
          error: (err: HttpErrorResponse) => this.fail(err),
        });
      },
      error: (err: HttpErrorResponse) => this.fail(err),
    });
  }

  private fail(err: HttpErrorResponse): void {
    this.state.set('form');
    this.error.set(err.error?.message || 'Pagamento non riuscito. Riprova.');
  }

  backToCart(): void {
    this.router.navigateByUrl('/carrello');
  }
}
