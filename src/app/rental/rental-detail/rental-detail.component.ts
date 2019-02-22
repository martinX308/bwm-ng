import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { Rental } from '../shared/rental.model';
import { Review } from '../../review/shared/review.model';

import { RentalService } from '../shared/rental.service';
import { ReviewService } from '../../review/shared/review.service';

@Component({
  selector: 'bwm-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {
  
  rental: Rental;
  reviews: Review [] = [];
  rating : number;

  constructor(private route: ActivatedRoute, 
    private rentalService: RentalService,
    private reviewService: ReviewService) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params) => {
        this.getRental(params['rentalId']);
      });
  }

  getRental(rentalId:string): any {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental:Rental) => {
        this.rental = rental;
        this.getReviews(rental._id);
        this.getOverallRating(rental._id);
      }
    )
  }

  getReviews(rentalId: string){
    this.reviewService.getReviewsByRental(rentalId)
      .subscribe((reviews: Review [])=>{
        this.reviews = reviews;
      });
  }

  formatDate(date: string):string{
    return `${moment(date).fromNow()}`;
  }

  getOverallRating(rentalId: string){
    return this.reviewService.getOverallRating(rentalId)
      .subscribe(rating => {
        this.rating = Math.round(rating*10)/10;
      });
  }

}
