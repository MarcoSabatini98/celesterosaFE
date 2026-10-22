import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin-service/admin.service';
import { ProductDetail } from '../../core/models/catalog.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';

@Component({
  selector: 'app-admin-products',
  imports: [RouterLink, EuroPipe],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css'],
})
export class AdminProductsPage implements OnInit {
  private admin = inject(AdminService);

  protected readonly items = signal<ProductDetail[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.admin.listProducts(1, 50).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(p: ProductDetail): void {
    if (!confirm(`Eliminare "${p.name}"? L'operazione è irreversibile.`)) return;
    this.admin.deleteProduct(p.id).subscribe({
      next: () => this.items.update((list) => list.filter((x) => x.id !== p.id)),
      error: () => {},
    });
  }
}
