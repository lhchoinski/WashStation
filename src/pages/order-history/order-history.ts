import { Component } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';

import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  listEnded: boolean = false;
  fetchDone: boolean = false;
  orders: Array<any> = [];

  constructor(private backendApi: BackendApiProvider,
              private ngProgress: NgProgress,
              private utils: UtilsProvider) {
  }

  ionViewDidEnter() {
    this.getOrders();
  }

  getOrders() {
    if (this.orders.length === 0) this.ngProgress.start();
    this.backendApi.getMyOrders().subscribe(
      res => {
        if (this.orders.length === 0) this.ngProgress.done();
        if (!res.hasOwnProperty('success') && Array.isArray(res)) {
          this.orders = res.filter(el => (Array.isArray(el.orderMachinePrograms) && el.orderMachinePrograms.length > 0));
        }

        this.listEnded = false;
        this.fetchDone = true;
      },
      err => {
        if (this.orders.length === 0) this.ngProgress.done();
        this.listEnded = false;
        this.fetchDone = true;        
        this.orders = [];
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }

  doInfiniteScroll(ev) {
    if (!this.listEnded && ev._content.directionY === 'down') {
      this.backendApi.getMyOrders(this.orders.length).subscribe(
        res => {
          if (Array.isArray(res) && res.length === 0) this.listEnded = true;
          setTimeout(() => {
            ev.complete();
            this.orders = this.orders.concat(res.filter(el => (Array.isArray(el.orderMachinePrograms) && el.orderMachinePrograms.length > 0)));
          }, 200);
        },
        err => {
          setTimeout(() => {
            ev.complete();
            this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
          }, 200);   
        }
      );
    } else {
      ev.complete();
    }
  }

}
