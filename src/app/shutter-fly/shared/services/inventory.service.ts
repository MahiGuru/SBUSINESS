import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(public http: HttpClient) { }

  getInventoryItems() {
    // return this.http.get(`assets/data/inventory.json`);
    return this.http.get(`${environment.baseUrl}${environment.inventoryList}`);
  }
  addedInventoryItems() {
    return this.http.get(`assets/data/addedInventory.json`).pipe(map(res => res));
  }
  calculatedInventoryItems() {
    return this.http.get(`assets/data/calculateInventory.json`);
  }
}
