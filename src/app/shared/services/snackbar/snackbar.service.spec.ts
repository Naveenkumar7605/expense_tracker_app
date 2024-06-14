import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';



describe('SnackbarService', () => {
  let service: SnackbarService;
   let spySnackbar:jasmine.SpyObj<MatSnackBar>;
  beforeEach(() => {
    spySnackbar = jasmine.createSpyObj(['openFromComponent'])
    TestBed.configureTestingModule({
      providers:[
        {
           provide:MatSnackBar,
           useValue:spySnackbar
        }
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should open the snackbar component when i call sucess method",()=>{
    service.sucess("sucess")
    expect(spySnackbar.openFromComponent).toHaveBeenCalled()
    expect(spySnackbar.openFromComponent).toHaveBeenCalledTimes(1)
  })


  it("should open the snackbar component when i call warn method",()=>{
    service.warn("error")
    expect(spySnackbar.openFromComponent).toHaveBeenCalled()
    expect(spySnackbar.openFromComponent).toHaveBeenCalledTimes(1)
  })
});
