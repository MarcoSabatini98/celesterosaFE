import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session-service/session.service';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { CartService } from '../../core/services/cart-service/cart.service';

@Component({
  selector: 'app-account',
  imports: [RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountPage {
  protected session = inject(SessionService);
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.cart.reset();
    this.router.navigate(['/']);
  }
}
