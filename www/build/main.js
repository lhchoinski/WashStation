webpackJsonp([0],{

/***/ 190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectProgramPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_diagnostic__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_orders_orders__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_machines_machines__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_washstation_info_washstation_info__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var SelectProgramPage = /** @class */ (function () {
    function SelectProgramPage(navParams, middlewareCloud, backendApi, loadingCtrl, utils, orders, userSession, translate, alertCtrl, machines, diagnostic, wsInfo, navCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.middlewareCloud = middlewareCloud;
        this.backendApi = backendApi;
        this.loadingCtrl = loadingCtrl;
        this.utils = utils;
        this.orders = orders;
        this.userSession = userSession;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.machines = machines;
        this.diagnostic = diagnostic;
        this.wsInfo = wsInfo;
        this.navCtrl = navCtrl;
        this.workflowTimeout = 1500;
        this.plusImg = 'assets/imgs/+.png';
        this.minusImg = 'assets/imgs/-.png';
        this.cardImg = 'assets/imgs/cartao-icon.png';
        this.coinImg = 'assets/imgs/moedas-icon.png';
        this.laundry = 0;
        this.minDuration = 0; // Minimum drying duration [min.]
        this.maxDuration = 120; // Maximum drying duration [min.]
        this.duration = 0;
        this.durStep = 0;
        this.machineType = "";
        this.machine = "";
        this.programs = [];
        this.img = "";
        this.priceCard = "";
        this.costCard = 0;
        this.wasImpulses = 1;
        this.dryImpulses = 1;
        this.totalCostCard = 0.00;
        this.btnEnabled = true;
        this.loading = "";
        this.middleSubs = null;
        this.timer = "";
        this.feedbackTimeout = 15 * 1000;
        this.actReqSent = false;
        this.actFeedbackEnabled = true;
        this.laundry = this.navParams.data.laundry;
        this.machineType = this.navParams.data.type;
        this.machine = this.navParams.data.machine;
        this.programs = this.navParams.data.programs;
        this.img = this.navParams.data.img;
        if (this.machineType === 'washing-machine') {
            this.programs.forEach(function (el) {
                el.selected = false;
                if (!el.duration) {
                    el.duration = el.program.duration.toString();
                }
            });
            // Set initial program.
            this.programs[0].selected = true;
            this.priceCard = this.programs[0].priceCard;
        }
        else {
            this.minDuration = Number(this.machine.config.durPerImp);
            this.duration = this.minDuration;
            this.durStep = Number(this.machine.config.durPerImp);
            this.priceCard = this.navParams.data.programs[0].priceCard;
            this.costCard = Number(this.priceCard);
        }
        this.middleSubs = this.middlewareCloud.getPkg().subscribe(function (pkg) {
            if (typeof pkg === 'object') {
                if (_this.actReqSent && pkg.hasOwnProperty('op') && pkg.op === 'activate-machine' && pkg.hasOwnProperty('code') && pkg.code === '200') {
                    _this.backendApi.setOrders(_this.getOrderRegObj()).subscribe(function (res) { return setTimeout(function () { if (_this.loading)
                        _this.loading.dismiss(true); }, _this.workflowTimeout); }, function (err) { return setTimeout(function () { if (_this.loading)
                        _this.loading.dismiss(false); }, _this.workflowTimeout); });
                }
            }
        });
    }
    SelectProgramPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
        if (this.middleSubs)
            this.middleSubs.unsubscribe();
    };
    SelectProgramPage.prototype.close = function () {
        this.navCtrl.pop();
    };
    SelectProgramPage.prototype.submit = function () {
        if (this.utils.getDistanceFromLatLonInKm(this.laundry.lat, this.laundry.lng, this.userSession.lat, this.userSession.lng) > this.wsInfo.minDistanceFromLaundry) {
            this.utils.presentToast('TOO_FAR_AWAY_MSG', 'toast-error', { value: this.wsInfo.minDistanceFromLaundry * 1000 });
            return;
        }
        var program = null;
        var order = null;
        var pkg = null;
        switch (this.machineType) {
            case 'washing-machine':
                program = this.programs.find(function (program) { return (program.selected); });
                program.selPriceCard = program.priceCard;
                program.impulses = this.wasImpulses.toString();
                program.impulses = Math.floor(program.program.duration / this.machine.config.durPerImp);
                order = {
                    machine: this.machine,
                    program: program,
                };
                this.orders.reset();
                this.orders.add(order);
                pkg = {
                    op: 'machine-reserved',
                    data: {
                        id: this.machine.config.intId,
                        chn: this.machine.peripheral_has_machines[0].channel,
                        progDur: program.program.duration + 1,
                    },
                };
                this.machines.updateMachineState(pkg);
                break;
            case 'drying-machine':
                program = this.programs[0];
                program.selPriceCard = this.costCard.toFixed(2);
                program.program.selDuration = "- " + this.duration + " min.";
                program.totalDuration = this.duration;
                program.impulses = this.dryImpulses.toString();
                program.impulses = Math.floor(program.totalDuration / this.machine.config.durPerImp);
                order = {
                    machine: this.machine,
                    program: program,
                };
                this.orders.reset();
                this.orders.add(order);
                pkg = {
                    op: 'machine-reserved',
                    data: {
                        id: this.machine.config.intId,
                        chn: this.machine.peripheral_has_machines[0].channel,
                        progDur: program.totalDuration + 1,
                    },
                };
                this.machines.updateMachineState(pkg);
                break;
        }
        this.setTotal();
        if (!this.actFeedbackEnabled) {
            this.completeOrder();
        }
        else {
            this.completeOrderWithFeedback();
        }
    };
    SelectProgramPage.prototype.updateDuration = function (action) {
        switch (action) {
            case 'increment':
                this.duration += this.durStep;
                this.dryImpulses++;
                if (this.duration > this.maxDuration) {
                    this.duration -= this.durStep;
                    this.dryImpulses--;
                }
                break;
            case 'decrement':
                if (this.duration > this.minDuration) {
                    this.duration -= this.durStep;
                    this.dryImpulses--;
                }
                break;
        }
        this.costCard = (this.duration / this.durStep) * Number(this.priceCard);
    };
    SelectProgramPage.prototype.selectProgram = function (program) {
        this.programs.forEach(function (program) {
            program.selected = false;
        });
        program.selected = !program.selected;
        this.priceCard = program.priceCard;
    };
    SelectProgramPage.prototype.setTotal = function () {
        this.totalCostCard = this.orders.get()
            .map(function (el) { return el.program.selPriceCard; })
            .reduce(function (prevVal, el) { return prevVal + Number(el); }, 0.00);
    };
    SelectProgramPage.prototype.cancelOrders = function () {
        var _this = this;
        var pkg = {
            op: 'cancel-orders'
        };
        this.machines.updateMachineState(pkg);
        setTimeout(function () { _this.orders.reset(); }, 1000);
        this.close();
    };
    SelectProgramPage.prototype.completeOrderWithFeedback = function () {
        var _this = this;
        if (!this.btnEnabled)
            return;
        if (this.userSession.balance >= this.totalCostCard) {
            this.btnEnabled = false;
            var alert_1 = this.alertCtrl.create({
                title: this.translate.instant('MAKE_PAYMENT_CONF_MSG'),
                message: (this.machineType === 'washing-machine') ? this.programs[0].program.name + ' (' + this.programs[0].duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>' : this.programs[0].program.name + ' (' + this.duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>',
                cssClass: 'custom-alert',
                buttons: [
                    {
                        text: this.translate.instant('NO'),
                        role: 'cancel',
                        cssClass: 'cancel-btn',
                        handler: function () { _this.btnEnabled = true; }
                    },
                    {
                        text: this.translate.instant('YES'),
                        cssClass: 'ok-btn',
                        handler: function () {
                            _this.sendActivationRequest();
                            _this.loading = _this.loadingCtrl.create({
                                content: _this.translate.instant('BUY_WAITING_MSG'),
                            });
                            _this.loading.onDidDismiss(function (res) {
                                if (res) {
                                    var toast = _this.utils.presentToast('ORDER_COMPLETE', 'toast-success', null, false, _this.workflowTimeout);
                                    toast.onDidDismiss(function () {
                                        _this.btnEnabled = true;
                                        _this.userSession.balance = (_this.userSession.balance - _this.totalCostCard < 0) ? 0 : _this.userSession.balance - _this.totalCostCard;
                                        _this.orders.reset();
                                        _this.close();
                                    });
                                }
                                else {
                                    _this.btnEnabled = true;
                                    _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                                }
                                _this.actReqSent = false;
                            });
                            _this.loading.present();
                            _this.timer = setTimeout(function () { if (_this.loading)
                                _this.loading.dismiss(false); }, _this.feedbackTimeout);
                        }
                    }
                ]
            });
            alert_1.present();
        }
        else {
            this.utils.presentToast('NOT_ENOUGH_BALANCE', 'toast-error');
        }
    };
    SelectProgramPage.prototype.completeOrder = function () {
        var _this = this;
        if (!this.btnEnabled)
            return;
        if (this.userSession.balance >= this.totalCostCard) {
            this.btnEnabled = false;
            var alert_2 = this.alertCtrl.create({
                title: this.translate.instant('MAKE_PAYMENT_CONF_MSG'),
                message: (this.machineType === 'washing-machine') ? this.programs[0].program.name + ' (' + this.programs[0].duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>' : this.programs[0].program.name + ' (' + this.duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>',
                cssClass: 'custom-alert',
                buttons: [
                    {
                        text: this.translate.instant('NO'),
                        role: 'cancel',
                        cssClass: 'cancel-btn',
                        handler: function () { _this.btnEnabled = true; }
                    },
                    {
                        text: this.translate.instant('YES'),
                        cssClass: 'ok-btn',
                        handler: function () {
                            _this.loading = _this.loadingCtrl.create({
                                content: _this.translate.instant('BUY_WAITING_MSG'),
                            });
                            _this.loading.onDidDismiss(function (res) {
                                if (res) {
                                    _this.sendActivationRequest();
                                    var toast = _this.utils.presentToast('ORDER_COMPLETE', 'toast-success', null, false, _this.workflowTimeout);
                                    toast.onDidDismiss(function () {
                                        _this.btnEnabled = true;
                                        _this.userSession.balance = (_this.userSession.balance - _this.totalCostCard < 0) ? 0 : _this.userSession.balance - _this.totalCostCard;
                                        _this.orders.reset();
                                        _this.close();
                                    });
                                }
                                else {
                                    _this.btnEnabled = true;
                                    _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                                }
                                _this.actReqSent = false;
                            });
                            _this.loading.present();
                            _this.backendApi.setOrders(_this.getOrderRegObj()).subscribe(function (res) { return setTimeout(function () { if (_this.loading)
                                _this.loading.dismiss(true); }, _this.workflowTimeout); }, function (err) { return setTimeout(function () { if (_this.loading)
                                _this.loading.dismiss(false); }, _this.workflowTimeout); });
                        }
                    }
                ]
            });
            alert_2.present();
        }
        else {
            this.utils.presentToast('NOT_ENOUGH_BALANCE', 'toast-error');
        }
    };
    SelectProgramPage.prototype.getOrderRegObj = function () {
        var obj = {
            cardId: this.userSession.cardId,
            nif: this.userSession.nif,
            expense: true,
            priceTotal: this.totalCostCard,
            laundryId: this.navParams.data.laundryId,
            orders: [],
        };
        this.orders.orders.forEach(function (item) {
            obj.orders.push({
                price: Number(item.program.selPriceCard),
                machineProgramId: item.program.machineProgramId,
                impulses: (item.program.impulses) ? item.program.impulses : 1,
            });
        });
        return obj;
    };
    SelectProgramPage.prototype.sendActivationRequest = function () {
        var actMsg = [];
        this.orders.get().forEach(function (item, i) {
            var act = {
                id: item.machine.config.intId,
                chn: item.machine.peripheral_has_machines[0].channel,
                impulses: (item.program.impulses) ? item.program.impulses.toString() : '1',
            };
            actMsg.push(act);
        });
        var pkg = {
            op: 'activate-machine',
            data: actMsg,
        };
        this.actReqSent = true;
        this.middlewareCloud.send(pkg);
    };
    SelectProgramPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-select-program',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\select-program\select-program.html"*/'<ion-header>\n\n  <ion-navbar color="dark-navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title *ngIf="machineType === \'washing-machine\'">{{ \'WASHING\' | translate }}</ion-title>\n\n    <ion-title *ngIf="machineType === \'drying-machine\'">{{ \'DRYING\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons>   	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="backgnd" padding>\n\n  <div class="table" style="height: 100%;">\n\n    <!-- Content section. -->\n\n    <div class="table-row">\n\n      <div class="table-cell">\n\n        <div [ngSwitch]="machineType">\n\n          <!-- Washing machine section. -->\n\n          <div *ngSwitchCase="\'washing-machine\'">\n\n            <ion-grid style="padding: 0;">\n\n              <ion-row>\n\n                <div class="table">\n\n                  <div class="table-cell">\n\n                    <div class="table-no-width" style="margin-bottom: 30px;">\n\n                      <div class="table-cell">\n\n                        <img class="machine-img" [src]="img" />    \n\n                      </div>\n\n                      <div class="table-cell">\n\n                        <div style="margin-left: 30px;">\n\n                          <div class="index-font machine-index-ok centered" style="margin: 0;">{{ machine.index }}</div>\n\n                          <div class="xl-font" style="margin: 10px 0;">{{ machine.name | uppercase }}</div>\n\n                          <div class="md-font">{{ priceCard | number: \'1.2-2\' }} &euro;</div>\n\n                        </div>\n\n                      </div>\n\n                    </div>\n\n                  </div>\n\n                </div>\n\n              </ion-row>\n\n              <ion-row>\n\n                <ion-col style="padding: 0;">\n\n                  <div *ngIf="programs.length === 1">\n\n                    <div [hidden]="!programs[0].selected" class="table program-btn selection" (click)="selectProgram(programs[0])" style="margin-top: 20px;">\n\n                      <div class="table-cell centered md-font">\n\n                        {{ programs[0].program.name }} ({{ programs[0].duration }} {{ \'MIN\' | translate }})\n\n                      </div>\n\n                    </div>\n\n                  </div>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </div>\n\n          <!-- Drying machine section. -->\n\n          <div *ngSwitchCase="\'drying-machine\'">\n\n            <ion-grid style="padding: 0;">\n\n              <ion-row>\n\n                <div class="table">\n\n                  <div class="table-cell">\n\n                    <div class="table-no-width">\n\n                      <div class="table-cell">\n\n                        <img class="machine-img" [src]="img" />    \n\n                      </div>\n\n                      <div class="table-cell">\n\n                        <div style="margin-left: 30px;">\n\n                          <div class="index-font machine-index-ok centered" style="margin: 0;">{{ machine.index }}</div>\n\n                          <div class="xl-font" style="margin: 10px 0;">{{ machine.name | uppercase }}</div>\n\n                          <div class="md-font">{{ costCard | number: \'1.2-2\' }} &euro;</div>\n\n                        </div>\n\n                      </div>\n\n                    </div>\n\n                  </div>\n\n                </div>\n\n              </ion-row>\n\n              <ion-row>\n\n                <ion-col>\n\n                  <div class="centered md-font" style="margin: 16px 0 10px 0;">{{ \'SELECT_DURATION_MSG\' | translate }}\n\n                  </div>\n\n                  <div class="table">\n\n                    <div class="table-cell" style="width: 55px;">\n\n                      <img class="centered-img" [src]="minusImg" (click)="updateDuration(\'decrement\')" />\n\n                    </div>\n\n                    <div class="table-cell" style="width: 15px;"></div>\n\n                    <div class="table-cell card-balance-box">\n\n                      <div class="centered md-font black">{{ duration }}  {{ \'MIN\' | translate }}</div>\n\n                    </div>\n\n                    <div class="table-cell" style="width: 15px;"></div>\n\n                    <div class="table-cell" style="width: 55px;">\n\n                      <img class="centered-img" [src]="plusImg" (click)="updateDuration(\'increment\')" />\n\n                    </div>\n\n                  </div>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <!-- Footer section. -->\n\n    <div class="table-row">\n\n      <div class="table-cell" style="height: 1px;">\n\n        <button class="md-btn transparent" ion-button block outline color="white" (click)="submit()">\n\n          <div class="xl-font">{{ \'PAY\' | translate | uppercase }}</div>\n\n        </button>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n  '/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\select-program\select-program.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_orders_orders__["a" /* OrdersProvider */],
            __WEBPACK_IMPORTED_MODULE_7__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__providers_machines_machines__["a" /* MachinesProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_diagnostic__["a" /* Diagnostic */],
            __WEBPACK_IMPORTED_MODULE_10__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], SelectProgramPage);
    return SelectProgramPage;
}());

//# sourceMappingURL=select-program.js.map

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermsConditionsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_washstation_info_washstation_info__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TermsConditionsPage = /** @class */ (function () {
    function TermsConditionsPage(viewCtrl, washstationInfo) {
        this.viewCtrl = viewCtrl;
        this.washstationInfo = washstationInfo;
    }
    TermsConditionsPage.prototype.close = function () { this.viewCtrl.dismiss(false); };
    TermsConditionsPage.prototype.accept = function () { this.viewCtrl.dismiss(true); };
    TermsConditionsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-terms-conditions',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\terms-conditions\terms-conditions.html"*/'<ion-header>\n\n  <ion-navbar color="light-grey">\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (click)="close()">\n\n        <ion-icon class="close-icon" name="ios-close-outline"></ion-icon>\n\n      </button>\n\n    </ion-buttons>   	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="title">{{ \'TERMS_CONDITION_TITLE\' | translate }}</div>\n\n\n\n  <div *ngIf="washstationInfo.termsObj.length <= 0" style="height: 50%; overflow: auto;">\n\n    <div id="no-terms-found">{{ \'TERMS_AND_COND_NOT_FOUND\' | translate }}</div>\n\n  </div>\n\n  <div *ngIf="washstationInfo.termsObj.length > 0">\n\n    <div *ngFor="let entry of washstationInfo.termsObj">\n\n      <div class="subtitle">{{ entry.section }}</div>\n\n      <p *ngFor="let item of entry.content" [ngClass]="{ \'item\': item.type === \'item\', \'sub-item\': item.type === \'sub-item\' }">{{ item.value }}</p>\n\n    </div>\n\n\n\n    <img style="width: 70%;margin-top: 10px;margin-bottom: 5px;" src="assets/imgs/payment.png">  \n\n  </div>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\terms-conditions\terms-conditions.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */]])
    ], TermsConditionsPage);
    return TermsConditionsPage;
}());

//# sourceMappingURL=terms-conditions.js.map

/***/ }),

