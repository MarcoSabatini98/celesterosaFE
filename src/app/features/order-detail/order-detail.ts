import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order-service/order.service';
import { Order } from '../../core/models/order.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { ORDER_STATUS } from '../orders/order-status';

@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, EuroPipe, DatePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private orders = inject(OrderService);

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly statusMap = ORDER_STATUS;

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      const num = p.get('orderNumber');
      if (!num) return;
      this.loading.set(true);
      this.orders.myOrder(num).subscribe({
        next: (o) => {
          this.order.set(o);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }
}
