import { Http } from '@angular/http';
import { AuthHttp }  from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class BackendApiProvider {

  baseUrl: string = 'https://api.washstation.pt/lma/api/v1.0/';
  // baseUrl: string = 'https://lma-prod-backend-test.azurewebsites.net/lma/api/v1.0/';
  // baseUrl: string = 'http://localhost:3550/lma/api/v1.0/';

  constructor(private http: Http,
              private authHttp: AuthHttp) {
  }

	getWashstationInfo(): Observable<any> {
		return this.http.get(this.baseUrl + 'washstation/getinfo')
		    .map(res => res.json())
		    .catch(err => Observable.throw(err.json()));
	}

	authenticate(email, password): Observable<any> {
    let body = {
      username: email,
      password: password,
    }
    return this.http.post(this.baseUrl + 'auth/local/app', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

	getAllLaundries(): Observable<any> {
		return this.authHttp.get(this.baseUrl + 'laundry/getalllaundriesapp')
		    .map(res => res.json())
		    .catch(err => Observable.throw(err.json()));
	}

	getNearbyLaundries(lng, lat, distance): Observable<any> {
		let body = {
			lng: lng,
			lat: lat,
			distance: distance,
		}
		return this.authHttp.post(this.baseUrl + 'laundry/getlaundriesinarea', body)
		  	.map(res => res.json())
		    .catch(err => Observable.throw(err.json()));
	}

	searchLaundries(searchTerm): Observable<any> {
	  	let body = {
	  		searchTerm: searchTerm,
	  	};
	    return this.authHttp.post(this.baseUrl + 'laundry/getlaundriesby', body)
	    	.map(res => res.json())
	      	.catch(err => Observable.throw(err.json()));
	}

  // MACHINE SERVICES ---------------------------------------------------------------------------------------
  getMachinesConfigs(LaundryId, type): Observable<any> {
    let body = {
      laundry_laundryId: LaundryId,
      type: type,
    };
    return this.authHttp.post(this.baseUrl + 'laundry/machine/getmachine', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  getPrograms(laundryId): Observable<any> {
    let body = {
      laundry_laundryId: laundryId,
      allPrograms: true,
    };
    return this.authHttp.post(this.baseUrl + 'machineprogram/getmachineprogram', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  // USER SERVICES ---------------------------------------------------------------------------------------
  createUser(name, email, password): Observable<any> {
    let body = {
      name: name,
      email: email,
      password: password,
    };
    return this.http.post(this.baseUrl + 'users/createuserapp', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  changePassword(oldPassword, newPassword): Observable<any> {
    let body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    return this.authHttp.post(this.baseUrl + 'users/changepassword', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  activateAccount(activationToken): Observable<any> {
    let body = {
      activationToken: activationToken,
    };
    return this.http.post(this.baseUrl + 'auth/local/activation', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  getUserDetails(userId): Observable<any> {
    let body = {
      userId: userId,
      app: true,
    };
    return this.authHttp.post(this.baseUrl + 'users/getuserdetailsbyid', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  updateUserDetails(userId, addressId, name, nif, mobile, birthday, gender, addrObj): Observable<any> {
    let body = {
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
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  forgotPassword(email): Observable<any> {
    let body = {
      email: email
    };
    return this.http.post(this.baseUrl + 'auth/local/forgotpassword', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  recoverAccount(token, password): Observable<any> {
    let body = {
      token: token,
      password: password
    };
    return this.http.post(this.baseUrl + 'auth/local/reset', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  // USER SERVICES ---------------------------------------------------------------------------------------
  setOrders(body): Observable<any> {
    return this.authHttp.post(this.baseUrl + 'orders/neworderapp', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  getMyOrders(offset=0, limit=10): Observable<any> {
    let body = {
      limit: limit,
      offset: offset,      
    };
    return this.authHttp.post(this.baseUrl + 'orders/getallmyorders', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  // PAYMENT SERVICES ------------------------------------------------------------------------------------
  setPaymentRequest(userId, amount, lang='PT'): Observable<any> {
    let body = {
      userId: userId,
      val: amount,
      lang: lang,
    };
    return this.authHttp.post(this.baseUrl + 'payments/receivepaymentapp', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }

  setPaypalPaymentRequest(userId, paypalObj): Observable<any> {
    let body = {
      userId: userId,
      paypalObj: paypalObj,
    };
    return this.authHttp.post(this.baseUrl + 'paymentpaypal/receivepaymentapp', body)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json()));
  }
}
