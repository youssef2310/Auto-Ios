import { Inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SharedMethodsService } from './shared-methods.service';
import { SharedVariablesService } from './shared-variables.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _fireParent: Subject<boolean> = new Subject<boolean>(); // consider putting the actual type of the data you will receive
  public fireParentObs = this._fireParent.asObservable();

  constructor(
    public sharedVariables: SharedVariablesService,
    public sharedMethods: SharedMethodsService,
    private httpClient: HttpClient,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform
  ) {}

  getParentChildren(observe?: boolean) {
    if (observe == true) this._fireParent.next(true);
    const formData: FormData = new FormData();
    formData.append('token', localStorage.getItem('userToken'));
    formData.append('lang', localStorage.getItem('lang'));
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append(
      'lat',
      localStorage.getItem('currentLatitude')
        ? localStorage.getItem('currentLatitude')
        : String(0)
    );

    formData.append(
      'lon',
      localStorage.getItem('currentLongitude')
        ? localStorage.getItem('currentLongitude')
        : String(0)
    );
    formData.append('cacheBust', String(new Date().getTime()));
    // var data = '';
    // data = data + 'token=' + localStorage.getItem('userToken');
    // data =
    //   data + '&project_id=' + this.sharedVariables.globalVariables.projectID;
    // data = data + '&lat=' + localStorage.getItem('currentLatitude');
    // data = data + '&lon=' + localStorage.getItem('currentLongitude');
    // data = data + '&cacheBust=' + new Date().getTime();
    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.initState}`,
      formData,
      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }

  login(mobile) {
    let loginData: any = {};

    const formData: FormData = new FormData();
    formData.append('mob', mobile);
    formData.append('lang', localStorage.getItem('lang'));
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));
    formData.append(
      'lat',
      localStorage.getItem('currentLatitude')
        ? localStorage.getItem('currentLatitude')
        : String(0)
    );
    formData.append(
      'lon',
      localStorage.getItem('currentLatitude')
        ? localStorage.getItem('currentLatitude')
        : String(0)
    );

    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.usersRegistration}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map((response: any) => {
          if (response.status_code === 1) {
            localStorage.setItem('smsCode', response.sms_code);
            // this.sharedMethods.presentToast(response.message, 'primary');
          } else if (response.relogin === true) {
            this.translateService.get('pleasereloginagain').subscribe((msg) => {
              this.sharedMethods.presentToast(msg, 'danger','testToast');
            });
          } else if (response.status_code === 0 && response.message) {
            this.sharedMethods.presentToast(response.message, 'danger','testToast');
          }
        })
      );
  }

  verifyCodePassword(code) {
    if (!code) return;

    const formData: FormData = new FormData();

    formData.append('mob', localStorage.getItem('mobile'));
    formData.append('gcm_token', localStorage.getItem('notification_token'));
    formData.append('sms_code', code);
    formData.append('platform', this.platform.is('ios') ? 'ios' : 'android');
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));

    // var data = '';
    // data = data + '&mob=' + localStorage.getItem('mobile');
    // data = data + '&sms_code=' + code;
    // data = data + '&platform=' + this.platform.is('ios') ? 'ios' : 'android';
    // data =
    //   data + '&project_id=' + this.sharedVariables.globalVariables.projectID;
    // data = data + '&cacheBust=' + new Date().getTime();

    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.verification}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map(
          (response: any) => {
            if (response.message)
              this.sharedMethods.presentToast(response.message, 'primary','testToast');

            if (response.status_code === 1) {
              let msg = this.translateService.instant('welcome');
              this.sharedMethods.presentToast(msg, 'primary','testToast');
              localStorage.removeItem('smsCode');
              localStorage.setItem('userToken', response.customer_token);
              localStorage.setItem('user', JSON.stringify(response.user));

              // this.regiosterGCMTokenOnServer(
              //   localStorage.getItem('notification_token')
              // ).subscribe();

              // this.router.navigate(['/tabs/home'], {
              //   relativeTo: this.route,
              // });
            } else if (response.relogin === true) {
              // this.translateService
              //   .get('pleasereloginagain')
              //   .subscribe((msg) => {
              //     this.sharedMethods.presentToast(msg, 'danger');
              //   });
              // this.router.navigate(['/signin'], {
              //   relativeTo: this.route,
              // });
            }
          },
          (error) => {
            this.sharedMethods.presentToast(error.error['message'], 'danger','testToast');
          }
        )
      );
  }

  verifyCode(code) {
    if (!code) return;

    const formData: FormData = new FormData();

    formData.append('mob', localStorage.getItem('mobile'));
    formData.append('gcm_token', localStorage.getItem('notification_token'));
    formData.append('sms_code', code);
    formData.append('platform', this.platform.is('ios') ? 'ios' : 'android');
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));

    // var data = '';
    // data = data + '&mob=' + localStorage.getItem('mobile');
    // data = data + '&sms_code=' + code;
    // data = data + '&platform=' + this.platform.is('ios') ? 'ios' : 'android';
    // data =
    //   data + '&project_id=' + this.sharedVariables.globalVariables.projectID;
    // data = data + '&cacheBust=' + new Date().getTime();

    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.verification}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map(
          (response: any) => {
            if (response.message)
              this.sharedMethods.presentToast(response.message, 'primary','testToast');

            if (response.status_code === 1) {
              let msg = this.translateService.instant('welcome');
              this.sharedMethods.presentToast(msg, 'primary','testToast');
              localStorage.removeItem('smsCode');
              localStorage.setItem('userToken', response.customer_token);
              localStorage.setItem('user', JSON.stringify(response.user));

              this.updateLanguage(localStorage.getItem('lang')).subscribe(
                (res) => {},
                (error) => {}
              );

              // this.regiosterGCMTokenOnServer(
              //   localStorage.getItem('notification_token')
              // ).subscribe();

              this.router.navigate(['/tabs/home'], {
                relativeTo: this.route,
              });
            } else if (response.relogin === true) {
              this.translateService
                .get('pleasereloginagain')
                .subscribe((msg) => {
                  this.sharedMethods.presentToast(msg, 'danger','testToast');
                });

              this.router.navigate(['/signin'], {
                relativeTo: this.route,
              });
            }
          },
          (error) => {
            this.sharedMethods.presentToast(error.error['message'], 'danger','testToast');
          }
        )
      );
  }

  regiosterGCMTokenOnServer(token) {
    const formData: FormData = new FormData();

    formData.append('mob', localStorage.getItem('mobile'));
    formData.append('gcm_token', token);
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));
    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.registerGCMToken}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map((response: any) => {
          if (response.status_code === 1) {
            //localStorage.setItem('GCM_token', token);
          } else if (response.relogin === true) {
            this.sharedMethods.presentToast(response.message, 'danger','testToast');
          }
        })
      );
  }

  callStudent(school_id, parent_id, student_id, date, ready?: boolean) {
    var time = new Date();
    console.log(
      time.toLocaleString('en-US', {
        hour: 'numeric',
        hour12: false,
        minute: 'numeric',
      })
    );

    // console.log(time);

    return this.httpClient
      .post(
        `${this.sharedVariables.apiUrl.upSert}`,
        {
          data: JSON.stringify([
            {
              school: school_id,
              student: student_id,
              code: school_id + student_id,
              parent: parent_id,
              flag: ready == true ? 'range' : 'call',
              date: date,
              time: time.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: false,
                minute: 'numeric',
              }),
            },
          ]),
          project_id: 'autoneda',
          table: 'neda_call_log',
          mobileAuthorization:
            'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
        },

        {
          headers: this.sharedVariables.globalVariables.http_config,
        }
      )
      .pipe(
        map((response: any) => {
          if (response.status_code === 1 && ready !== true) {
            this.translateService
              .get('yourchildhasbeenconfirmedsummoned')
              .subscribe((msg) => {
                this.sharedMethods.presentToast(msg, 'primary','testToast');
              });
          } else if (response.relogin === true) {
            this.translateService.get('pleasereloginagain').subscribe((msg) => {
              this.sharedMethods.presentToast(msg, 'danger','testToast');
            });
            this.router.navigate(['/signin'], {
              relativeTo: this.route,
            });
          }
        })
      );
  }

  // mobileAuthorization=AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea
  // &project_id=autoneda
  // &table=neda_students
  // &conditions={"school":"S0FF","parent":"966595214785"}
  // school_id, student_id

  registerDelegate(code, mob, name, pw) {
    // if(!phoneTwo) phoneTwo="000000000"
    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.upSert}`,
      {
        data: JSON.stringify([
          {
            code: code,
            mob: mob,
            name: name,
            pw: pw,
          },
        ]),
        project_id: 'autoneda',
        table: 'neda_parents',
        mobileAuthorization:
          'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
      },

      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }
  deleteDelegateStudent(code) {
    
    // console.log(time);

    return this.httpClient
      .post(
        `${this.sharedVariables.apiUrl.delete}`,
        {
          conditions: JSON.stringify({
            
            code: code,
          }),
          mobileAuthorization:
            'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
          project_id: 'autoneda',
          table: 'neda_students',
        },

        {
          headers: this.sharedVariables.globalVariables.http_config,
        }
      )
      .pipe(map((response: any) => {}));
  }

  registerDelegateStudents(students) {

    return this.httpClient
      .post(
        `${this.sharedVariables.apiUrl.upSert}`,
        {
          data: JSON.stringify(students),
          mobileAuthorization:
            'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
          project_id: 'autoneda',
          table: 'neda_students',
        },

        {
          headers: this.sharedVariables.globalVariables.http_config,
        }
      )
      .pipe(map((response: any) => {}));
  }

  updateLanguage(lang) {
    const formData: FormData = new FormData();

    formData.append('token', localStorage.getItem('userToken'));
    formData.append('lang', lang);
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));

    // var data = '';
    // data = 'token=' + localStorage.getItem('token');
    // data = data + '&lang=' + lang;
    // data =
    //   data + '&project_id=' + this.sharedVariables.globalVariables.projectID;
    // data = data + '&cacheBust=' + new Date().getTime();

    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.customerProfileUpdate}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map((response: any) => {
          if (response.status_code === 1) {
            this.sharedMethods.presentToast(response.message, 'primary','testToast');
          } else if (response.relogin === true) {
            this.translateService.get('pleasereloginagain').subscribe((msg) => {
              this.sharedMethods.presentToast(msg, 'danger','testToast');
            });
            this.router.navigate(['/signin'], {
              relativeTo: this.route,
            });
          }
        })
      );
  }

  logout() {
    const formData: FormData = new FormData();

    formData.append('token', localStorage.getItem('userToken'));
    formData.append(
      'project_id',
      this.sharedVariables.globalVariables.projectID
    );
    formData.append('cacheBust', String(new Date().getTime()));

    // var data = '';
    // data = data + 'token=' + localStorage.getItem('token');
    // data =
    //   data + '&project_id=' + this.sharedVariables.globalVariables.projectID;
    // data = data + '&cacheBust=' + new Date().getTime();

    return this.httpClient
      .post(`${this.sharedVariables.apiUrl.logout}`, formData, {
        headers: this.sharedVariables.globalVariables.http_config,
      })
      .pipe(
        map((response: any) => {
          this.router.navigate(['/signin'], {
            relativeTo: this.route,
          });
          if (response.status_code === 1) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('parent');
            localStorage.removeItem('user');

            this.router.navigate(['/signin'], {
              relativeTo: this.route,
            });
          } else if (response.relogin === true) {
            this.translateService.get('pleasereloginagain').subscribe((msg) => {
              this.sharedMethods.presentToast(msg, 'danger','testToast');
            });
          }
        })
      );
  }

  updatePaymentStatus(studentCode) {
    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.upSert}`,
      {
        data: JSON.stringify([
          {
            code: studentCode,
            paid: true,
          },
        ]),
        project_id: 'autoneda',
        table: 'neda_students',
        mobileAuthorization:
          'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
      },

      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }

  updateAlertStatus(studentCode) {
    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.upSert}`,
      {
        data: JSON.stringify([
          {
            code: studentCode,
            alert: false,
          },
        ]),
        project_id: 'autoneda',
        table: 'neda_students',
        mobileAuthorization:
          'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
      },

      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }

  setNotificationsAsRead(parent_id, index) {
    let nameOfObject: string = 'notifications.' + index + '.' + 'read';

    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.upSert}`,
      {
        data: JSON.stringify([
          {
            code: parent_id,
            [nameOfObject]: true,
          },
        ]),
        project_id: 'autoneda',
        table: 'neda_parents',
        parent_id: parent_id,
        mobileAuthorization:
          'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
      },

      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }

  saveSpareDriver(parent_id, nameOne, phoneOne, phoneTwo, nameTwo) {
    // if(!phoneTwo) phoneTwo="000000000"
    return this.httpClient.post(
      `${this.sharedVariables.apiUrl.upSert}`,
      {
        data: JSON.stringify([
          {
            driver1M: phoneOne,
            driver1N: nameOne,
            driver2M: phoneTwo,
            driver2N: nameTwo,
            code: parent_id,
          },
        ]),
        project_id: 'autoneda',
        table: 'neda_parents',
        parent_id: parent_id,
        mobileAuthorization:
          'AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea',
      },

      {
        headers: this.sharedVariables.globalVariables.http_config,
      }
    );
  }

 

  verifyUser() {
    let url = 'https://capsegypt.epictechnology.net/api/user/verifyuser';
    return this.httpClient.get(url);
  }

  checkVerificationStatus() {
    // this.verifyUser().subscribe((res: any) => {
    //   let state: boolean = res.success;
    //   if (!state) {
    //     this.sharedMethods.presentToast(
    //       'Clear cache & data from Google Play Services',
    //       'danger'
    //     );
    //     navigator['app'].exitApp();
    //   }
    // });
  }

  //   initPushNotifications() {
  //     if (!this.platform.is('cordova')) {
  //       console.warn(
  //         'Push notifications not initialized. Cordova is not available - Run in physical device'
  //       );
  //       return;
  //     }

  //     let pushOptions: PushOptions = {
  //       android: { senderID: '662245175296', sound: true },
  //       ios: { alert: 'true', badge: 'true', sound: 'true' },
  //       windows: {},
  //     };

  //     let pushObject: PushObject = this.push.init(pushOptions);

  //     pushObject.on('registration').subscribe((data: any) => {
  //       console.log('Device token/handle is: ' + data.registrationId);
  //       this.regiosterGCMTokenOnServer(data.registrationId).subscribe();
  //     });

  //     pushObject.on('notification').subscribe((data: any) => {
  //       console.log('Push Received: ' + data.message);
  //       this.sharedMethods.presentToast(data.message, 'primary');
  //     });

  //     pushObject.on('error').subscribe((error) => {
  //       console.log('ERROR is: ' + error);
  //     });
  //   }
}

// Request URL: https://api.fixeny.com/api/upsert/?mobileAuthorization=AWe~?N1zq]CE(5y!XM@]6IqH6.%R`xLsN~JKH$T/sY8PuNJRtH:s?@@7Ea&project_id=autoneda&table=neda_call_log&data=[{%20%27school%27%20:%20S0001,%27student%27%20:%20T1007,%27code%27%20:%20S0001T1007,%20%27parent%27:%20P0001,%20%27flag%27%20:%20range,%20%27date%27%20:%202021-11-25%20}]
