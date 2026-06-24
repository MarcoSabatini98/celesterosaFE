import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProductCard } from './product-card';
import { ProductCard as ProductCardModel } from '../../core/models/catalog.models';

const mock: ProductCardModel = {
  id: 1,
  sku: 'TEST-1',
  name: 'Chitarra Test',
  slug: 'chitarra-test',
  short_description: null,
  condition: 'new',
  base_price: 749,
  price_from: 749,
  vat_rate: 22,
  is_featured: false,
  rating_avg: 0,
  rating_count: 0,
  brand: { id: 1, name: 'Fender', slug: 'fender' },
  category: { id: 1, name: 'Chitarre', slug: 'chitarre' },
  primary_image: null,
  total_stock: 5,
};

describe('ProductCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('dovrebbe creare la card e mostrare nome e prezzo', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', mock);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Chitarra Test');
    expect(text).toContain('749');
  });

  it('dovrebbe mostrare "Esaurito" se senza stock', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', { ...mock, total_stock: 0 });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Esaurito');
  });
});
