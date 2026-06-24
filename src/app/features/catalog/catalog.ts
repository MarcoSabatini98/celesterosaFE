import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard as ProductCardModel, ProductQuery } from '../../core/models/catalog.models';
import { ProductCard } from '../../shared/product-card/product-card';

type SortValue = NonNullable<ProductQuery['sort']>;

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogPage implements OnInit {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly products = signal<ProductCardModel[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly loading = signal(true);
  protected readonly query = signal<ProductQuery>({});

  protected readonly hasMore = computed(() => this.page() < this.totalPages());

  protected readonly sorts: { value: SortValue; label: string }[] = [
    { value: 'newest', label: 'Novità' },
    { value: 'price_asc', label: 'Prezzo ↑' },
    { value: 'price_desc', label: 'Prezzo ↓' },
    { value: 'name', label: 'Nome' },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const q: ProductQuery = {
        category: params['category'] || undefined,
        brand: params['brand'] || undefined,
        q: params['q'] || undefined,
        featured: params['featured'] === 'true' || undefined,
        sort: (params['sort'] as SortValue) || 'newest',
        limit: 12,
        page: 1,
      };
      this.query.set(q);
      this.fetch(q, false);
    });
  }

  private fetch(q: ProductQuery, append: boolean): void {
    this.loading.set(true);
    this.catalog.products(q).subscribe({
      next: (res) => {
        this.products.set(append ? [...this.products(), ...res.items] : res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.totalPages.set(res.total_pages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  changeSort(sort: SortValue): void {
    this.router.navigate(['/catalogo'], {
      queryParams: { ...this.query(), sort, page: undefined, limit: undefined },
    });
  }

  loadMore(): void {
    const next = { ...this.query(), page: this.page() + 1 };
    this.query.set(next);
    this.fetch(next, true);
  }
}
