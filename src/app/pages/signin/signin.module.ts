import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SigninPageRoutingModule } from './signin-routing.module';
import { SigninPage } from './signin.page';
import { TranslateModule } from '@ngx-translate/core';
import {MaterialModule} from '../../material.module'
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigninPageRoutingModule,
    TranslateModule,
    MaterialModule,
    RouterModule,
    
    
  ],
  declarations: [SigninPage],
  providers: []
})
export class SigninPageModule {}
