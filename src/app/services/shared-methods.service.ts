import { Inject, Injectable } from '@angular/core';

import { LoadingController, Platform, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class SharedMethodsService {
  isLoading: boolean = false;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  filterString(str) {
    if (!str) return str;
    var arabicArr = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g,
    ];
    for (var i = 0; i < 10; i++) str = str.replace(arabicArr[i], i);

    if (/\d{6}/.test(str)) return str.replace(/[0-9]/g, '');
    else return str;
  }

  ArrayMapByProperty(array, property) {
    var result = [];

    if (!array) return result;

    for (var i = 0; i < array.length; i++) {
      result.push(array[i][property]);
    }

    return result;
  }

  ArrayFindByProperty(array, property, term) {
    var result;

    if (!array) return result;

    for (var i = 0; i < array.length; i++) {
      if (array[i][property] == term) {
        result = array[i];
      }
    }

    return result;
  }

  isEmptyObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  async presentToast(msg, color, customClass: string = '') {
    const toast = await this.toastController.create({
      message: msg,
      color: color,
      duration: 5000,
      animated: true,
      position: 'top',
      cssClass: customClass,
    });
    toast.present();
  }

  async startLoad() {
    console.log('jjj');

    this.isLoading = true;

    return await this.loadingController
      .create({
        duration: 9000,
        message: 'Please wait...',
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }
  async dismissLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
}
