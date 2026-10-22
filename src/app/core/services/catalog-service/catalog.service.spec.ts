import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  it('viene creato', () => {
    expect(service).toBeTruthy();
  });

  it('categories() esegue una GET su /categories e scarta il wrapper', () => {
    let result: unknown;
    service.categories().subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.endsWith('/categories'));
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'success', data: [{ id: 1, name: 'Chitarre', slug: 'chitarre' }] });
    expect(Array.isArray(result)).toBe(true);
    http.verify();
  });
});
