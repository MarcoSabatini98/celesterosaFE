import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CheckoutPage } from './checkout';

describe('CheckoutPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare il checkout in stato form', () => {
    const fixture = TestBed.createComponent(CheckoutPage);
    fixture.detectChanges();
    expect(fixture.componentInstance['state']()).toBe('form');
  });

  it('con carrello vuoto mostra lo stato vuoto', () => {
    const fixture = TestBed.createComponent(CheckoutPage);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Il carrello è vuoto');
  });
});
