import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

import { ReviewComponent } from './review.component';
import { ReviewService } from './shared/review.service';


@NgModule ({
  declarations: [
    ReviewComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    StarRatingModule.forRoot()
  ],
  providers:[
    ReviewService
  ],
  exports: [
    ReviewComponent
  ]
})

export class ReviewModule{}