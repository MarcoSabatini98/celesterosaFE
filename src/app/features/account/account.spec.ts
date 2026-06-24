import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountPage } from './account';

describe('AccountPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AccountPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina account', () => {
    const fixture = TestBed.createComponent(AccountPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
