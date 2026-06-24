import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDetail, ProductVariant } from '../../core/models/catalog.models';
import { EuroPipe } from '../../shared/pipes/euro.pipe';

@Component({
  selector: 'app-product',
  imports: [RouterLink, EuroPipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductPage implements OnInit {
  private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);
  private cart = inject(CartService);

  protected readonly product = signal<ProductDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly selected = signal<ProductVariant | null>(null);
  protected readonly activeImage = signal<string | null>(null);
  protected readonly qty = signal(1);
  protected readonly adding = signal(false);
  protected readonly added = signal(false);

  protected readonly price = computed(() => this.selected()?.price ?? this.product()?.price_from ?? 0);
  protected readonly canBuy = computed(() => (this.selected()?.stock ?? 0) > 0);
  // Scorta bassa: avviso "ne restano pochi" sotto soglia.
  protected readonly lowStock = computed(() => {
    const s = this.selected()?.stock ?? 0;
    return s > 0 && s <= 5;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      const slug = p.get('slug');
      if (slug) this.fetch(slug);
    });
  }

  private fetch(slug: string): void {
    this.loading.set(true);
    this.catalog.product(slug).subscribe({
      next: (prod) => {
        this.product.set(prod);
        const def = prod.variants.find((v) => v.is_default) || prod.variants.find((v) => v.in_stock) || prod.variants[0] || null;
        this.selected.set(def);
        this.activeImage.set(prod.images[0]?.url ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectVariant(v: ProductVariant): void {
    this.selected.set(v);
    this.added.set(false);
  }

  setQty(delta: number): void {
    const max = this.selected()?.stock ?? 1;
    this.qty.set(Math.max(1, Math.min(max, this.qty() + delta)));
  }

  addToCart(): void {
    const v = this.selected();
    if (!v || !this.canBuy()) return;
    this.adding.set(true);
    this.cart.add(v.id, this.qty()).subscribe({
      next: () => {
        this.adding.set(false);
        this.added.set(true);
      },
      error: () => this.adding.set(false),
    });
  }
}
