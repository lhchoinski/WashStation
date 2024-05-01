import { Injectable } from '@angular/core';

import { BackendApiProvider } from '../backend-api/backend-api';


@Injectable()
export class WashstationInfoProvider {

  appVersion: string = 'V1.1.0';
  washStationInfo: any = null;
  minCharge: number = 10;
  maxCharge: number = 100;
  minDistanceFromLaundry: number = 0.1;  // [Km]
  visaFwdUrl: string = 'api.washstation.pt';
  termsObj: Array<any> = [];

  constructor(private backendApi: BackendApiProvider) {
    this.getWashstationInfo();
  }

  getWashstationInfo() {
    this.backendApi.getWashstationInfo().subscribe(
      res => {
        this.washStationInfo = res[0];
        if (res[0].minValCharge !== null) this.minCharge = Number(res[0].minValCharge);
        if (res[0].maxValCharge !== null) this.maxCharge = Number(res[0].maxValCharge);
        if (res[0].minDistance !== null) this.minDistanceFromLaundry = Number(res[0].minDistance);
        if (Array.isArray(res[0].terms)) this.termsObj = res[0].terms;
      }
    );
  }
}
