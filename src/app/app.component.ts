import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';

import { LoginPage } from '../pages/login/login';

import { UtilsProvider } from '../providers/utils/utils';
import { UserSessionProvider } from '../providers/user-session/user-session';
import { BackendApiProvider } from '../providers/backend-api/backend-api';
import { MiddlewareCloudProvider } from '../providers/middleware-cloud/middleware-cloud';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {

  @ViewChild(Nav) nav: Nav;

  pages: Array<any> = [];
  pagesSideMenu: Array<any> = [];

  langSubs: Subscription = null;
  storage: any = new Storage({});

  middleSubs: Subscription = null;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private userSession: UserSessionProvider,
              private utils: UtilsProvider,
              private backendApi: BackendApiProvider,
              private translate: TranslateService,
              private globalization: Globalization,
              private middlewareCloud: MiddlewareCloudProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'WASHSTATION', icon: 'ios-home-outline' },
      { title: 'PROFILE', icon: 'ios-contact-outline' },
      { title: 'RECHARGE', icon: 'ios-card-outline' },
      { title: 'SETTINGS', icon: 'ios-settings-outline' },
      { title: 'ORDERS_HISTORY', icon: 'ios-list-outline' },
      { title: 'ABOUT', icon: 'ios-information-circle-outline' },
    ];
    this.pagesSideMenu = this.pages.filter(el => (el.title !== 'PROFILE'));

    
		this.middleSubs = this.middlewareCloud.getPushNotif().subscribe(
      notif => {
        this.utils.presentToast('CHARGE_RECEIVED_SUCCESS', 'toast-success');

        if (this.userSession.id) {
          this.backendApi.getUserDetails(this.userSession.id).subscribe(
            res => {
              if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
                let appCard = res.cards.find(el => (el.type === 'APP'));
                this.userSession.balance = Number(appCard.balance);
              }
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.langSubs) this.langSubs.unsubscribe();
    if (this.middleSubs) this.middleSubs.unsubscribe();
  }

  getDeviceLanguage() {
    return new Promise(resolve => {
      this.globalization.getPreferredLanguage()
        .then(res => resolve(res))
        .catch(e => resolve(false));
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('selectedLang').then(async selectedLang => {
        if (selectedLang) {
          this.translate.setDefaultLang(selectedLang);          
          this.userSession.selectedLang = selectedLang;
        } else {
          let deviceLanguage = await this.getDeviceLanguage();

          if (deviceLanguage && deviceLanguage.hasOwnProperty('value')) {
            let langOpts = ['pt', 'es', 'fr', 'en', 'nl'];
            let aux = langOpts.find(el => deviceLanguage['value'].indexOf(el) !== -1);
            if (aux) {
              this.translate.setDefaultLang(aux);
              this.userSession.selectedLang = aux;  
            } else {
              this.translate.setDefaultLang('en');
              this.userSession.selectedLang = 'en';
            }
          } else {
            this.translate.setDefaultLang('pt');
            this.userSession.selectedLang = 'pt';
          }
        }
      });

      this.langSubs = this.userSession.getLangEv().subscribe(
        res => {
          if (res) { this.translate.setDefaultLang(res); }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.resume.subscribe(res => this.getUserDetails());

      this.nav.setRoot(LoginPage);
    });
  }

  logout() {
    this.userSession.logout();
    this.middlewareCloud.disconnect();
    this.nav.setRoot(LoginPage);
  }

  selectPage(page) {
    this.utils.setPage(page.title);
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
