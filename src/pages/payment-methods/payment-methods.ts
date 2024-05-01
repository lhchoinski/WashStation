import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RechargePage } from '../recharge/recharge';
import { EasypayPage } from '../easypay/easypay';

import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';
import { UserSessionProvider } from '../../providers/user-session/user-session';


@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {

  params: any = null;

  constructor(private navCtrl: NavController,
              private wsInfo: WashstationInfoProvider,
              private userSession: UserSessionProvider) {
    this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
  }

  goToPaymentForm(paymentMethod) {
    switch (paymentMethod) {
      case 'PAYPAL':
        this.navCtrl.push(RechargePage);
        break;
      case 'MB_REF':
        this.navCtrl.push(EasypayPage, { mode: 'MB_REF' });        
        break;
      case 'CREDIT_CARD':
        this.navCtrl.push(EasypayPage, { mode: 'CREDIT_CARD' });
        break;
    }
  }
}
