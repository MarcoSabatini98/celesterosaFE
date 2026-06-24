import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('dovrebbe creare la shell admin', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
