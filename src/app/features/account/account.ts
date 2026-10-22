import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session-service/session.service';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { CartService } from '../../core/services/cart-service/cart.service';
import { OrderService } from '../../core/services/order-service/order.service';
import { Order } from '../../core/models/order.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { ORDER_STATUS } from '../orders/order-status';

@Component({
  selector: 'app-account',
  imports: [RouterLink, DatePipe, EuroPipe],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountPage implements OnInit {
  protected session = inject(SessionService);
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private order = inject(OrderService);
  private router = inject(Router);

  protected readonly orders = signal<Order[]>([]);
  protected readonly loadingOrders = signal(true);
  protected readonly statusMap = ORDER_STATUS;

  // Ordini in corso (pagati / in lavorazione / spediti, non ancora consegnati).
  protected readonly ongoing = computed(() =>
    this.orders().filter((o) => ['paid', 'processing', 'shipped'].includes(o.status)),
  );
  protected readonly recent = computed(() => this.orders().slice(0, 5));
  protected readonly invoices = computed(() => this.orders().filter((o) => o.invoice));
  protected readonly deliveredCount = computed(
    () => this.orders().filter((o) => o.status === 'delivered').length,
  );

  ngOnInit(): void {
    this.order.myOrders(1, 50).subscribe({
      next: (res) => {
        this.orders.set(res.items);
        this.loadingOrders.set(false);
      },
      error: () => this.loadingOrders.set(false),
    });
  }

  logout(): void {
    this.auth.logout();
    this.cart.reset();
    this.router.navigate(['/']);
  }
}
