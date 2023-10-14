import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpareDriverPageRoutingModule } from './spare-driver-routing.module';

import { SpareDriverPage } from './spare-driver.page';


import {MaterialModule} from '../../material.module'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpareDriverPageRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [SpareDriverPage]
})
export class SpareDriverPageModule {}
