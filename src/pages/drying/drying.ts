import { Component, OnDestroy } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { SelectProgramPage } from '../select-program/select-program';

import { UserSessionProvider } from '../../providers/user-session/user-session';
import { MachinesProvider } from '../../providers/machines/machines';
import { OrdersProvider } from '../../providers/orders/orders';
import { MiddlewareCloudProvider } from '../../providers/middleware-cloud/middleware-cloud';


@Component({
  selector: 'page-drying',
  templateUrl: 'drying.html',
})
export class DryingPage implements OnDestroy {

	dryMachineImgs: Array<string> = [
		'assets/imgs/S1.png',
		'assets/imgs/S2.png',
		'assets/imgs/S3.png',
		'assets/imgs/S4.png',
	];
	animationInd: number = 0;

	dryMachineImg: string = this.dryMachineImgs[this.animationInd];
	dryMachineStaticImg: string = this.dryMachineImgs[0];

	dryMachines: Array<any> = [];
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
    this.dryMachines = this.navParams.data.dryMachines;
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

  ngOnDestroy() {
    clearTimeout(this.timer);
    if (this.middleSubs) this.middleSubs.unsubscribe();
  }

	getStatusClass(dryMachine, type) {
	    switch(dryMachine.status) {
        case 'ISSUE':
          return (type === 'machine') ? 'machine-issue' : 'machine-index-issue';
        case 'NOK':
          return (type === 'machine') ? 'machine-n-ok' : 'machine-index-n-ok';
        case 'OK':
        case 'RES':
          return (type === 'machine') ? 'machine-ok' : 'machine-index-ok';
	    }
	}

	selectProgram(dryMachine) {
		if (dryMachine.status === 'NOK' || dryMachine.status === 'ISSUE') return;

		let modalArgs = {
		    machine: dryMachine,
        // programs: this.programs.filter(el => (el.program.capacity === dryMachine.config.capacity)),
        programs: this.programs.filter(el => (el.machine_machineId === dryMachine.machineId)),
		    type: 'drying-machine',
				img: this.dryMachineImg,
        laundryId: this.navParams.data.laundryId,
        laundry: this.navParams.data.laundry
		};
    this.navCtrl.push(SelectProgramPage, modalArgs);
	}

	setStatus(status) {
    let newStatusObj = null;
    let len = null;
    this.dryMachines.forEach(el1 => {
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
      if (this.animationInd === this.dryMachineImgs.length - 1) {
        this.animationInd = 0;
      } else {
        this.animationInd++;
      }
      this.dryMachineImg = this.dryMachineImgs[this.animationInd];
      this.animateMachine();
    }, 700);
  }
}
