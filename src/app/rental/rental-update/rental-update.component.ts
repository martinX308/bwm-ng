import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { Subject } from'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { ToastrService } from 'ngx-toastr';
import { UcWordsPipe } from 'ngx-pipes';

@Component({
  selector: 'bwm-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})

export class RentalUpdateComponent implements OnInit {
  rental: Rental;
  rentalCategories: string[] = Rental.CATEGORIES;
  locationSubject: Subject <any> = new Subject();

  constructor(private route: ActivatedRoute, 
    private rentalService: RentalService,
    private toastr: ToastrService,
    private upperPipe: UcWordsPipe) {
      //this.transformLocation = obj => this.transformLocation(obj);
      this.transformLocation = this.transformLocation.bind(this);
    }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params) => {
        this.getRental(params['rentalId']);
      });
  }

  transformLocation(location: string): string {
    return this.upperPipe.transform(location);
  }

  getRental(rentalId:string): any {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental:Rental) => {
        this.rental = rental;
      }
    )
  }

  updateRental (rentalId:string, rentalData: any){
    this.rentalService.patchRentalById(rentalId,rentalData).subscribe(
      (updatedRental:Rental) => {
        this.rental = updatedRental;
        if(rentalData.city||rentalData.street) {
          this.locationSubject.next(this.rental.city + ',' + this.rental.street);
        }
      }, (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail,'Error');
        this.getRental(rentalId);
      });
  }

  countBedroomAssets(assetsNum: number) {
    return parseInt(<any>this.rental.bedrooms || 0,10) + assetsNum;
  }
}
