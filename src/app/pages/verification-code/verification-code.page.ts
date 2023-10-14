import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate-config.service';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.page.html',
  styleUrls: ['./verification-code.page.scss'],
})
export class VerificationCodePage implements OnInit {
  lang: string = '';
  code: string = '';
  loading: boolean = false;
  parentData: any;
  constructor(
    private translateConfig: TranslateConfigService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.lang = this.translateConfig.getCurrentLang();
    // this.fillParentChildren();
    this.apiService.checkVerificationStatus();
  }

  ngOnInit() {}

  verifyCode() {
    if (!this.code.match(/^\d+$/)) {
      let msg: string = '';
      // if (this.lang == 'en') msg = 'Please enter the numbers in english';
      // else msg = 'يرجي ادخال الارقام باللغه الانجليزيه';
      // this.apiService.sharedMethods.presentToast(msg, 'danger');
      //  this.translateConfig.translate.get(
      //   'pleaseenterthenumbersinenglish'
      // ).subscribe(msg => {
      //   this.apiService.sharedMethods.presentToast(msg, 'danger');

      // })
      return;
    }

    // this.loading = true;

    this.apiService.sharedVariables.verifyCode
      .confirm(this.code)
      .then((res) => {
        // this.loading = false;
        console.log(res);
        if (res && res.user) {
          let staticCode = localStorage.getItem('smsCode');
          localStorage.setItem('verified', '1')
          this.router.navigate(['/tabs/home']);
          // this.apiService.verifyCode(staticCode).subscribe(
          //   (res) => {
          //     //console.log(res)
          //     this.loading = false;

          //     //this.router.navigate(['/tabs/home']);
          //   },
          //   (error) => {
          //     this.loading = false;
          //   }
          // );
        }
      })
      .catch((err) => {
        this.loading = false;
        console.log(err.message);
        this.apiService.sharedMethods.presentToast(err.message, 'danger');
      });

    // this.loading = true;
  }

  ionViewWillEnter() {
    this.fillParentChildren();
  }

  fillParentChildren(observe?: boolean) {
    this.parentData = undefined;
    this.apiService.sharedMethods.startLoad();
    this.apiService.getParentChildren(observe).subscribe(
      (res: any) => {
        this.apiService.sharedMethods.dismissLoader();
        if (!res || !res.result) return;

        this.parentData = res?.parent;
      },
      (error) => {
        this.apiService.sharedMethods.dismissLoader();
      }
    );
  }

  onCodeChanged(code: string) {
    console.log(code);
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    console.log(code);
    this.code = code;
    if (this.code.length == 6) {
      if (this.code === this.parentData.pw) {
        localStorage.setItem('verified', '1')
        this.router.navigate(['/tabs/home'], {
          relativeTo: this.route,
        });
      } else {
        console.log('sms code');
        this.verifyCode();
      }
    }
  }
}
