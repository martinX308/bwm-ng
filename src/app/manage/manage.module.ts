import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { ReviewModule } from '../review/review.module';

import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { ManageRentalComponent } from './manage-rental/manage-rental.component';
import { ManageComponent } from './manage.component';
import { ManageRentalBookingComponent } from './manage-rental/manage-rental-booking/manage-rental-booking.component';

import { AuthGuard } from '../auth/shared/auth.guard';
import { RentalService } from '../rental/shared/rental.service';
import { BookingService } from '../booking/shared/booking.service';


const routes: Routes =[
  {path:'manage', 
  component: ManageComponent,
  children:[
    {path:'rentals', component:ManageRentalComponent, canActivate:[AuthGuard]},
    {path:'bookings', component:ManageBookingComponent, canActivate:[AuthGuard]},
  ]}
]

@NgModule ({
  declarations: [
    ManageComponent,
    ManageBookingComponent,
    ManageRentalComponent,
    ManageRentalBookingComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    NgPipesModule,
    ReviewModule
  ],
  providers:[
    RentalService,
    BookingService
  ]
})

export class ManageModule{}