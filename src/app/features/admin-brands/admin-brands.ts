import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/services/admin-service/admin.service';
import { AdminBrand, AdminBrandInput } from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-brands',
  imports: [FormsModule],
  templateUrl: './admin-brands.html',
  styleUrls: ['./admin-brands.css'],
})
export class AdminBrandsPage implements OnInit {
  private admin = inject(AdminService);

  protected readonly brands = signal<AdminBrand[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);

  protected newBrand: AdminBrandInput = { name: '', website: '', description: '' };
  protected editForm: AdminBrandInput = { name: '' };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.admin.listBrands().subscribe({
      next: (b) => {
        this.brands.set(b);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private fail = (err: HttpErrorResponse) =>
    this.error.set(err.error?.message || 'Operazione non riuscita.');

  create(): void {
    const name = this.newBrand.name.trim();
    if (!name) return;
    this.error.set(null);
    this.admin
      .createBrand({
        name,
        website: this.newBrand.website || null,
        description: this.newBrand.description || null,
      })
      .subscribe({
        next: () => {
          this.newBrand = { name: '', website: '', description: '' };
          this.load();
        },
        error: this.fail,
      });
  }

  startEdit(b: AdminBrand): void {
    this.editingId.set(b.id);
    this.editForm = { name: b.name, website: b.website || '', description: b.description || '' };
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(b: AdminBrand): void {
    this.error.set(null);
    this.admin
      .updateBrand(b.id, {
        name: this.editForm.name,
        website: this.editForm.website || null,
        description: this.editForm.description || null,
      })
      .subscribe({
        next: () => {
          this.editingId.set(null);
          this.load();
        },
        error: this.fail,
      });
  }

  toggleActive(b: AdminBrand): void {
    this.error.set(null);
    this.admin.updateBrand(b.id, { is_active: !b.is_active }).subscribe({
      next: () => this.load(),
      error: this.fail,
    });
  }

  remove(b: AdminBrand): void {
    if (!confirm(`Eliminare la marca "${b.name}"?`)) return;
    this.error.set(null);
    this.admin.deleteBrand(b.id).subscribe({ next: () => this.load(), error: this.fail });
  }

  onLogo(b: AdminBrand, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.error.set(null);
    this.admin.uploadBrandLogo(b.id, input.files[0]).subscribe({
      next: () => {
        input.value = '';
        this.load();
      },
      error: this.fail,
    });
  }
}
