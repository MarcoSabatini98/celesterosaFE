import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { Category, ProductCard as ProductCardModel } from '../../core/models/catalog.models';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {
  private catalog = inject(CatalogService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly featured = signal<ProductCardModel[]>([]);
  protected readonly newest = signal<ProductCardModel[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.catalog.categories().subscribe({
      next: (c) => this.categories.set(c.slice(0, 8)),
      error: () => {},
    });
    this.catalog.products({ featured: true, limit: 8 }).subscribe({
      next: (p) => this.featured.set(p.items),
      error: () => {},
    });
    this.catalog.products({ sort: 'newest', limit: 4 }).subscribe({
      next: (p) => {
        this.newest.set(p.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
