import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Sidebar } from './sidebar';
import { provideAppIcons } from '../../icons/icon.registry';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAppIcons(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expõe os três sublinks do Rollouts', () => {
    expect(component.rolloutLinks.map((l) => l.route)).toEqual([
      '/release-trains',
      '/applications',
      '/release-train-schedulers',
    ]);
  });

  it('abre e fecha o flyout do Rollouts', () => {
    expect(component.rolloutOpen()).toBe(false);
    component.toggleRollout();
    expect(component.rolloutOpen()).toBe(true);
    component.closeRollout();
    expect(component.rolloutOpen()).toBe(false);
  });
});
