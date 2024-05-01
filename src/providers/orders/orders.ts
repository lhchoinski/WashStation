import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';


@Injectable()
export class OrdersProvider {

  orders: Array<any> = [];
  total: any = { totalPriceCoin: 0.00, totalPriceCard: 0.00 };
  totalPrice: Subject<any> = new Subject<number>();
  count: Subject<number> = new Subject<any>();

  constructor() {}

  reset() {
    this.orders = [];
    this.setCount();
    this.setTotalPrice();
  }

  add(newOrder) {
    let i = this.orders.findIndex(el => (el.machine.machineId === newOrder.machine.machineId));
    if (i !== -1) {
      this.orders[i] = newOrder;
    } else {
      this.orders.push(newOrder);
    }
    this.setCount();
    this.setTotalPrice();
  }

  remove(order) {
    this.orders = this.orders.filter(el => (el.machine.machineId !== order.machine.machineId));
    this.setCount();
    this.setTotalPrice();
  }

  get(): Array<any> {
    return this.orders;
  }

  setCount() {
    this.count.next(this.orders.length);
  }

  getCount() {
    return this.count.asObservable();
  }

  setTotalPrice() {
    this.total = {
      totalPriceCoin: this.orders.map(el => el.program['selPrice']).reduce((prevVal, el) => prevVal + Number(el), 0.00),
      totalPriceCard: this.orders.map(el => el.program['selPriceCard']).reduce((prevVal, el) => prevVal + Number(el), 0.00),
    };
    this.totalPrice.next(this.total);
  }

  getTotalPrice() {
    return this.totalPrice.asObservable();
  }

}
