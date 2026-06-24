import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminProductFormPage } from './admin-product-form';

describe('AdminProductFormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductFormPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare il form in modalità nuovo prodotto', () => {
    const fixture = TestBed.createComponent(AdminProductFormPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.isEdit).toBe(false);
  });
});
