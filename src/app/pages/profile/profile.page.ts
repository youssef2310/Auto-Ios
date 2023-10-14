import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from '../../services/translate-config.service';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  lang: string = '';
  parent: any = {};
  loading: boolean = false;
  isDeleted : boolean = false;
  constructor(
    private translateConfigService: TranslateConfigService,
    private apiService: ApiService,
    private alertController : AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.lang = this.translateConfigService.getCurrentLang();
    this.parent = JSON.parse(localStorage.getItem('parent'));

    this.isDeleted = localStorage.getItem('accountDeleted') ? true : false;
    console.log(this.isDeleted)
  }

  logOut() {
    this.loading = true;
    this.apiService.logout().subscribe(
      (res) => {
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  
  logOutWithDeletion(){
    this.loading = true;
    this.apiService.logout().subscribe(
      (res) => {
        this.loading = false;
        localStorage.setItem('accountDeleted', '1')
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Confirm',
          handler: () => {
            this.logOutWithDeletion()
          },
        },
      ],
    });

    await alert.present();
  }

  changeLanguage(lang) {
    this.apiService.sharedMethods.startLoad();
    this.apiService.updateLanguage(lang).subscribe(
      (res) => {
        this.apiService.sharedMethods.dismissLoader();
        this.translateConfigService.setLanguage(lang);
        this.lang = lang;
      },
      (error) => {
        this.apiService.sharedMethods.dismissLoader();
      }
    );
  }


  async confirmLogout() {
    let msg = this.translateConfigService.translate.instant(
      'Do you need to Close your account and erase your data'
    );
    let confirm =
      this.translateConfigService.translate.instant('Yes');
    let decline = this.translateConfigService.translate.instant('No');
    let alertMsg = this.translateConfigService.translate.instant('Alert');
    const alert = await this.alertController.create({
      header: alertMsg,
      message: msg,

      buttons: [
        {
          text: decline,
          role: 'cancel',
          handler: () => {},
        },
        {
          text: confirm,
          role: 'confirm',
          handler: () => {
            this.logOut();
          },
        },
      ],
    });

    await alert.present();
  }
}