/***/ 201:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 201;

/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackendApiProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_jwt__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BackendApiProvider = /** @class */ (function () {
    // baseUrl: string = 'https://lma-prod-backend-test.azurewebsites.net/lma/api/v1.0/';
    // baseUrl: string = 'http://localhost:3550/lma/api/v1.0/';
    function BackendApiProvider(http, authHttp) {
        this.http = http;
        this.authHttp = authHttp;
        this.baseUrl = 'https://api.washstation.pt/lma/api/v1.0/';
    }
    BackendApiProvider.prototype.getWashstationInfo = function () {
        return this.http.get(this.baseUrl + 'washstation/getinfo')
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.authenticate = function (email, password) {
        var body = {
            username: email,
            password: password,
        };
        return this.http.post(this.baseUrl + 'auth/local/app', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err); });
    };
    BackendApiProvider.prototype.getAllLaundries = function () {
        return this.authHttp.get(this.baseUrl + 'laundry/getalllaundriesapp')
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.getNearbyLaundries = function (lng, lat, distance) {
        var body = {
            lng: lng,
            lat: lat,
            distance: distance,
        };
        return this.authHttp.post(this.baseUrl + 'laundry/getlaundriesinarea', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.searchLaundries = function (searchTerm) {
        var body = {
            searchTerm: searchTerm,
        };
        return this.authHttp.post(this.baseUrl + 'laundry/getlaundriesby', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    // MACHINE SERVICES ---------------------------------------------------------------------------------------
    BackendApiProvider.prototype.getMachinesConfigs = function (LaundryId, type) {
        var body = {
            laundry_laundryId: LaundryId,
            type: type,
        };
        return this.authHttp.post(this.baseUrl + 'laundry/machine/getmachine', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.getPrograms = function (laundryId) {
        var body = {
            laundry_laundryId: laundryId,
            allPrograms: true,
        };
        return this.authHttp.post(this.baseUrl + 'machineprogram/getmachineprogram', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    // USER SERVICES ---------------------------------------------------------------------------------------
    BackendApiProvider.prototype.createUser = function (name, email, password) {
        var body = {
            name: name,
            email: email,
            password: password,
        };
        return this.http.post(this.baseUrl + 'users/createuserapp', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.changePassword = function (oldPassword, newPassword) {
        var body = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        return this.authHttp.post(this.baseUrl + 'users/changepassword', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.activateAccount = function (activationToken) {
        var body = {
            activationToken: activationToken,
        };
        return this.http.post(this.baseUrl + 'auth/local/activation', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.getUserDetails = function (userId) {
        var body = {
            userId: userId,
            app: true,
        };
        return this.authHttp.post(this.baseUrl + 'users/getuserdetailsbyid', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.updateUserDetails = function (userId, addressId, name, nif, mobile, birthday, gender, addrObj) {
        var body = {
            userId: userId,
            name: name,
            nif: nif,
            sex: gender,
            birthDate: birthday,
            address: {
                addressId: addressId,
                addressLine1: addrObj.addressLine1,
                city: addrObj.city,
                country: addrObj.country,
                postalCode: addrObj.postalCode,
                mobileNumber: mobile,
            }
        };
        return this.authHttp.post(this.baseUrl + 'users/updateuser', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.forgotPassword = function (email) {
        var body = {
            email: email
        };
        return this.http.post(this.baseUrl + 'auth/local/forgotpassword', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.recoverAccount = function (token, password) {
        var body = {
            token: token,
            password: password
        };
        return this.http.post(this.baseUrl + 'auth/local/reset', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    // USER SERVICES ---------------------------------------------------------------------------------------
    BackendApiProvider.prototype.setOrders = function (body) {
        return this.authHttp.post(this.baseUrl + 'orders/neworderapp', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.getMyOrders = function (offset, limit) {
        if (offset === void 0) { offset = 0; }
        if (limit === void 0) { limit = 10; }
        var body = {
            limit: limit,
            offset: offset,
        };
        return this.authHttp.post(this.baseUrl + 'orders/getallmyorders', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    // PAYMENT SERVICES ------------------------------------------------------------------------------------
    BackendApiProvider.prototype.setPaymentRequest = function (userId, amount, lang) {
        if (lang === void 0) { lang = 'PT'; }
        var body = {
            userId: userId,
            val: amount,
            lang: lang,
        };
        return this.authHttp.post(this.baseUrl + 'payments/receivepaymentapp', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider.prototype.setPaypalPaymentRequest = function (userId, paypalObj) {
        var body = {
            userId: userId,
            paypalObj: paypalObj,
        };
        return this.authHttp.post(this.baseUrl + 'paymentpaypal/receivepaymentapp', body)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].throw(err.json()); });
    };
    BackendApiProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["Http"],
            __WEBPACK_IMPORTED_MODULE_1_angular2_jwt__["AuthHttp"]])
    ], BackendApiProvider);
    return BackendApiProvider;
}());

//# sourceMappingURL=backend-api.js.map

/***/ }),

/***/ 245:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 245;

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UtilsProvider = /** @class */ (function () {
    function UtilsProvider(toastCtrl, translate) {
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.pageSubj = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Subject"]();
        this.menuSubj = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Subject"]();
    }
    UtilsProvider.prototype.presentToast = function (toastMsg, cssClass, params, isError, duration) {
        if (params === void 0) { params = null; }
        if (isError === void 0) { isError = false; }
        if (duration === void 0) { duration = 3000; }
        if (isError) {
            var toast = this.toastCtrl.create({
                message: (params) ? this.translate.instant(toastMsg, params) : this.translate.instant(toastMsg),
                cssClass: cssClass,
                showCloseButton: true,
                closeButtonText: this.translate.instant('CLOSE'),
                position: 'top',
            });
            toast.present();
            return toast;
        }
        else {
            var toast = this.toastCtrl.create({
                message: (params) ? this.translate.instant(toastMsg, params) : this.translate.instant(toastMsg),
                cssClass: cssClass,
                duration: duration,
                position: 'top',
            });
            toast.present();
            return toast;
        }
    };
    UtilsProvider.prototype.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };
    UtilsProvider.prototype.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    UtilsProvider.prototype.getPageEv = function () {
        return this.pageSubj.asObservable();
    };
    UtilsProvider.prototype.setPage = function (pageTitle) {
        this.pageSubj.next(pageTitle);
    };
    UtilsProvider.prototype.isObject = function (obj) {
        return ((typeof obj === "object") && (obj !== null));
    };
    UtilsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */]])
    ], UtilsProvider);
    return UtilsProvider;
}());

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserSessionProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserSessionProvider = /** @class */ (function () {
    function UserSessionProvider() {
        var _this = this;
        this.storage = new __WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */]({});
        this.langSubj = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Subject"]();
        this.id = "";
        this.roleId = "";
        this.roleIdUser = "";
        this.balance = 0;
        this.isAuth = false;
        this.cardId = "";
        this.selectedLang = "";
        this.name = "";
        this.email = "";
        this.nif = "";
        this.mobileContact = "";
        this.birthday = "";
        this.gender = "";
        this.address = "";
        this.paymentRef = "";
        this.lat = 0;
        this.lng = 0;
        this.storage.get('userId').then(function (userId) { if (userId)
            _this.id = userId; });
        this.storage.get('name').then(function (name) { if (name)
            _this.name = name; });
    }
    UserSessionProvider.prototype.setSessionAttr = function (decodedJWT) {
        this.name = decodedJWT.name;
        this.id = decodedJWT.id;
        this.roleId = decodedJWT.roleId;
        this.roleIdUser = decodedJWT.roleIdUser;
    };
    UserSessionProvider.prototype.setSelectedLang = function (lang) {
        this.selectedLang = lang;
        this.storage.set('selectedLang', lang);
        this.langSubj.next(lang);
    };
    UserSessionProvider.prototype.getUsername = function () { return this.name; };
    UserSessionProvider.prototype.getLangEv = function () {
        return this.langSubj.asObservable();
    };
    UserSessionProvider.prototype.logout = function () {
        var _this = this;
        this.storage.clear().then(function () {
            _this.name = "";
            _this.id = "";
            _this.roleId = "";
            _this.roleIdUser = "";
            _this.balance = 0;
            _this.isAuth = false;
            _this.cardId = "";
            _this.nif = "";
            _this.email = "";
            _this.mobileContact = "";
            _this.birthday = "";
            _this.gender = "";
            _this.address = "";
            _this.lat = 0;
            _this.lng = 0;
            _this.paymentRef = "";
        });
    };
    UserSessionProvider.prototype.isUserProfileComplete = function () {
        if (!this.name || this.name === '' ||
            !this.address.addressLine1 || this.address.addressLine1 === '' ||
            !this.address.city || this.address.city === '' ||
            !this.address.postalCode || this.address.postalCode === '' ||
            !this.address.country || this.address.country === '') {
            return false;
        }
        else {
            return true;
        }
    };
    UserSessionProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], UserSessionProvider);
    return UserSessionProvider;
}());

//# sourceMappingURL=user-session.js.map

/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_jwt__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tabs_tabs__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__register_register__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__forgot_password_forgot_password__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var LoginPage = /** @class */ (function () {
    function LoginPage(platform, geolocation, navCtrl, backendApi, utils, formBuilder, ngProgress, menu, userSession, middlewareCloud) {
        this.platform = platform;
        this.geolocation = geolocation;
        this.navCtrl = navCtrl;
        this.backendApi = backendApi;
        this.utils = utils;
        this.formBuilder = formBuilder;
        this.ngProgress = ngProgress;
        this.menu = menu;
        this.userSession = userSession;
        this.middlewareCloud = middlewareCloud;
        this.loginSubmitAttempt = false;
        this.storage = new __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]({});
        this.jwtHelper = new __WEBPACK_IMPORTED_MODULE_5_angular2_jwt__["JwtHelper"]();
        this.btnEnabled = true;
        this.isAuth = true;
        this.geoOptions = {
            timeout: 5000,
            enableHighAccuracy: true,
        };
        this.loginForm = formBuilder.group({
            username: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    }
    LoginPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.clearPasswordField();
        this.storage.get('id_token').then(function (token) {
            if (token && !_this.jwtHelper.isTokenExpired(token)) {
                _this.getUserDetails();
            }
            else {
                _this.isAuth = false;
            }
        });
        this.initializeBackButtonCustomHandler();
        this.menu.swipeEnable(false);
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        this.menu.swipeEnable(true);
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    };
    LoginPage.prototype.initializeBackButtonCustomHandler = function () {
        this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function (e) { }, 101);
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.loginSubmitAttempt = true;
        setTimeout(function () { _this.loginSubmitAttempt = false; }, 2500);
        if (!this.btnEnabled || !this.loginForm.valid)
            return;
        this.btnEnabled = false;
        this.ngProgress.start();
        this.backendApi.authenticate(this.loginForm.value.username, this.loginForm.value.password).subscribe(function (res) {
            if (res.hasOwnProperty('success') && !res.success) {
                _this.ngProgress.done();
                _this.utils.presentToast(res.msg, 'toast-error');
            }
            else {
                _this.storage.set('id_token', res.token).then(function () {
                    _this.userSession.setSessionAttr(_this.jwtHelper.decodeToken(res.token));
                    _this.getUserDetails();
                });
            }
        }, function (err) {
            _this.ngProgress.done();
            if (err.hasOwnProperty('status') && err.status === 401) {
                _this.utils.presentToast('LOGIN_WRONG_CREDENTIALS', 'toast-error');
                _this.clearPasswordField();
            }
            else {
                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
            }
            _this.btnEnabled = true;
        });
    };
    LoginPage.prototype.getUserDetails = function () {
        var _this = this;
        this.backendApi.getUserDetails(this.userSession.id).subscribe(function (res) {
            if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
                var appCard = res.cards.find(function (el) { return (el.type === 'APP'); });
                _this.userSession.balance = Number(appCard.balance);
                _this.userSession.cardId = appCard.cardId;
            }
            if (res.hasOwnProperty('paymentsRequests') && Array.isArray(res.paymentsRequests) && res.paymentsRequests.length > 0 && res.paymentsRequests[0].ep_status && res.paymentsRequests[0].ep_status.indexOf('err') === -1) {
                _this.userSession.paymentRef = res.paymentsRequests[0];
                _this.userSession.paymentRef.ep_date = new Date(_this.userSession.paymentRef.ep_date);
            }
            else {
                _this.userSession.paymentRef = null;
            }
            _this.userSession.email = res.email;
            _this.userSession.nif = res.nif;
            _this.userSession.mobileContact = res.address.mobileNumber;
            _this.userSession.birthday = res.birthDate;
            _this.userSession.gender = res.sex;
            _this.userSession.address = res.address;
            _this.storage.set('userId', _this.userSession.id);
            _this.storage.set('name', _this.userSession.name);
            _this.userSession.isAuth = true;
            _this.geolocation.getCurrentPosition(_this.geoOptions).then(function (position) {
                _this.userSession.lat = position.coords.latitude;
                _this.userSession.lng = position.coords.longitude;
                _this.ngProgress.done();
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__tabs_tabs__["a" /* TabsPage */], null, { animate: true, direction: 'forward' });
            }).catch(function (err) {
                _this.ngProgress.done();
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__tabs_tabs__["a" /* TabsPage */], null, { animate: true, direction: 'forward' });
            });
            _this.middlewareCloud.connect(_this.userSession.id);
        }, function (err) {
            _this.ngProgress.done();
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    LoginPage.prototype.clearPasswordField = function () {
        var username = this.loginForm.value.username;
        this.loginForm.reset();
        this.loginForm = this.formBuilder.group({
            username: [username, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    };
    LoginPage.prototype.register = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__register_register__["a" /* RegisterPage */]);
    };
    LoginPage.prototype.forgotPassword = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__forgot_password_forgot_password__["a" /* ForgotPasswordPage */]);
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\login\login.html"*/'<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding no-bounce class="background" style="position: relative;">\n\n  <div class="vh-align-container">\n\n    <div class="vh-align-content">\n\n      <img src="assets/imgs/logo.png" />\n\n      <div *ngIf="!isAuth">\n\n        <form [formGroup]="loginForm" style="margin-top: 0px; margin-bottom: 30px;">\n\n          <ion-item color="white" [class.invalid]="!loginForm.controls.username.valid && loginSubmitAttempt">\n\n            <ion-label floating>{{ \'LOGIN_EMAIL_LABEL\' | translate }}</ion-label>\n\n            <ion-input formControlName="username" type="text" (keyup.enter)="login()"></ion-input>\n\n          </ion-item>\n\n          <ion-item [class.invalid]="!loginForm.controls.password.valid && loginSubmitAttempt">\n\n            <ion-label floating>{{ \'LOGIN_PASSWORD_LABEL\' | translate }}</ion-label>\n\n            <ion-input formControlName="password" type="password" (keyup.enter)="login()"></ion-input>\n\n          </ion-item>\n\n        </form>\n\n        <!-- Buttons section. -->\n\n        <button class="login-btn btn-border" ion-button block full color="navbar" (click)="login()">{{ \'LOGIN_SUBMIT_BUTTON\' | translate | uppercase }}</button>\n\n        <button class="btn-no-border" ion-button block full outline color="navbar" (click)="register()" style="border: none;">{{ \'REGISTER_BUTTON\' | translate | uppercase }}</button>\n\n        <div class="forgot-pass"><a (click)="forgotPassword()" style="text-decoration: underline;">{{ \'FORGOT_PASSWORD\' | translate }}</a></div>\n\n      </div>\n\n      <div *ngIf="isAuth">\n\n        <ion-spinner name="ios"></ion-spinner>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_10__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_12__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_6_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_11__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_13__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_main__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profile_profile__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__payment_methods_payment_methods__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__settings_settings__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__order_history_order_history__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__about_about__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var TabsPage = /** @class */ (function () {
    function TabsPage(utils) {
        var _this = this;
        this.utils = utils;
        this.pageSubs = null;
        this.pages = [
            { title: 'WASHSTATION', component: __WEBPACK_IMPORTED_MODULE_2__main_main__["a" /* MainPage */], icon: 'ios-map-outline' },
            { title: 'PROFILE', component: __WEBPACK_IMPORTED_MODULE_3__profile_profile__["a" /* ProfilePage */], icon: 'ios-contact' },
            { title: 'RECHARGE', component: __WEBPACK_IMPORTED_MODULE_4__payment_methods_payment_methods__["a" /* PaymentMethodsPage */], icon: 'ios-card' },
            { title: 'SETTINGS', component: __WEBPACK_IMPORTED_MODULE_5__settings_settings__["a" /* SettingsPage */], icon: 'ios-settings' },
            { title: 'ORDERS_HISTORY', component: __WEBPACK_IMPORTED_MODULE_6__order_history_order_history__["a" /* OrderHistoryPage */], icon: 'ios-list-box-outline' },
            { title: 'ABOUT', component: __WEBPACK_IMPORTED_MODULE_7__about_about__["a" /* AboutPage */], icon: 'ios-information-circle-outline' },
        ];
        this.pageSubs = this.utils.getPageEv().subscribe(function (title) {
            _this.tabRef.select(_this.pages.findIndex(function (el) { return (el.title === title); }));
        });
    }
    TabsPage.prototype.ngOnDestroy = function () {
        if (this.pageSubs)
            this.pageSubs.unsubscribe();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('appTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-tabs',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\tabs\tabs.html"*/'<ion-content id="tabs-content">\n\n  <ion-tabs #appTabs color="navbar">\n\n    <ion-tab *ngFor="let page of pages" [root]="page.component"></ion-tab>\n\n  </ion-tabs>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\tabs\tabs.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__["a" /* UtilsProvider */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vending_machine_app_vending_machine_app__ = __webpack_require__(404);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__laundry_details_laundry_details__ = __webpack_require__(418);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_laundry_autocomplete_laundry_autocomplete__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_washstation_info_washstation_info__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var MainPage = /** @class */ (function () {
    function MainPage(navCtrl, modalCtrl, geolocation, userSession, ngProgress, utils, translate, alertCtrl, wsInfo, autoComplete, backendApi) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.geolocation = geolocation;
        this.userSession = userSession;
        this.ngProgress = ngProgress;
        this.utils = utils;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.wsInfo = wsInfo;
        this.autoComplete = autoComplete;
        this.backendApi = backendApi;
        this.watchSubs = null;
        this.modal = null;
        this.map = null;
        this.mapDraggable = true;
        this.hasPosition = false;
        this.searchPlc = null;
        // refreshTranslate: boolean = true;
        this.laundries = [];
        this.zoom = 7;
        this.lat = null;
        this.lng = null;
        this.mapLat = 39.7681878;
        this.mapLng = -8.2464266;
        this.geoOptions = {
            timeout: 5000,
            enableHighAccuracy: true,
        };
        this.searchPlc = { placeholder: this.translate.instant('LAUNDRY_SEARCH') };
        this.userSession.getLangEv().subscribe(function (res) {
            setTimeout(function () { _this.searchPlc = { placeholder: _this.translate.instant('LAUNDRY_SEARCH') }; });
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
        this.watchSubs = this.geolocation.watchPosition(this.geoOptions).subscribe(function (position) {
            if (position.coords && position.coords.latitude && position.coords.longitude) {
                _this.lat = position.coords.latitude;
                _this.lng = position.coords.longitude;
                _this.userSession.lat = position.coords.latitude;
                _this.userSession.lng = position.coords.longitude;
                if (!_this.hasPosition) {
                    _this.zoom = 15;
                    _this.mapLat = position.coords.latitude;
                    _this.mapLng = position.coords.longitude;
                }
                _this.hasPosition = true;
            }
        });
    }
    MainPage.prototype.ionViewDidEnter = function () {
        this.getLaundries();
    };
    MainPage.prototype.ngOnDestroy = function () {
        if (this.watchSubs)
            this.watchSubs.unsubscribe();
    };
    MainPage.prototype.menuClicked = function () {
        if (this.modal)
            this.modal.dismiss();
    };
    MainPage.prototype.getLaundries = function () {
        var _this = this;
        if (this.laundries.length === 0)
            this.ngProgress.start();
        this.backendApi.getAllLaundries().subscribe(function (res) {
            var laundries = [];
            res.forEach(function (el) {
                el.lat = Number(el.lat);
                el.lng = Number(el.lng);
                el['name'] = el.laundries[0].name;
                el['autocompleteLabel'] = el.laundries[0].name + ', ' + el.addressLine1 + ', ' + el.postalCode + ', ' + el.city;
                laundries.push(el);
            });
            _this.autoComplete.laundries = laundries;
            _this.laundries = laundries;
            _this.userSession.isAuth = true;
            _this.ngProgress.done();
        }, function (err) {
            _this.ngProgress.done();
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    MainPage.prototype.mapReady = function (map) {
        this.map = map;
    };
    MainPage.prototype.goToMyLocation = function () {
        this.map.panTo({ lat: this.lat, lng: this.lng });
    };
    MainPage.prototype.zoomIn = function () {
        if (this.zoom < 23)
            this.zoom = this.zoom + 1;
    };
    MainPage.prototype.zoomOut = function () {
        if (this.zoom > 1)
            this.zoom = this.zoom - 1;
    };
    MainPage.prototype.laundrySelected = function (e) {
        var _this = this;
        if (!this.map)
            return;
        if (e.lat && e.lng) {
            this.map.panTo({ lat: e.lat, lng: e.lng });
            var laundry_1 = this.laundries.find(function (el) { return (el.laundries[0].laundryId === e.laundries[0].laundryId); });
            setTimeout(function () { _this.goToVendingApp(laundry_1); }, 500);
        }
    };
    MainPage.prototype.closeModal = function () {
        if (this.modal)
            this.modal.dismiss(false);
    };
    MainPage.prototype.goToVendingApp = function (laundry) {
        var _this = this;
        if (this.modal)
            return;
        this.modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__laundry_details_laundry_details__["a" /* LaundryDetailsPage */], { laundry: laundry }, { cssClass: 'laundry-modal' });
        this.modal.onDidDismiss(function (res) {
            if (res)
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__vending_machine_app_vending_machine_app__["a" /* VendingMachineAppPage */], { laundry: laundry });
            _this.modal = null;
        });
        setTimeout(function () { _this.modal.present(); }, 10);
    };
    MainPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-main',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\main\main.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle (click)="menuClicked()">\n\n        <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>WashStation</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons>   	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content style="position: relative;" (click)="closeModal()">\n\n  <ng-template  #searchTemplate let-attrs="attrs">\n\n    <div class="title">{{ attrs.data.name }}</div>\n\n    <div class="subtitle">{{ attrs.data.addressLine1 }}, {{ attrs.data.postalCode }}, {{ attrs.data.city }}</div>\n\n  </ng-template>\n\n  <ion-auto-complete [dataProvider]="autoComplete" [template]="searchTemplate" [options]="searchPlc" (itemSelected)="laundrySelected($event)" style="top: 10px; border-radius: 12px; width: 95%; left: 2.5%; position: absolute; z-index: 1;"></ion-auto-complete>\n\n\n\n  <div id="zoom-container">\n\n    <button class="zoom-in-btn" (click)="zoomIn()">\n\n      <ion-icon name="ios-add-outline"></ion-icon>\n\n    </button>\n\n    <div class="separator"></div>\n\n    <button class="zoom-out-btn" (click)="zoomOut()">\n\n      <ion-icon name="ios-remove-outline"></ion-icon>\n\n    </button>\n\n  </div>\n\n\n\n  <button id="my-location-btn-search" (click)="goToMyLocation()">\n\n    <ion-icon name="ios-locate-outline"></ion-icon>\n\n  </button>\n\n\n\n  <!-- Map -->\n\n  <agm-map id="map-search" [latitude]="mapLat" [longitude]="mapLng" [zoom]="zoom" [zoomControl]="false" [mapDraggable]="mapDraggable" [streetViewControl]="false" [zoomControl]="true" [clickableIcons]="false" (mapReady)="mapReady($event)">\n\n    <agm-marker *ngIf="hasPosition" [zIndex]="0" [latitude]="lat" [longitude]="lng" [iconUrl]=\'{"url": "assets/imgs/my-location-icon.png","scaledSize": {"height": 100, "width": 100},"anchor": {"x": 50, "y": 50}}\'></agm-marker>\n\n    <agm-marker *ngFor="let laundry of laundries" [latitude]="laundry.lat" [longitude]="laundry.lng" [iconUrl]=\'{"url": "assets/imgs/pin-washstation.png","scaledSize": {"height": 50, "width": 50}}\' (markerClick)="goToVendingApp(laundry, true)"></agm-marker>\n\n  </agm-map>\n\n</ion-content>\n\n  '/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\main\main.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_7__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_9__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_11__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
            __WEBPACK_IMPORTED_MODULE_10__providers_laundry_autocomplete_laundry_autocomplete__["a" /* LaundryAutocompleteProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_backend_api_backend_api__["a" /* BackendApiProvider */]])
    ], MainPage);
    return MainPage;
}());

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VendingMachineAppPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_machines_machines__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_orders_orders__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__drying_drying__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__washing_washing__ = __webpack_require__(417);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var VendingMachineAppPage = /** @class */ (function () {
    function VendingMachineAppPage(navCtrl, navParams, machines, orders, userSession, middlewareCloud) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.machines = machines;
        this.orders = orders;
        this.userSession = userSession;
        this.middlewareCloud = middlewareCloud;
        this.pageName = 'VendingMachineAppPage';
        this.wasMachineImg = 'assets/imgs/icon_maquina_lavar.png';
        this.dryMachineImg = 'assets/imgs/icon_maquina_secar.png';
        this.laundry = null;
        this.laundry = this.navParams.data.laundry;
        if (this.laundry)
            this.middlewareCloud.subscribeLaundry(this.laundry.laundries[0].laundryId);
        this.machines.getMachines(this.laundry.laundries[0].laundryId);
    }
    VendingMachineAppPage.prototype.goToWashingMenu = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__washing_washing__["a" /* WashingPage */], {
            wasMachines: this.machines.getWasMachines(),
            programs: this.machines.getPrograms('WASH'),
            laundryId: this.laundry.laundries[0].laundryId,
            laundry: this.laundry,
        });
    };
    VendingMachineAppPage.prototype.goToDryingMenu = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__drying_drying__["a" /* DryingPage */], {
            dryMachines: this.machines.getDryMachines(),
            programs: this.machines.getPrograms('DRY'),
            laundryId: this.laundry.laundries[0].laundryId,
            laundry: this.laundry,
        });
    };
    VendingMachineAppPage.prototype.ngOnDestroy = function () {
        this.orders.reset();
        this.middlewareCloud.unsubscribeLaundry(this.laundry.laundries[0].laundryId);
    };
    VendingMachineAppPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-vending-machine-app',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\vending-machine-app\vending-machine-app.html"*/'<ion-header>\n\n  <ion-navbar color="dark-navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ laundry.laundries[0].name }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons> 	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="backgnd">\n\n\n\n\n\n\n\n  <ion-grid no-padding class="menu-container">\n\n    <ion-row class="row-btn">\n\n      <ion-col>\n\n        <button class="menu-btn" ion-button block outline (click)="goToWashingMenu()">\n\n          <div class="table">\n\n            <div class="table-row">\n\n              <div class="table-cell">\n\n                <img class="btn-img" [src]="wasMachineImg" />\n\n              </div>\n\n            </div>\n\n            <div class="table-row" style="height: 16px;"></div>            \n\n            <div class="table-row">\n\n              <div class="table-cell">\n\n                  <div class="xl-font">{{ \'WASHING\' | translate | uppercase }}</div>\n\n              </div>\n\n            </div>\n\n          </div>\n\n        </button>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row style="height: 16px;"></ion-row>\n\n    <ion-row  class="row-btn">\n\n      <ion-col>\n\n        <button class="menu-btn" ion-button block outline (click)="goToDryingMenu()">\n\n          <div class="table">\n\n            <div class="table-row">\n\n              <div class="table-cell">\n\n                <img class="btn-img" [src]="dryMachineImg" />\n\n              </div>\n\n            </div>\n\n            <div class="table-row" style="height: 16px;"></div>                        \n\n            <div class="table-row">\n\n              <div class="table-cell">\n\n                  <div class="xl-font">{{ \'DRYING\' | translate | uppercase }}</div>\n\n              </div>\n\n            </div>\n\n          </div>\n\n        </button>\n\n      </ion-col>      \n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n\n\n  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\vending-machine-app\vending-machine-app.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_machines_machines__["a" /* MachinesProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_orders_orders__["a" /* OrdersProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */]])
    ], VendingMachineAppPage);
    return VendingMachineAppPage;
}());

//# sourceMappingURL=vending-machine-app.js.map

/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DryingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__select_program_select_program__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_machines_machines__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_orders_orders__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DryingPage = /** @class */ (function () {
    function DryingPage(navCtrl, navParams, userSession, orders, middlewareCloud, machines) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userSession = userSession;
        this.orders = orders;
        this.middlewareCloud = middlewareCloud;
        this.machines = machines;
        this.dryMachineImgs = [
            'assets/imgs/S1.png',
            'assets/imgs/S2.png',
            'assets/imgs/S3.png',
            'assets/imgs/S4.png',
        ];
        this.animationInd = 0;
        this.dryMachineImg = this.dryMachineImgs[this.animationInd];
        this.dryMachineStaticImg = this.dryMachineImgs[0];
        this.dryMachines = [];
        this.programs = [];
        this.middleSubs = null;
        this.timer = null;
        this.statusReqTimeout = 20 * 1000;
        this.dryMachines = this.navParams.data.dryMachines;
        this.programs = this.navParams.data.programs;
        this.middleSubs = this.middlewareCloud.getPkg().subscribe(function (pkg) {
            if (typeof pkg === 'object') {
                if (!pkg.hasOwnProperty('code')) {
                    switch (pkg.op) {
                        case 'status_int':
                            if (pkg.hasOwnProperty('dev'))
                                _this.setStatus(pkg.dev);
                            break;
                        case 'machine-started':
                        case 'door-opened':
                            _this.middlewareCloud.send({ op: 'status_int' });
                            break;
                    }
                }
            }
        });
        this.statusReq();
        this.animateMachine();
    }
    DryingPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
        if (this.middleSubs)
            this.middleSubs.unsubscribe();
    };
    DryingPage.prototype.getStatusClass = function (dryMachine, type) {
        switch (dryMachine.status) {
            case 'ISSUE':
                return (type === 'machine') ? 'machine-issue' : 'machine-index-issue';
            case 'NOK':
                return (type === 'machine') ? 'machine-n-ok' : 'machine-index-n-ok';
            case 'OK':
            case 'RES':
                return (type === 'machine') ? 'machine-ok' : 'machine-index-ok';
        }
    };
    DryingPage.prototype.selectProgram = function (dryMachine) {
        if (dryMachine.status === 'NOK' || dryMachine.status === 'ISSUE')
            return;
        var modalArgs = {
            machine: dryMachine,
            // programs: this.programs.filter(el => (el.program.capacity === dryMachine.config.capacity)),
            programs: this.programs.filter(function (el) { return (el.machine_machineId === dryMachine.machineId); }),
            type: 'drying-machine',
            img: this.dryMachineImg,
            laundryId: this.navParams.data.laundryId,
            laundry: this.navParams.data.laundry
        };
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__select_program_select_program__["a" /* SelectProgramPage */], modalArgs);
    };
    DryingPage.prototype.setStatus = function (status) {
        var newStatusObj = null;
        var len = null;
        this.dryMachines.forEach(function (el1) {
            newStatusObj = status.find(function (el2) { return (el1.hasOwnProperty('config') && el2.id === el1.config.intId); });
            if (newStatusObj) {
                len = newStatusObj.status.length;
                var auxValue = (el1.hasOwnProperty('config') && el1.config.activation === 'high') ? '1' : '0';
                if (newStatusObj.active === '1') {
                    if (newStatusObj.status[len - Number(el1.peripheral_has_machines[0].channel)] === auxValue) {
                        // Machine working.
                        el1.status = 'NOK';
                    }
                    else {
                        // Machine idle.
                        el1.status = 'OK';
                    }
                }
                else {
                    // Disconnected interface.
                    el1.status = 'ISSUE';
                }
            }
            else {
                el1.status = 'ISSUE';
            }
        });
    };
    DryingPage.prototype.statusReq = function () {
        var _this = this;
        var pkg = { op: 'status_int' };
        this.middlewareCloud.send(pkg);
        this.timer = setTimeout(function () { _this.statusReq(); }, this.statusReqTimeout);
    };
    DryingPage.prototype.animateMachine = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.animationInd === _this.dryMachineImgs.length - 1) {
                _this.animationInd = 0;
            }
            else {
                _this.animationInd++;
            }
            _this.dryMachineImg = _this.dryMachineImgs[_this.animationInd];
            _this.animateMachine();
        }, 700);
    };
    DryingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-drying',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\drying\drying.html"*/'<ion-header>\n\n  <ion-navbar color="dark-navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'DRYING\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons> 	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="backgnd">\n\n  <div class="machine-btn" *ngFor="let dryMachine of dryMachines;" [ngClass]="getStatusClass(dryMachine, \'machine\')" (click)="selectProgram(dryMachine)">\n\n    <div class="table" style="height: 100%;">\n\n      <!-- Machine index. -->\n\n      <div class="table-cell centered" style="width: 60px;">\n\n        <div class="index-font" [ngClass]="getStatusClass(dryMachine, \'index\')">{{ dryMachine.index }}</div>\n\n      </div>\n\n      <!-- Machine image. -->\n\n      <div class="table-cell" style="width: 70px;">\n\n        <img *ngIf="dryMachine.status !== \'NOK\'" class="centered-img" [src]="dryMachineStaticImg" style="height: 65px;"/>\n\n        <img *ngIf="dryMachine.status === \'NOK\'" class="centered-img" [src]="dryMachineImg" style="height: 65px;"/>\n\n      </div>\n\n      <!-- Machine description. -->\n\n      <div class="table-cell" style="padding-left: 15px;">\n\n        <div class="md-font">{{ dryMachine.name | uppercase }}</div>\n\n        <div class="sm-font">{{ dryMachine.type | translate }}</div>\n\n        <div class="sm-font">{{ dryMachine.config.capacity }} Kg</div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\drying\drying.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_orders_orders__["a" /* OrdersProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_machines_machines__["a" /* MachinesProvider */]])
    ], DryingPage);
    return DryingPage;
}());

