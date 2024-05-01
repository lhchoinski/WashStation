import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-laundry-details',
  templateUrl: 'laundry-details.html',
})
export class LaundryDetailsPage {

  laundry: any = null;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              private viewCtrl: ViewController) {
    this.laundry = this.navParams.get('laundry');
  }

  enterLaundry() {
    this.viewCtrl.dismiss(true);
  }
}
