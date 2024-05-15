import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Rx';


@Injectable()
export class UserSessionProvider {

  storage: any = new Storage({});
  langSubj: Subject<any> = new Subject<any>();

  id: string = "";
  roleId: string = "";
  roleIdUser: string = "";
  balance: number = 0;
  isAuth: boolean = false;
  cardId: string = "";
  selectedLang: string = "";

  name: string = "";
  email: string = "";
  nif: string = "";
  mobileContact: string = "";
  birthday: string = "";
  gender: string = "";
  address: any = "";

  paymentRef: any = "";

  lat: number = 0;
  lng: number = 0;

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
      this.name = "";
      this.id = "";
      this.roleId = "";
      this.roleIdUser = "";
      this.balance = 0;
      this.isAuth = false;
      this.cardId = "";
      this.nif = "";
      this.email = "";
      this.mobileContact = "";
      this.birthday = "";
      this.gender = "";
      this.address = "";
      this.lat = 0;
      this.lng = 0;
      this.paymentRef = "";
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
