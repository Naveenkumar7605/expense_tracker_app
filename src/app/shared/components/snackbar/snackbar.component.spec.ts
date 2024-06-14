import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let spyMatDialogData: typeof MAT_SNACK_BAR_DATA;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarComponent],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: "This email address is already taken", 
            bg: "#317aff",
            color: "white",
            type: 0
          }
        },
      ]
    })
      .compileComponents();
    spyMatDialogData = TestBed.inject(MAT_SNACK_BAR_DATA)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should be variable has defined",()=>{
    component.ngOnInit()
    expect(component.bg).not.toBeUndefined()
    expect(component.content).not.toBeUndefined()
    expect(component.color).not.toBeUndefined()
  })
});
