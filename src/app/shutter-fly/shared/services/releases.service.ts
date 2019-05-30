import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReleasesService {
  constructor(public http: HttpClient) { }

  // getPartners() {
  //   return this.httpClient.get(`${environment.baseUrl}${environment.partner}`);
  // }

  getAllReleaseRecords() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${environment.baseUrl}${environment.releasesList}`, { headers })
      .pipe(map((res: any) => res));
  }
  
  getReleaseItems() {
    // return this.http.get(`assets/data/addedInventory.json`).pipe(map(res => res));
    return this.http.get(`${environment.baseUrl}${environment.releaseItems}`)
      .pipe(map((res: any) => res));
  }
  updateReleaseOrderStatus(data) {
    return this.http.post(`${environment.baseUrl}${environment.releaseManage}`, data)
      .pipe(map((res: any) => res));
  }
}
