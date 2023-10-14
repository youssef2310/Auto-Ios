import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  lang: string = '';
  constructor(private translateService: TranslateService) {
   // this.ionViewWillEnter();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.lang = this.translateService.currentLang;
    console.log(this.lang)
  }
}
