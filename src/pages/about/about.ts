import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { NgProgress } from 'ngx-progressbar';

import { TermsConditionsPage } from '../terms-conditions/terms-conditions';

import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  washInfo: any = null;

  name: string = '---';
  address: string = '---';
  postalCode: string = '---';
  city: string = '---';
  phoneContacts: any = '---';
  phoneContactsAlt: any = null;
  emailContacts: any = '---';
  emailContactsAlt: any = null;
  website: string = '---';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private backendApi: BackendApiProvider,
              private ngProgress: NgProgress,
              private utils: UtilsProvider,
              private modalCtrl: ModalController,
              private washstationInfo: WashstationInfoProvider) {
    if (washstationInfo.washStationInfo !== null) {
      this.washInfo = washstationInfo.washStationInfo;
      this.handleInfoObj();
    } else {
      this.ngProgress.start();
      this.backendApi.getWashstationInfo().subscribe(
        res => {
          this.washInfo = res[0];
          this.ngProgress.done();
          this.handleInfoObj();
        },
        err => {
          this.ngProgress.done();
          this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        }
      );
    }
  }

  handleInfoObj() {
    if (this.washInfo) {
      this.name = this.washInfo.name;
      this.address = this.washInfo.addressLine1;
      this.postalCode = this.washInfo.postalCode;
      this.city = this.washInfo.city;
      this.phoneContacts = this.washInfo.mobileNumber1;
      this.phoneContactsAlt = this.washInfo.mobileNumber2;
      this.emailContacts = this.washInfo.email1;
      this.emailContactsAlt = this.washInfo.email2;
      this.website = this.washInfo.site1;
    }
  }

  goToTermsConditionPage() {
    let termsCondModal = this.modalCtrl.create(TermsConditionsPage);
    termsCondModal.present();
  }
}
