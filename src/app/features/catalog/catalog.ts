import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../core/services/catalog-service/catalog.service';
import {
  Brand,
  Category,
  ProductCard as ProductCardModel,
  ProductQuery,
} from '../../core/models/catalog.models';
import { ProductCard } from '../../shared/product-card/product-card';

type SortValue = NonNullable<ProductQuery['sort']>;
type ConditionValue = NonNullable<ProductQuery['condition']>;

@Component({
  selector: 'app-catalog',
  imports: [ProductCard],
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

  // Opzioni dei filtri (caricate una volta).
  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);

  // Stato del form filtri (sincronizzato con la query string).
  protected readonly fCategory = signal('');
  protected readonly fBrand = signal('');
  protected readonly fCondition = signal('');
  protected readonly fMin = signal('');
  protected readonly fMax = signal('');

  // Pannello filtri aperto su mobile.
  protected readonly filtersOpen = signal(false);

  protected readonly hasMore = computed(() => this.page() < this.totalPages());

  protected readonly activeCount = computed(() => {
    const q = this.query();
    return [q.category, q.brand, q.condition, q.min_price, q.max_price].filter(
      (v) => v !== undefined && v !== '',
    ).length;
  });

  protected readonly sorts: { value: SortValue; label: string }[] = [
    { value: 'newest', label: 'Novità' },
    { value: 'price_asc', label: 'Prezzo ↑' },
    { value: 'price_desc', label: 'Prezzo ↓' },
    { value: 'name', label: 'Nome' },
  ];

  protected readonly conditions: { value: ConditionValue; label: string }[] = [
    { value: 'new', label: 'Nuovo' },
    { value: 'used', label: 'Usato' },
    { value: 'refurbished', label: 'Ricondizionato' },
  ];

  ngOnInit(): void {
    this.catalog.categories().subscribe((c) => this.categories.set(c));
    this.catalog.brands().subscribe((b) => this.brands.set(b));

    this.route.queryParams.subscribe((params) => {
      const q: ProductQuery = {
        category: params['category'] || undefined,
        brand: params['brand'] || undefined,
        q: params['q'] || undefined,
        condition: (params['condition'] as ConditionValue) || undefined,
        min_price: params['min_price'] ? Number(params['min_price']) : undefined,
        max_price: params['max_price'] ? Number(params['max_price']) : undefined,
        featured: params['featured'] === 'true' || undefined,
        sort: (params['sort'] as SortValue) || 'newest',
        limit: 12,
        page: 1,
      };
      this.query.set(q);
      this.syncForm(q);
      this.fetch(q, false);
    });
  }

  // Allinea i controlli del form ai valori correnti della query.
  private syncForm(q: ProductQuery): void {
    this.fCategory.set(q.category ?? '');
    this.fBrand.set(q.brand ?? '');
    this.fCondition.set(q.condition ?? '');
    this.fMin.set(q.min_price != null ? String(q.min_price) : '');
    this.fMax.set(q.max_price != null ? String(q.max_price) : '');
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

  // Naviga con i parametri correnti del form (azzera la paginazione).
  private navigate(overrides: Record<string, string | undefined>): void {
    const q = this.query();
    const params: Record<string, string | undefined> = {
      q: q.q || undefined,
      sort: q.sort && q.sort !== 'newest' ? q.sort : undefined,
      featured: q.featured ? 'true' : undefined,
      category: this.fCategory() || undefined,
      brand: this.fBrand() || undefined,
      condition: this.fCondition() || undefined,
      min_price: this.fMin() || undefined,
      max_price: this.fMax() || undefined,
      ...overrides,
    };
    this.router.navigate(['/catalogo'], { queryParams: params });
  }

  changeSort(sort: SortValue): void {
    this.navigate({ sort: sort === 'newest' ? undefined : sort });
  }

  applyFilters(): void {
    this.filtersOpen.set(false);
    this.navigate({});
  }

  clearFilters(): void {
    this.fCategory.set('');
    this.fBrand.set('');
    this.fCondition.set('');
    this.fMin.set('');
    this.fMax.set('');
    this.router.navigate(['/catalogo']);
  }

  toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  loadMore(): void {
    const next = { ...this.query(), page: this.page() + 1 };
    this.query.set(next);
    this.fetch(next, true);
  }

  // Nome leggibile di una categoria dato lo slug (per l'intestazione).
  protected categoryName(slug: string): string {
    for (const top of this.categories()) {
      if (top.slug === slug) return top.name;
      const child = top.children?.find((c) => c.slug === slug);
      if (child) return child.name;
    }
    return slug;
  }
}
