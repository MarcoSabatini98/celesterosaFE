import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogPage } from './catalog';

describe('CatalogPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina catalogo', () => {
    const fixture = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('dovrebbe esporre le opzioni di ordinamento', () => {
    const fixture = TestBed.createComponent(CatalogPage);
    expect(fixture.componentInstance['sorts'].length).toBe(4);
  });
});
