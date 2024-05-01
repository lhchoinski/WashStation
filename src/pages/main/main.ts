import { Component, OnDestroy } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NgProgress } from 'ngx-progressbar';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { VendingMachineAppPage } from '../vending-machine-app/vending-machine-app';
import { LaundryDetailsPage } from '../laundry-details/laundry-details';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';
import { LaundryAutocompleteProvider } from '../../providers/laundry-autocomplete/laundry-autocomplete';
import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';


@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnDestroy {

  watchSubs: Subscription = null;

  modal: any = null;
  map: any = null;
	mapDraggable: boolean = true;
  hasPosition: boolean = false;
  searchPlc: any = null;
  // refreshTranslate: boolean = true;

	laundries: Array<any> = [];

  zoom: number = 7;
	lat: number = null;
  lng: number = null;

  mapLat: number = 39.7681878;
  mapLng: number = -8.2464266;

  geoOptions: any = {
    timeout: 5000,
    enableHighAccuracy: true,
  };

  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private userSession: UserSessionProvider,
              private ngProgress: NgProgress,
              private utils: UtilsProvider,
              private translate: TranslateService,
              private alertCtrl: AlertController,
              private wsInfo: WashstationInfoProvider,
              private autoComplete: LaundryAutocompleteProvider,
              private backendApi: BackendApiProvider) {
    this.searchPlc = { placeholder: this.translate.instant('LAUNDRY_SEARCH') };
    this.userSession.getLangEv().subscribe(res => {
      setTimeout(() => { this.searchPlc = { placeholder: this.translate.instant('LAUNDRY_SEARCH') }; });
    });

    this.getLaundries();

    if (this.userSession.lat && this.userSession.lng) {
      this.lat = this.userSession.lat;
      this.lng = this.userSession.lng;

      this.mapLat = this.userSession.lat;
      this.mapLng = this.userSession.lng;

      this.zoom = 15;
      this.hasPosition = true;
    }

    this.watchSubs = this.geolocation.watchPosition(this.geoOptions).subscribe((position) => {
      if (position.coords && position.coords.latitude && position.coords.longitude) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.userSession.lat = position.coords.latitude;
        this.userSession.lng = position.coords.longitude;
        if (!this.hasPosition) {
          this.zoom = 15;
          this.mapLat = position.coords.latitude;
          this.mapLng = position.coords.longitude;    
        }
        this.hasPosition = true;
      }
    });
  }

  ionViewDidEnter() {
    this.getLaundries();
  }

  ngOnDestroy() {
    if (this.watchSubs) this.watchSubs.unsubscribe();
  }

  menuClicked() {
    if (this.modal) this.modal.dismiss();
  }

  getLaundries() {
    if (this.laundries.length === 0) this.ngProgress.start();
    this.backendApi.getAllLaundries().subscribe(
      res => {
        let laundries = [];
        res.forEach(el => {
          el.lat = Number(el.lat);
          el.lng = Number(el.lng);
          el['name'] = el.laundries[0].name;
          el['autocompleteLabel'] = el.laundries[0].name + ', ' + el.addressLine1 + ', ' + el.postalCode + ', ' + el.city;
          laundries.push(el);
        });
        this.autoComplete.laundries = laundries;
        this.laundries = laundries;
        this.userSession.isAuth = true;      
        this.ngProgress.done();
      },
      err => {
        this.ngProgress.done();            
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');  
      }
    );
  }

  mapReady(map) {
    this.map = map;
  }

  goToMyLocation() {
    this.map.panTo({ lat: this.lat, lng: this.lng });
  }

  zoomIn() {
    if (this.zoom < 23) this.zoom = this.zoom + 1;
  }

  zoomOut() {
    if (this.zoom > 1) this.zoom = this.zoom - 1;
  }

  laundrySelected(e) {
    if (!this.map) return;

    if (e.lat && e.lng) {
      this.map.panTo({ lat: e.lat, lng: e.lng });
      let laundry = this.laundries.find(el => (el.laundries[0].laundryId === e.laundries[0].laundryId));
      setTimeout(() => { this.goToVendingApp(laundry); }, 500)
    }
  }

  closeModal() {
    if (this.modal) this.modal.dismiss(false);
  }

  goToVendingApp(laundry) {
    if (this.modal) return;
    
    this.modal = this.modalCtrl.create(LaundryDetailsPage, { laundry: laundry }, { cssClass: 'laundry-modal' });
    this.modal.onDidDismiss(
      res => {
        if (res) this.navCtrl.push(VendingMachineAppPage, { laundry: laundry });
        this.modal = null;
      }
    );
    setTimeout(() => { this.modal.present(); }, 10);
  }
}