//# sourceMappingURL=drying.js.map

/***/ }),

/***/ 417:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WashingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__select_program_select_program__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_machines_machines__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_orders_orders__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var WashingPage = /** @class */ (function () {
    function WashingPage(navCtrl, navParams, userSession, orders, middlewareCloud, machines) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userSession = userSession;
        this.orders = orders;
        this.middlewareCloud = middlewareCloud;
        this.machines = machines;
        this.wasMachineImgs = [
            'assets/imgs/L1.png',
            'assets/imgs/L2.png',
            'assets/imgs/L3.png',
        ];
        this.animationInd = 0;
        this.wasMachineImg = this.wasMachineImgs[this.animationInd];
        this.wasMachineStaticImg = this.wasMachineImgs[0];
        this.wasMachines = [];
        this.programs = [];
        this.middleSubs = null;
        this.timer = null;
        this.statusReqTimeout = 20 * 1000;
        this.wasMachines = this.navParams.data.wasMachines;
        this.programs = this.navParams.data.programs;
        this.middleSubs = this.middlewareCloud.getPkg().subscribe(function (pkg) {
            if (typeof pkg === 'object') {
                if (!pkg.hasOwnProperty('code')) {
                    switch (pkg.op) {
                        case 'status_int':
                            if (pkg.hasOwnProperty('dev'))
                                _this.setStatus(pkg.dev);
                            break;
                        case 'machine-started':
                        case 'door-opened':
                            _this.middlewareCloud.send({ op: 'status_int' });
                            break;
                    }
                }
            }
        });
        this.statusReq();
        this.animateMachine();
    }
    WashingPage.prototype.ionViewDidEnter = function () {
        this.middlewareCloud.send({ op: 'status_int' });
    };
    WashingPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
        if (this.middleSubs)
            this.middleSubs.unsubscribe();
    };
    WashingPage.prototype.getStatusClass = function (wasMachine, type) {
        switch (wasMachine.status) {
            case 'ISSUE':
                return (type === 'machine') ? 'machine-issue' : 'machine-index-issue';
            case 'NOK':
                return (type === 'machine') ? 'machine-n-ok' : 'machine-index-n-ok';
            case 'OK':
            case 'RES':
                return (type === 'machine') ? 'machine-ok' : 'machine-index-ok';
        }
    };
    WashingPage.prototype.selectProgram = function (wasMachine) {
        if (wasMachine.status === 'NOK' || wasMachine.status === 'ISSUE')
            return;
        var modalArgs = {
            machine: wasMachine,
            programs: this.programs.filter(function (el) { return (el.machine_machineId === wasMachine.machineId); }),
            // programs: this.programs.filter(el => (el.program.capacity === wasMachine.config.capacity)),
            type: 'washing-machine',
            img: this.wasMachineImg,
            laundryId: this.navParams.data.laundryId,
            laundry: this.navParams.data.laundry
        };
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__select_program_select_program__["a" /* SelectProgramPage */], modalArgs);
    };
    WashingPage.prototype.setStatus = function (status) {
        var newStatusObj = null;
        var len = null;
        this.wasMachines.forEach(function (el1) {
            newStatusObj = status.find(function (el2) { return (el1.hasOwnProperty('config') && el2.id === el1.config.intId); });
            if (newStatusObj) {
                len = newStatusObj.status.length;
                var auxValue = (el1.hasOwnProperty('config') && el1.config.activation === 'high') ? '1' : '0';
                if (newStatusObj.active === '1') {
                    if (newStatusObj.status[len - Number(el1.peripheral_has_machines[0].channel)] === auxValue) {
                        // Machine working.
                        el1.status = 'NOK';
                    }
                    else {
                        // Machine idle.
                        el1.status = 'OK';
                    }
                }
                else {
                    // Disconnected interface.
                    el1.status = 'ISSUE';
                }
            }
            else {
                el1.status = 'ISSUE';
            }
        });
    };
    WashingPage.prototype.statusReq = function () {
        var _this = this;
        var pkg = { op: 'status_int' };
        this.middlewareCloud.send(pkg);
        this.timer = setTimeout(function () { _this.statusReq(); }, this.statusReqTimeout);
    };
    WashingPage.prototype.animateMachine = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.animationInd === _this.wasMachineImgs.length - 1) {
                _this.animationInd = 0;
            }
            else {
                _this.animationInd++;
            }
            _this.wasMachineImg = _this.wasMachineImgs[_this.animationInd];
            _this.animateMachine();
        }, 700);
    };
    WashingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-washing',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\washing\washing.html"*/'<ion-header>\n\n  <ion-navbar color="dark-navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'WASHING\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons> 	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="backgnd">\n\n  <div class="machine-btn" *ngFor="let wasMachine of wasMachines;" [ngClass]="getStatusClass(wasMachine, \'machine\')" (click)="selectProgram(wasMachine)">\n\n    <div class="table" style="height: 100%;">\n\n      <!-- Machine index. -->\n\n      <div class="table-cell centered" style="width: 60px;">\n\n        <div class="index-font" [ngClass]="getStatusClass(wasMachine, \'index\')">{{ wasMachine.index }}</div>\n\n      </div>\n\n      <!-- Machine image. -->\n\n      <div class="table-cell" style="width: 70px;">\n\n        <img *ngIf="wasMachine.status !== \'NOK\'" class="centered-img" [src]="wasMachineStaticImg" style="height: 65px;"/>\n\n        <img *ngIf="wasMachine.status === \'NOK\'" class="centered-img" [src]="wasMachineImg" style="height: 65px;"/>\n\n      </div>\n\n      <!-- Machine description. -->\n\n      <div class="table-cell" style="padding-left: 15px;">\n\n        <div class="md-font">{{ wasMachine.name | uppercase }}</div>\n\n        <div class="sm-font">{{ wasMachine.type | translate }}</div>\n\n        <div class="sm-font">{{ wasMachine.config.capacity }} Kg</div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\washing\washing.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_orders_orders__["a" /* OrdersProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_machines_machines__["a" /* MachinesProvider */]])
    ], WashingPage);
    return WashingPage;
}());

