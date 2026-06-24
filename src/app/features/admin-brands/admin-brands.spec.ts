import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminBrandsPage } from './admin-brands';

describe('AdminBrandsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrandsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina marche', () => {
    const fixture = TestBed.createComponent(AdminBrandsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
