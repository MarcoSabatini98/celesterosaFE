import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoginPage } from './login';

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('dovrebbe creare la pagina di accesso in modalità login', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    expect(fixture.componentInstance['mode']()).toBe('login');
  });

  it('dovrebbe passare alla modalità registrazione', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance['switchMode']('register');
    fixture.detectChanges();
    expect(fixture.componentInstance['mode']()).toBe('register');
  });
});
