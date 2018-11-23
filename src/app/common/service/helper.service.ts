import{Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Booking } from '../../booking/shared/booking.model';

@Injectable () 
export class HelperService {

  constructor(private http:HttpClient) {}

  private getRangeOfDates( startAt, endAt, dateFormat) {
    const temDates = [];
    const mEndAt = moment(endAt);
    let mStartAt = moment(startAt);

    while (mStartAt < mEndAt) {
      temDates.push(mStartAt.format(dateFormat));
      mStartAt = mStartAt.add(1,"day");
    }
    temDates.push(mEndAt.format(dateFormat));
    return temDates;
  }
  private formatDate( date, dateFormat) {
    return moment(date).format(dateFormat);
  }

  public formatBookingDate(date){
    return this.formatDate(date,Booking.DATE_FORMAT);
  }

  public getBookingRangeOfDates( startAt, endAt) {
    return this.getRangeOfDates(startAt,endAt,Booking.DATE_FORMAT);
  }
 
}