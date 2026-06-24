import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrderDetailPage } from './order-detail';

describe('OrderDetailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare il dettaglio ordine', () => {
    const fixture = TestBed.createComponent(OrderDetailPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
