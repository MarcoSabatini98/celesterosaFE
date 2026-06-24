import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { CartService } from '../../core/services/cart-service/cart.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected email = '';
  protected password = '';
  protected first_name = '';
  protected last_name = '';

  switchMode(m: 'login' | 'register'): void {
    this.mode.set(m);
    this.error.set(null);
  }

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    const done = {
      next: () => {
        this.cart.load().subscribe({ error: () => {} });
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Operazione non riuscita. Riprova.');
      },
    };

    if (this.mode() === 'login') {
      this.auth.login({ email: this.email, password: this.password }).subscribe(done);
    } else {
      this.auth
        .register({
          email: this.email,
          password: this.password,
          first_name: this.first_name,
          last_name: this.last_name,
        })
        .subscribe(done);
    }
  }
}
