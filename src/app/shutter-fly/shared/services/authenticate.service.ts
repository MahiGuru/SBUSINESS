import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment.prod';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(public http: HttpClient) { }

  authenticate(credentials) {
    return this.http.post(`${environment.baseUrl}${environment.authenticate}`, credentials).pipe(map(res => res));
  }
}
