import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsDetail } from './applications-detail';

describe('ApplicationsDetail', () => {
  let component: ApplicationsDetail;
  let fixture: ComponentFixture<ApplicationsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
