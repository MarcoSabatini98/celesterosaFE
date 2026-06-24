import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartPage } from './cart-page';

describe('CartPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina carrello', () => {
    const fixture = TestBed.createComponent(CartPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('dovrebbe mostrare lo stato vuoto a caricamento completato', () => {
    const fixture = TestBed.createComponent(CartPage);
    fixture.detectChanges();
    // Simula il completamento del caricamento (oltre lo skeleton iniziale).
    fixture.componentInstance['loaded'].set(true);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Il carrello è vuoto');
  });
});
