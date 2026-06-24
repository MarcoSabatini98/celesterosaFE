import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/services/admin-service/admin.service';
import { CatalogService } from '../../core/services/catalog-service/catalog.service';
import { AttributeDef, Brand, Category, ProductDetail } from '../../core/models/catalog.models';
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

  // Attributi EAV: definizioni della categoria + valori correnti del prodotto.
  protected readonly attrDefs = signal<AttributeDef[]>([]);
  protected attrs: Record<string, string | number | boolean | null> = {};
  protected readonly savingAttrs = signal(false);
  protected readonly attrError = signal<string | null>(null);
  protected readonly attrNotice = signal<string | null>(null);

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

  // File selezionati in fase di creazione: caricati dopo che il prodotto esiste.
  protected pendingFiles: File[] = [];

  // Creazione rapida inline di categoria/marca (toggle "matita").
  protected readonly creatingCategory = signal(false);
  protected readonly creatingBrand = signal(false);
  protected newCategoryName = '';
  protected newBrandName = '';
  protected readonly taxoError = signal<string | null>(null);

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
        if (p.category?.slug) this.loadAttributes(p.category.slug);
      },
      error: () => {},
    });
  }

  // Carica le definizioni degli attributi della categoria e precompila i valori
  // correnti del prodotto (EAV).
  private loadAttributes(slug: string): void {
    this.catalog.category(slug).subscribe({
      next: (cat) => {
        this.attrDefs.set(cat.attributes);
        const current = new Map(this.product()?.attributes.map((a) => [a.code, a.value]) ?? []);
        const next: Record<string, string | number | boolean | null> = {};
        for (const def of cat.attributes) {
          next[def.code] = current.has(def.code)
            ? (current.get(def.code) as string | number | boolean | null)
            : def.data_type === 'boolean'
              ? false
              : '';
        }
        this.attrs = next;
      },
      error: () => {},
    });
  }

  saveAttributes(): void {
    if (!this.productId()) return;
    this.attrError.set(null);
    this.attrNotice.set(null);
    this.savingAttrs.set(true);
    this.admin.setAttributes(this.productId()!, this.attrs).subscribe({
      next: (p) => {
        this.savingAttrs.set(false);
        this.product.set(p);
        this.attrNotice.set('Attributi salvati.');
      },
      error: (err: HttpErrorResponse) => {
        this.savingAttrs.set(false);
        this.attrError.set(err.error?.message || 'Salvataggio attributi non riuscito.');
      },
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
          // Carica le eventuali immagini scelte, poi passa alla modifica
          // (varianti, altre immagini, attributi).
          const goToEdit = () => {
            this.saving.set(false);
            this.router.navigate(['/admin/prodotti', p.id]);
          };
          if (this.pendingFiles.length) {
            this.admin.uploadImages(p.id, this.pendingFiles).subscribe({
              next: goToEdit,
              error: goToEdit,
            });
          } else {
            goToEdit();
          }
        },
        ...done,
      });
    }
  }

  // Memorizza i file scelti nel form di creazione (upload differito al salvataggio).
  onPendingFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pendingFiles = input.files ? Array.from(input.files) : [];
  }

  // ── Creazione rapida categoria/marca (matita) ───────────────
  toggleNewCategory(): void {
    this.taxoError.set(null);
    this.newCategoryName = '';
    this.creatingCategory.update((v) => !v);
  }

  toggleNewBrand(): void {
    this.taxoError.set(null);
    this.newBrandName = '';
    this.creatingBrand.update((v) => !v);
  }

  confirmNewCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.taxoError.set(null);
    // La nuova categoria è figlia di quella selezionata (o di primo livello).
    this.admin.createCategory({ name, parent_id: this.form.category_id || null }).subscribe({
      next: (cat) => {
        this.creatingCategory.set(false);
        this.newCategoryName = '';
        this.catalog.categories().subscribe((tree) => this.categories.set(this.flatten(tree)));
        this.form.category_id = cat.id;
        this.loadAttributes(cat.slug);
      },
      error: (err: HttpErrorResponse) =>
        this.taxoError.set(err.error?.message || 'Creazione categoria non riuscita.'),
    });
  }

  confirmNewBrand(): void {
    const name = this.newBrandName.trim();
    if (!name) return;
    this.taxoError.set(null);
    this.admin.createBrand({ name }).subscribe({
      next: (brand) => {
        this.creatingBrand.set(false);
        this.newBrandName = '';
        this.catalog.brands().subscribe((list) => this.brands.set(list));
        this.form.brand_id = brand.id;
      },
      error: (err: HttpErrorResponse) =>
        this.taxoError.set(err.error?.message || 'Creazione marca non riuscita.'),
    });
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
