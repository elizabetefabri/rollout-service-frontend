import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrainsSchedulers } from './release-trains-schedulers';

describe('ReleaseTrainsSchedulers', () => {
  let component: ReleaseTrainsSchedulers;
  let fixture: ComponentFixture<ReleaseTrainsSchedulers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrainsSchedulers],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrainsSchedulers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
