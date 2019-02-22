import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Review } from './review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http:HttpClient) { }

  public createReview(reviewData: Review, bookingId: string): Observable <any>{
    return this.http.post(`/api/v1/reviews?bookingId=${bookingId}`, reviewData);
  } 

  public getReviewsByRental(rentalId: string): Observable <any> {
    return this.http.get(`/api/v1/reviews?rentalId=${rentalId}`);
  }

  public getOverallRating (rentalId: string): Observable <any> {
    return this.http.get(`/api/v1/reviews/${rentalId}/rating`);
  }

}
