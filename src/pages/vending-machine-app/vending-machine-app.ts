import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { MachinesProvider } from '../../providers/machines/machines';
import { OrdersProvider } from '../../providers/orders/orders';
import { MiddlewareCloudProvider } from '../../providers/middleware-cloud/middleware-cloud';

import { DryingPage } from '../drying/drying';
import { WashingPage } from '../washing/washing';


@Component({
  selector: 'page-vending-machine-app',
  templateUrl: 'vending-machine-app.html',
})
export class VendingMachineAppPage implements OnDestroy {

  pageName: string = 'VendingMachineAppPage';
  wasMachineImg: string = 'assets/imgs/icon_maquina_lavar.png';
  dryMachineImg: string = 'assets/imgs/icon_maquina_secar.png';

  laundry: any = null;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private machines: MachinesProvider,
              private orders: OrdersProvider,
              private userSession: UserSessionProvider,
              private middlewareCloud: MiddlewareCloudProvider) {
      this.laundry = this.navParams.data.laundry;
      if (this.laundry) this.middlewareCloud.subscribeLaundry(this.laundry.laundries[0].laundryId);
      this.machines.getMachines(this.laundry.laundries[0].laundryId);
    }
  
    goToWashingMenu() {
      this.navCtrl.push(WashingPage, {
        wasMachines: this.machines.getWasMachines(),
        programs: this.machines.getPrograms('WASH'),
        laundryId: this.laundry.laundries[0].laundryId,
        laundry: this.laundry,
      });
    }
  
    goToDryingMenu() {
      this.navCtrl.push(DryingPage, {
        dryMachines: this.machines.getDryMachines(),
        programs: this.machines.getPrograms('DRY'),
        laundryId: this.laundry.laundries[0].laundryId,
        laundry: this.laundry,            
      });    
    }

    ngOnDestroy() {
      this.orders.reset();
      this.middlewareCloud.unsubscribeLaundry(this.laundry.laundries[0].laundryId);
    }
}
