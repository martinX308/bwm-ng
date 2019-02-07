import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../auth/shared/auth.guard';
import { FormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { UserService } from './shared/user.service';
import { AuthService } from '../auth/shared/auth.service';

const routes: Routes =[
  {path:'users', 
  component: UserComponent,
  children:[
    {path:'profile', component:UserDetailComponent,canActivate:[AuthGuard]}
  ]}
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [ 
    ]
    ,
  declarations: [
    UserComponent,
    UserDetailComponent
  ],
  providers: [
    UserService,
    AuthService
  ]
})

export class UserModule {}