import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../rental/shared/rental.service';
import { Rental } from '../../rental/shared/rental.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.scss']
})
export class ManageRentalComponent implements OnInit {
  rentalArray: Rental[];
  rentalDeleteIndex: number;
  errors: any[] = [];
  
  constructor(private rentalService: RentalService, private toastr: ToastrService) { }

  ngOnInit() {
    this.rentalService.getRentalsByUser().subscribe((rentals: Rental[]) => {
      this.rentalArray = rentals;
    }, () => {
    })
  }

  public deleteRental(rentalId: string) {
    this.rentalService.deleteRentalById(rentalId).subscribe(() => {
      this.rentalArray.splice(this.rentalDeleteIndex,1);
      this.rentalDeleteIndex = undefined;
    }, (errorResponse: HttpErrorResponse) => {
      this.toastr.error(errorResponse.error.errors[0].detail,'Failed!');

    }
    )
  }

}
