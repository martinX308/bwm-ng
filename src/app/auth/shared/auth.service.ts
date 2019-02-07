import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

const jwt = new JwtHelperService();

class DecodedToken {
  exp:number = 0;
  username: string = '';
}

@Injectable()
export class AuthService {
  private decodedToken;

  constructor(private http: HttpClient) { 
    this.decodedToken =JSON.parse(localStorage.getItem('bwm_meta')) || new DecodedToken();
  }

  private saveToken(token:any): string{
    this.decodedToken = jwt.decodeToken(token);
    localStorage.setItem('bwm_auth',token);
    localStorage.setItem('bwm_meta',JSON.stringify(this.decodedToken));
    return token;
  }

  private getExpiration() {
    return moment.unix(this.decodedToken.exp)
  }
  public register(userData:any): Observable<any> {
    return this.http.post('api/v1/users/register',userData);
  }

  public login(userData:any): Observable<any>{
    return this.http.post('api/v1/users/auth',userData).pipe(map(
      token =>this.saveToken(token)));
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  public logout() {
    localStorage.removeItem('bwm_auth');
    localStorage.removeItem('bwm_meta');
    this.decodedToken = new DecodedToken();
  }

  public getUsername(): string{
    return this.decodedToken.username;
  }

  public getUserId(): string{
    return this.decodedToken.userId;
  }

  public getAuthToken(): string{
    return localStorage.getItem('bwm_auth');
  }

}
