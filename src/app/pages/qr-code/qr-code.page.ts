import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  lang: string = '';
  title = 'qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  value = 'Techiediaries';
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ionViewWillEnter();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.lang = this.translateService.currentLang;
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('qrCode')) return;
      this.value = paramMap.get('qrCode');
      console.log(this.value)
      
    });
  }

  goToHome() {
    this.router.navigate(['/tabs/home'], { relativeTo: this.route });
  }
}
