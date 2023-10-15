import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './services/translate-config.service';
import { SharedVariablesService } from './services/shared-variables.service';
import { ApiService } from './services/api.service';
import {Geolocation} from '@ionic-native/geolocation/ngx'
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AngularFireModule} from '@angular/fire'
import {AngularFireAuthModule} from '@angular/fire/auth'
import {AngularFirestoreModule} from '@angular/fire/firestore'
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx'
import { PaymentService } from './services/payment.service';
import {Network} from '@ionic-native/network/ngx'
import {HTTP} from '@ionic-native/http/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx'
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

import * as firebase from 'firebase'

firebase.default.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateConfigService,
    SharedVariablesService,
    ApiService,
    Geolocation,
    LocationAccuracy,
    InAppBrowser,
    PaymentService,
    Network,
    HTTP,
    Dialogs,
    FirebaseX,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
