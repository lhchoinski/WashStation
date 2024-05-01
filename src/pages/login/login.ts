import { Component } from '@angular/core';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';
import { NgProgress } from 'ngx-progressbar';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UserSessionProvider } from '../../providers/user-session/user-session';
import { UtilsProvider } from '../../providers/utils/utils';
import { MiddlewareCloudProvider } from '../../providers/middleware-cloud/middleware-cloud';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  unregisterBackButtonAction: any;

  loginForm: FormGroup;
  loginSubmitAttempt: boolean = false;

  storage: any = new Storage({});
  jwtHelper: any = new JwtHelper();
  btnEnabled: boolean = true;

  isAuth: boolean = true;

  geoOptions: any = {
    timeout: 5000,
    enableHighAccuracy: true,
  };

  constructor(private platform: Platform,
              private geolocation: Geolocation,
              private navCtrl: NavController,
              private backendApi: BackendApiProvider,
              private utils: UtilsProvider,
              private formBuilder: FormBuilder,
              private ngProgress: NgProgress,
              private menu: MenuController,
              private userSession: UserSessionProvider,
              private middlewareCloud: MiddlewareCloudProvider) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
    });
  }

  ionViewDidEnter() {
    this.clearPasswordField();

    this.storage.get('id_token').then(token => {
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        this.getUserDetails();
      } else {
        this.isAuth = false;        
      }
    });
    this.initializeBackButtonCustomHandler();    
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(e => {}, 101);
  }

  login() {
    this.loginSubmitAttempt = true;
    setTimeout(() => { this.loginSubmitAttempt = false; }, 2500)

    if (!this.btnEnabled || !this.loginForm.valid) return;

    this.btnEnabled = false;
    this.ngProgress.start();
    this.backendApi.authenticate(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      res => {
        if (res.hasOwnProperty('success') && !res.success) {
          this.ngProgress.done();          
          this.utils.presentToast(res.msg, 'toast-error');
        } else {
          this.storage.set('id_token', res.token).then(() => {
            this.userSession.setSessionAttr(this.jwtHelper.decodeToken(res.token));
            this.getUserDetails();
          });
        }
      },
      err => {
        this.ngProgress.done();        
        if (err.hasOwnProperty('status') && err.status === 401) {
          this.utils.presentToast('LOGIN_WRONG_CREDENTIALS', 'toast-error');

          this.clearPasswordField();
        } else {
          this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');          
        }
        this.btnEnabled = true;
      }
    );
  }

  getUserDetails() {
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

        this.geolocation.getCurrentPosition(this.geoOptions).then(position => {
          this.userSession.lat = position.coords.latitude;
          this.userSession.lng = position.coords.longitude;
          this.ngProgress.done();
          this.navCtrl.setRoot(TabsPage, null, { animate: true, direction: 'forward' });
        }).catch(err => {
          this.ngProgress.done();
          this.navCtrl.setRoot(TabsPage, null, { animate: true, direction: 'forward' });
        });

        this.middlewareCloud.connect(this.userSession.id);
      },
      err => {
        this.ngProgress.done();
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }

  clearPasswordField() {
    let username = this.loginForm.value.username;
    this.loginForm.reset();

    this.loginForm = this.formBuilder.group({
      username: [username, Validators.compose([Validators.maxLength(50), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
    });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }
}
