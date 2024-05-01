import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { SelectProgramPage } from '../select-program/select-program';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { MachinesProvider } from '../../providers/machines/machines';
import { OrdersProvider } from '../../providers/orders/orders';
import { MiddlewareCloudProvider } from '../../providers/middleware-cloud/middleware-cloud';


@Component({
  selector: 'page-washing',
  templateUrl: 'washing.html',
})
export class WashingPage implements OnDestroy {

	wasMachineImgs: Array<string> = [
		'assets/imgs/L1.png',
		'assets/imgs/L2.png',
		'assets/imgs/L3.png',
	];
	animationInd: number = 0;

	wasMachineImg: string = this.wasMachineImgs[this.animationInd];
	wasMachineStaticImg: string = this.wasMachineImgs[0];

	wasMachines: Array<any> = [];
	programs: Array<any> = [];

  middleSubs: Subscription = null;
  timer: any = null;
  statusReqTimeout: number = 20*1000;

	constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userSession: UserSessionProvider,
              private orders: OrdersProvider,
              private middlewareCloud: MiddlewareCloudProvider,
              private machines: MachinesProvider) {
    this.wasMachines = this.navParams.data.wasMachines;
    this.programs = this.navParams.data.programs;

    this.middleSubs = this.middlewareCloud.getPkg().subscribe(
      pkg => {
        if (typeof pkg === 'object') {
          if (!pkg.hasOwnProperty('code')) {
            switch (pkg.op) {
              case 'status_int':
                if (pkg.hasOwnProperty('dev')) this.setStatus(pkg.dev);
                break;
              case 'machine-started':
              case 'door-opened':
                this.middlewareCloud.send({ op: 'status_int' });
                break;
            }
          }
        }
      }
    );
    this.statusReq();
    this.animateMachine();
  }

  ionViewDidEnter() {
    this.middlewareCloud.send({ op: 'status_int' });
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    if (this.middleSubs) this.middleSubs.unsubscribe();
  }

  getStatusClass(wasMachine, type) {
    switch(wasMachine.status) {
      case 'ISSUE':
        return (type === 'machine') ? 'machine-issue' : 'machine-index-issue';
      case 'NOK':
        return (type === 'machine') ? 'machine-n-ok' : 'machine-index-n-ok';
      case 'OK':
      case 'RES':
        return (type === 'machine') ? 'machine-ok' : 'machine-index-ok';
    }
  }

  selectProgram(wasMachine) {
  if (wasMachine.status === 'NOK' || wasMachine.status === 'ISSUE') return;
    let modalArgs = {
        machine: wasMachine,
        programs: this.programs.filter(el => (el.machine_machineId === wasMachine.machineId)),
        // programs: this.programs.filter(el => (el.program.capacity === wasMachine.config.capacity)),
        type: 'washing-machine',
        img: this.wasMachineImg,
        laundryId: this.navParams.data.laundryId,
        laundry: this.navParams.data.laundry
    };
    this.navCtrl.push(SelectProgramPage, modalArgs);
  }

  setStatus(status) {
    let newStatusObj = null;
    let len = null;
    this.wasMachines.forEach(el1 => {
      newStatusObj = status.find(el2 => (el1.hasOwnProperty('config') && el2.id === el1.config.intId));
      if (newStatusObj) {
        len = newStatusObj.status.length;

        let auxValue = (el1.hasOwnProperty('config') && el1.config.activation === 'high') ? '1' : '0';
        if (newStatusObj.active === '1') {
          if (newStatusObj.status[len - Number(el1.peripheral_has_machines[0].channel)] === auxValue) {
            // Machine working.
            el1.status = 'NOK';
          } else {
            // Machine idle.
            el1.status = 'OK';
          }
        } else {
          // Disconnected interface.
          el1.status = 'ISSUE';
        }
      } else {
        el1.status = 'ISSUE';
      }
    });
  }

  statusReq() {
    let pkg = { op: 'status_int' };
    this.middlewareCloud.send(pkg);
    this.timer = setTimeout(() => { this.statusReq(); }, this.statusReqTimeout);
  }

	animateMachine() {
    setTimeout(() => {
      if (this.animationInd === this.wasMachineImgs.length - 1) {
        this.animationInd = 0;
      } else {
        this.animationInd++;
      }
      this.wasMachineImg = this.wasMachineImgs[this.animationInd];
      this.animateMachine();
    }, 700);
  }
}
