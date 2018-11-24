import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-rental-search',
  templateUrl: './rental-search.component.html',
  styleUrls: ['./rental-search.component.scss']
})
export class RentalSearchComponent implements OnInit {
  rentalArray: Rental[] =[];
  errors: any[] = [];
  city: string;

  constructor(private route: ActivatedRoute, 
    private rentalService: RentalService) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params) => {
        this.city = params['city'];
        this.getCityRentals(params['city']);
      });
  }

  getCityRentals(city:string): any {
    this.errors = [];
    this.rentalArray = [];
    
    this.rentalService.getRentalsByCity(city).subscribe(
      (rentals:Rental[]) => {
        this.rentalArray = rentals;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      });
  }

}
