import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrdersListPage } from './orders-list';

describe('OrdersListPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersListPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la lista ordini', () => {
    const fixture = TestBed.createComponent(OrdersListPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
