import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inventory } from '../../core/models/inventory-old';

@Injectable({
  providedIn: 'root'
})
export class SharedOrdersService {
  public data: BehaviorSubject<any> = new BehaviorSubject('');
  public data$: Observable<any> = this.data.asObservable();
  temp = [];
  constructor() {
    this.changeData();
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    // req.open('GET', `assets/data/data.json`);
    // req.onload = () => {
    //   cb(JSON.parse(req.response));
    // };
    // req.send();
  }
  public changeData() {
    // this.fetch((data) => {
    //   // push our inital complete list
    //   // console.log(data);
    //   data.forEach(item => {
    //     // console.log(item);
    //     const itemRow = new Inventory(item);
    //     this.temp.push(itemRow);
    //   });
    //   this.data.next(this.temp);
    //   // this.rows = data;
    // });
  }
  public updateOrders(rows) {
    this.data.next(rows);
  }

}
