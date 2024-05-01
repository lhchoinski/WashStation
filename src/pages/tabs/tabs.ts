import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { MainPage } from '../main/main';
import { ProfilePage } from '../profile/profile';
import { PaymentMethodsPage } from '../payment-methods/payment-methods';
import { SettingsPage } from '../settings/settings';
import { OrderHistoryPage } from '../order-history/order-history';
import { AboutPage } from '../about/about';

import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnDestroy {

  @ViewChild('appTabs') tabRef: Tabs;

  pageSubs: Subscription = null;

  pages = [
    { title: 'WASHSTATION', component: MainPage, icon: 'ios-map-outline' },
    { title: 'PROFILE', component: ProfilePage, icon: 'ios-contact' },
    { title: 'RECHARGE', component: PaymentMethodsPage, icon: 'ios-card' },
    { title: 'SETTINGS', component: SettingsPage, icon: 'ios-settings' },
    { title: 'ORDERS_HISTORY', component: OrderHistoryPage, icon: 'ios-list-box-outline' },
    { title: 'ABOUT', component: AboutPage, icon: 'ios-information-circle-outline' },
  ];
  
  constructor(private utils: UtilsProvider) {
    this.pageSubs = this.utils.getPageEv().subscribe(
      title => {
        this.tabRef.select(this.pages.findIndex(el => (el.title === title)));
      } 
    );
  }

  ngOnDestroy() {
    if (this.pageSubs) this.pageSubs.unsubscribe();
  }
}
