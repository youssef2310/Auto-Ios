import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationCodePageRoutingModule } from './verification-code-routing.module';

import { VerificationCodePage } from './verification-code.page';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { CodeInputModule } from 'angular-code-input';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificationCodePageRoutingModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: '——————',
    }),
  ],
  declarations: [VerificationCodePage]
})
export class VerificationCodePageModule {}
