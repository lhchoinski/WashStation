import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { BackendApiProvider } from '../backend-api/backend-api';


@Injectable()
export class MachinesProvider {

	reservationTimeout: number = 5*60*1000;  // [ms]

	machines: Array<any> = [];
  programs: Array<any> = [];
  resTimers: Array<any> = [];

	wasMachine: Subject<any> = new Subject<any>();
	dryMachine: Subject<any> = new Subject<any>();

  constructor(private backendApi: BackendApiProvider) {}

  getMachines(laundryId) {
    let wasMachinesObs = this.backendApi.getMachinesConfigs(laundryId, 'wash');
    let dryMachinesObs = this.backendApi.getMachinesConfigs(laundryId, 'dry');
    let programsObs = this.backendApi.getPrograms(laundryId);
    Observable.forkJoin([wasMachinesObs, dryMachinesObs, programsObs]).subscribe(
      res => {
        this.machines = res[0].concat(res[1]);
        this.machines.forEach((el, i) => {
          // el.status = 'OK';
          el.status = 'ISSUE';
        });
        this.programs = res[2];
        
        this.programs.forEach(el => {
          if (el.hasOwnProperty('priceApp') && el.priceApp) {
            el.priceCard = el.priceApp;
          }
        });
      },
      err => {}
    );
  }

  getPrograms(type) {
    return this.programs.filter(el => (el.program.type === type));
  }

  getWasMachines() {
     return this.machines.filter(item => (item.type === 'wash'));
  }

  getDryMachines() {
    return this.machines.filter(item => (item.type === 'dry'));
  }

  updateMachineState(pkg) {
    let machine = null;
    let timer = null;
    if (pkg.op !== 'cancel-orders') {
      machine = this.machines.find(item => (item.config.intId === pkg.data.id && item.peripheral_has_machines[0].channel === pkg.data.chn));
      timer = this.resTimers.find(item => (item.intId === pkg.data.id && item.channel === pkg.data.chn));
    }
    switch (pkg.op) {
      case 'machine-started':
        if (!machine && machine.status === 'NOK') return;
        machine.status = 'NOK';
        // Clear timeout.
        clearTimeout(timer.resTimer);
        timer.resTimer = setTimeout(() => {
          machine.status = 'OK';
          timer.resTimer = null;
          timer.progDur = 0;
          this.sendMachineChanges(machine);
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
        if (machine) machine.status = 'RES';
        break;
      case 'machine-res-canceled':
        if (machine && machine.status === 'RES') {
          machine.status = 'OK';
        }
        break
      case 'cancel-orders':
        this.machines.forEach(machine => {
          if (machine.status === 'RES') {
            machine.status = 'OK';
            this.sendMachineChanges(machine);
          }
        });
        break;
    }
    if (machine) {
      this.sendMachineChanges(machine);
    }
  }

  setMahineProgDuration(intId, chn, progDur) {
    let timer = this.resTimers.find(item => (item.intId === intId && item.channel === chn));
    timer.progDur = progDur;
  }

  sendMachineChanges(machine) {
    if (machine.type === 'wash') {
      this.wasMachine.next(machine);
    }

    if (machine.type === 'dry') {
      this.dryMachine.next(machine);
    }
  }
}
