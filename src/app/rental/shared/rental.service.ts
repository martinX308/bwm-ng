import{ Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rental } from './rental.model';

@Injectable () 
export class RentalService {

  constructor(private http:HttpClient) {}

  public getRentalById(rentalId: string): Observable <any>{
    return this.http.get(`/api/v1/rentals/${rentalId}`);
  }

  public getRentals ():Observable<any>{
    return this.http.get('/api/v1/rentals');
  }

  public getRentalsByCity(city: string): Observable <any>{
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }

  public createRental(rental: Rental): Observable <any> {
    return this.http.post(`/api/v1/rentals`,rental);
  }
  
  public getRentalsByUser(): Observable <any> {
    return this.http.get(`/api/v1/rentals/manage`);
  }

  public deleteRentalById(rentalId:string):Observable <any> {
    return this.http.delete(`/api/v1/rentals/${rentalId}`);
  }
}