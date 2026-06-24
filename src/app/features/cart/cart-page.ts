import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/order.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, EuroPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  protected cart = inject(CartService);
  protected readonly model = this.cart.cart;
  // Evita il flash di "carrello vuoto" durante il primo caricamento.
  protected readonly loaded = signal(false);

  ngOnInit(): void {
    this.cart.load().subscribe({
      next: () => this.loaded.set(true),
      error: () => this.loaded.set(true),
    });
  }

  inc(item: CartItem): void {
    if (item.quantity >= item.stock) return;
    this.cart.updateQuantity(item.item_id, item.quantity + 1).subscribe({ error: () => {} });
  }

  dec(item: CartItem): void {
    if (item.quantity <= 1) return;
    this.cart.updateQuantity(item.item_id, item.quantity - 1).subscribe({ error: () => {} });
  }

  remove(item: CartItem): void {
    this.cart.remove(item.item_id).subscribe({ error: () => {} });
  }
}
