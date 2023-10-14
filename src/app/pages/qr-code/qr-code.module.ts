import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrCodePageRoutingModule } from './qr-code-routing.module';

import { QrCodePage } from './qr-code.page';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrCodePageRoutingModule,
    MaterialModule,
    TranslateModule,
    NgxQRCodeModule
  ],
  declarations: [QrCodePage],
  providers : [DatePipe]
})
export class QrCodePageModule {}
