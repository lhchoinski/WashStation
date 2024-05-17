import { Component, OnDestroy } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';

import { UtilsProvider } from '../../providers/utils/utils';
import { MiddlewareCloudProvider } from '../../providers/middleware-cloud/middleware-cloud';
import { BackendApiProvider } from '../../providers/backend-api/backend-api';
import { UserSessionProvider } from '../../providers/user-session/user-session';
import { OrdersProvider } from '../../providers/orders/orders';
import { MachinesProvider } from '../../providers/machines/machines';
import { WashstationInfoProvider } from '../../providers/washstation-info/washstation-info';


@Component({
	selector: 'page-select-program',
	templateUrl: 'select-program.html',
})
export class SelectProgramPage implements OnDestroy {

	workflowTimeout: number = 1500;

	plusImg: string = 'assets/imgs/+.png';
	minusImg: string = 'assets/imgs/-.png';
	cardImg: string = 'assets/imgs/cartao-icon.png';
	coinImg: string = 'assets/imgs/moedas-icon.png';

	laundry: any = 0;

	minDuration: number = 0; // Minimum drying duration [min.]
	maxDuration: number = 120; // Maximum drying duration [min.]
	duration: number = 0;
	durStep: number = 0;

	machineType: string = "";
	machine: any = "";
	programs: Array<any> = [];
	img: string = "";

	priceCard: string = "";
	costCard: number = 0;

	wasImpulses: number = 1;
	dryImpulses: number = 1;

	totalCostCard: number = 0.00;
	btnEnabled: boolean = true;
	loading: any = "";
	middleSubs: Subscription = null;
	timer: any = "";
	feedbackTimeout: number = 15 * 1000;
	actReqSent: boolean = false;

	actFeedbackEnabled: boolean = true;

	constructor(private navParams: NavParams,
		private middlewareCloud: MiddlewareCloudProvider,
		private backendApi: BackendApiProvider,
		private loadingCtrl: LoadingController,
		private utils: UtilsProvider,
		private orders: OrdersProvider,
		private userSession: UserSessionProvider,
		private translate: TranslateService,
		private alertCtrl: AlertController,
		private machines: MachinesProvider,
		private diagnostic: Diagnostic,
		private wsInfo: WashstationInfoProvider,
		private navCtrl: NavController) {
		this.laundry = this.navParams.data.laundry;
		this.machineType = this.navParams.data.type;
		this.machine = this.navParams.data.machine;
		this.programs = this.navParams.data.programs;
		this.img = this.navParams.data.img;

		if (this.machineType === 'washing-machine') {
			this.programs.forEach(el => {
				el.selected = false;
				if (!el.duration) {
					el.duration = el.program.duration.toString();
				}
			});
			// Set initial program.
			this.programs[0].selected = true;
			this.priceCard = this.programs[0].priceCard;
		} else {
			this.minDuration = Number(this.machine.config.durPerImp);
			this.duration = this.minDuration;
			this.durStep = Number(this.machine.config.durPerImp);
			this.priceCard = this.navParams.data.programs[0].priceCard;
			this.costCard = Number(this.priceCard);
		}

		this.middleSubs = this.middlewareCloud.getPkg().subscribe(
			pkg => {
				if (typeof pkg === 'object') {
					if (this.actReqSent && pkg.hasOwnProperty('op') && pkg.op === 'activate-machine' && pkg.hasOwnProperty('code') && pkg.code === '200') {
						this.backendApi.setOrders(this.getOrderRegObj()).subscribe(
							res => setTimeout(() => { if (this.loading) this.loading.dismiss(true); }, this.workflowTimeout),
							err => setTimeout(() => { if (this.loading) this.loading.dismiss(false); }, this.workflowTimeout),
						);
					}
				}
			}
		);
	}

	ngOnDestroy() {
		clearTimeout(this.timer);
		if (this.middleSubs) this.middleSubs.unsubscribe();
	}

