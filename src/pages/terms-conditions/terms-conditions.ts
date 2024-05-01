import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';


@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {

  constructor(private viewCtrl: ViewController,
              private washstationInfo: WashstationInfoProvider) {}


  close() { this.viewCtrl.dismiss(false); }

  accept() { this.viewCtrl.dismiss(true); }
}
