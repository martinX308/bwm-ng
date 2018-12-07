import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RentalService } from './rental.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";

@Injectable()

export class RentalGuard implements CanActivate {

  constructor(private rentalService: RentalService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      const rentalId: string = route.params.rentalId;
      return this.rentalService.verifyRentalUser(rentalId).pipe(map(()=> {
        return true;
      }),catchError(()=>{
        this.router.navigate(['/rentals']);
        return of(false);
      }));
    }

}