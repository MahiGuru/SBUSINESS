import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(public http: HttpClient) { }

  getInventoryItems() {
    return this.http.get(`assets/data/inventory.json`);
  }
  addedInventoryItems() {
    return this.http.get(`assets/data/addedInventory.json`);
  }
  calculatedInventoryItems() {
    return this.http.get(`assets/data/calculateInventory.json`);
  }
}