//# sourceMappingURL=washing.js.map

/***/ }),

/***/ 418:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LaundryDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(29);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LaundryDetailsPage = /** @class */ (function () {
    function LaundryDetailsPage(navCtrl, navParams, translate, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.translate = translate;
        this.viewCtrl = viewCtrl;
        this.laundry = null;
        this.laundry = this.navParams.get('laundry');
    }
    LaundryDetailsPage.prototype.enterLaundry = function () {
        this.viewCtrl.dismiss(true);
    };
    LaundryDetailsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-laundry-details',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\laundry-details\laundry-details.html"*/'<ion-content style="position: relative;">\n\n  <div class="table container">\n\n    <div class="table-cell">\n\n      <div class="name">{{ laundry.laundries[0].name }}</div>\n\n      <p class="addr">{{ laundry.addressLine1 }}</p>    \n\n      <p class="addr no-margin">{{ laundry.postalCode + \', \' + laundry.city }}</p>    \n\n    </div>\n\n  </div>\n\n  <button class="btn" ion-button block full (click)="enterLaundry()">{{ \'ENTER\' | translate | uppercase }}</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\laundry-details\laundry-details.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
    ], LaundryDetailsPage);
    return LaundryDetailsPage;
}());

//# sourceMappingURL=laundry-details.js.map

/***/ }),

/***/ 419:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LaundryAutocompleteProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LaundryAutocompleteProvider = /** @class */ (function () {
    function LaundryAutocompleteProvider() {
        this.labelAttribute = 'autocompleteLabel';
        this.laundries = [];
    }
    LaundryAutocompleteProvider.prototype.getResults = function (keyword) {
        return this.laundries.filter(function (el) { return (el.autocompleteLabel.toLowerCase().includes(keyword.toLowerCase())); });
    };
    LaundryAutocompleteProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], LaundryAutocompleteProvider);
    return LaundryAutocompleteProvider;
}());

//# sourceMappingURL=laundry-autocomplete.js.map

/***/ }),

/***/ 420:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, navParams, formBuilder, utils, userSession, translate, ngProgress, backendApi) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.utils = utils;
        this.userSession = userSession;
        this.translate = translate;
        this.ngProgress = ngProgress;
        this.backendApi = backendApi;
        this.storage = new __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]({});
        this.userDataSubmitAttempt = false;
        this.userDataBtnEnabled = true;
        this.birthday = null;
        this.gender = null;
        this.birthday = this.userSession.birthday;
        this.gender = this.userSession.gender;
        this.userDataForm = formBuilder.group({
            name: [(this.userSession.name) ? this.userSession.name : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])],
            nif: [(this.userSession.nif) ? this.userSession.nif : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(9), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(9)])],
            mobileContact: [(this.userSession.mobileContact) ? this.userSession.mobileContact : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(9), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(9)])],
            addressLine: [(this.userSession.address.addressLine1) ? this.userSession.address.addressLine1 : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(500)])],
            postalCode: [(this.userSession.address.postalCode) ? this.userSession.address.postalCode : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(8)])],
            city: [(this.userSession.address.city) ? this.userSession.address.city : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(100)])],
            country: [(this.userSession.address.country) ? this.userSession.address.country : '', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(100)])],
        });
    }
    ProfilePage.prototype.submitUserData = function () {
        var _this = this;
        this.userDataSubmitAttempt = true;
        if (!this.userDataBtnEnabled || !this.userDataForm.valid)
            return;
        this.userDataBtnEnabled = false;
        this.ngProgress.start();
        var addrObj = {
            addressLine1: this.userDataForm.value.addressLine,
            city: this.userDataForm.value.city,
            country: this.userDataForm.value.country,
            postalCode: this.userDataForm.value.postalCode,
        };
        this.backendApi.updateUserDetails(this.userSession.id, this.userSession.address.addressId, this.userDataForm.value.name, this.userDataForm.value.nif, this.userDataForm.value.mobileContact, this.birthday, this.gender, addrObj).subscribe(function (res) {
            _this.userSession.name = _this.userDataForm.value.name;
            _this.userSession.nif = _this.userDataForm.value.nif;
            _this.userSession.mobileContact = _this.userDataForm.value.mobileContact;
            _this.userSession.birthday = _this.birthday;
            _this.userSession.gender = _this.gender;
            _this.userSession.address.addressLine1 = _this.userDataForm.value.addressLine;
            _this.userSession.address.postalCode = _this.userDataForm.value.postalCode;
            _this.userSession.address.city = _this.userDataForm.value.city;
            _this.userSession.address.country = _this.userDataForm.value.country;
            _this.storage.set('name', _this.userSession.name);
            _this.ngProgress.done();
            _this.userDataBtnEnabled = true;
            _this.utils.presentToast('PROFILE_SUCCESS_MSG', 'toast-success');
        }, function (err) {
            _this.ngProgress.done();
            _this.userDataBtnEnabled = true;
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-profile',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\profile\profile.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'PROFILE\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n      </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding>\n\n  <ion-item no-lines class="header-item">\n\n    <ion-icon name="ios-contact" item-start style="font-size: 4.5rem;"></ion-icon>\n\n    <h2 class="title">{{ userSession.name }}</h2>\n\n    <p class="subtitle">{{ userSession.email }}</p>\n\n  </ion-item>\n\n\n\n  <ion-list>\n\n    <form [formGroup]="userDataForm" style="margin-top: 0px">\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.name.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'NAME_NAME_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="text" formControlName="name" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.nif.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'NIF_NAME_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="number" formControlName="nif" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.addressLine.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'ADDRESS_LABEL\' | translate }}</ion-label>\n\n        <ion-textarea type="text" formControlName="addressLine" rows="3" (keyup.enter)="submitUserData()"></ion-textarea>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.postalCode.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'POSTAL_CODE_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="text" formControlName="postalCode" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.city.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'CITY_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="text" formControlName="city" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.country.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'COUNTRY_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="text" formControlName="country" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="input-field" [class.invalid]="!userDataForm.controls.mobileContact.valid && userDataSubmitAttempt">\n\n        <ion-label>{{ \'MOBILE_CONTACT_NAME_LABEL\' | translate }}</ion-label>\n\n        <ion-input type="number" formControlName="mobileContact" (keyup.enter)="submitUserData()"></ion-input>\n\n      </ion-item>\n\n      <ion-item style="display: none;"></ion-item>\n\n    </form>\n\n    <ion-item>\n\n      <ion-label>{{ \'BIRTHDAY_NAME_LABEL\' | translate }}</ion-label>\n\n      <ion-datetime displayFormat="DD/MM/YYYY" [(ngModel)]="birthday" [cancelText]="translate.instant(\'CANCEL\')" [doneText]="translate.instant(\'OK\')"></ion-datetime>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label>{{ \'GENDER_NAME_LABEL\' | translate }}</ion-label>\n\n      <ion-select [(ngModel)]="gender">\n\n        <ion-option value="MALE">{{ \'MALE\' | translate }}</ion-option>\n\n        <ion-option value="FEMALE">{{ \'FEMALE\' | translate }}</ion-option>            \n\n      </ion-select>\n\n    </ion-item>\n\n  </ion-list>\n\n  <button class="login-btn" ion-button block full color="navbar" (click)="submitUserData()">{{ \'SAVE\' | translate | uppercase }}</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\profile\profile.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_5_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend_api_backend_api__["a" /* BackendApiProvider */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaymentMethodsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__recharge_recharge__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__easypay_easypay__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_washstation_info_washstation_info__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__ = __webpack_require__(27);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PaymentMethodsPage = /** @class */ (function () {
    function PaymentMethodsPage(navCtrl, wsInfo, userSession) {
        this.navCtrl = navCtrl;
        this.wsInfo = wsInfo;
        this.userSession = userSession;
        this.params = null;
        this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
    }
    PaymentMethodsPage.prototype.goToPaymentForm = function (paymentMethod) {
        switch (paymentMethod) {
            case 'PAYPAL':
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__recharge_recharge__["a" /* RechargePage */]);
                break;
            case 'MB_REF':
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__easypay_easypay__["a" /* EasypayPage */], { mode: 'MB_REF' });
                break;
            case 'CREDIT_CARD':
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__easypay_easypay__["a" /* EasypayPage */], { mode: 'CREDIT_CARD' });
                break;
        }
    };
    PaymentMethodsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-payment-methods',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\payment-methods\payment-methods.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'RECHARGE\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n      </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <h2 class="title">{{ \'SELECT_PAYMENT_METHOD\' | translate }}</h2>\n\n  <p class="subtitle">{{ \'RANGE_CHARGE_VALUE\' | translate:params }}</p>\n\n  <ion-list>\n\n    <button class="payment-item item-arrow" ion-item no-lines (click)="goToPaymentForm(\'PAYPAL\')">\n\n      <ion-thumbnail item-start>\n\n        <img class="payment-type-img" src="assets/imgs/paypal.svg" />\n\n      </ion-thumbnail>\n\n      <ion-label>{{ \'PAYPAL\' | translate }}</ion-label>\n\n    </button>\n\n    <button class="payment-item item-arrow" ion-item no-lines (click)="goToPaymentForm(\'MB_REF\')">\n\n      <ion-thumbnail item-start>\n\n        <img class="payment-type-img" src="assets/imgs/mb-logo-crop.png" />\n\n      </ion-thumbnail>\n\n      <ion-label>{{ \'MB_REF\' | translate }}</ion-label>\n\n    </button>\n\n    <button class="payment-item item-arrow" ion-item no-lines (click)="goToPaymentForm(\'CREDIT_CARD\')">\n\n      <ion-thumbnail item-start>\n\n        <img class="payment-type-img" src="assets/imgs/visa-icon-crop.png" />\n\n      </ion-thumbnail>\n\n      <ion-label>{{ \'CREDIT_CARD\' | translate }}</ion-label>\n\n    </button>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\payment-methods\payment-methods.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__["a" /* UserSessionProvider */]])
    ], PaymentMethodsPage);
    return PaymentMethodsPage;
}());

