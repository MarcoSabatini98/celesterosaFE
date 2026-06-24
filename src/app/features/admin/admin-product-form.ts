import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/services/admin.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Brand, Category, ProductDetail } from '../../core/models/catalog.models';
import { AdminProductInput, AdminVariantInput } from '../../core/models/admin.models';

interface CatOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-admin-product-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrls: ['./admin-product-form.css'],
})
export class AdminProductFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private admin = inject(AdminService);
  private catalog = inject(CatalogService);

  protected readonly productId = signal<number | null>(null);
  protected readonly product = signal<ProductDetail | null>(null);
  protected readonly categories = signal<CatOption[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected form: AdminProductInput = {
    category_id: 0,
    brand_id: null,
    sku: '',
    name: '',
    short_description: '',
    description: '',
    condition: 'new',
    base_price: 0,
    is_featured: false,
  };

  protected variant: AdminVariantInput = { sku: '', name: '', stock: 0, is_default: false };

  get isEdit(): boolean {
    return this.productId() !== null;
  }

  ngOnInit(): void {
    this.catalog.categories().subscribe({
      next: (tree) => this.categories.set(this.flatten(tree)),
      error: () => {},
    });
    this.catalog.brands().subscribe({ next: (b) => this.brands.set(b), error: () => {} });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId.set(Number(id));
      this.loadProduct(Number(id));
    }
  }

  private flatten(tree: Category[], depth = 0): CatOption[] {
    const out: CatOption[] = [];
    for (const c of tree) {
      out.push({ id: c.id, label: `${'— '.repeat(depth)}${c.name}` });
      if (c.children?.length) out.push(...this.flatten(c.children, depth + 1));
    }
    return out;
  }

  private loadProduct(id: number): void {
    this.admin.getProduct(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.form = {
          category_id: p.category?.id ?? 0,
          brand_id: p.brand?.id ?? null,
          sku: p.sku,
          name: p.name,
          short_description: p.short_description ?? '',
          description: p.description ?? '',
          condition: p.condition,
          base_price: Number(p.base_price),
          is_featured: p.is_featured,
        };
      },
      error: () => {},
    });
  }

  save(): void {
    this.error.set(null);
    this.notice.set(null);
    this.saving.set(true);
    const done = {
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Salvataggio non riuscito.');
      },
    };

    if (this.isEdit) {
      this.admin.updateProduct(this.productId()!, this.form).subscribe({
        next: (p) => {
          this.saving.set(false);
          this.product.set(p);
          this.notice.set('Modifiche salvate.');
        },
        ...done,
      });
    } else {
      this.admin.createProduct(this.form).subscribe({
        next: (p) => {
          this.saving.set(false);
          // Passa in modalità modifica per immagini e varianti.
          this.router.navigate(['/admin/prodotti', p.id]);
        },
        ...done,
      });
    }
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.productId()) return;
    this.admin.uploadImages(this.productId()!, Array.from(input.files)).subscribe({
      next: () => {
        input.value = '';
        this.loadProduct(this.productId()!);
      },
      error: () => {},
    });
  }

  removeImage(imageId: number): void {
    this.admin.deleteImage(imageId).subscribe({
      next: () => this.loadProduct(this.productId()!),
      error: () => {},
    });
  }

  addVariant(): void {
    if (!this.productId()) return;
    this.admin.addVariant(this.productId()!, this.variant).subscribe({
      next: () => {
        this.variant = { sku: '', name: '', stock: 0, is_default: false };
        this.loadProduct(this.productId()!);
      },
      error: () => {},
    });
  }

  removeVariant(id: number): void {
    this.admin.deleteVariant(id).subscribe({
      next: () => this.loadProduct(this.productId()!),
      error: () => {},
    });
  }
}
