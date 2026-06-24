import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin-service/admin.service';
import { Order } from '../../core/models/order.models';
import { OrderStatusUpdate } from '../../core/models/admin.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { ORDER_STATUS } from '../orders/order-status';

@Component({
  selector: 'app-admin-orders',
  imports: [EuroPipe, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrdersPage implements OnInit {
  private admin = inject(AdminService);

  protected readonly items = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly statusMap = ORDER_STATUS;
  protected readonly options: OrderStatusUpdate[] = [
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  ngOnInit(): void {
    this.admin.listOrders(1, 50).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  changeStatus(order: Order, status: OrderStatusUpdate): void {
    this.admin.updateOrderStatus(order.order_number, status).subscribe({
      next: (updated) => {
        this.items.update((list) =>
          list.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o)),
        );
      },
      error: () => {},
    });
  }
}
