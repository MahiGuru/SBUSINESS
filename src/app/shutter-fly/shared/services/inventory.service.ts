import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(public http: HttpClient) { }

  getInventoryItems() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${environment.baseUrl}${environment.inventoryList}`, { headers })
      .pipe(map((res: any) => res));
  }
  getAddItems() {
    // return this.http.get(`assets/data/addedInventory.json`).pipe(map(res => res));
    return this.http.get(`${environment.baseUrl}${environment.inventoryItems}`)
      .pipe(map((res: any) => res));
  }
  getPartners() {
    return this.http.get(`${environment.baseUrl}${environment.partner}`)
      .pipe(map((res: any) => res));
  }
  // calculatedInventoryItems() {
  //   return this.http.get(`assets/data/calculateInventory.json`);
  // }
  saveNewInventory(data) {
    return this.http.post(`${environment.baseUrl}${environment.saveNewInventory}`, data)
      .pipe(map((res: any) => res));
  }
  deleteInventory(data) {
    return this.http.post(`${environment.baseUrl}${environment.deletePartner}`, data)
      .pipe(map((res: any) => res));
  }
  updateInventoryOrder(data){
    return this.http.post(`${environment.baseUrl}${environment.releaseManage}`, data)
      .pipe(map((res: any) => res));
  }
}
