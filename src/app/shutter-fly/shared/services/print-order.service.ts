import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrintOrderService {
  constructor(public http: HttpClient) { }

  // getPartners() {
  //   return this.httpClient.get(`${environment.baseUrl}${environment.partner}`);
  // }

  getAllPrintRecords() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${environment.baseUrl}${environment.printList}`, { headers })
      .pipe(map((res: any) => res));
  }
  getPrintItems() {
    // return this.http.get(`assets/data/addedInventory.json`).pipe(map(res => res));
    return this.http.get(`${environment.baseUrl}${environment.printItems}`)
      .pipe(map((res: any) => res));
  }
  saveNewPrintItem(data) {
    return this.http.post(`${environment.baseUrl}${environment.savePrintRecord}`, data)
      .pipe(map((res: any) => res));
  }
  updatePrintOrderStatus(data) {
    return this.http.post(`${environment.baseUrl}${environment.savePrintRecord}`, data)
      .pipe(map((res: any) => res));
  }
}
