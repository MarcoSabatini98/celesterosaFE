import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminProductsPage } from './admin-products';

describe('AdminProductsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la lista prodotti admin', () => {
    const fixture = TestBed.createComponent(AdminProductsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
