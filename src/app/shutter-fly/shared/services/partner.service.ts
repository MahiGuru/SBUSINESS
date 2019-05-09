import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(public httpClient: HttpClient) { }

  getPartners() {
    return this.httpClient.get(`${environment.baseUrl}${environment.partner}`);
  }
}
