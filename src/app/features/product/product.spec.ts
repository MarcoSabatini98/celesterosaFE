import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProductPage } from './product';

describe('ProductPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina prodotto', () => {
    const fixture = TestBed.createComponent(ProductPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
