import { Component, OnInit } from '@angular/core';
import { SharedMethodsService } from '../../services/shared-methods.service';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate-config.service';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  lang: string = '';
  mobile: number;
  countryPhoneCode: string = '966';
  loading: boolean = false;
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  confirmationResult: any;
  verificationStatus: boolean = false;
  constructor(
    private translateConfigService: TranslateConfigService,
    private apiService: ApiService,
    private sharedMethods: SharedMethodsService,
    private router: Router,
    private fireAuth: AngularFireAuth,
    private alertController: AlertController
  ) {
    this.lang = this.translateConfigService.getCurrentLang();
    this.apiService.checkVerificationStatus();
  }

  ngOnInit() {}

  register() {
    console.log(this.mobile);
    console.log(this.countryPhoneCode);
    let phone: number;
    phone = this.mobile;
    let msg: string = '';
    if (!phone || !this.countryPhoneCode) {
      if (this.lang == 'en') {
        msg = 'Please fill the required fields';
      } else {
        msg = 'يرجى ملء الحقول المطلوبة';
      }
      this.sharedMethods.presentToast(msg, 'danger', 'testToast');

      return;
    }
    // if (String(phone).charAt(0) === '0') {
    //   phone = String(phone).substr(1);
    //   //console.log(phone);
    // }

    if (String(phone).length < 8) {
      if (this.lang == 'en') msg = 'Mobile Number must be at least 9 digits';
      else msg = 'يجب أن يتكون رقم الجوال من ٩ ارقام';

      this.sharedMethods.presentToast(msg, 'danger', 'testToast');

      return;
    }

    phone = (this.countryPhoneCode + String(phone)) as any;
    // console.log(this.mobile);
    if (!String(phone).match(/^\d+$/)) {
      if (this.lang == 'en') msg = 'Please enter the numbers in english';
      else msg = 'يرجي ادخال الارقام باللغه الانجليزيه';
      this.sharedMethods.presentToast(msg, 'danger', 'testToast');

      return;
    }

    localStorage.setItem('countryCode', this.countryPhoneCode);

    localStorage.setItem('mobile', String(phone));

    this.loading = true;
    this.apiService.login(phone).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        if (
          String(phone) !== '966588888888' &&
          localStorage.getItem('accountDeleted')
        ) {
          localStorage.removeItem('accountDeleted');
        }
        if (localStorage.getItem('smsCode')) {
          this.getToken();
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.sharedMethods.presentToast(error.error.message, 'danger', 'testToast');
      }
    );
  }

  changeLanguage(lang) {
    this.translateConfigService.setLanguage(lang);
    this.lang = lang;
  }

  ionViewDidEnter() {
    this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.onSignInSubmit();
        },
      }
    );
  }

  onSignInSubmit() {
    console.log('hello');
    this.loading = true;
    this.fireAuth
      .signInWithPhoneNumber(
        '+' + this.countryPhoneCode + this.mobile,
        this.recaptchaVerifier
      )
      .then((res) => {
        this.loading = false;
        this.confirmationResult = res;
        console.log(this.confirmationResult);
        this.apiService.sharedVariables.verifyCode = this.confirmationResult;
        let msg =
          this.translateConfigService.translate.instant('smsmcodewassent');
        this.apiService.sharedMethods.presentToast(msg, 'primary', 'testToast');
        this.router.navigate(['/verfication-code']);
      })
      .catch((err) => {
        this.loading = false;
        let msg =
          this.translateConfigService.translate.instant('smsmcodewassent');
        this.apiService.sharedMethods.presentToast(msg, 'primary', 'testToast');
        this.router.navigate(['/verfication-code']);
        // this.recaptchaVerifier.render().then((widgetID) => {
        //   this.reset(widgetID);
        // });
        // if(err.code !== '400')
        // this.apiService.sharedMethods.presentToast(err.message, 'danger');
      });
  }

  testOtp() {
    // this.firebaseAuthentication
    //   .verifyPhoneNumber('+201001404967', 30)
    //   .then((res) => {
    //     console.log(res);
    //     this.firebaseAuthentication
    //       .signInWithVerificationId(res, '121212')
    //       .then((res) => {
    //         console.log(res);
    //       });
    //   });
  }

  getToken() {
    let staticCode = localStorage.getItem('smsCode');
    this.apiService.verifyCodePassword(staticCode).subscribe(
      (res) => {
        //console.log(res)
        this.loading = false;
        this.checkUserExistence();
        localStorage.setItem('verified', '0');
        //this.router.navigate(['/tabs/home']);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  checkUserExistence(observe?) {
    this.apiService.sharedMethods.startLoad();
    this.apiService.getParentChildren(observe).subscribe(
      (res: any) => {
        this.apiService.sharedMethods.dismissLoader();
        if (!res || !res.result || !res['parent']) {
          // let msg = this.translateConfigService.translate.instant(
          //   'Not Registered for this service'
          // );
          // this.apiService.sharedMethods.presentToast(msg, 'primary');
          this.contactTechSupport();
          return;
        } else {
          this.apiService
            .updateLanguage(localStorage.getItem('lang'))
            .subscribe(
              (res) => {},
              (error) => {}
            );
          this.onSignInSubmit();
          return;
        }
      },
      (error) => {
        this.apiService.sharedMethods.dismissLoader();
      }
    );
  }

  async contactTechSupport() {
    let msg = this.translateConfigService.translate.instant(
      'Not Registered for this service'
    );
    let contactSupport =
      this.translateConfigService.translate.instant('Contact Support');
    let close = this.translateConfigService.translate.instant('close');
    let alertMsg = this.translateConfigService.translate.instant('Alert');
    const alert = await this.alertController.create({
      header: alertMsg,
      message: msg,
      
      buttons: [
        {
          text: close,
          role: 'cancel',
          handler: () => {},
          cssClass:'alert-color'
        },
        {
          text: contactSupport,
          cssClass: 'alert-color',
          role: 'confirm',
          handler: () => {
            window.open('https://wa.me/966532103300', '_system');
          },
        },
      ],
    });

    await alert.present();
  }
}
