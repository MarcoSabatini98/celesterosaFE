import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/services/admin-service/admin.service';
import { AdminCategory, AdminCategoryInput } from '../../core/models/admin.models';

interface FlatNode {
  cat: AdminCategory;
  depth: number;
}

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  templateUrl: './admin-categories.html',
  styleUrls: ['./admin-categories.css'],
})
export class AdminCategoriesPage implements OnInit {
  private admin = inject(AdminService);

  protected readonly tree = signal<AdminCategory[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);

  protected readonly flat = computed(() => this.flatten(this.tree()));

  protected newCategory: AdminCategoryInput = { name: '', parent_id: null };
  protected editForm: AdminCategoryInput = { name: '' };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.admin.listCategories().subscribe({
      next: (t) => {
        this.tree.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private flatten(tree: AdminCategory[], depth = 0): FlatNode[] {
    const out: FlatNode[] = [];
    for (const c of tree) {
      out.push({ cat: c, depth });
      if (c.children?.length) out.push(...this.flatten(c.children, depth + 1));
    }
    return out;
  }

  private fail = (err: HttpErrorResponse) =>
    this.error.set(err.error?.message || 'Operazione non riuscita.');

  create(): void {
    const name = this.newCategory.name.trim();
    if (!name) return;
    this.error.set(null);
    this.admin
      .createCategory({ name, parent_id: this.newCategory.parent_id || null })
      .subscribe({
        next: () => {
          this.newCategory = { name: '', parent_id: null };
          this.load();
        },
        error: this.fail,
      });
  }

  startEdit(c: AdminCategory): void {
    this.editingId.set(c.id);
    this.editForm = { name: c.name, description: c.description || '' };
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(c: AdminCategory): void {
    this.error.set(null);
    this.admin
      .updateCategory(c.id, { name: this.editForm.name, description: this.editForm.description || null })
      .subscribe({
        next: () => {
          this.editingId.set(null);
          this.load();
        },
        error: this.fail,
      });
  }

  toggleActive(c: AdminCategory): void {
    this.error.set(null);
    this.admin.updateCategory(c.id, { is_active: !c.is_active }).subscribe({
      next: () => this.load(),
      error: this.fail,
    });
  }

  remove(c: AdminCategory): void {
    if (!confirm(`Eliminare la categoria "${c.name}"?`)) return;
    this.error.set(null);
    this.admin.deleteCategory(c.id).subscribe({ next: () => this.load(), error: this.fail });
  }

  onImage(c: AdminCategory, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.error.set(null);
    this.admin.uploadCategoryImage(c.id, input.files[0]).subscribe({
      next: () => {
        input.value = '';
        this.load();
      },
      error: this.fail,
    });
  }
}
