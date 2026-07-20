import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrainsSchedulers } from './release-trains-schedulers';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('ReleaseTrainsSchedulers', () => {
  let component: ReleaseTrainsSchedulers;
  let fixture: ComponentFixture<ReleaseTrainsSchedulers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrainsSchedulers],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrainsSchedulers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
