import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  getDefaultLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    return language;
  }
  setLanguage(lang) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.translate.currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    // if (lang == 'en') this.document.documentElement.dir = 'ltr';
    // else this.document.documentElement.dir = 'rtl';
  }

  getCurrentLang():string{
    return this.translate.currentLang;
  }
}
