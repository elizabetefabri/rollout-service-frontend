import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrains } from './release-trains';

describe('ReleaseTrains', () => {
  let component: ReleaseTrains;
  let fixture: ComponentFixture<ReleaseTrains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrains],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
