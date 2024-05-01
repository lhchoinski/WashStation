import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Rx';


@Injectable()
export class UtilsProvider {

  pageSubj: Subject<any> = new Subject<any>();
  menuSubj: Subject<any> = new Subject<any>();

  constructor(private toastCtrl: ToastController,
              private translate: TranslateService) {}

  presentToast(toastMsg, cssClass, params=null, isError=false, duration=3000) {
    if (isError) {
      let toast = this.toastCtrl.create({
        message: (params) ? this.translate.instant(toastMsg, params) : this.translate.instant(toastMsg),
        cssClass: cssClass,
        showCloseButton: true,
        closeButtonText: this.translate.instant('CLOSE'),
        position: 'top',
      });
      toast.present();
      return toast;
    } else {
      let toast = this.toastCtrl.create({
        message: (params) ? this.translate.instant(toastMsg, params) : this.translate.instant(toastMsg),
        cssClass: cssClass,
        duration: duration,
        position: 'top',
      });
      toast.present();
      return toast;          
    }
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  getPageEv() {
    return this.pageSubj.asObservable();
  }

  setPage(pageTitle) {
    this.pageSubj.next(pageTitle);
  }

  isObject(obj) {
    return ((typeof obj === "object") && (obj !== null));
  }
}
