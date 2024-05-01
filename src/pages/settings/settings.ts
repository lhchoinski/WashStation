import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgProgress } from 'ngx-progressbar';

import { ChangePasswordPage } from '../change-password/change-password';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public formBuilder: FormBuilder,
              private userSession: UserSessionProvider,
              private alertCtrl: AlertController,
              private utils: UtilsProvider,
              private translate: TranslateService,
              private ngProgress: NgProgress,
              private backendApi: BackendApiProvider) {
  }

  changePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }

  langSelected(e) {
    this.userSession.setSelectedLang(e);
  }
}