//# sourceMappingURL=payment-methods.js.map

/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RechargePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_paypal__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_washstation_info_washstation_info__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var RechargePage = /** @class */ (function () {
    function RechargePage(navCtrl, userSession, backendApi, ngProgress, payPal, loadingCtrl, translate, wsInfo, utils) {
        this.navCtrl = navCtrl;
        this.userSession = userSession;
        this.backendApi = backendApi;
        this.ngProgress = ngProgress;
        this.payPal = payPal;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.wsInfo = wsInfo;
        this.utils = utils;
        this.params = null;
        this.payPalEnvironmentProduction = 'ATmzzf0v5Lt-lA-s9-sWE2tPAEMEMX4eNgW5NF4itfq2gL2JHkeDWKq6gCm7UH5_D6YaBZAC2TQK5L5_';
        // payPalEnvironmentSandbox: string = 'AX7cOgBU1s7xSX2WCtaRTwslhRS7y6SGdM9kKwUQTLsuBXpJGqPSXus2h8U8khM2E66CzRNebKaY-DjM';
        this.payPalEnvironmentSandbox = 'AQU3d8UOMlRE2-8tY2oMQrhnMluAiuLEJWHTCwgraCTDEqHC4N13io56AG9KE2zuR17yoW908tjRsKfe';
        this.chargeSubmitAttempt = false;
        this.submitBtnEnabled = true;
        this.valuePlc = null;
        this.payment = null;
        this.chargeValue = null;
        this.balanceValue = null;
        this.valueValid = false;
        this.storage = new __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]({});
        this.loading = null;
        this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
        this.valuePlc = this.translate.instant('CHARGE_AMOUNT');
    }
    RechargePage.prototype.isValueValid = function () {
        if (Number(this.chargeValue) < this.wsInfo.minCharge || Number(this.chargeValue) > this.wsInfo.maxCharge) {
            this.valueValid = false;
        }
        else {
            this.valueValid = true;
        }
    };
    RechargePage.prototype.makePayment = function () {
        var _this = this;
        this.chargeSubmitAttempt = true;
        this.isValueValid();
        if (!this.submitBtnEnabled || !this.valueValid) {
            if (!this.valueValid) {
                var toast = this.utils.presentToast('RANGE_CHARGE_VALUE', 'toast-error', { min: this.wsInfo.minCharge.toFixed(2), max: this.wsInfo.maxCharge.toFixed(2) });
                toast.onDidDismiss(function (res) {
                    _this.valueIn.setFocus();
                    _this.chargeSubmitAttempt = false;
                });
            }
            return;
        }
        this.submitBtnEnabled = false;
        this.payment = new __WEBPACK_IMPORTED_MODULE_3__ionic_native_paypal__["c" /* PayPalPayment */](Number(this.chargeValue).toFixed(2), 'EUR', 'Carregamento WashStation', 'sale');
        this.payPal.init({
            PayPalEnvironmentProduction: this.payPalEnvironmentProduction,
            PayPalEnvironmentSandbox: this.payPalEnvironmentSandbox,
        }).then(function () {
            // this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            _this.payPal.prepareToRender('PayPalEnvironmentProduction', new __WEBPACK_IMPORTED_MODULE_3__ionic_native_paypal__["b" /* PayPalConfiguration */]({
                languageOrLocale: _this.translate.defaultLang,
                acceptCreditCards: false,
            })).then(function () {
                _this.payPal.renderSinglePaymentUI(_this.payment).then(function (response) {
                    _this.ngProgress.start();
                    _this.backendApi.setPaypalPaymentRequest(_this.userSession.id, response).subscribe(function (res) {
                        if (res.hasOwnProperty('success') && res.success) {
                            _this.chargeValue = null;
                            _this.balanceValue = res.balance;
                            _this.loading.dismiss('CHARGE_SUCCESS_MSG');
                        }
                        else {
                            _this.loading.dismiss('CHARGE_ERROR_MSG');
                        }
                        _this.ngProgress.done();
                    }, function (err) {
                        _this.loading.dismiss('CHECK_INTERNET_CONNECTION');
                        _this.submitBtnEnabled = true;
                        _this.ngProgress.done();
                    });
                    _this.loading = _this.loadingCtrl.create({
                        content: _this.translate.instant('CHARGE_WAITING_MSG'),
                    });
                    _this.loading.onDidDismiss(function (res) {
                        switch (res) {
                            case 'CHARGE_SUCCESS_MSG':
                                var toast = _this.utils.presentToast('CHARGE_SUCCESS_MSG', 'toast-success');
                                toast.onDidDismiss(function () {
                                    _this.userSession.balance = _this.balanceValue;
                                    _this.chargeValue = null;
                                    _this.utils.setPage('WASHSTATION');
                                });
                                break;
                            case 'CHARGE_ERROR_MSG':
                                _this.utils.presentToast('CHARGE_ERROR_MSG', 'toast-success');
                                break;
                            case 'CHECK_INTERNET_CONNECTION':
                                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                                break;
                        }
                    });
                    _this.loading.present();
                }, function () {
                    _this.submitBtnEnabled = true;
                });
            }, function () {
                _this.submitBtnEnabled = true;
                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
            });
        }, function () {
            _this.submitBtnEnabled = true;
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    RechargePage.prototype.getOrderRegObj = function () {
        var obj = {
            cardId: this.userSession.cardId,
            nif: this.userSession.nif,
            expense: false,
            priceTotal: Number(this.chargeValue),
        };
        return obj;
    };
    RechargePage.prototype.getUserDetails = function () {
        var _this = this;
        if (this.userSession.id) {
            this.backendApi.getUserDetails(this.userSession.id).subscribe(function (res) {
                if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
                    var appCard = res.cards.find(function (el) { return (el.type === 'APP'); });
                    _this.userSession.balance = Number(appCard.balance);
                    _this.userSession.cardId = appCard.cardId;
                }
                if (res.hasOwnProperty('paymentsRequests') && Array.isArray(res.paymentsRequests) && res.paymentsRequests.length > 0 && res.paymentsRequests[0].ep_status && res.paymentsRequests[0].ep_status.indexOf('err') === -1) {
                    _this.userSession.paymentRef = res.paymentsRequests[0];
                    _this.userSession.paymentRef.ep_date = new Date(_this.userSession.paymentRef.ep_date);
                }
                else {
                    _this.userSession.paymentRef = null;
                }
                _this.userSession.email = res.email;
                _this.userSession.nif = res.nif;
                _this.userSession.mobileContact = res.address.mobileNumber;
                _this.userSession.birthday = res.birthDate;
                _this.userSession.gender = res.sex;
                _this.userSession.address = res.address;
                _this.storage.set('userId', _this.userSession.id);
                _this.storage.set('name', _this.userSession.name);
                _this.userSession.isAuth = true;
            });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('valueIn'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* TextInput */])
    ], RechargePage.prototype, "valueIn", void 0);
    RechargePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-recharge',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\recharge\recharge.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'PAYPAL\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n      </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <p class="subtitle">{{ \'RANGE_CHARGE_VALUE\' | translate:params }}</p>\n\n\n\n  <div style="margin-top: 0px; margin-bottom: 16px;">\n\n    <ion-item class="input-field" [class.invalid]="!valueValid && chargeSubmitAttempt">\n\n      <ion-thumbnail item-start>\n\n        <img class="paypal-img" src="assets/imgs/paypal.svg" />\n\n      </ion-thumbnail>\n\n      <ion-input #valueIn [(ngModel)]="chargeValue" type="number" [placeholder]="valuePlc" (keyup.enter)="makePayment()"></ion-input>\n\n    </ion-item>\n\n  </div>\n\n  <button class="login-btn" ion-button block full color="navbar" (click)="makePayment()">{{ \'CONTINUE\' | translate | uppercase }}</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\recharge\recharge.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_paypal__["a" /* PayPal */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_7__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
            __WEBPACK_IMPORTED_MODULE_9__providers_utils_utils__["a" /* UtilsProvider */]])
    ], RechargePage);
    return RechargePage;
}());

//# sourceMappingURL=recharge.js.map

