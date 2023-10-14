import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment'
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  lang: string = '';
  notifications: any[] = [];
  notifiCount: number = 0;
  loading: boolean = false;
  parent: any;
  constructor(
    private translateService: TranslateService,
    private datepipe: DatePipe,
    private apiService: ApiService
  ) {
    this.ionViewWillEnter();
  }

  ngOnInit() {}

  getParentNotifications() {
    this.apiService.sharedMethods.startLoad();
    this.apiService.getParentChildren().subscribe(
      (res: any) => {
        this.apiService.sharedMethods.dismissLoader();
        if (!res || !res.result) return;
        this.parent = res['parent'];
        this.notifications = res['parent']['notifications'];
        this.notifications = this.notifications.reverse()
        if (this.notifications && this.notifications.length) {
          this.notifications.forEach((e, i) => {
            if (!e.read && e.read !== true) e.read = false as Boolean;

            e.date = this.dateFromObjectId(e?.at?.$date?.$numberLong)?.notDate;
            e.ampm = this.dateFromObjectId(e?.at?.$date?.$numberLong)?.ampm
           // e.time = this.dateFromObjectId(e.at.$date.$numberLong).time;
          });
        }
      },
      (error) => {
        this.apiService.sharedMethods.dismissLoader();
      }
    );
  }

  ionViewWillEnter() {
    this.lang = this.translateService.currentLang;
    this.getParentNotifications();
  }

  doRefresh(event) {
    this.loading = true;
    this.getParentNotifications();
    setTimeout(() => {
      this.loading = false;
      event.target.complete();
    }, 2000);
  }

  setNotificationAsRead(notification, index) {
    console.log(index) 
    console.log(this.notifications.length)
    
    if (notification.read == true) return;

    index = this.notifications.length - (index + 1)
    this.apiService
      .setNotificationsAsRead(this.parent.code, index)
      .subscribe((res) => {
        notification.read = true;
      });
  }

  dateFromObjectId(objectId) {
    if(!objectId) return;
    let date : any = moment(parseInt(objectId));
    let latestDate : Date = date._d
    console.log(date)
    var hours = latestDate.getHours();
    console.log(hours)
    var ampm = hours >= 12 ? 'pm' : 'am';
    console.log(ampm)
    // this.datepipe.transform(uuu, 'YYYY-MM-DD');
    // console.log(this.datepipe.transform(date, 'dd-MM-yyyy'))
    // console.log(uuu)
    // console.log(date)

    let obj: any = {};
    obj.notDate = date
    obj.ampm = ampm
    console.log(obj.notDate)
    obj.time = date.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: false,
      minute: 'numeric',
    });

    return obj;
  }
}
