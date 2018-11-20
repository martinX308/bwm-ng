import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService} from '../shared/auth.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors: any[]=[];
  notifyMessage:string = '';

  constructor(private auth:AuthService, 
    private router: Router, 
    private fb:FormBuilder,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe((params) => {
      if(params ['registered']==='true'){
        this.notifyMessage=' You have been successfully registered. Please login.'
      }
    })
  }

  initForm() {
    this.loginForm = this.fb.group({
      email:['', [Validators.required,
                  Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password:['', Validators.required]
    })
  }

  isInvalidForm(fieldName):Boolean {
    return this.loginForm.controls[fieldName].invalid &&
     (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }
  isRequired(fieldName):Boolean{
    return this.loginForm.controls['email'].errors.required;
  }
  login(){
    this.auth.login(this.loginForm.value).subscribe(
      (token)=> {
        this.router.navigate(['/rentals'])
      },
      (errorResponse)=> {
        console.log(errorResponse);
        this.errors = errorResponse.error.errors;
      });
  }

}