/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EasypayPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_washstation_info_washstation_info__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var EasypayPage = /** @class */ (function () {
    function EasypayPage(navCtrl, navParams, userSession, backendApi, translate, loadingCtrl, utils, ngProgress, wsInfo, iab) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userSession = userSession;
        this.backendApi = backendApi;
        this.translate = translate;
        this.loadingCtrl = loadingCtrl;
        this.utils = utils;
        this.ngProgress = ngProgress;
        this.wsInfo = wsInfo;
        this.iab = iab;
        this.params = null;
        this.chargeSubmitAttempt = false;
        this.submitBtnEnabled = true;
        this.mode = null;
        this.valuePlc = null;
        this.chargeValue = null;
        this.valueValid = false;
        this.loading = null;
        this.loadingExit = null;
        this.timer = null;
        this.paymentAcceptedTimeout = 4000;
        this.options = {
            location: 'no',
            hidden: 'yes',
            hardwareback: 'yes',
        };
        this.params = { min: this.wsInfo.minCharge, max: this.wsInfo.maxCharge };
        this.valuePlc = this.translate.instant('CHARGE_AMOUNT');
        this.mode = this.navParams.data.mode;
    }
    EasypayPage.prototype.isValueValid = function () {
        if (Number(this.chargeValue) < this.wsInfo.minCharge || Number(this.chargeValue) > this.wsInfo.maxCharge) {
            this.valueValid = false;
        }
        else {
            this.valueValid = true;
        }
    };
    EasypayPage.prototype.genMbRef = function () {
        var _this = this;
        this.chargeSubmitAttempt = true;
        this.isValueValid();
        if (!this.submitBtnEnabled || !this.valueValid) {
            if (!this.valueValid) {
                var toast = this.utils.presentToast('RANGE_CHARGE_VALUE', 'toast-error', { min: this.wsInfo.minCharge.toFixed(2), max: this.wsInfo.maxCharge.toFixed(2) });
                toast.onDidDismiss(function (res) {
                    _this.valueIn.setFocus();
                    _this.chargeSubmitAttempt = false;
                });
            }
            return;
        }
        this.submitBtnEnabled = false;
        this.ngProgress.start();
        this.backendApi.setPaymentRequest(this.userSession.id, Number(this.chargeValue).toFixed(2), this.userSession.selectedLang.toUpperCase()).subscribe(function (res) {
            if (res.hasOwnProperty('success') && !res.success) {
                _this.utils.presentToast('MB_REF_ERR_MSG', 'toast-error');
            }
            else {
                var toast = _this.utils.presentToast('MB_REF_SUCCESS_MSG', 'toast-success');
                toast.onDidDismiss(function () {
                    _this.userSession.paymentRef = {
                        ep_entity: res.ep_entity,
                        ep_reference: res.ep_reference,
                        ep_value: res.ep_value,
                        ep_date: new Date(res.ep_date),
                    };
                    _this.chargeValue = null;
                });
            }
            _this.submitBtnEnabled = true;
            _this.ngProgress.done();
        }, function (err) {
            _this.submitBtnEnabled = true;
            _this.ngProgress.done();
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    EasypayPage.prototype.genGwUrl = function () {
        var _this = this;
        this.chargeSubmitAttempt = true;
        this.isValueValid();
        if (!this.submitBtnEnabled || !this.valueValid) {
            if (!this.valueValid) {
                var toast = this.utils.presentToast('RANGE_CHARGE_VALUE', 'toast-error', { min: this.wsInfo.minCharge.toFixed(2), max: this.wsInfo.maxCharge.toFixed(2) });
                toast.onDidDismiss(function (res) {
                    _this.valueIn.setFocus();
                    _this.chargeSubmitAttempt = false;
                });
            }
            return;
        }
        this.submitBtnEnabled = false;
        this.ngProgress.start();
        this.backendApi.setPaymentRequest(this.userSession.id, Number(this.chargeValue).toFixed(2), this.userSession.selectedLang.toUpperCase()).subscribe(function (res) {
            if (res.hasOwnProperty('success') && !res.success) {
                _this.utils.presentToast('CREDIT_REF_ERR_MSG', 'toast-error');
            }
            else {
                _this.openWithInAppBrowser(res.ep_link);
            }
            _this.submitBtnEnabled = true;
            _this.ngProgress.done();
        }, function (err) {
            _this.submitBtnEnabled = true;
            _this.ngProgress.done();
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    EasypayPage.prototype.openWithInAppBrowser = function (url) {
        var _this = this;
        var browser = this.iab.create(url, '_blank', this.options);
        this.loading = this.loadingCtrl.create({
            content: this.translate.instant('CHARGE_REQUEST_WAITING_MSG'),
        });
        this.loading.onDidDismiss(function () {
            browser.show();
            _this.loading = null;
        });
        this.loading.present();
        browser.on('loadstop').subscribe(function (ev) {
            _this.loading.dismiss();
        });
        browser.on('loadstart').subscribe(function (ev) {
            if (ev.url.indexOf(_this.wsInfo.visaFwdUrl) !== -1) {
                browser.close();
                if (ev.url.indexOf('s=ok') !== -1) {
                    _this.loadingExit = _this.loadingCtrl.create({
                        content: _this.translate.instant('CHARGE_REQUEST_WAITING_MSG'),
                    });
                    _this.loadingExit.onDidDismiss(function () {
                        _this.chargeValue = null;
                        _this.utils.setPage('WASHSTATION');
                        _this.loading = null;
                    });
                    _this.loadingExit.present();
                    _this.timer = setTimeout(function () { if (_this.loadingExit)
                        _this.loadingExit.dismiss(); }, _this.paymentAcceptedTimeout);
                }
                else {
                    _this.utils.presentToast('CREDIT_ERR_MSG', 'toast-error', null, false, 5000);
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('valueIn'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* TextInput */])
    ], EasypayPage.prototype, "valueIn", void 0);
    EasypayPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-easypay',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\easypay\easypay.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button class="side-menu-btn" ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ mode | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n      </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content *ngIf="mode === \'MB_REF\'" padding style="position: relative;">\n\n  <p class="subtitle">{{ \'RANGE_CHARGE_VALUE\' | translate:params }}</p>\n\n\n\n  <div style="margin-top: 0px; margin-bottom: 16px;">\n\n    <ion-item class="input-field" [class.invalid]="!valueValid && chargeSubmitAttempt">\n\n      <ion-thumbnail item-start>\n\n        <img class="mb-img" src="assets/imgs/mb-logo-crop.png" />\n\n      </ion-thumbnail>\n\n      <ion-input #valueIn [(ngModel)]="chargeValue" type="number" [placeholder]="valuePlc" (keyup.enter)="genMbRef()"></ion-input>\n\n    </ion-item>\n\n  </div>\n\n  <button class="login-btn" ion-button block full color="navbar" (click)="genMbRef()">{{ \'GEN_MB_REF\' | translate | uppercase }}</button>\n\n\n\n  <div id="ref-container" *ngIf="userSession.paymentRef !== null">\n\n    <div class="label">{{ \'ACT_MB_REF\' | translate }}</div>\n\n    <div class="mb-img-container">\n\n      <img class="centered-img" src="assets/imgs/mb-logo.png" />\n\n    </div>\n\n    <div class="mb-data-container table">\n\n      <div class="table-row">\n\n        <div class="table-cell key">{{ \'ENTITY\' | translate }}</div>\n\n        <div class="table-cell value">{{ userSession.paymentRef.ep_entity }}</div>\n\n      </div>\n\n      <div class="table-row">\n\n        <div class="table-cell key">{{ \'REF\' | translate }}</div>\n\n        <div class="table-cell value">{{  userSession.paymentRef.ep_reference }}</div>\n\n      </div>\n\n      <div class="table-row">\n\n        <div class="table-cell key">{{ \'AMOUNT\' | translate }}</div>\n\n        <div class="table-cell value">{{ userSession.paymentRef.ep_value }} &euro;</div>\n\n      </div>\n\n    </div>\n\n    <div class="limit-payment-date">{{ \'DATE_LIMIT\' | translate }}: {{ userSession.paymentRef.ep_date | date: \'dd/MM/yyyy\'}}</div>\n\n  </div>\n\n</ion-content>\n\n\n\n<ion-content *ngIf="mode === \'CREDIT_CARD\'" padding>\n\n  <p class="subtitle">{{ \'RANGE_CHARGE_VALUE\' | translate:params }}</p>\n\n\n\n  <div style="margin-top: 0px; margin-bottom: 16px;">\n\n    <ion-item class="input-field" [class.invalid]="!valueValid && chargeSubmitAttempt">\n\n      <ion-thumbnail item-start>\n\n        <img class="visa-img" src="assets/imgs/visa-icon-crop.png" />\n\n      </ion-thumbnail>\n\n      <ion-input #valueIn [(ngModel)]="chargeValue" type="number" [placeholder]="valuePlc" (keyup.enter)="genGwUrl()"></ion-input>\n\n    </ion-item>\n\n  </div>\n\n  <button class="login-btn" ion-button block full color="navbar" (click)="genGwUrl()">{{ \'CONTINUE\' | translate | uppercase }}</button>  \n\n</ion-content>'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\easypay\easypay.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_8__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], EasypayPage);
    return EasypayPage;
}());

//# sourceMappingURL=easypay.js.map

/***/ }),

/***/ 424:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__change_password_change_password__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var SettingsPage = /** @class */ (function () {
    function SettingsPage(navCtrl, navParams, formBuilder, userSession, alertCtrl, utils, translate, ngProgress, backendApi) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.userSession = userSession;
        this.alertCtrl = alertCtrl;
        this.utils = utils;
        this.translate = translate;
        this.ngProgress = ngProgress;
        this.backendApi = backendApi;
    }
    SettingsPage.prototype.changePassword = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__change_password_change_password__["a" /* ChangePasswordPage */]);
    };
    SettingsPage.prototype.langSelected = function (e) {
        this.userSession.setSelectedLang(e);
    };
    SettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-settings',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\settings\settings.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'SETTINGS\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n      </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <ion-item>\n\n      <ion-label>{{ \'LANGUAGE\' | translate }}</ion-label>\n\n      <ion-select [(ngModel)]="userSession.selectedLang"  (ionChange)="langSelected($event)">\n\n        <ion-option value="en">{{ \'EN\' | translate }}</ion-option>\n\n        <ion-option value="es">{{ \'ES\' | translate }}</ion-option>\n\n        <ion-option value="fr">{{ \'FR\' | translate }}</ion-option>\n\n        <ion-option value="pt">{{ \'PT\' | translate }}</ion-option>              \n\n        <ion-option value="nl">{{ \'NL\' | translate }}</ion-option>              \n\n      </ion-select>\n\n    </ion-item>\n\n    <button class="item-arrow" ion-item (click)="changePassword()">\n\n      <ion-label>{{ \'CHANGE_PASSWORD\' | translate }}</ion-label>\n\n    </button>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\settings\settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_6__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend_api_backend_api__["a" /* BackendApiProvider */]])
    ], SettingsPage);
    return SettingsPage;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 425:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangePasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ChangePasswordPage = /** @class */ (function () {
    function ChangePasswordPage(navCtrl, formBuilder, ngProgress, backendApi, utils, userSession, navParams) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.ngProgress = ngProgress;
        this.backendApi = backendApi;
        this.utils = utils;
        this.userSession = userSession;
        this.navParams = navParams;
        this.changeSubmitAttempt = false;
        this.changeBtnEnabled = true;
        this.changePassForm = formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            newPassword: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            confPassword: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    }
    ChangePasswordPage.prototype.changePassword = function () {
        var _this = this;
        this.changeSubmitAttempt = true;
        setTimeout(function () { _this.changeSubmitAttempt = false; }, 2500);
        if (!this.changeBtnEnabled || !this.changePassForm.valid)
            return;
        if (this.changePassForm.value.confPassword !== this.changePassForm.value.newPassword) {
            var toast = this.utils.presentToast('PASSWORD_NOT_EQUAL', 'toast-error');
            toast.onDidDismiss(function () {
                _this.changeBtnEnabled = true;
            });
            this.changeBtnEnabled = false;
            return;
        }
        this.changeBtnEnabled = false;
        this.ngProgress.start();
        this.backendApi.changePassword(this.changePassForm.value.password, this.changePassForm.value.newPassword).subscribe(function (res) {
            _this.ngProgress.done();
            var toast = _this.utils.presentToast('CHANGE_PASSWORD_SUCCESS_MSG', 'toast-success');
            toast.onDidDismiss(function () {
                _this.navCtrl.pop();
            });
        }, function (err) {
            _this.ngProgress.done();
            _this.changeBtnEnabled = true;
            if (err.hasOwnProperty('status') && err.status === 401) {
                _this.utils.presentToast('WRONG_PASSWORD', 'toast-error');
            }
            else {
                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
            }
        });
    };
    ChangePasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-change-password',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\change-password\change-password.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <ion-title>{{ \'CHANGE_PASSWORD\' | translate }}</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only>\n\n        <span class="navbar-balance">{{ userSession.balance | number : \'1.2-2\' }} &euro;</span>\n\n      </button>\n\n    </ion-buttons>   	\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <form [formGroup]="changePassForm" style="margin-top: 0px">\n\n      <ion-item id="pass" class="input-field" [class.invalid]="!changePassForm.controls.password.valid && changeSubmitAttempt">\n\n        <ion-label>{{ \'ACTUAL_PASSWORD\' | translate }}</ion-label>\n\n        <ion-input type="password" formControlName="password" (keyup.enter)="changePassword()"></ion-input>\n\n      </ion-item>\n\n      <ion-item id="new-pass" class="input-field" [class.invalid]="!changePassForm.controls.newPassword.valid && changeSubmitAttempt">\n\n        <ion-label>{{ \'NEW_PASSWORD\' | translate }}</ion-label>\n\n        <ion-input type="password" formControlName="newPassword" (keyup.enter)="changePassword()"></ion-input>\n\n      </ion-item>\n\n      <ion-item id="conf-new-pass" class="input-field" [class.invalid]="!changePassForm.controls.confPassword.valid && changeSubmitAttempt">\n\n        <ion-label class="label">{{ \'CONF_PASSWORD\' | translate }}</ion-label>\n\n        <ion-input type="password" formControlName="confPassword" (keyup.enter)="changePassword()"></ion-input>\n\n      </ion-item>\n\n      <ion-item style="display: none;"></ion-item>\n\n    </form>\n\n  </ion-list>\n\n  <button class="login-btn" ion-button block full color="navbar" (click)="changePassword()">{{ \'SUBMIT\' | translate | uppercase }}</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\change-password\change-password.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_4__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], ChangePasswordPage);
    return ChangePasswordPage;
}());

//# sourceMappingURL=change-password.js.map

/***/ }),

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderHistoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrderHistoryPage = /** @class */ (function () {
    function OrderHistoryPage(backendApi, ngProgress, utils) {
        this.backendApi = backendApi;
        this.ngProgress = ngProgress;
        this.utils = utils;
        this.listEnded = false;
        this.fetchDone = false;
        this.orders = [];
    }
    OrderHistoryPage.prototype.ionViewDidEnter = function () {
        this.getOrders();
    };
    OrderHistoryPage.prototype.getOrders = function () {
        var _this = this;
        if (this.orders.length === 0)
            this.ngProgress.start();
        this.backendApi.getMyOrders().subscribe(function (res) {
            if (_this.orders.length === 0)
                _this.ngProgress.done();
            if (!res.hasOwnProperty('success') && Array.isArray(res)) {
                _this.orders = res.filter(function (el) { return (Array.isArray(el.orderMachinePrograms) && el.orderMachinePrograms.length > 0); });
            }
            _this.listEnded = false;
            _this.fetchDone = true;
        }, function (err) {
            if (_this.orders.length === 0)
                _this.ngProgress.done();
            _this.listEnded = false;
            _this.fetchDone = true;
            _this.orders = [];
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    OrderHistoryPage.prototype.doInfiniteScroll = function (ev) {
        var _this = this;
        if (!this.listEnded && ev._content.directionY === 'down') {
            this.backendApi.getMyOrders(this.orders.length).subscribe(function (res) {
                if (Array.isArray(res) && res.length === 0)
                    _this.listEnded = true;
                setTimeout(function () {
                    ev.complete();
                    _this.orders = _this.orders.concat(res.filter(function (el) { return (Array.isArray(el.orderMachinePrograms) && el.orderMachinePrograms.length > 0); }));
                }, 200);
            }, function (err) {
                setTimeout(function () {
                    ev.complete();
                    _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                }, 200);
            });
        }
        else {
            ev.complete();
        }
    };
    OrderHistoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-order-history',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\order-history\order-history.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'ORDERS_HISTORY\' | translate }}</ion-title>  \n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding>\n\n  <div *ngIf="orders.length <= 0 && fetchDone" style="height: 50%; overflow: auto;">\n\n    <div id="no-history-found">{{ \'NO_HISTORY_FOUND\' | translate }}</div>\n\n  </div>\n\n\n\n  <ion-list *ngIf="orders.length > 0 && fetchDone">\n\n    <ion-item *ngFor="let order of orders">\n\n      <!-- SERVICES -->\n\n      <div *ngIf="order.type === \'SPEND_APP\'">\n\n        <h2 *ngIf="order.orderMachinePrograms[0].transaction === \'SPEND\' && order.orderMachinePrograms[0].machineProgram && order.orderMachinePrograms[0].machineProgram.machine.type === \'wash\'">\n\n          {{ \'WASH\' | translate }} - {{ order.orderMachinePrograms[0].machineProgram.machine.name }}\n\n        </h2>\n\n        <h2 *ngIf="order.orderMachinePrograms[0].transaction === \'SPEND\' && order.orderMachinePrograms[0].machineProgram && order.orderMachinePrograms[0].machineProgram.machine.type === \'dry\'">\n\n          {{ \'DRY\' | translate }} - {{ order.orderMachinePrograms[0].machineProgram.machine.name }}\n\n        </h2>\n\n        <p>{{ order.laundry.name }}</p>\n\n        <p>{{ order.created_at | date: \'dd/MM/yyyy HH:mm\' }}</p>\n\n      </div>            \n\n      <!-- APP CHARGES -->\n\n      <div *ngIf="order.type === \'CHARGE_APP\' || order.type === \'CHARGE_APP_PAYPAL\' || order.type === \'CHARGE_APP_MB\' || order.type === \'CHARGE_APP_CC\'">\n\n        <h2>{{ \'RECHARGE\' | translate }}</h2>\n\n        <p>{{ order.created_at | date: \'dd/MM/yyyy HH:mm\' }}</p>\n\n      </div>\n\n      <span class="price" clear item-end>{{ order.orderMachinePrograms[0].price }} &euro;</span>          \n\n    </ion-item>\n\n  </ion-list>\n\n  <ion-infinite-scroll *ngIf="!listEnded" (ionInfinite)="doInfiniteScroll($event)">\n\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\order-history\order-history.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_3__providers_utils_utils__["a" /* UtilsProvider */]])
    ], OrderHistoryPage);
    return OrderHistoryPage;
}());

//# sourceMappingURL=order-history.js.map

/***/ }),

