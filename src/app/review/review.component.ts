import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Review } from './shared/review.model';
import { ReviewService } from './shared/review.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
 
  @Input() bookingId: string;
  @Output() reviewSubmitted = new EventEmitter();

  modalRef: any;
  errors: any[] = [];
  review: Review = {text:'', rating: 3};

  constructor(private modalService: NgbModal, private reviewService:ReviewService) { }

  ngOnInit() {
  }

  openReviewModal(content){
    this.modalRef= this.modalService.open(content);
  }

  confirmReview(){
    this.reviewService.createReview(this.review,this.bookingId)
      .subscribe((review: Review) => {
        this.reviewSubmitted.emit(review);
        this.modalRef.close();
      },(errorResponse: HttpErrorResponse) =>{
        this.errors = errorResponse.error.errors;
      });
  }

  handleRatingChange(event){
    this.review.rating = event.rating;
  }
}
