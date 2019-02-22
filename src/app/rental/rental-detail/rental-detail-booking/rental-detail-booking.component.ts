import { Component, OnInit, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';

import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { AuthService } from '../../../auth/shared/auth.service';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
  @Input() rental: Rental;
  
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  newBooking: Booking;
  modalRef: any;

  daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = [];
  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens:'left',
    autoUpdateInput: false,
    //isInvalidDate:this.checkForInvalidDates.bind(this)
  };
 // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
 
  constructor( private helper:HelperService,
               private modalService: NgbModal,
               private bookingService: BookingService,
               private toastr: ToastrService,
               public auth: AuthService) { }
  

  ngOnInit() {
    this.newBooking = new Booking();
    this.getBookedOutDates();
  }

  private checkForInvalidDates(date) {
    return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) ||
    date.diff(moment(),'days') < 0;
  }

  private getBookedOutDates () {
    const bookings:Booking[] = this.rental.bookings;

    if(bookings && bookings.length>0) {
      bookings.forEach((booking:Booking)=>{
        console.log(booking);
        const dateRange = this.helper.getBookingRangeOfDates(booking.startAt,booking.endAt);
        this.bookedOutDates.push(...dateRange);
      })
    }
  }

  private addNewBookedDates(bookinData:any) {
    const dateRange = this.helper.getBookingRangeOfDates(bookinData.startAt,bookinData.endAt);
    this.bookedOutDates.push(...dateRange);
  }

  private resetDatePicker() {
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val('');
  }

  public openConfirmModal(content) {
    this.errors = [];
    this.modalRef = this.modalService.open(content);
  }

  onPaymentConfirmed(paymentToken:any) {
    this.newBooking.paymentToken = paymentToken;
  }

  public createBooking() {
    this.newBooking.rental=this.rental;
    this.bookingService.saveBooking(this.newBooking).subscribe(
      (bookingData: any)=> {
        this.addNewBookedDates(bookingData);
        this.newBooking = new Booking ();
        this.modalRef.close();
        this.resetDatePicker();
        this.toastr.success('Booking has been successfully created, check your booking detail in manage section','Success!');
      },
      (errorResponse: any)=> {
        this.errors = errorResponse.error.errors;
      });
  }

  public selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    // any object can be passed to the selected event and it will be passed back here
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -(value.start.diff( value.end,'days'));
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
    // or manupulat your own internal property
    // this.daterange.start = value.start;
    // this.daterange.end = value.end;
    // this.daterange.label = value.label;
  }

}
