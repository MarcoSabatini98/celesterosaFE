import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminCategoriesPage } from './admin-categories';

describe('AdminCategoriesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoriesPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina categorie', () => {
    const fixture = TestBed.createComponent(AdminCategoriesPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