/***/ 427:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__terms_conditions_terms_conditions__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_washstation_info_washstation_info__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, navParams, backendApi, ngProgress, utils, modalCtrl, washstationInfo) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backendApi = backendApi;
        this.ngProgress = ngProgress;
        this.utils = utils;
        this.modalCtrl = modalCtrl;
        this.washstationInfo = washstationInfo;
        this.washInfo = null;
        this.name = '---';
        this.address = '---';
        this.postalCode = '---';
        this.city = '---';
        this.phoneContacts = '---';
        this.phoneContactsAlt = null;
        this.emailContacts = '---';
        this.emailContactsAlt = null;
        this.website = '---';
        if (washstationInfo.washStationInfo !== null) {
            this.washInfo = washstationInfo.washStationInfo;
            this.handleInfoObj();
        }
        else {
            this.ngProgress.start();
            this.backendApi.getWashstationInfo().subscribe(function (res) {
                _this.washInfo = res[0];
                _this.ngProgress.done();
                _this.handleInfoObj();
            }, function (err) {
                _this.ngProgress.done();
                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
            });
        }
    }
    AboutPage.prototype.handleInfoObj = function () {
        if (this.washInfo) {
            this.name = this.washInfo.name;
            this.address = this.washInfo.addressLine1;
            this.postalCode = this.washInfo.postalCode;
            this.city = this.washInfo.city;
            this.phoneContacts = this.washInfo.mobileNumber1;
            this.phoneContactsAlt = this.washInfo.mobileNumber2;
            this.emailContacts = this.washInfo.email1;
            this.emailContactsAlt = this.washInfo.email2;
            this.website = this.washInfo.site1;
        }
    };
    AboutPage.prototype.goToTermsConditionPage = function () {
        var termsCondModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__terms_conditions_terms_conditions__["a" /* TermsConditionsPage */]);
        termsCondModal.present();
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-about',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\about\about.html"*/'<ion-header>\n\n  <ion-navbar color="navbar">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{ \'ABOUT\' | translate }}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding>\n\n  <img class="centered-img about-logo" src="assets/imgs/logo-blue.png" style="margin-top: 15px;" />\n\n  <ion-item no-lines>\n\n    <h2 class="title">{{ name }}</h2>\n\n    <p class="subtitle">{{ address }}</p>\n\n    <p class="subtitle">{{ postalCode }}, {{ city }}</p>\n\n  </ion-item>\n\n  <ion-list>\n\n    <ion-item>\n\n      <div class="label">{{ \'CONTACTS\' | translate }}</div>\n\n      <div class="table">\n\n        <div class="table-row">\n\n          <div class="table-cell icon"><ion-icon name="ios-call-outline"></ion-icon></div>\n\n          <div class="table-cell">{{ phoneContacts }}</div>\n\n        </div>\n\n        <div *ngIf="phoneContactsAlt !== null" class="table-row">\n\n          <div class="table-cell icon"></div>\n\n          <div class="table-cell">{{ phoneContactsAlt }}</div>\n\n        </div>\n\n        <div class="table-row separator"></div>        \n\n        <div class="table-row">\n\n          <div class="table-cell icon"><ion-icon name="ios-at-outline"></ion-icon></div>\n\n          <div class="table-cell">{{ emailContacts }}</div>\n\n        </div>\n\n        <div *ngIf="emailContactsAlt !== null" class="table-row">\n\n          <div class="table-cell icon"></div>\n\n          <div class="table-cell">{{ emailContactsAlt }}</div>\n\n        </div>\n\n        <div class="table-row separator"></div>        \n\n        <div class="table-row">\n\n          <div class="table-cell icon"><ion-icon name="ios-globe-outline"></ion-icon></div>\n\n          <div class="table-cell">{{ website }}</div>\n\n        </div>\n\n      </div>\n\n    </ion-item>\n\n    <ion-item class="item-arrow" detail-push (click)="goToTermsConditionPage()">\n\n      <div class="label">{{ \'TERMS_CONDITION\' | translate }}</div>\n\n    </ion-item>\n\n    <ion-item>\n\n      <div class="label">{{ \'APP_VERSION\' | translate }}</div>\n\n      <div class="content">{{ washstationInfo.appVersion }}</div> \n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\about\about.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_2_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__terms_conditions_terms_conditions__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var RegisterPage = /** @class */ (function () {
    function RegisterPage(viewCtrl, backendApi, formBuilder, ngProgress, modalCtrl, alertCtrl, translate, menu, utils) {
        this.viewCtrl = viewCtrl;
        this.backendApi = backendApi;
        this.formBuilder = formBuilder;
        this.ngProgress = ngProgress;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.menu = menu;
        this.utils = utils;
        this.passwordEqual = true;
        this.termsCondAccepted = false;
        this.regSubmitAttempt = false;
        this.regBtnEnabled = true;
        this.registerForm = formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            email: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].email, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    }
    RegisterPage.prototype.ionViewDidEnter = function () {
        this.menu.swipeEnable(false);
    };
    RegisterPage.prototype.ionViewWillLeave = function () {
        this.menu.swipeEnable(true);
    };
    RegisterPage.prototype.register = function () {
        var _this = this;
        this.regSubmitAttempt = true;
        setTimeout(function () { _this.regSubmitAttempt = false; }, 2500);
        if (!this.regBtnEnabled || !this.registerForm.valid || !this.termsCondAccepted) {
            if (this.registerForm.value.password.length < 6)
                this.utils.presentToast('MIN_PASSWORD_LENGTH', 'toast-error');
            return;
        }
        this.regBtnEnabled = false;
        this.ngProgress.start();
        this.backendApi.createUser(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.password).subscribe(function (res) {
            var toast = _this.utils.presentToast('REGISTER_SUCCESS_MSG', 'toast-success');
            toast.onDidDismiss(function (res) { return _this.activateAccount(); });
            _this.regBtnEnabled = true;
            _this.ngProgress.done();
        }, function (err) {
            if (err.hasOwnProperty('message') && err.message === 'UNAVAILABLE_USER') {
                _this.utils.presentToast(err.message, 'toast-error');
            }
            else {
                _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
            }
            _this.regBtnEnabled = true;
            _this.ngProgress.done();
        });
    };
    RegisterPage.prototype.login = function () {
        this.viewCtrl.dismiss();
    };
    RegisterPage.prototype.goToTermsConditionPage = function () {
        var _this = this;
        var termsCondModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__terms_conditions_terms_conditions__["a" /* TermsConditionsPage */]);
        termsCondModal.onDidDismiss(function (res) {
            if (res)
                _this.termsCondAccepted = true;
        });
        termsCondModal.present();
    };
    RegisterPage.prototype.activateAccount = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '<h2 class="laundry-name">' + this.translate.instant('ACTIVATION_TITLE') + '</h2>',
            message: '<p class="alert-subtitle">' + this.translate.instant('ACTIVATION_MSG') + '</p>',
            cssClass: 'input-alert custom-alert',
            inputs: [
                {
                    name: 'actCode',
                    placeholder: this.translate.instant('ACTIVATION_CODE')
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'cancel-btn',
                },
                {
                    text: this.translate.instant('OK'),
                    cssClass: 'ok-btn',
                    handler: function (data) {
                        if (data.actCode === null || data.actCode === '') {
                            _this.utils.presentToast('ACT_CODE_REQUIRED', 'toast-error');
                            return false;
                        }
                        _this.ngProgress.start();
                        _this.backendApi.activateAccount(data.actCode).subscribe(function (res) {
                            var toast = null;
                            _this.ngProgress.done();
                            if (res.hasOwnProperty('success') && !res.success) {
                                toast = _this.utils.presentToast(res.msg, 'toast-error');
                            }
                            else {
                                toast = _this.utils.presentToast('ACTIVATION_SUCCESS_MSG', 'toast-success');
                                toast.onDidDismiss(function (res) {
                                    _this.login();
                                });
                            }
                        }, function (err) {
                            _this.ngProgress.done();
                            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-register',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\register\register.html"*/'<ion-header>\n\n  <ion-navbar color="transparent"></ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding class="background">\n\n  <div class="vh-align-container">\n\n    <div class="vh-align-content">\n\n      <img src="assets/imgs/logo.png" />\n\n      <form [formGroup]="registerForm" style="margin-top: 0px; margin-bottom: 15px;">\n\n        <ion-item [class.invalid]="!registerForm.controls.name.valid && regSubmitAttempt">\n\n          <ion-label>{{ \'REG_NAME_LABEL\' | translate }}</ion-label>\n\n          <ion-input type="text" formControlName="name" (keyup.enter)="register()"></ion-input>\n\n        </ion-item>\n\n        <ion-item [class.invalid]="!registerForm.controls.email.valid && regSubmitAttempt">\n\n          <ion-label>{{ \'REG_EMAIL_LABEL\' | translate }}</ion-label>\n\n          <ion-input type="text" formControlName="email" (keyup.enter)="register()"></ion-input>\n\n        </ion-item>\n\n        <ion-item [class.invalid]="!registerForm.controls.password.valid && regSubmitAttempt">\n\n          <ion-label>{{ \'REG_PASSWORD_LABEL\' | translate }}</ion-label>\n\n          <ion-input type="password" formControlName="password" (keyup.enter)="register()"></ion-input>\n\n        </ion-item>\n\n      </form>\n\n      <div class="table" style="margin-bottom: 30px;">\n\n        <div class="table-cell">\n\n          <ion-checkbox [class.invalid]="!termsCondAccepted && regSubmitAttempt" color="primary" [(ngModel)]=termsCondAccepted></ion-checkbox>\n\n        </div>\n\n        <div class="table-cell" style="text-align: left;">\n\n          <ion-label><a (click)="goToTermsConditionPage()" style="margin-left: 10px; text-decoration: underline;">{{ \'ACCEPT_TERMS_CONDITION\' | translate }}</a></ion-label>\n\n        </div>\n\n      </div>\n\n      <!-- Buttons section. -->\n\n      <button class="login-btn btn-border" ion-button block full color="navbar" (click)="register()">{{ \'REG_SUBMIT_BUTTON\' | translate | uppercase }}</button>\n\n      <div class="act-link"><a (click)="activateAccount()" style="text-decoration: underline;">{{ \'ACTIVATE_ACCOUNT\' | translate }}</a></div>\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\register\register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_utils_utils__["a" /* UtilsProvider */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 429:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotPasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ForgotPasswordPage = /** @class */ (function () {
    function ForgotPasswordPage(platform, navCtrl, backendApi, utils, formBuilder, ngProgress, alertCtrl, translate, menu) {
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.backendApi = backendApi;
        this.utils = utils;
        this.formBuilder = formBuilder;
        this.ngProgress = ngProgress;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.menu = menu;
        this.forgotSubmitAttempt = false;
        this.forgotBtnEnabled = true;
        this.forgotPassForm = formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].email, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    }
    ForgotPasswordPage.prototype.submitEmail = function () {
        var _this = this;
        this.forgotSubmitAttempt = true;
        setTimeout(function () { _this.forgotSubmitAttempt = false; }, 2500);
        if (!this.forgotBtnEnabled || !this.forgotPassForm.valid)
            return;
        this.forgotBtnEnabled = false;
        this.ngProgress.start();
        this.backendApi.forgotPassword(this.forgotPassForm.value.email).subscribe(function (res) {
            var toast = null;
            _this.ngProgress.done();
            if (res.hasOwnProperty('success') && !res.success) {
                _this.utils.presentToast(res.msg, 'toast-error');
            }
            else {
                toast = _this.utils.presentToast('RESET_PASSWORD_EMAIL_SENT', 'toast-success');
                toast.onDidDismiss(function () {
                    _this.accountRecovery();
                    _this.forgotBtnEnabled = true;
                });
            }
        }, function (err) {
            _this.ngProgress.done();
            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
        });
    };
    ForgotPasswordPage.prototype.accountRecovery = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '<h2 class="alert-title">' + this.translate.instant('ACCOUNT_RECOVERY_TITLE') + '</h2>',
            message: '<p class="alert-subtitle">' + this.translate.instant('RECOVERY_MSG') + '</p>',
            cssClass: 'input-alert custom-alert',
            inputs: [
                {
                    name: 'recCode',
                    placeholder: this.translate.instant('RECOVERY_CODE')
                },
                {
                    name: 'password',
                    type: 'password',
                    placeholder: this.translate.instant('NEW_PASSWORD')
                },
            ],
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'cancel-btn',
                },
                {
                    text: this.translate.instant('OK'),
                    cssClass: 'ok-btn',
                    handler: function (data) {
                        if (data.recCode === null || data.recCode === '' || data.password === null || data.password === '') {
                            _this.utils.presentToast('REC_CODE_PASS_REQUIRED', 'toast-error');
                            return false;
                        }
                        _this.ngProgress.start();
                        _this.backendApi.recoverAccount(data.recCode, data.password).subscribe(function (res) {
                            var toast = null;
                            _this.ngProgress.done();
                            if (res.hasOwnProperty('success') && !res.success) {
                                _this.utils.presentToast(res.msg, 'toast-error');
                            }
                            else {
                                toast = _this.utils.presentToast('ACCOUNT_RECOVERY_SUCCESS_MSG', 'toast-success');
                                toast.onDidDismiss(function () {
                                    _this.navCtrl.pop();
                                });
                            }
                        }, function (err) {
                            _this.ngProgress.done();
                            _this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    ForgotPasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-forgot-password',template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\forgot-password\forgot-password.html"*/'<ion-header>\n\n  <ion-navbar color="transparent"></ion-navbar>\n\n</ion-header>\n\n\n\n<ng-progress [color]="\'#65cbe4\'" [showSpinner]="false"></ng-progress>\n\n\n\n<ion-content padding class="background">\n\n  <div class="vh-align-container">\n\n    <div class="vh-align-content">\n\n      <img src="assets/imgs/logo.png" />\n\n      <div>\n\n        <div id="forgot-pass-msg">{{ \'FORGOT_PASSWORD_MSG\' | translate }}</div>\n\n        <form [formGroup]="forgotPassForm" style="margin-top: 0px; margin-bottom: 30px;">\n\n          <ion-item [class.invalid]="!forgotPassForm.controls.email.valid && forgotSubmitAttempt">\n\n            <ion-label floating>{{ \'LOGIN_EMAIL_LABEL\' | translate }}</ion-label>\n\n            <ion-input formControlName="email" type="email" (keyup.enter)="submitEmail()"></ion-input>\n\n          </ion-item>\n\n        </form>\n\n        <!-- Buttons section. -->\n\n        <button class="login-btn btn-border " ion-button block full color="navbar" (click)="submitEmail()">{{ \'SUBMIT_BUTTON\' | translate | uppercase }}</button>\n\n        <div class="forgot-pass"><a (click)="accountRecovery()" style="text-decoration: underline;">{{ \'ACCOUNT_RECOVERY\' | translate }}</a></div>        \n\n      </div>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\pages\forgot-password\forgot-password.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_5__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3_ngx_progressbar__["a" /* NgProgress */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* MenuController */]])
    ], ForgotPasswordPage);
    return ForgotPasswordPage;
}());

//# sourceMappingURL=forgot-password.js.map

/***/ }),

/***/ 430:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(435);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 435:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* unused harmony export getAuthHttp */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_http_loader__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_jwt__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_geolocation__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__agm_core__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ngx_progressbar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ionic2_auto_complete__ = __webpack_require__(756);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_paypal__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_diagnostic__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_in_app_browser__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__app_component__ = __webpack_require__(757);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_login_login__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_vending_machine_app_vending_machine_app__ = __webpack_require__(404);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_drying_drying__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_washing_washing__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_select_program_select_program__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_main_main__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_profile_profile__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_recharge_recharge__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_register_register__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_terms_conditions_terms_conditions__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_settings_settings__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_change_password_change_password__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_forgot_password_forgot_password__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_about_about__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_order_history_order_history__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_laundry_details_laundry_details__ = __webpack_require__(418);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_payment_methods_payment_methods__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_easypay_easypay__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ionic_native_status_bar__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_splash_screen__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_globalization__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__providers_machines_machines__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__providers_orders_orders__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__providers_laundry_autocomplete_laundry_autocomplete__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__providers_washstation_info_washstation_info__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















































function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_5__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var storage = new __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */]({});
function getAuthHttp(http) {
    return new __WEBPACK_IMPORTED_MODULE_8_angular2_jwt__["AuthHttp"](new __WEBPACK_IMPORTED_MODULE_8_angular2_jwt__["AuthConfig"]({
        headerPrefix: 'Bearer',
        noJwtError: false,
        globalHeaders: [{ 'Accept': 'application/json' }],
        tokenGetter: (function () { return storage.get('id_token'); }),
    }), http);
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_16__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_vending_machine_app_vending_machine_app__["a" /* VendingMachineAppPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_drying_drying__["a" /* DryingPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_washing_washing__["a" /* WashingPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_select_program_select_program__["a" /* SelectProgramPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_main_main__["a" /* MainPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_recharge_recharge__["a" /* RechargePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_terms_conditions_terms_conditions__["a" /* TermsConditionsPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_change_password_change_password__["a" /* ChangePasswordPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_forgot_password_forgot_password__["a" /* ForgotPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_order_history_order_history__["a" /* OrderHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_laundry_details_laundry_details__["a" /* LaundryDetailsPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_payment_methods_payment_methods__["a" /* PaymentMethodsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_easypay_easypay__["a" /* EasypayPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_16__app_component__["a" /* MyApp */], {
                    backButtonText: ''
                }, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_7__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: (createTranslateLoader),
                        deps: [__WEBPACK_IMPORTED_MODULE_6__angular_common_http__["a" /* HttpClient */]]
                    }
                }),
                __WEBPACK_IMPORTED_MODULE_10__agm_core__["a" /* AgmCoreModule */].forRoot({
                    // apiKey: 'AIzaSyCgl8n3Mv-cOQaUVD3ljtF_yoTTQ1unatc',
                    apiKey: 'AIzaSyAoBIsSFoO6Mk9NAONV6ntqBBfrO9MxRvw',
                }),
                __WEBPACK_IMPORTED_MODULE_11_ngx_progressbar__["b" /* NgProgressModule */],
                __WEBPACK_IMPORTED_MODULE_12_ionic2_auto_complete__["a" /* AutoCompleteModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_16__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_vending_machine_app_vending_machine_app__["a" /* VendingMachineAppPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_drying_drying__["a" /* DryingPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_washing_washing__["a" /* WashingPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_select_program_select_program__["a" /* SelectProgramPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_main_main__["a" /* MainPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_recharge_recharge__["a" /* RechargePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_terms_conditions_terms_conditions__["a" /* TermsConditionsPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_change_password_change_password__["a" /* ChangePasswordPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_forgot_password_forgot_password__["a" /* ForgotPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_order_history_order_history__["a" /* OrderHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_laundry_details_laundry_details__["a" /* LaundryDetailsPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_payment_methods_payment_methods__["a" /* PaymentMethodsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_easypay_easypay__["a" /* EasypayPage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_36__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_globalization__["a" /* Globalization */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                { provide: __WEBPACK_IMPORTED_MODULE_8_angular2_jwt__["AuthHttp"], useFactory: getAuthHttp, deps: [__WEBPACK_IMPORTED_MODULE_7__angular_http__["Http"]] },
                __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
                __WEBPACK_IMPORTED_MODULE_39__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
                __WEBPACK_IMPORTED_MODULE_40__providers_user_session_user_session__["a" /* UserSessionProvider */],
                __WEBPACK_IMPORTED_MODULE_41__providers_machines_machines__["a" /* MachinesProvider */],
                __WEBPACK_IMPORTED_MODULE_42__providers_orders_orders__["a" /* OrdersProvider */],
                __WEBPACK_IMPORTED_MODULE_43__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_44__providers_utils_utils__["a" /* UtilsProvider */],
                __WEBPACK_IMPORTED_MODULE_45__providers_laundry_autocomplete_laundry_autocomplete__["a" /* LaundryAutocompleteProvider */],
                __WEBPACK_IMPORTED_MODULE_46__providers_washstation_info_washstation_info__["a" /* WashstationInfoProvider */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_paypal__["a" /* PayPal */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WashstationInfoProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend_api_backend_api__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var WashstationInfoProvider = /** @class */ (function () {
    function WashstationInfoProvider(backendApi) {
        this.backendApi = backendApi;
        this.appVersion = 'V1.1.1';
        this.washStationInfo = "";
        this.minCharge = 10;
        this.maxCharge = 100;
        this.minDistanceFromLaundry = 0.1; // [Km]
        this.visaFwdUrl = 'api.washstation.pt';
        this.termsObj = [];
        this.getWashstationInfo();
    }
    WashstationInfoProvider.prototype.getWashstationInfo = function () {
        var _this = this;
        this.backendApi.getWashstationInfo().subscribe(function (res) {
            _this.washStationInfo = res[0];
            if (res[0].minValCharge !== null)
                _this.minCharge = Number(res[0].minValCharge);
            if (res[0].maxValCharge !== null)
                _this.maxCharge = Number(res[0].maxValCharge);
            if (res[0].minDistance !== null)
                _this.minDistanceFromLaundry = Number(res[0].minDistance);
            if (Array.isArray(res[0].terms))
                _this.termsObj = res[0].terms;
        });
    };
    WashstationInfoProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__backend_api_backend_api__["a" /* BackendApiProvider */]])
    ], WashstationInfoProvider);
    return WashstationInfoProvider;
}());

//# sourceMappingURL=washstation-info.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MiddlewareCloudProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client__ = __webpack_require__(758);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_socket_io_client__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MiddlewareCloudProvider = /** @class */ (function () {
    function MiddlewareCloudProvider() {
        var _this = this;
        this.host = 'wss://wsapi.washstation.pt';
        this.socket = null;
        this.incomingPkgObs = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
        this.incomingMsgObs = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
        this.storage = new __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]({});
        this.sessionToken = null;
        this.storage.get('id_token').then(function (idToken) { _this.sessionToken = idToken; });
    }
    MiddlewareCloudProvider.prototype.connect = function (userId) {
        var _this = this;
        if (this.socket || !userId)
            return;
        // NOTE: Check this workflow (connect/reconnect) for multiple joins
        this.socket = __WEBPACK_IMPORTED_MODULE_3_socket_io_client__["connect"](this.host, { reconnection: true });
        this.socket.on('connect', function () {
            _this.socket.emit('join', { userId: userId });
        }).emit('authenticate', { token: this.sessionToken });
        this.socket.on('reconnect', function () {
            _this.socket.emit('join', { userId: userId });
            _this.socket.emit('authenticate', { token: _this.sessionToken });
        });
        // Incomming messages.
        this.socket.on('send', function (pkg) {
            try {
                if (pkg.hasOwnProperty('vmconnected') && !pkg.vmconnected) { }
                _this.incomingPkgObs.next(pkg);
            }
            catch (e) { }
        });
        this.socket.on('chargeAlert', function (msg) {
            _this.incomingMsgObs.next(msg);
        });
    };
    MiddlewareCloudProvider.prototype.disconnect = function () {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    };
    MiddlewareCloudProvider.prototype.send = function (pkg) {
        if (this.socket) {
            this.socket.emit('send1', pkg);
        }
    };
    MiddlewareCloudProvider.prototype.getPkg = function () {
        return this.incomingPkgObs.asObservable();
    };
    MiddlewareCloudProvider.prototype.getPushNotif = function () {
        return this.incomingMsgObs.asObservable();
    };
    MiddlewareCloudProvider.prototype.subscribeLaundry = function (laundryId) {
        if (this.socket) {
            this.socket.emit('subscribe', { room: "cloud." + laundryId });
            this.socket.emit('vmconnected', "cloud." + laundryId);
        }
    };
    MiddlewareCloudProvider.prototype.unsubscribeLaundry = function (laundryId) {
        if (this.socket) {
            this.socket.emit('unsubscribe', { room: "cloud." + laundryId });
        }
    };
    MiddlewareCloudProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], MiddlewareCloudProvider);
    return MiddlewareCloudProvider;
}());

