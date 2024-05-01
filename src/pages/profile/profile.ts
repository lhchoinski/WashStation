import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgProgress } from 'ngx-progressbar';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  storage: any = new Storage({});

  userDataForm: FormGroup;
  userDataSubmitAttempt: boolean = false;
  userDataBtnEnabled: boolean = true;

  birthday: any = null;
  gender: any = null;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public formBuilder: FormBuilder,
              private utils: UtilsProvider,
              private userSession: UserSessionProvider,
              private translate: TranslateService,
              private ngProgress: NgProgress,
              private backendApi: BackendApiProvider) {
    this.birthday = this.userSession.birthday;
    this.gender = this.userSession.gender;

    this.userDataForm = formBuilder.group({
      name: [(this.userSession.name) ? this.userSession.name : '', Validators.compose([Validators.maxLength(50), Validators.required])],      
      nif: [(this.userSession.nif) ? this.userSession.nif : '', Validators.compose([Validators.minLength(9), Validators.maxLength(9)])],
      mobileContact: [(this.userSession.mobileContact) ? this.userSession.mobileContact : '', Validators.compose([Validators.minLength(9), Validators.maxLength(9)])],

      addressLine: [(this.userSession.address.addressLine1) ? this.userSession.address.addressLine1 : '', Validators.compose([Validators.maxLength(500)])],
      postalCode: [(this.userSession.address.postalCode) ? this.userSession.address.postalCode : '', Validators.compose([Validators.maxLength(8)])],
      city: [(this.userSession.address.city) ? this.userSession.address.city : '', Validators.compose([Validators.maxLength(100)])],
      country: [(this.userSession.address.country) ? this.userSession.address.country : '', Validators.compose([Validators.maxLength(100)])],
    });
  }

  submitUserData() {
    this.userDataSubmitAttempt = true;

    if (!this.userDataBtnEnabled || !this.userDataForm.valid) return;

    this.userDataBtnEnabled = false;
    this.ngProgress.start();

    let addrObj = {
      addressLine1: this.userDataForm.value.addressLine,
      city: this.userDataForm.value.city,
      country: this.userDataForm.value.country,
      postalCode: this.userDataForm.value.postalCode,
    };
    this.backendApi.updateUserDetails(this.userSession.id, this.userSession.address.addressId, this.userDataForm.value.name, this.userDataForm.value.nif, this.userDataForm.value.mobileContact, this.birthday, this.gender, addrObj).subscribe(
      res => {
        this.userSession.name = this.userDataForm.value.name;
        this.userSession.nif = this.userDataForm.value.nif;
        this.userSession.mobileContact = this.userDataForm.value.mobileContact;
        this.userSession.birthday = this.birthday;
        this.userSession.gender = this.gender;

        this.userSession.address.addressLine1 = this.userDataForm.value.addressLine;
        this.userSession.address.postalCode = this.userDataForm.value.postalCode;
        this.userSession.address.city = this.userDataForm.value.city;
        this.userSession.address.country = this.userDataForm.value.country;

        this.storage.set('name', this.userSession.name);

        this.ngProgress.done();
        this.userDataBtnEnabled = true;                
        this.utils.presentToast('PROFILE_SUCCESS_MSG', 'toast-success');
      },
      err => {
        this.ngProgress.done();
        this.userDataBtnEnabled = true;        
        this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
      }
    );
  }
}
