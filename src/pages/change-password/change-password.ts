import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';

import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UserSessionProvider } from '../../providers/user-session/user-session';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  changePassForm: FormGroup;
  changeSubmitAttempt: boolean = false;
  changeBtnEnabled: boolean = true;

  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private ngProgress: NgProgress,
              private backendApi: BackendApiProvider,
              private utils: UtilsProvider,
              private userSession: UserSessionProvider,
              private navParams: NavParams) {
    this.changePassForm = formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      newPassword: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.required])],
      confPassword: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.required])],
    });
  }

  changePassword() {
    this.changeSubmitAttempt = true;
    setTimeout(() => { this.changeSubmitAttempt = false; }, 2500)

    if (!this.changeBtnEnabled || !this.changePassForm.valid) return;

    if (this.changePassForm.value.confPassword !== this.changePassForm.value.newPassword) {
      let toast = this.utils.presentToast('PASSWORD_NOT_EQUAL', 'toast-error');
      toast.onDidDismiss(() => {
        this.changeBtnEnabled = true;        
      });
      this.changeBtnEnabled = false;
      return;        
    }

    this.changeBtnEnabled = false;
    this.ngProgress.start();
    this.backendApi.changePassword(this.changePassForm.value.password, this.changePassForm.value.newPassword).subscribe(
      res => {
        this.ngProgress.done();                                                                          
        let toast = this.utils.presentToast('CHANGE_PASSWORD_SUCCESS_MSG', 'toast-success');
        toast.onDidDismiss(() => {
          this.navCtrl.pop();
        });
      },
      err => {
        this.ngProgress.done();
        this.changeBtnEnabled = true;                                                              
        if (err.hasOwnProperty('status') && err.status === 401) {
          this.utils.presentToast('WRONG_PASSWORD', 'toast-error'); 
        } else {
          this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');          
        }
      }
    );
  }

}
