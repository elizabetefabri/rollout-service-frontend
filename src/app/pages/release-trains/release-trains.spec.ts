import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrains } from './release-trains';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('ReleaseTrains', () => {
  let component: ReleaseTrains;
  let fixture: ComponentFixture<ReleaseTrains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrains],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