	close() {
		this.navCtrl.pop();
	}

	submit() {

		if (this.utils.getDistanceFromLatLonInKm(this.laundry.lat, this.laundry.lng, this.userSession.lat, this.userSession.lng) > this.wsInfo.minDistanceFromLaundry) {
			this.utils.presentToast('TOO_FAR_AWAY_MSG', 'toast-error', { value: this.wsInfo.minDistanceFromLaundry * 1000 });
			return;
		}
		
		let program = null;
		let order = null;
		let pkg = null;

		switch (this.machineType) {
			case 'washing-machine':
				program = this.programs.find(program => (program.selected));
				program.selPriceCard = program.priceCard;
				program.impulses = this.wasImpulses.toString();

				program.impulses = Math.floor(program.program.duration / this.machine.config.durPerImp);
				order = {
					machine: this.machine,
					program: program,
				}

				this.orders.reset();
				this.orders.add(order);

				pkg = {
					op: 'machine-reserved',
					data: {
						id: this.machine.config.intId,
						chn: this.machine.peripheral_has_machines[0].channel,
						progDur: program.program.duration + 1,  // [.min]
					},
				};
				this.machines.updateMachineState(pkg);
				break;
			case 'drying-machine':
				program = this.programs[0];
				program.selPriceCard = this.costCard.toFixed(2);
				program.program.selDuration = `- ${this.duration} min.`;
				program.totalDuration = this.duration;
				program.impulses = this.dryImpulses.toString();

				program.impulses = Math.floor(program.totalDuration / this.machine.config.durPerImp);
				order = {
					machine: this.machine,
					program: program,
				}

				this.orders.reset();
				this.orders.add(order);

				pkg = {
					op: 'machine-reserved',
					data: {
						id: this.machine.config.intId,
						chn: this.machine.peripheral_has_machines[0].channel,
						progDur: program.totalDuration + 1,  // [.min]
					},
				};
				this.machines.updateMachineState(pkg);
				break;
		}
		this.setTotal();

		if (!this.actFeedbackEnabled) {
			this.completeOrder();
		} else {
			this.completeOrderWithFeedback();
		}
	}

	updateDuration(action) {
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
	}

	selectProgram(program) {
		this.programs.forEach(program => {
			program.selected = false;
		});
		program.selected = !program.selected;
		this.priceCard = program.priceCard;
	}

	setTotal() {
		this.totalCostCard = this.orders.get()
			.map(el => el.program.selPriceCard)
			.reduce((prevVal, el) => prevVal + Number(el), 0.00);
	}

	cancelOrders() {
		let pkg = {
			op: 'cancel-orders'
		};
		this.machines.updateMachineState(pkg);
		setTimeout(() => { this.orders.reset(); }, 1000);
		this.close();
	}

