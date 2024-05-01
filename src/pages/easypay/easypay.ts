import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextInput, LoadingController } from 'ionic-angular';
import { NgProgress } from 'ngx-progressbar';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';
import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';


@Component({
  selector: 'page-easypay',
  templateUrl: 'easypay.html',
})
export class EasypayPage {

  params: any = null;

  @ViewChild('valueIn') valueIn: TextInput;
  chargeSubmitAttempt: boolean = false;
  submitBtnEnabled: boolean = true;
  mode: string = null;
  valuePlc: string = null;
  chargeValue: number = null;
  valueValid: boolean = false;
  loading: any = null;
  loadingExit: any = null;
  timer: any = null;
  paymentAcceptedTimeout: number = 4000;

  options : InAppBrowserOptions = {
    location : 'no',
    hidden : 'yes',
    hardwareback : 'yes',
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userSession: UserSessionProvider,
              private backendApi: BackendApiProvider,
              private translate: TranslateService,
              private loadingCtrl: LoadingController,
              private utils: UtilsProvider,
              private ngProgress: NgProgress,
              private wsInfo: WashstationInfoProvider,
              private iab: InAppBrowser) {
    this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
    this.valuePlc = this.translate.instant('CHARGE_AMOUNT');
    this.mode = this.navParams.data.mode;
  }

  isValueValid() {
    if (Number(this.chargeValue) < this.wsInfo.minCharge || Number(this.chargeValue) > this.wsInfo.maxCharge) {
      this.valueValid = false;
    } else {
      this.valueValid = true;
    }
  }

  genMbRef() {
    this.chargeSubmitAttempt = true;
    this.isValueValid();
    if (!this.submitBtnEnabled || !this.valueValid) {
      if (!this.valueValid) {
        let toast = this.utils.presentToast('RANGE_CHARGE_VALUE', 'toast-error', { min: this.wsInfo.minCharge.toFixed(2), max: this.wsInfo.maxCharge.toFixed(2) });
        toast.onDidDismiss(res => {
          this.valueIn.setFocus();
          this.chargeSubmitAttempt = false;
        }); 
      }
      return;
    }
    this.submitBtnEnabled = false;
    this.ngProgress.start();
    this.backendApi.setPaymentRequest(this.userSession.id, Number(this.chargeValue).toFixed(2), this.userSession.selectedLang.toUpperCase()).subscribe(
      res => {
        if (res.hasOwnProperty('success') && !res.success) {
          this.utils.presentToast('MB_REF_ERR_MSG', 'toast-error');
        } else {
          let toast = this.utils.presentToast('MB_REF_SUCCESS_MSG', 'toast-success');
          toast.onDidDismiss(() => {
            this.userSession.paymentRef = {
              ep_entity: res.ep_entity,
              ep_reference: res.ep_reference,
              ep_value: res.ep_value,
              ep_date: new Date(res.ep_date),
            }
            this.chargeValue = null;
          });
        }
        this.submitBtnEnabled = true;
        this.ngProgress.done();
      },
      err => {
        this.submitBtnEnabled = true;
        this.ngProgress.done();              
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }

  genGwUrl() {
    this.chargeSubmitAttempt = true;

    this.isValueValid();
    if (!this.submitBtnEnabled || !this.valueValid) {
      if (!this.valueValid) {
        let toast = this.utils.presentToast('RANGE_CHARGE_VALUE', 'toast-error', { min: this.wsInfo.minCharge.toFixed(2), max: this.wsInfo.maxCharge.toFixed(2) });
        toast.onDidDismiss(res => {
          this.valueIn.setFocus();
          this.chargeSubmitAttempt = false;
        }); 
      }
      return;
    }

    this.submitBtnEnabled = false;
    this.ngProgress.start();
    this.backendApi.setPaymentRequest(this.userSession.id, Number(this.chargeValue).toFixed(2), this.userSession.selectedLang.toUpperCase()).subscribe(
      res => {
        if (res.hasOwnProperty('success') && !res.success) {
          this.utils.presentToast('CREDIT_REF_ERR_MSG', 'toast-error');
        } else {
          this.openWithInAppBrowser(res.ep_link);
        }
        this.submitBtnEnabled = true;
        this.ngProgress.done();
      },
      err => {
        this.submitBtnEnabled = true;
        this.ngProgress.done();              
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }

  openWithInAppBrowser(url) {
    let browser = this.iab.create(url, '_blank', this.options);

    this.loading = this.loadingCtrl.create({
      content: this.translate.instant('CHARGE_REQUEST_WAITING_MSG'),
    });
    this.loading.onDidDismiss(() => {
      browser.show();
      this.loading = null;
    });
    this.loading.present();

    browser.on('loadstop').subscribe(ev => {
      this.loading.dismiss();
    });

    browser.on('loadstart').subscribe(ev => {
      if (ev.url.indexOf(this.wsInfo.visaFwdUrl) !== -1) {
        browser.close();

        if (ev.url.indexOf('s=ok') !== -1) {
          this.loadingExit = this.loadingCtrl.create({
            content: this.translate.instant('CHARGE_REQUEST_WAITING_MSG'),
          });
          this.loadingExit.onDidDismiss(() => {
            this.chargeValue = null;
            this.utils.setPage('WASHSTATION');
            this.loading = null;
          });

          this.loadingExit.present();
          this.timer = setTimeout(() => { if (this.loadingExit) this.loadingExit.dismiss(); }, this.paymentAcceptedTimeout);
        } else {
          this.utils.presentToast('CREDIT_ERR_MSG', 'toast-error', null, false, 5000);
        }
      }
    });
  }
}
