import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Rx';


@Injectable()
export class UserSessionProvider {

  storage: any = new Storage({});
  langSubj: Subject<any> = new Subject<any>();

  id: string = null;
  roleId: string = null;
  roleIdUser: string = null;
  balance: number = 0;
  isAuth: boolean = false;
  cardId: string = null;
  selectedLang: string = null;

  name: string = null;
  email: string = null;
  nif: string = null;
  mobileContact: string = null;
  birthday: string = null;
  gender: string = null;
  address: any = null;

  paymentRef: any = null;

  lat: number = null;
  lng: number = null;

  constructor() {
    this.storage.get('userId').then(userId => { if (userId) this.id = userId; });
    this.storage.get('name').then(name => { if (name) this.name = name; });
  }

  setSessionAttr(decodedJWT) {
    this.name = decodedJWT.name;
    this.id = decodedJWT.id;
    this.roleId = decodedJWT.roleId;
    this.roleIdUser = decodedJWT.roleIdUser;
  }

  setSelectedLang(lang) {
    this.selectedLang = lang;
    this.storage.set('selectedLang', lang);
    this.langSubj.next(lang);    
  }

  getUsername() { return this.name; }

  getLangEv() {
    return this.langSubj.asObservable();
  }

  logout() {
    this.storage.clear().then(() => {
      this.name = null;
      this.id = null;
      this.roleId = null;
      this.roleIdUser = null;
      this.balance = 0;
      this.isAuth = false;
      this.cardId = null;
      this.nif = null;
      this.email = null;
      this.mobileContact = null;
      this.birthday = null;
      this.gender = null;
      this.address = null;
      this.lat = null;
      this.lng = null;
      this.paymentRef = null;
    });
  }

  isUserProfileComplete() {
    if (!this.name || this.name === '' ||
        !this.address.addressLine1 || this.address.addressLine1 === '' ||
        !this.address.city || this.address.city === '' ||
        !this.address.postalCode || this.address.postalCode === '' ||
        !this.address.country || this.address.country === '') {
      return false;
    } else {
      return true;
    }
  }
}
