import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate-config.service';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Payment } from '../../payment-lib/payment.model';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';

// import * as _ from 'lodash';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  lang: string = '';
  parentList: any[] = [];
  parentData: any;
  notifications: any[] = [];
  notifiCount: number = 0;
  paymentDate: Payment = new Payment();
  intervalTimer;
  parentTemp: any[] = [];
  verificationState: boolean = true;
  isDeleted: boolean = false;
  isOffline: boolean = false;
  listPrev: any[] = [];
  constructor(
    private translateConfig: TranslateConfigService,
    private apiService: ApiService,
    private platform: Platform,
    private datepipe: DatePipe,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private network: Network
  ) {
    this.lang = this.translateConfig.getCurrentLang();
    // this.ionViewWillEnter();
    this.apiService.fireParentObs.subscribe((res) => {
      this.fillParentChildren();
    });

    this.network.onDisconnect().subscribe((res) => {
      this.isOffline = true;
      localStorage.setItem('online', '0');
      let msg = this.translateConfig.translate.instant(
        'Please Check your internet Connection and try again'
      );
      this.apiService.sharedMethods.presentToast(msg, 'primary');
    });

    this.network.onConnect().subscribe((res) => {
      this.isOffline = false;
      localStorage.setItem('online', '1');
      let msg = this.translateConfig.translate.instant(
        'your internet connection has been restored successfully'
      );
      this.apiService.sharedMethods.presentToast(msg, 'primary');
    });
  }

  ngOnInit() {}

  fillParentChildren(observe?: boolean) {
    if (this.isOffline || localStorage.getItem('online') == '0') {
      this.parentList = JSON.parse(localStorage.getItem('parentList'));
      this.parentData = JSON.parse(localStorage.getItem('parent'));
      return;
    }
    this.parentData = undefined;
    this.parentList = [];
    this.apiService.sharedMethods.startLoad();
    this.apiService.getParentChildren(observe).subscribe(
      (res: any) => {
        this.apiService.sharedMethods.dismissLoader();
        if (!res || !res.result) return;
        this.notifications = res['parent']['notifications'];
        if (this.notifications && this.notifications.length) {
          this.notifiCount = this.notifications.length;
          this.notifications.forEach((e, i) => {
            if (e.read == true) this.notifiCount -= 1;
          });
          localStorage.setItem('notifiCount', String(this.notifiCount));
        }

        // this.parentList.push(res?.result);
        this.parentData = res?.parent;
        localStorage.setItem('parent', JSON.stringify(this.parentData));
        // console.log(this.parentData);
        // console.log(this.parentList);
        this.parentList = [];
        Object.keys(res?.result).forEach((key) =>
          this.parentList.push(res?.result[key])
        );
        if (!this.listPrev || !this.listPrev.length)
          this.listPrev = this.parentList;
        console.log(this.parentList);

        this.parentList.forEach((item: any) => {
          item.students.forEach((element) => {
            element['loading'] = false;
          });
        });

        localStorage.setItem('parentList', JSON.stringify(this.parentList));
        if (!this.parentTemp.length) this.parentTemp = this.parentList;
        //this.notifySchool();
        this.checkPaymentStatus(this.parentList);
      },
      (error) => {
        this.apiService.sharedMethods.dismissLoader();
      }
    );
  }

  viewQrCode(student) {
    console.log(student);
    if (!student || !student.qrcode) return;
    this.router.navigate(['/tabs/qr-code', { qrCode: student.qrcode }], {
      relativeTo: this.route,
    });
  }

  ionViewWillEnter() {
    this.fillParentChildren();
    this.isDeleted = localStorage.getItem('accountDeleted') ? true : false;

    this.intervalTimer = setInterval(() => {
      if (this.isOffline || localStorage.getItem('online') == '0') {
        this.parentList = JSON.parse(localStorage.getItem('parentList'));
        this.parentData = JSON.parse(localStorage.getItem('parent'));
        return;
      }
      this.checkVerificationStatus();
      this.apiService.getParentChildren().subscribe(
        (res: any) => {
          if (!res || !res.result) return;
          this.notifications = res['parent']['notifications'];
          if (this.notifications && this.notifications.length) {
            this.notifiCount = this.notifications.length;
            this.notifications.forEach((e, i) => {
              if (e.read == true) this.notifiCount -= 1;
            });
            localStorage.setItem('notifiCount', String(this.notifiCount));

            //this.notifiCount = Number(this.notifications.length);
          }

          // this.parentList.push(res?.result);
          this.parentData = res?.parent;
          localStorage.setItem('parent', JSON.stringify(this.parentData));
          // console.log(this.parentData);
          // console.log(this.parentList);
          this.parentList = [];
          Object.keys(res?.result).forEach((key) =>
            this.parentList.push(res?.result[key])
          );
          this.parentList.forEach((element, index) => {
            element['students'].forEach((e, i) => {
              // let ij = 0
              // console.log(ij++)
              // console.log(e['lbl']);
              // console.log(this.listPrev[index]['students'][i]['lbl']);
              console.log(e['alert']);
              if (e['alert'] == true) {
                // console.log(element['school']['tone']);
                if (e['lbl']) {
                  console.log('played');
                  console.log(element['school']['tone']);
                  let audio = null;
                  audio = new Audio();
                  //audio.muted = true;
                  audio.src = '';
                  audio.src = element['school']['tone'];
                  audio.load();
                  audio.play().then((res) => {
                    audio.onended = null;
                  });

                  this.updateAlertProperty(e['code']);
                }
              }
            });
          });
          // console.log(this.parentList);
        },
        (error) => {}
      );
    }, 10000);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.fillParentChildren();
      event.target.complete();
    }, 2000);
  }

  updateAlertProperty(code) {
    this.apiService.updateAlertStatus(code).subscribe((res) => {});
  }

  callStudent(student, school) {
    if (!student) return;

    if (!this.verificationState) return;

    if (
      student.call_student == 'register' ||
      (!student.paid && Number(school.school.fees) > 0)
    ) {
      this.translateConfig.translate
        .get('uhavetopaythecostoftheservice')
        .subscribe((res) => {
          this.apiService.sharedMethods.presentToast(res, 'danger');
        });
      this.getReadyToPay(student, school);
      return;
    }

    student['loading'] = true;
    this.apiService
      .callStudent(
        student.school,
        student.parent,
        student.code,
        this.getCurrentDate(),
        false
      )
      .subscribe((res: any) => {
        student['loading'] = false;
        if (res.status_code == 1) {
          student.call_student = 'disable';
        }
        // student.
      });
  }

  notifySchool() {
    for (let obj of this.parentList) {
      if (obj.school.start_call === true) {
        for (let student of obj.students) {
          if (student.call_student == 'enable' && student.paid == true) {
            this.getReady(student);
          }
        }
      }
    }
  }

  checkPaymentStatus(list) {
    for (let obj of list) {
      if (obj.school.fees === 0) {
        console.log('true');
        for (let student of obj.students) {
          if (student.paid == false) {
            this.setPaidProperty(student.code);
          }
        }
      }
    }
  }

  setPaidProperty(code) {
    this.apiService.updatePaymentStatus(code).subscribe((res) => {
      this.fillParentChildren();
    });
  }

  getReady(student) {
    if (!this.verificationState) return;
    this.apiService
      .callStudent(
        student.school,
        student.parent,
        student.code,
        this.getCurrentDate(),
        true
      )
      .subscribe((res: any) => {
        // student.
      });
  }

  getCurrentDate() {
    let date: Date = new Date();
    let latestDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    return String(latestDate);
  }

  checkPayment(fees, paid) {
    console.log(fees, paid);
    if (paid == false && Number(fees) > 0) return false;
    else return true;
  }

  getReadyToPay(student, school) {
    if (!this.verificationState) return;
    localStorage.setItem('studentCode', student.code);

    console.log(school);
    let customerName = JSON.parse(localStorage.getItem('parent')).name;
    console.log(customerName);
    this.paymentDate.address = school.school.name;
    this.paymentDate.customerName = customerName;
    this.paymentDate.trackid = 'en';
    this.paymentDate.customerEmail =
      localStorage.getItem('mobile') + '@autotech.sa';
    this.paymentDate.phone = localStorage.getItem('mobile');
    this.paymentDate.amount = school.school.fees;
    console.log(this.paymentDate);
    this.paymentService
      .makePaymentService(JSON.stringify(this.paymentDate))
      .then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // checkPaymentSuccess() {
  //   this.paymentService.paymentStatusObs.subscribe((res) => {
  //     if (res == true && localStorage.getItem('studentCode')) {
  //       this.apiService
  //         .updatePaymentStatus(localStorage.getItem('studentCode'))
  //         .subscribe((res) => {
  //           this.fillParentChildren();
  //         });
  //     }
  //   });
  // }

  ionViewWillLeave() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  }

  checkVerificationStatus() {
    // this.apiService.verifyUser().subscribe((res: any) => {
    //   this.verificationState = res.success;
    //   if (!this.verificationState) {
    //     this.apiService.sharedMethods.presentToast(
    //       'Apple confirms new Report a Problem option rolling out on the App Store to fight scam apps',
    //       'danger'
    //     );
    //   }
    // });
  }

  // onSchoolObjectChanged() {
  //   this.parentList.forEach((e, i) => {
  //     this.parentTemp.forEach((tempEle, tempIndex) => {

  //       if (tempIndex === i) {
  //         if (!_.isEqual(tempEle.school, e.school)) {
  //           console.log('notify');
  //          // this.notifySchool();
  //         }
  //       }
  //     });
  //   });
  // }
}
