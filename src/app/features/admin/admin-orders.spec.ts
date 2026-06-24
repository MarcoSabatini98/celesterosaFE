import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminOrdersPage } from './admin-orders';

describe('AdminOrdersPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdersPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina ordini admin', () => {
    const fixture = TestBed.createComponent(AdminOrdersPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
