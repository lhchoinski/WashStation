import { Component, ViewChild } from '@angular/core';
import { NavController, TextInput, LoadingController } from 'ionic-angular';
import { NgProgress } from 'ngx-progressbar';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html',
})
export class RechargePage {

  params: any = null;

  payPalEnvironmentProduction: string = 'ATmzzf0v5Lt-lA-s9-sWE2tPAEMEMX4eNgW5NF4itfq2gL2JHkeDWKq6gCm7UH5_D6YaBZAC2TQK5L5_';
  // payPalEnvironmentSandbox: string = 'AX7cOgBU1s7xSX2WCtaRTwslhRS7y6SGdM9kKwUQTLsuBXpJGqPSXus2h8U8khM2E66CzRNebKaY-DjM';
  payPalEnvironmentSandbox: string = 'AQU3d8UOMlRE2-8tY2oMQrhnMluAiuLEJWHTCwgraCTDEqHC4N13io56AG9KE2zuR17yoW908tjRsKfe';

  @ViewChild('valueIn') valueIn: TextInput;
  chargeSubmitAttempt: boolean = false;
  submitBtnEnabled: boolean = true;
  valuePlc: string = null;
  payment: PayPalPayment = null;
  chargeValue: number = null;
  balanceValue: number = null;
  valueValid: boolean = false;
  storage: any = new Storage({});
  loading: any = null;

  constructor(private navCtrl: NavController,
              private userSession: UserSessionProvider,
              private backendApi: BackendApiProvider,
              private ngProgress: NgProgress,
              private payPal: PayPal,
              private loadingCtrl: LoadingController,
              private translate: TranslateService,
              private wsInfo: WashstationInfoProvider,
              private utils: UtilsProvider) {
    this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
    this.valuePlc = this.translate.instant('CHARGE_AMOUNT');
  }

  isValueValid() {
    if (Number(this.chargeValue) < this.wsInfo.minCharge || Number(this.chargeValue) > this.wsInfo.maxCharge) {
      this.valueValid = false;
    } else {
      this.valueValid = true;
    }
  }

  makePayment() {
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
    this.payment = new PayPalPayment(Number(this.chargeValue).toFixed(2), 'EUR', 'Carregamento WashStation', 'sale');
		this.payPal.init({
			PayPalEnvironmentProduction: this.payPalEnvironmentProduction,
			PayPalEnvironmentSandbox: this.payPalEnvironmentSandbox,
		}).then(() => {
    // this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
    this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
      languageOrLocale: this.translate.defaultLang,
      acceptCreditCards: false,
    })).then(() => {
				this.payPal.renderSinglePaymentUI(this.payment).then((response) => {
          this.ngProgress.start();
          this.backendApi.setPaypalPaymentRequest(this.userSession.id, response).subscribe(
            res => {
              if (res.hasOwnProperty('success') && res.success) {
                this.chargeValue = null;
                this.balanceValue = res.balance;
                this.loading.dismiss('CHARGE_SUCCESS_MSG');
              } else {
                this.loading.dismiss('CHARGE_ERROR_MSG');
              }
              this.ngProgress.done();   
            },
            err => {
              this.loading.dismiss('CHECK_INTERNET_CONNECTION');
              this.submitBtnEnabled = true;
              this.ngProgress.done();              
            }
          );
          this.loading = this.loadingCtrl.create({
            content: this.translate.instant('CHARGE_WAITING_MSG'),
          });
          this.loading.onDidDismiss((res) => {
            switch (res) {
              case 'CHARGE_SUCCESS_MSG':
                let toast = this.utils.presentToast('CHARGE_SUCCESS_MSG', 'toast-success');
                toast.onDidDismiss(
                  () => {
                    this.userSession.balance = this.balanceValue;
                    this.chargeValue = null;
                    this.utils.setPage('WASHSTATION');
                  }
                );
                break;
              case 'CHARGE_ERROR_MSG':
                this.utils.presentToast('CHARGE_ERROR_MSG', 'toast-success');
                break;
              case 'CHECK_INTERNET_CONNECTION':
                this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                break;
            }
          });
          this.loading.present();
				}, () => {
          this.submitBtnEnabled = true;
				});
			}, () => {
        this.submitBtnEnabled = true;        
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error'); 
			});
		}, () => {
      this.submitBtnEnabled = true;
      this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
    });
  }

  getOrderRegObj() {
		let obj = {
			cardId: this.userSession.cardId,
      nif: this.userSession.nif,
      expense: false,
      priceTotal: Number(this.chargeValue),
		};
		return obj;
	}

  getUserDetails() {
    if (this.userSession.id) {
      this.backendApi.getUserDetails(this.userSession.id).subscribe(
        res => {
          if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
            let appCard = res.cards.find(el => (el.type === 'APP'));
            this.userSession.balance = Number(appCard.balance);
            this.userSession.cardId = appCard.cardId;  
          }
  
          if (res.hasOwnProperty('paymentsRequests') && Array.isArray(res.paymentsRequests) && res.paymentsRequests.length > 0 && res.paymentsRequests[0].ep_status && res.paymentsRequests[0].ep_status.indexOf('err') === -1) {
            this.userSession.paymentRef = res.paymentsRequests[0];
            this.userSession.paymentRef.ep_date = new Date(this.userSession.paymentRef.ep_date);
          } else {
            this.userSession.paymentRef = null;
          }

          this.userSession.email = res.email;
          this.userSession.nif = res.nif;
          this.userSession.mobileContact = res.address.mobileNumber;
          this.userSession.birthday = res.birthDate;
          this.userSession.gender = res.sex;
          this.userSession.address = res.address;
  
          this.storage.set('userId', this.userSession.id);
          this.storage.set('name', this.userSession.name);
  
          this.userSession.isAuth = true;
        }
      );
    }
  }

}
