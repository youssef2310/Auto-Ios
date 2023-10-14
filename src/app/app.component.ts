import { Component, ViewChildren, QueryList } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {
  Platform,
  NavController,
  ToastController,
  IonRouterOutlet,
  AlertController,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TranslateConfigService } from './services/translate-config.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  // countryCode: any = '+20';
  phoneNo: any = '+201001630798';
  otpMsg = 'an opt wan sent';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private translateConfig: TranslateConfigService,
    private locationAccuracy: LocationAccuracy,
    private geoLocation: Geolocation,
    private fcmService: FCM,
    private location: Location,
    private alertController: AlertController
  ) {
    this.translateConfig.setLanguage(
      localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ar'
    );
    this.initializeApp();
    if (
      localStorage.getItem('userToken') &&
      localStorage.getItem('verified') == '1'
    ) {
      this.router.navigate(['/tabs/home']);
    } else {
      this.router.navigate(['/signin']);
    }
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#083985');
      this.splashScreen.hide();
      this.getLocationPermission();
      this.getNotificationPermission();
      this.translateConfig.setLanguage(
        localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ar'
      );
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (this.router.url != '/tabs/home') {
          // await this.router.navigate(['/']);
          this.location.back();
        } else if (this.router.url === '/tabs/home') {
          if (
            new Date().getTime() - this.lastTimeBackPress >=
            this.timePeriodToExit
          ) {
            this.lastTimeBackPress = new Date().getTime();
            this.presentAlertConfirm();
          } else {
            navigator['app'].exitApp();
          }
        }
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: 'Are you sure you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Close App',
          handler: () => {
            navigator['app'].exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
  async showToast() {
    const toast = await this.toastController.create({
      message: 'press back again to exit App.',
      duration: 2000,
      cssClass: 'leaveToast',
    });
    toast.present();
  }
  getLocationPermission() {
    this.geoLocation.watchPosition().subscribe((res: any) => {
      localStorage.setItem('currentLatitude', res.coords.latitude);
      localStorage.setItem('currentLongitude', res.coords.longitude);
    });

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(
            () => {
              this.geoLocation.watchPosition().subscribe((res: any) => {
                localStorage.setItem('currentLatitude', res.coords.latitude);
                localStorage.setItem('currentLongitude', res.coords.longitude);
              });
            },
            (error) =>
              console.log('Error requesting location permissions', error)
          );
      }
    });
  }

  getNotificationPermission() {
    if (!this.platform.is('cordova')) {
      console.warn(
        'Push notifications not initialized. Cordova is not available - Run in physical device'
      );
      return;
    } else {
      if (this.platform.is('ios')) {
        this.fcmService.requestPushPermission().then((res) => {
          if (res) {
            this.fcmService.getToken().then((token) => {
              localStorage.setItem('notification_token', token);
            });
          }
        });
      } else {
        this.fcmService.getToken().then((token) => {
          localStorage.setItem('notification_token', token);
        });
      }
    }
  }
}