//# sourceMappingURL=middleware-cloud.js.map

/***/ }),

/***/ 757:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_globalization__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_user_session_user_session__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_backend_api_backend_api__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_middleware_cloud_middleware_cloud__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};












var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, userSession, utils, backendApi, translate, globalization, middlewareCloud) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.userSession = userSession;
        this.utils = utils;
        this.backendApi = backendApi;
        this.translate = translate;
        this.globalization = globalization;
        this.middlewareCloud = middlewareCloud;
        this.pages = [];
        this.pagesSideMenu = [];
        this.langSubs = null;
        this.storage = new __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]({});
        this.middleSubs = null;
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
        this.pagesSideMenu = this.pages.filter(function (el) { return (el.title !== 'PROFILE'); });
        this.middleSubs = this.middlewareCloud.getPushNotif().subscribe(function (notif) {
            _this.utils.presentToast('CHARGE_RECEIVED_SUCCESS', 'toast-success');
            if (_this.userSession.id) {
                _this.backendApi.getUserDetails(_this.userSession.id).subscribe(function (res) {
                    if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
                        var appCard = res.cards.find(function (el) { return (el.type === 'APP'); });
                        _this.userSession.balance = Number(appCard.balance);
                    }
                });
            }
        });
    }
    MyApp.prototype.ngOnDestroy = function () {
        if (this.langSubs)
            this.langSubs.unsubscribe();
        if (this.middleSubs)
            this.middleSubs.unsubscribe();
    };
    MyApp.prototype.getDeviceLanguage = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.globalization.getPreferredLanguage()
                .then(function (res) { return resolve(res); })
                .catch(function (e) { return resolve(false); });
        });
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.storage.get('selectedLang').then(function (selectedLang) { return __awaiter(_this, void 0, void 0, function () {
                var deviceLanguage_1, langOpts, aux;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!selectedLang) return [3 /*break*/, 1];
                            this.translate.setDefaultLang(selectedLang);
                            this.userSession.selectedLang = selectedLang;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.getDeviceLanguage()];
                        case 2:
                            deviceLanguage_1 = _a.sent();
                            if (deviceLanguage_1 && deviceLanguage_1.hasOwnProperty('value')) {
                                langOpts = ['pt', 'es', 'fr', 'en', 'nl'];
                                aux = langOpts.find(function (el) { return deviceLanguage_1['value'].indexOf(el) !== -1; });
                                if (aux) {
                                    this.translate.setDefaultLang(aux);
                                    this.userSession.selectedLang = aux;
                                }
                                else {
                                    this.translate.setDefaultLang('en');
                                    this.userSession.selectedLang = 'en';
                                }
                            }
                            else {
                                this.translate.setDefaultLang('pt');
                                this.userSession.selectedLang = 'pt';
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            _this.langSubs = _this.userSession.getLangEv().subscribe(function (res) {
                if (res) {
                    _this.translate.setDefaultLang(res);
                }
            });
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            _this.platform.resume.subscribe(function (res) { return _this.getUserDetails(); });
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */]);
        });
    };
    MyApp.prototype.logout = function () {
        this.userSession.logout();
        this.middlewareCloud.disconnect();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */]);
    };
    MyApp.prototype.selectPage = function (page) {
        this.utils.setPage(page.title);
    };
    MyApp.prototype.getUserDetails = function () {
        var _this = this;
        if (this.userSession.id) {
            this.backendApi.getUserDetails(this.userSession.id).subscribe(function (res) {
                if (res.hasOwnProperty('cards') && Array.isArray(res.cards)) {
                    var appCard = res.cards.find(function (el) { return (el.type === 'APP'); });
                    _this.userSession.balance = Number(appCard.balance);
                    _this.userSession.cardId = appCard.cardId;
                }
                if (res.hasOwnProperty('paymentsRequests') && Array.isArray(res.paymentsRequests) && res.paymentsRequests.length > 0 && res.paymentsRequests[0].ep_status && res.paymentsRequests[0].ep_status.indexOf('err') === -1) {
                    _this.userSession.paymentRef = res.paymentsRequests[0];
                    _this.userSession.paymentRef.ep_date = new Date(_this.userSession.paymentRef.ep_date);
                }
                else {
                    _this.userSession.paymentRef = null;
                }
                _this.userSession.email = res.email;
                _this.userSession.nif = res.nif;
                _this.userSession.mobileContact = res.address.mobileNumber;
                _this.userSession.birthday = res.birthDate;
                _this.userSession.gender = res.sex;
                _this.userSession.address = res.address;
                _this.storage.set('userId', _this.userSession.id);
                _this.storage.set('name', _this.userSession.name);
                _this.userSession.isAuth = true;
            });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\Luiz Henrique\Desktop\WashStation\src\app\app.html"*/'<ion-menu [content]="content" persistent="true">\n\n  <ion-header>\n\n    <ion-toolbar color="navbar">\n\n      <ion-item id="menu-header" no-lines menuClose (click)="selectPage(pages[1])">\n\n        <ion-icon name="ios-contact" item-start style="font-size: 4.5rem;"></ion-icon>\n\n        <p>{{ userSession.name }}</p>\n\n      </ion-item>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n  <ion-content>\n\n    <ion-list>\n\n      <button class="menu-item item-arrow" menuClose no-lines ion-item *ngFor="let p of pagesSideMenu" (click)="selectPage(p)">\n\n        <ion-icon [name]="p.icon" item-start></ion-icon>\n\n        {{ p.title | translate }}\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n  <ion-footer>\n\n    <button id="logout-btn" class="menu-item" menuClose ion-item (click)="logout()">\n\n      <ion-icon name="ios-power" item-start></ion-icon>\n\n      {{ \'LOGOUT\' | translate }}\n\n    </button>\n\n  </ion-footer>\n\n</ion-menu>\n\n\n\n<ion-nav #content swipeBackEnabled="false"></ion-nav>\n\n'/*ion-inline-end:"C:\Users\Luiz Henrique\Desktop\WashStation\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_9__providers_user_session_user_session__["a" /* UserSessionProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_utils_utils__["a" /* UtilsProvider */],
            __WEBPACK_IMPORTED_MODULE_10__providers_backend_api_backend_api__["a" /* BackendApiProvider */],
            __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_globalization__["a" /* Globalization */],
            __WEBPACK_IMPORTED_MODULE_11__providers_middleware_cloud_middleware_cloud__["a" /* MiddlewareCloudProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MachinesProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_forkJoin__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_forkJoin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_forkJoin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__backend_api_backend_api__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MachinesProvider = /** @class */ (function () {
    function MachinesProvider(backendApi) {
        this.backendApi = backendApi;
        this.reservationTimeout = 5 * 60 * 1000; // [ms]
        this.machines = [];
        this.programs = [];
        this.resTimers = [];
        this.wasMachine = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
        this.dryMachine = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
    }
    MachinesProvider.prototype.getMachines = function (laundryId) {
        var _this = this;
        var wasMachinesObs = this.backendApi.getMachinesConfigs(laundryId, 'wash');
        var dryMachinesObs = this.backendApi.getMachinesConfigs(laundryId, 'dry');
        var programsObs = this.backendApi.getPrograms(laundryId);
        __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].forkJoin([wasMachinesObs, dryMachinesObs, programsObs]).subscribe(function (res) {
            _this.machines = res[0].concat(res[1]);
            _this.machines.forEach(function (el, i) {
                // el.status = 'OK';
                el.status = 'ISSUE';
            });
            _this.programs = res[2];
            _this.programs.forEach(function (el) {
                if (el.hasOwnProperty('priceApp') && el.priceApp) {
                    el.priceCard = el.priceApp;
                }
            });
        }, function (err) { });
    };
    MachinesProvider.prototype.getPrograms = function (type) {
        return this.programs.filter(function (el) { return (el.program.type === type); });
    };
    MachinesProvider.prototype.getWasMachines = function () {
        return this.machines.filter(function (item) { return (item.type === 'wash'); });
    };
    MachinesProvider.prototype.getDryMachines = function () {
        return this.machines.filter(function (item) { return (item.type === 'dry'); });
    };
    MachinesProvider.prototype.updateMachineState = function (pkg) {
        var _this = this;
        var machine = null;
        var timer = null;
        if (pkg.op !== 'cancel-orders') {
            machine = this.machines.find(function (item) { return (item.config.intId === pkg.data.id && item.peripheral_has_machines[0].channel === pkg.data.chn); });
            timer = this.resTimers.find(function (item) { return (item.intId === pkg.data.id && item.channel === pkg.data.chn); });
        }
        switch (pkg.op) {
            case 'machine-started':
                if (!machine && machine.status === 'NOK')
                    return;
                machine.status = 'NOK';
                // Clear timeout.
                clearTimeout(timer.resTimer);
                timer.resTimer = setTimeout(function () {
                    machine.status = 'OK';
                    timer.resTimer = null;
                    timer.progDur = 0;
                    _this.sendMachineChanges(machine);
                }, timer.progDur * 60 * 1000);
                break;
            case 'door-opened':
                if (machine && machine.type === 'wash') {
                    clearTimeout(timer.resTimer);
                    machine.status = 'OK';
                    timer.resTimer = null;
                    timer.progDur = 0;
                    this.sendMachineChanges(machine);
                }
                break;
            case 'machine-reserved':
                if (machine)
                    machine.status = 'RES';
                break;
            case 'machine-res-canceled':
                if (machine && machine.status === 'RES') {
                    machine.status = 'OK';
                }
                break;
            case 'cancel-orders':
                this.machines.forEach(function (machine) {
                    if (machine.status === 'RES') {
                        machine.status = 'OK';
                        _this.sendMachineChanges(machine);
                    }
                });
                break;
        }
        if (machine) {
            this.sendMachineChanges(machine);
        }
    };
    MachinesProvider.prototype.setMahineProgDuration = function (intId, chn, progDur) {
        var timer = this.resTimers.find(function (item) { return (item.intId === intId && item.channel === chn); });
        timer.progDur = progDur;
    };
    MachinesProvider.prototype.sendMachineChanges = function (machine) {
        if (machine.type === 'wash') {
            this.wasMachine.next(machine);
        }
        if (machine.type === 'dry') {
            this.dryMachine.next(machine);
        }
    };
    MachinesProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__backend_api_backend_api__["a" /* BackendApiProvider */]])
    ], MachinesProvider);
    return MachinesProvider;
}());

//# sourceMappingURL=machines.js.map

/***/ }),

/***/ 778:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OrdersProvider = /** @class */ (function () {
    function OrdersProvider() {
        this.orders = [];
        this.total = { totalPriceCoin: 0.00, totalPriceCard: 0.00 };
        this.totalPrice = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
        this.count = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Subject"]();
    }
    OrdersProvider.prototype.reset = function () {
        this.orders = [];
        this.setCount();
        this.setTotalPrice();
    };
    OrdersProvider.prototype.add = function (newOrder) {
        var i = this.orders.findIndex(function (el) { return (el.machine.machineId === newOrder.machine.machineId); });
        if (i !== -1) {
            this.orders[i] = newOrder;
        }
        else {
            this.orders.push(newOrder);
        }
        this.setCount();
        this.setTotalPrice();
    };
    OrdersProvider.prototype.remove = function (order) {
        this.orders = this.orders.filter(function (el) { return (el.machine.machineId !== order.machine.machineId); });
        this.setCount();
        this.setTotalPrice();
    };
    OrdersProvider.prototype.get = function () {
        return this.orders;
    };
    OrdersProvider.prototype.setCount = function () {
        this.count.next(this.orders.length);
    };
    OrdersProvider.prototype.getCount = function () {
        return this.count.asObservable();
    };
    OrdersProvider.prototype.setTotalPrice = function () {
        this.total = {
            totalPriceCoin: this.orders.map(function (el) { return el.program['selPrice']; }).reduce(function (prevVal, el) { return prevVal + Number(el); }, 0.00),
            totalPriceCard: this.orders.map(function (el) { return el.program['selPriceCard']; }).reduce(function (prevVal, el) { return prevVal + Number(el); }, 0.00),
        };
        this.totalPrice.next(this.total);
    };
    OrdersProvider.prototype.getTotalPrice = function () {
        return this.totalPrice.asObservable();
    };
    OrdersProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], OrdersProvider);
    return OrdersProvider;
}());

//# sourceMappingURL=orders.js.map

/***/ })

},[430]);
//# sourceMappingURL=main.js.map