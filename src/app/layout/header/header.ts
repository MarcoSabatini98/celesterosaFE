import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme-service/theme.service';
import { CartService } from '../../core/services/cart-service/cart.service';
import { SessionService } from '../../core/services/session-service/session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  protected theme = inject(ThemeService);
  protected cart = inject(CartService);
  protected session = inject(SessionService);

  ngOnInit(): void {
    // Allinea il contatore carrello allo stato del backend.
    this.cart.load().subscribe({ error: () => {} });
  }
}
