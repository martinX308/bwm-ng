import { Component, OnInit } from '@angular/core';
import { AuthService} from '../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'bwm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData:any={};
  errors: any[]=[];
  constructor( private auth:AuthService, private router: Router) { }

  ngOnInit() {
  }

  register (){
    this.auth.register(this.formData).subscribe(
      ()=> {
        console.log("success");
        this.router.navigate(['/login',{registered:'true'}])
      },
      (errorResponse)=> {
        console.log(errorResponse);
        this.errors = errorResponse.error.errors;
      }
    );
  }
}
