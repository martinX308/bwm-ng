import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'bwm-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {
  newRental: Rental;
  rentalCategories = Rental.CATEGORIES;
  errors: any[] =[];
  constructor(private rentalService: RentalService, private router:Router) { }

  ngOnInit() {
    this.newRental = new Rental();
    this.newRental.shared = false;
  }

  public createRental () {
    console.log(this.newRental );
    this.rentalService.createRental(this.newRental).subscribe(
      (rental: Rental) => {
        debugger;
        this.router.navigate([`/rentals/${rental._id}`])
      },
      (errorResponce: HttpErrorResponse) => {
        this.errors = errorResponce.error.errors;
      }
    )
  }

  public handleImageChange () {
    this.newRental.image ="https://cdn.freshome.com/wp-content/uploads/2018/02/studio-intro.jpg";
  }
}
