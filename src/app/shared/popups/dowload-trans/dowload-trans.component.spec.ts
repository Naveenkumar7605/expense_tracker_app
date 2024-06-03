import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadTransComponent } from './dowload-trans.component';

describe('DowloadTransComponent', () => {
  let component: DowloadTransComponent;
  let fixture: ComponentFixture<DowloadTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadTransComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DowloadTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
