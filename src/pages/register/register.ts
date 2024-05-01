import { Component } from '@angular/core';
import { ViewController, ModalController, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgProgress } from 'ngx-progressbar';

import { TermsConditionsPage } from '../terms-conditions/terms-conditions';

import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  passwordEqual: boolean = true;
  termsCondAccepted: boolean = false;

  registerForm: FormGroup;
  regSubmitAttempt: boolean = false;
  regBtnEnabled: boolean = true;

  constructor(private viewCtrl: ViewController,
              private backendApi: BackendApiProvider,
              public formBuilder: FormBuilder,
              private ngProgress: NgProgress,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private menu: MenuController,
              private utils: UtilsProvider) {
    this.registerForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(50), Validators.required])],      
      email: ['', Validators.compose([Validators.maxLength(50), Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.required])],
    });
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  register() {
    this.regSubmitAttempt = true;
    setTimeout(() => { this.regSubmitAttempt = false; }, 2500)
    
    if (!this.regBtnEnabled || !this.registerForm.valid || !this.termsCondAccepted) {
      if (this.registerForm.value.password.length < 6) this.utils.presentToast('MIN_PASSWORD_LENGTH', 'toast-error');
      return;
    }

    this.regBtnEnabled = false;
    this.ngProgress.start();
    this.backendApi.createUser(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.password).subscribe(
      res => {
        let toast = this.utils.presentToast('REGISTER_SUCCESS_MSG', 'toast-success');
        toast.onDidDismiss(
          res => this.activateAccount()
        );
        this.regBtnEnabled = true;
        this.ngProgress.done();
      },
      err => {
        if (err.hasOwnProperty('message') && err.message === 'UNAVAILABLE_USER') {
          this.utils.presentToast(err.message, 'toast-error');          
        } else {
          this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');          
        }
        this.regBtnEnabled = true;        
        this.ngProgress.done();        
      }
    );
  }

  login() {
    this.viewCtrl.dismiss();
  }

  goToTermsConditionPage() {
    let termsCondModal = this.modalCtrl.create(TermsConditionsPage);
    termsCondModal.onDidDismiss(
      res => {
        if (res) this.termsCondAccepted = true;
      }
    );
    termsCondModal.present();
  }

  activateAccount() {
    let alert = this.alertCtrl.create({
      title: '<h2 class="laundry-name">' + this.translate.instant('ACTIVATION_TITLE') + '</h2>',
      message: '<p class="alert-subtitle">' + this.translate.instant('ACTIVATION_MSG') + '</p>',
      cssClass: 'input-alert custom-alert',
      inputs: [
        {
          name: 'actCode',
          placeholder: this.translate.instant('ACTIVATION_CODE')
        }
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
            if (data.actCode === null || data.actCode === '') {
              this.utils.presentToast('ACT_CODE_REQUIRED', 'toast-error');
              return false;
            }

            this.ngProgress.start();
            this.backendApi.activateAccount(data.actCode).subscribe(
              res => {
                let toast = null;
                this.ngProgress.done();                
                if (res.hasOwnProperty('success') && !res.success) {
                  toast = this.utils.presentToast(res.msg, 'toast-error');
                } else {
                  toast = this.utils.presentToast('ACTIVATION_SUCCESS_MSG', 'toast-success');
                  toast.onDidDismiss(
                    res => {
                      this.login();
                    }
                  );
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
