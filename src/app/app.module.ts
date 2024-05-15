import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
import { NgProgressModule } from 'ngx-progressbar';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { PayPal } from '@ionic-native/paypal';
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { VendingMachineAppPage } from '../pages/vending-machine-app/vending-machine-app';
import { DryingPage } from '../pages/drying/drying';
import { WashingPage } from '../pages/washing/washing';
import { SelectProgramPage } from '../pages/select-program/select-program';
import { MainPage } from '../pages/main/main';
import { ProfilePage } from '../pages/profile/profile';
import { RechargePage } from '../pages/recharge/recharge';
import { RegisterPage } from '../pages/register/register';
import { TermsConditionsPage } from '../pages/terms-conditions/terms-conditions';
import { SettingsPage } from '../pages/settings/settings';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { AboutPage } from '../pages/about/about';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { LaundryDetailsPage } from '../pages/laundry-details/laundry-details';
import { PaymentMethodsPage } from '../pages/payment-methods/payment-methods';
import { EasypayPage } from '../pages/easypay/easypay';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';
import { BackendApiProvider } from '../providers/backend-api/backend-api';
import { UserSessionProvider } from '../providers/user-session/user-session';
import { MachinesProvider } from '../providers/machines/machines';
import { OrdersProvider } from '../providers/orders/orders';
import { MiddlewareCloudProvider } from '../providers/middleware-cloud/middleware-cloud';
import { UtilsProvider } from '../providers/utils/utils';
import { LaundryAutocompleteProvider } from '../providers/laundry-autocomplete/laundry-autocomplete';
import { WashstationInfoProvider } from '../providers/washstation-info/washstation-info';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

let storage = new Storage({});
export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'Bearer',
    noJwtError: false,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    VendingMachineAppPage,
    DryingPage,
    WashingPage,
    SelectProgramPage,
    MainPage,
    ProfilePage,
    RechargePage,
    RegisterPage,
    TermsConditionsPage,
    SettingsPage,
    ChangePasswordPage,
    ForgotPasswordPage,
    AboutPage,
    OrderHistoryPage,
    LaundryDetailsPage,
    PaymentMethodsPage,
    EasypayPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyCgl8n3Mv-cOQaUVD3ljtF_yoTTQ1unatc',
      apiKey: 'AIzaSyD49NOJy5vtGdXT3FtSIYkLOysLR6JIL8c',
    }),
    NgProgressModule,
    AutoCompleteModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    VendingMachineAppPage,
    DryingPage,
    WashingPage,
    SelectProgramPage,
    MainPage,
    ProfilePage,
    RechargePage,
    RegisterPage,
    TermsConditionsPage,
    SettingsPage,
    ChangePasswordPage,
    ForgotPasswordPage,
    AboutPage,
    OrderHistoryPage,    
    LaundryDetailsPage,
    PaymentMethodsPage,
    EasypayPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globalization,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: AuthHttp, useFactory: getAuthHttp, deps: [Http] },
    TranslateService,
    BackendApiProvider,
    UserSessionProvider,
    MachinesProvider,
    OrdersProvider,
    MiddlewareCloudProvider,
    Geolocation,
    UtilsProvider,
    LaundryAutocompleteProvider,
    WashstationInfoProvider,
    PayPal,
    Diagnostic,
    InAppBrowser,
  ]
})
export class AppModule {}