	completeOrderWithFeedback() {
		if (!this.btnEnabled) return;

		if (this.userSession.balance >= this.totalCostCard) {
			this.btnEnabled = false;

			let alert = this.alertCtrl.create({
				title: this.translate.instant('MAKE_PAYMENT_CONF_MSG'),
				message: (this.machineType === 'washing-machine') ? this.programs[0].program.name + ' (' + this.programs[0].duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>' : this.programs[0].program.name + ' (' + this.duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>',
				cssClass: 'custom-alert',
				buttons: [
					{
						text: this.translate.instant('NO'),
						role: 'cancel',
						cssClass: 'cancel-btn',
						handler: () => { this.btnEnabled = true; }
					},
					{
						text: this.translate.instant('YES'),
						cssClass: 'ok-btn',
						handler: () => {
							this.sendActivationRequest();

							this.loading = this.loadingCtrl.create({
								content: this.translate.instant('BUY_WAITING_MSG'),
							});
							this.loading.onDidDismiss((res) => {
								if (res) {
									let toast = this.utils.presentToast('ORDER_COMPLETE', 'toast-success', null, false, this.workflowTimeout);

									toast.onDidDismiss(() => {
										this.btnEnabled = true;

										this.userSession.balance = (this.userSession.balance - this.totalCostCard < 0) ? 0 : this.userSession.balance - this.totalCostCard;
										this.orders.reset();

										this.close();
									});
								} else {
									this.btnEnabled = true;
									this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
								}
								this.actReqSent = false;
							});
							this.loading.present();
							this.timer = setTimeout(() => { if (this.loading) this.loading.dismiss(false); }, this.feedbackTimeout);
						}
					}
				]
			});
			alert.present();
		} else {
			this.utils.presentToast('NOT_ENOUGH_BALANCE', 'toast-error');
		}
	}

	completeOrder() {
		if (!this.btnEnabled) return;

		if (this.userSession.balance >= this.totalCostCard) {
			this.btnEnabled = false;

			let alert = this.alertCtrl.create({
				title: this.translate.instant('MAKE_PAYMENT_CONF_MSG'),
				message: (this.machineType === 'washing-machine') ? this.programs[0].program.name + ' (' + this.programs[0].duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>' : this.programs[0].program.name + ' (' + this.duration + ' ' + this.translate.instant('MIN') + ')<div>' + this.totalCostCard.toFixed(2) + '&euro;</div>',
				cssClass: 'custom-alert',
				buttons: [
					{
						text: this.translate.instant('NO'),
						role: 'cancel',
						cssClass: 'cancel-btn',
						handler: () => { this.btnEnabled = true; }
					},
					{
						text: this.translate.instant('YES'),
						cssClass: 'ok-btn',
						handler: () => {
							this.loading = this.loadingCtrl.create({
								content: this.translate.instant('BUY_WAITING_MSG'),
							});
							this.loading.onDidDismiss((res) => {
								if (res) {
									this.sendActivationRequest();

									let toast = this.utils.presentToast('ORDER_COMPLETE', 'toast-success', null, false, this.workflowTimeout);

									toast.onDidDismiss(() => {
										this.btnEnabled = true;

										this.userSession.balance = (this.userSession.balance - this.totalCostCard < 0) ? 0 : this.userSession.balance - this.totalCostCard;
										this.orders.reset();

										this.close();
									});
								} else {
									this.btnEnabled = true;
									this.utils.presentToast('CHECK_INTERNET_CONNECTION', 'toast-error');
								}
								this.actReqSent = false;
							});
							this.loading.present();

							this.backendApi.setOrders(this.getOrderRegObj()).subscribe(
								res => setTimeout(() => { if (this.loading) this.loading.dismiss(true); }, this.workflowTimeout),
								err => setTimeout(() => { if (this.loading) this.loading.dismiss(false); }, this.workflowTimeout),
							);
						}
					}
				]
			});
			alert.present();
		} else {
			this.utils.presentToast('NOT_ENOUGH_BALANCE', 'toast-error');
		}
	}

	getOrderRegObj() {
		let obj = {
			cardId: this.userSession.cardId,
			nif: this.userSession.nif,
			expense: true,
			priceTotal: this.totalCostCard,
			laundryId: this.navParams.data.laundryId,
			orders: [],
		};
		this.orders.orders.forEach(item => {
			obj.orders.push({
				price: Number(item.program.selPriceCard),
				machineProgramId: item.program.machineProgramId,
				impulses: (item.program.impulses) ? item.program.impulses : 1,
			});
		});
		return obj;
	}

	sendActivationRequest() {
		let actMsg = [];
		this.orders.get().forEach((item, i) => {
			let act = {
				id: item.machine.config.intId,
				chn: item.machine.peripheral_has_machines[0].channel,
				impulses: (item.program.impulses) ? item.program.impulses.toString() : '1',
			};
			actMsg.push(act);
		});

		let pkg = {
			op: 'activate-machine',
			data: actMsg,
		};
		this.actReqSent = true;
		this.middlewareCloud.send(pkg);
	}
}
