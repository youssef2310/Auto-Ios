import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import {MaterialModule} from '../../material.module'
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MaterialModule,
    TranslateModule,
    RouterModule
  ],
  declarations: [HomePage],
  providers: [DatePipe,Network]
})
export class HomePageModule {}
