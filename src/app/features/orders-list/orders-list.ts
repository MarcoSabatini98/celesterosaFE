import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order-service/order.service';
import { Order } from '../../core/models/order.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { ORDER_STATUS } from '../orders/order-status';

@Component({
  selector: 'app-orders-list',
  imports: [RouterLink, EuroPipe, DatePipe],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
})
export class OrdersListPage implements OnInit {
  private orders = inject(OrderService);

  protected readonly items = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly statusMap = ORDER_STATUS;

  ngOnInit(): void {
    this.orders.myOrders(1, 20).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
