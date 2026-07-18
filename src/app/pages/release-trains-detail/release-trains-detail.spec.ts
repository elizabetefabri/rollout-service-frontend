import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrainsDetail } from './release-trains-detail';

describe('ReleaseTrainsDetail', () => {
  let component: ReleaseTrainsDetail;
  let fixture: ComponentFixture<ReleaseTrainsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrainsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrainsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
