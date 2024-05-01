import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { TranslateService } from '@ngx-translate/core';

import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgotPassForm: FormGroup;
  forgotSubmitAttempt: boolean = false;
  forgotBtnEnabled: boolean = true;

  constructor(public platform: Platform,
              private navCtrl: NavController,
              private backendApi: BackendApiProvider,
              private utils: UtilsProvider,
              public formBuilder: FormBuilder,
              private ngProgress: NgProgress,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private menu: MenuController) {
    this.forgotPassForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(50), Validators.email, Validators.required])],
    });
  }

  submitEmail() {
    this.forgotSubmitAttempt = true;
    setTimeout(() => { this.forgotSubmitAttempt = false; }, 2500)

    if (!this.forgotBtnEnabled || !this.forgotPassForm.valid) return;
    
    this.forgotBtnEnabled = false;
    this.ngProgress.start();

    this.backendApi.forgotPassword(this.forgotPassForm.value.email).subscribe(
      res => {
        let toast = null;
        this.ngProgress.done();                                        
        if (res.hasOwnProperty('success') && !res.success) {
          this.utils.presentToast(res.msg, 'toast-error');
        } else {
          toast = this.utils.presentToast('RESET_PASSWORD_EMAIL_SENT', 'toast-success');
          toast.onDidDismiss(() => {
            this.accountRecovery();

            this.forgotBtnEnabled = true;
          });
        }
      },
      err => {
        this.ngProgress.done();                                
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }

  accountRecovery() {
    let alert = this.alertCtrl.create({
      title: '<h2 class="alert-title">' + this.translate.instant('ACCOUNT_RECOVERY_TITLE') + '</h2>',
      message: '<p class="alert-subtitle">' + this.translate.instant('RECOVERY_MSG') + '</p>',
      cssClass: 'input-alert custom-alert',
      inputs: [
        {
          name: 'recCode',
          placeholder: this.translate.instant('RECOVERY_CODE')
        },
        {
          name: 'password',
          type: 'password',
          placeholder: this.translate.instant('NEW_PASSWORD')
        },
      ],
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'cancel-btn',
        },
        {
          text: this.translate.instant('OK'),
          cssClass: 'ok-btn',					
          handler: data => {
            if (data.recCode === null || data.recCode === '' || data.password === null || data.password === '') {
              this.utils.presentToast('REC_CODE_PASS_REQUIRED', 'toast-error');
              return false;
            }

            this.ngProgress.start();
            this.backendApi.recoverAccount(data.recCode, data.password).subscribe(
              res => {
                let toast = null;
                this.ngProgress.done();                                        
                if (res.hasOwnProperty('success') && !res.success) {
                  this.utils.presentToast(res.msg, 'toast-error');
                } else {
                  toast = this.utils.presentToast('ACCOUNT_RECOVERY_SUCCESS_MSG', 'toast-success');
                  toast.onDidDismiss(() => {
                    this.navCtrl.pop();
                  });
                }
              },
              err => {
                this.ngProgress.done();                                
                this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
              }
            );
          }
        }
      ]
    });
    alert.present();
  }
}
