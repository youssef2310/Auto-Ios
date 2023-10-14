import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPageRoutingModule } from './notification-routing.module';

import { NotificationPage } from './notification.page';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [NotificationPage],
  providers : [DatePipe]
})
export class NotificationPageModule {}
