import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  lang: string = '';
  parent : any = {};
  intervalTimer;
  constructor(
    private translate: TranslateService,
    private apiService: ApiService,
    private platform: Platform,
    private router: Router
  ) {
    console.log(this.translate.currentLang);
    this.lang = this.translate.currentLang;

    this.parent = JSON.parse(localStorage.getItem('parent'))

    this.intervalTimer = setInterval(() => {
      this.parent = JSON.parse(localStorage.getItem('parent'))

    }, 10000);

   
  }


}
