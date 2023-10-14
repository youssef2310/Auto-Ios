import { DOCUMENT, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Inject, Injectable, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { responseMsgConfig } from '../payment-lib/responseMsgConfig';
import { RespCode } from '../payment-lib/response-code';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import {
  InAppBrowser,
  InAppBrowserEvent,
  InAppBrowserObject,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { URWAYPayment } from '../payment-lib/urwaypayment';
import { ApiService } from './api.service';

import QueryString from 'queryString';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  paymentData: any;
  paymentStandaloneData: any;
  //paymentData:any;
  paymentUrl: string;
  //paymentStatus: number; //0 - processing, 1 - success, 2 - failure

  _paymentStatus: number;
  get paymentStatus(): number {
    return this.paymentStatus;
  }
  set paymentStatus(value: number) {
    console.log(value);
    this._paymentStatus = value;
    if (value == 1) {
      this.apiService
        .updatePaymentStatus(localStorage.getItem('studentCode'))
        .subscribe((res) => {
          this.apiService.getParentChildren(true);
        });
    }
  }

  paymentTransactionMessage: string;
  paymentResponse: string;
  paymentRespCode: string;
  paymentRespresult: string;
  paymentMaskedCard: string;
  paymentCardBrand: string;
  paymentReponseTrandId: string;
  paymentRespHash: string;
  paymentReponseStatus: string;
  paymentReponseDate: Date;
  paymentReponsecardToken: string;
  paymentReponsePan: string;
  paymentReponseAmount: string;
  paymentRespMsg: string;
  public appinit: boolean = true;
  public validinit: boolean = false;
  isValidEmail: boolean = false;

  listmainResp: any = [];
  listresultVal: any = [];
  loading: any;

  options: InAppBrowserOptions = {
    location: 'no', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    hideurlbar: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'no', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'fullscreen', //iOS only
    fullscreen: 'yes', //Windows only
  };
  _paymentMessage: string;
  get paymentMessage(): string {
    return this.paymentMessage;
  }
  set paymentMessage(value: string) {
    console.log(value);
    this._paymentMessage = value;
    this.apiService.sharedMethods.presentToast(value, 'primary');
  }

  // private _paymentStatus: Subject<any> = new Subject<any>(); // consider putting the actual type of the data you will receive
  // public paymentStatusObs = this._paymentStatus.asObservable();

  constructor(
    private route: ActivatedRoute,
    private http: HTTP,
    private iab: InAppBrowser,
    private apiService: ApiService,
    private network: Network,
    private location: Location,
    private alertController: AlertController,
    private dialogs: Dialogs
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   this.paymentData = JSON.parse(params['data']);
    // });

    this.paymentStatus = 0; //processing
    this.paymentReponseTrandId = '';
    this.paymentReponseStatus = '';
    this.paymentReponseDate = null;
    this.paymentReponsecardToken = '';
    this.paymentReponsePan = '';
    // this.paymentReponseAmount = 0;
  }

  ngOnInit() {
    // this.networkInterface.getCarrierIPAddress()
    //   .then(address => console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
    //   .catch(error => console.error(`Unable to get IP: ${error}`));
  }

  // processPayment(paymentData) {
  //   // this._paymentStatus.next(true)
  //   this.paymentMessage = 'Processing Payment. Please wait ....';
  //   console.log(this.paymentData);
  //   this.paymentData = paymentData;
  //   let payment = new URWAYPayment(this.http);
  //   payment
  //     .ProcessPayment(this.paymentData)
  //     .then((response: any) => {
  //       if (response.status == 'redirect') {
  //         if (response.redirectUrl != undefined && response.redirectUrl != '') {
  //           const browser: InAppBrowserObject = this.iab.create(
  //             response.redirectUrl,
  //             '_blank',
  //             this.options
  //           );
  //           browser.on('exit').subscribe({
  //             next: (ev: InAppBrowserEvent) => {
  //               //this.btnClick.nativeElement.click();
  //               this.processResponse();
  //             },
  //             error: (error) => {
  //               //this.btnClick.nativeElement.click();
  //               this.processResponse();
  //             },
  //           });
  //           browser.on('loadstart').subscribe({
  //             next: (ev: InAppBrowserEvent) => {
  //               console.log('Browser:' + ev.url);
  //               if (ev.url.indexOf('response') >= 0) {
  //                 this.paymentUrl = ev.url;

  //                 browser.close();

  //                 //this.btnClick.nativ=eElement.click();
  //               }
  //             },
  //             error: (error: any) => {
  //               console.log('Browser: ' + error);
  //               browser.close();
  //               this.paymentUrl = '';

  //               //this.btnClick.nativeElement.click();
  //             },
  //           });
  //         } else {
  //           this.paymentStatus = 1;
  //           this.paymentMessage = 'Transaction has been processed.';
  //         }
  //       } else {
  //         this.paymentStatus = 2; //error
  //         this.paymentMessage = 'Error processing payment';
  //       }
  //     })
  //     .catch((error) => {
  //       this.paymentStatus = 2; //error
  //       this.paymentMessage = error;
  //     });
  // }

  // processResponse() {
  //   console.log('Payment response - ' + this.paymentUrl);
  //   if (
  //     this.paymentUrl == '' ||
  //     this.paymentUrl == undefined ||
  //     this.paymentUrl == 'undefined'
  //   ) {
  //     this.paymentStatus = 2;
  //     this.paymentMessage = 'Payment could not be processed';
  //     console.log(this.paymentMessage);
  //     this._paymentStatus.next(false);
  //     return;
  //   } else {
  //     const responseObject = QueryString.parse(this.paymentUrl);
  //     console.log(responseObject);
  //     if (responseObject['Result'] == 'Failure') {
  //       this.paymentStatus = 2;
  //       this.paymentMessage = 'Payment Data was incorrect';
  //       return;
  //     }
  //     this.paymentStatus = 1;
  //     this.paymentMessage = 'Payment was successful';
  //     this.apiService
  //       .updatePaymentStatus(localStorage.getItem('studentCode'))
  //       .subscribe((res) => {
  //         this.apiService.getParentChildren(true);
  //       });

  //     console.log(this.paymentMessage);
  //     this._paymentStatus.next(true);
  //     let payment: URWAYPayment;
  //     payment
  //       .ProcessResponse(this.paymentUrl)
  //       .then((response: any) => {
  //         console.log('response');
  //         console.log(response);
  //         this.paymentStatus = 1;
  //         this.paymentMessage = 'Payment was successful';
  //         this.paymentReponseTrandId = response.tranid;
  //         this.paymentReponseStatus = response.status;
  //         this.paymentReponseAmount = response.amount;
  //         this.paymentReponsecardToken =
  //           response.cardtoken == undefined || response.cardtoken == null
  //             ? ''
  //             : response.cardtoken;
  //         this.paymentReponsePan =
  //           response.maskedno == undefined || response.maskedno == null
  //             ? ''
  //             : response.maskedno;
  //         this.paymentReponseDate = new Date();
  //       })
  //       .catch((error: any) => {
  //         console.log('error');
  //         console.log(error);
  //         this.paymentStatus = 2;
  //         this.paymentMessage = error;
  //       });
  //   }
  // }

  makePaymentService(requestData) {
    responseMsgConfig.startTrxn = false;
    this.appinit = true;
    //var networkState = navigator.connection.type;
    if (this.network.type == this.network.Connection.NONE) {
      console.log(' No internet ');
      this.showDialogAlert(' Please Check your Internet Connection');
    } else {
      this.paymentData = JSON.parse(requestData);
      console.log('Request Data full ' + JSON.stringify(this.paymentData));
      console.log('Request Data ' + this.paymentData.country);
      //this.presentLoading();
      //console.log("Respon code "+RespCode[202]);
      return new Promise((resolve, reject) => {
        console.log('Start Trxn 1' + responseMsgConfig.startTrxn);
        // this.loading.dismiss();

        if (responseMsgConfig.startTrxn != this.appinit) {
          console.log('Start Trxn2 ' + responseMsgConfig.startTrxn);
          responseMsgConfig.startTrxn = true;

          if (
            this.isValidationSucess(
              this.paymentData.country,
              this.paymentData.currency,
              this.paymentData.amount,
              this.paymentData.action,
              this.paymentData.customerEmail,
              this.paymentData.trackid,
              this.paymentData.cardToken,
              this.paymentData.tokenOperation,
              this.paymentData.trxnID
            )
          ) {
            // this.loading.dismiss();

            let payment = new URWAYPayment(this.http, this.network);
            //  let payment = new URWAYPayment();
            payment
              .ProcessPayment(this.paymentData)

              .then((response: any) => {
                if (response.status == 'redirect') {
                  console.log('This is in redirect');
                  // this.loading.dismiss();
                  if (
                    response.redirectUrl != undefined &&
                    response.redirectUrl != ''
                  ) {
                    this.paymentRespMsg = '';
                    const browser: InAppBrowserObject = this.iab.create(
                      response.redirectUrl,
                      '_blank',
                      this.options
                    );
                    //   browser.show();
                    browser.on('exit').subscribe({
                      next: (ev: InAppBrowserEvent) => {
                        // this.btnClick.nativeElement.click();
                        browser.close();
                        responseMsgConfig.startTrxn = false;
                        this.apiService.sharedMethods.presentToast(
                          this.paymentMessage,
                          'primary'
                        );
                      },
                      // 04454
                      error: (error) => {
                        // this.btnClick.nativeElement.click();
                        browser.close();
                        responseMsgConfig.startTrxn = false;
                      },
                    });

                    browser.on('loadstart').subscribe({
                      next: (ev: InAppBrowserEvent) => {
                        console.log('Browser loading complete:' + ev.url);
                        if (ev.url.indexOf('response') >= 0) {
                          this.paymentUrl = ev.url;
                          responseMsgConfig.startTrxn = false;
                        }
                        if (ev.url.includes('&Result')) {
                          const arrResp = ev.url.split('?');
                          let lstRespparam = arrResp[1].split('&');
                          for (let arrParam of lstRespparam) {
                            const parts = arrParam.split('=');
                            let name = parts[0];
                            if (name == 'PaymentId') {
                              this.paymentReponseTrandId = parts[1].toString();
                            }
                            if (name == 'responseHash') {
                              this.paymentRespHash = parts[1].toString();
                            }
                            if (name == 'ResponseCode') {
                              this.paymentRespCode = parts[1].toString();
                            }
                            if (name == 'TranId') {
                              this.paymentReponseTrandId = parts[1].toString();
                            }
                            if (name == 'amount') {
                              this.paymentReponseAmount = parts[1].toString();
                            }

                            if (name == 'cardToken') {
                              this.paymentReponsecardToken =
                                parts[1].toString();
                            }
                            if (name == 'Result') {
                              this.paymentRespresult = parts[1].toString();
                            }

                            if (name == 'maskedPAN') {
                              this.paymentMaskedCard = parts[1].toString();
                            }
                            if (name == 'cardBrand') {
                              this.paymentCardBrand = parts[1].toString();
                            }
                          }
                          browser.close();
                          this.paymentRespMsg = RespCode[this.paymentRespCode];
                          if (this.paymentReponsecardToken == null) {
                            this.paymentReponsecardToken = '';
                          }
                          //response code mapping here
                          payment
                            .ProcessTransactEnqPayment(
                              this.paymentData,
                              this.paymentReponseTrandId
                            )
                            .then((response: any) => {
                              let respObj = JSON.stringify(response);
                              console.log('respObj' + respObj);

                              console.log(JSON.parse(respObj)['respMsg']);
                              console.log(
                                'In ProcessTransactEnqPayment RESOLVE ' +
                                  JSON.stringify(response)
                              );
                              console.log(
                                'In ProcessTransactEnqPayment STATUS ' +
                                  response.status
                              );

                              this.paymentTransactionMessage = JSON.parse(
                                response.redirectUrl
                              );
                              console.log(
                                'In ProcessTransactEnqPayment DATA ' +
                                  JSON.stringify(this.paymentTransactionMessage)
                              );
                              console.log(
                                'In ProcessTransactEnqPaymentAMOUNT ' +
                                  this.paymentTransactionMessage['amount']
                              );
                              // this.paymentTransactionMessage=JSON.stringify(response);
                              if (
                                this.paymentTransactionMessage[
                                  'responsecode'
                                ] == '000'
                              ) {
                                this.apiService
                                  .updatePaymentStatus(
                                    localStorage.getItem('studentCode')
                                  )
                                  .subscribe((res) => {
                                    this.apiService.getParentChildren(true);
                                  });
                              }
                              this.showDialogAlert(
                                this.paymentTransactionMessage['description']
                              );

                              resolve({
                                amount:
                                  this.paymentTransactionMessage['amount'],
                                tranid:
                                  this.paymentTransactionMessage['tranid'],
                                status:
                                  this.paymentTransactionMessage['result'],
                                cardtoken:
                                  this.paymentTransactionMessage['cardToken'],
                                respCode:
                                  this.paymentTransactionMessage[
                                    'responsecode'
                                  ],
                                maskedpan:
                                  this.paymentTransactionMessage['maskedpan'],
                                cardbrand:
                                  this.paymentTransactionMessage['cardBrand'],
                                // maskedno: "",
                                respMsg:
                                  this.paymentTransactionMessage['description'],
                              });
                            })
                            .catch((error) => {
                              //dismiss
                              // // this.loading.dismiss();
                              this.paymentStatus = 2; //error
                              this.paymentMessage = error;
                              reject('Hash mismatch!');
                              responseMsgConfig.startTrxn = false;
                            });

                          //****CALL Enquiry function here n */

                          console.log(
                            'In ProcessTransactEnqPayment RESOLVE AMOUNT  ' +
                              this.paymentTransactionMessage['amount']
                          );

                          responseMsgConfig.startTrxn = false;
                        }
                      },
                    });
                  } else {
                    this.paymentStatus = 1;
                    this.paymentMessage = 'Transaction has been processed.';
                    reject('Hash mismatch!');
                    responseMsgConfig.startTrxn = false;
                  }
                } else if (response.status == 'standaloneRefund') {
                  // this.loading.dismiss();
                  //dismiss
                  if (response.redirectUrl != undefined) {
                    this.paymentStandaloneData = JSON.parse(
                      response.redirectUrl
                    );

                    this.paymentStatus = 1;
                    this.paymentMessage = 'Sucessful';
                    this.paymentRespMsg =
                      RespCode[this.paymentStandaloneData['responsecode']];
                    //here also resolve will call with data
                    if (this.paymentStandaloneData['tranid'] == null) {
                      this.paymentStandaloneData['tranid'] = '0';
                    }
                    resolve({
                      //type: "receiptToken",
                      amount: this.paymentStandaloneData['amount'],
                      tranid: this.paymentStandaloneData['tranid'],
                      status: this.paymentMessage,
                      cardtoken: this.paymentStandaloneData['cardToken'],
                      respCode: this.paymentStandaloneData['responsecode'],
                      maskedpan: this.paymentStandaloneData['maskedpan'],
                      cardbrand: this.paymentStandaloneData['cardBrand'],
                      // maskedno: "",
                      respMsg: this.paymentRespMsg,
                    });
                    responseMsgConfig.startTrxn = false;
                  }
                } else if (response.status == 'otherResp') {
                  this.paymentMessage = JSON.parse(response.redirectUrl);
                  console.log('RUUNNAALLII ' + this.paymentMessage['tranid']);
                  if (
                    this.paymentMessage['tranid'] == '' ||
                    this.paymentMessage['tranid'] == undefined
                  ) {
                    this.paymentRespMsg = this.paymentMessage['description'];
                    this.paymentRespCode = this.paymentMessage['responsecode'];

                    this.dialogs
                      .alert(
                        this.paymentRespMsg + ':RespCode' + this.paymentRespCode
                      )

                      .then(() => {
                        this.location.back();
                        responseMsgConfig.startTrxn = false;
                      })
                      .catch((e) => {
                        // // this.loading.dismiss();
                        responseMsgConfig.startTrxn = false;
                      });
                  } else {
                    this.paymentMessage = JSON.parse(response.redirectUrl);
                    console.log(
                      'this.paymentMessage other' +
                        JSON.stringify(this.paymentMessage)
                    );
                    console.log('other else part');
                    resolve({
                      //type: "receiptToken",
                      amount: this.paymentMessage['amount'],
                      tranid: this.paymentMessage['tranid'],
                      status: this.paymentMessage['result'],
                      cardtoken: this.paymentMessage['cardToken'],
                      respCode: this.paymentMessage['responsecode'],
                      maskedpan: this.paymentMessage['maskedpan'],
                      cardbrand: this.paymentMessage['cardBrand'],

                      respMsg: this.paymentMessage['description'],
                      //   add here card token
                    });
                    responseMsgConfig.startTrxn = false;
                  }
                } else {
                  //dismiss
                  //// this.loading.dismiss();
                  // ToDo Runali mapping resp and show dialog
                  this.paymentStatus = 2; //error
                  this.paymentMessage = 'Error processing payment';
                  reject('Hash mismatch!');
                  responseMsgConfig.startTrxn = false;
                }
                // sfdssfsdfsdfsdfdsf
              })
              .catch((error) => {
                //dismiss
                // // this.loading.dismiss();
                this.paymentStatus = 2; //error
                this.paymentMessage = error;
                reject('Hash mismatch!');
                responseMsgConfig.startTrxn = false;
              });
          } else {
            responseMsgConfig.startTrxn = false;
            //  // this.loading.dismiss();
            console.log('failed');
          }
        } else {
          //  // this.loading.dismiss();
          resolve('Transaction already initiated');
        }
      });
      //  // this.loading.dismiss();
    }
  }
  isValidationSucess(
    cntry,
    curr,
    amt,
    action,
    email,
    trackid,
    cardtok,
    cardOpr,
    trxnID
  ) {
    console.log(
      cntry,
      curr,
      amt,
      action,
      email,
      trackid,
      cardtok,
      cardOpr,
      trxnID
    );
    if (cntry == '') {
      this.showDialogAlert('Country should not be empty');

      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (curr == '') {
      //this.loading.dismiss()
      this.showDialogAlert('Currency should not be empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (amt == '') {
      // this.loading.dismiss()
      this.showDialogAlert('Amount should not be empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (action == '') {
      // this.loading.dismiss()
      this.showDialogAlert('Action should not be empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;

      return this.validinit;
    } else if (email == '') {
      ///this.loading.dismiss()
      this.showDialogAlert('Email should not be empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (trackid == '') {
      // this.loading.dismiss()
      //this.presentAlert("Track ID should not be empty");
      this.showDialogAlert('Track ID should not be empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (curr.length > 3) {
      //  this.loading.dismiss()
      this.showDialogAlert('Currency should be proper');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (amt.length > 15) {
      //  this.loading.dismiss()
      this.showDialogAlert('Amount should be proper');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (trackid.length > 20) {
      //  this.loading.dismiss()
      this.showDialogAlert('Track ID should be proper');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (action.length > 3) {
      //this.loading.dismiss()
      this.showDialogAlert('Action Code should be proper');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (cntry.length > 3) {
      // this.loading.dismiss()
      this.showDialogAlert('Country Code should be proper');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (
      (action == '2' ||
        action == '3' ||
        action == '5' ||
        action == '9' ||
        action == '6') &&
      trxnID == ''
    ) {
      this.showDialogAlert('Transaction ID should not empty');
      responseMsgConfig.startTrxn = false;
      this.validinit = false;
      return this.validinit;
    } else if (action == '12' && (cardOpr == 'U' || cardOpr == 'D')) {
      //console.log("in IF crTok")
      if (cardtok == '') {
        //console.log("in IF crTok in if")
        this.showDialogAlert('Card Token should not be empty');
        responseMsgConfig.startTrxn = false;
        this.validinit = false;
        return this.validinit;
      } else {
        this.validinit = true;
        return this.validinit;
      }
    } else if (email != '') {
      if (this.checkEmail(email)) {
        this.validinit = true;
        return this.validinit;
      } else {
        this.showDialogAlert('Email should be proper');
        responseMsgConfig.startTrxn = false;
        this.validinit = false;
        return this.validinit;
      }
    } else {
      this.validinit = true;
      return this.validinit;
    }
  }

  showDialogAlert(msgDispl) {
    this.alertController
      .create({
        header: 'Alert',
        message: msgDispl,
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',

            handler: () => {
              //this.location.back();
              responseMsgConfig.startTrxn = false;
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  checkEmail(email) {
    var emailfilter =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //debugger

    // if (emailfilter.test(email)) {
    //   this.isValidEmail = true;
    //   return this.isValidEmail;
    // } else {
    //   this.isValidEmail = false;
    //   return this.isValidEmail;
    // }
    return true;
  }
}

// - http://localhost:8100/?PaymentId=2134613928944056351
// &TranId=2134613928944056351
// &ECI=05&Result=Successful&
// TrackId=619e52d51a060ffdf4a903352021
// &AuthCode=002916&ResponseCode=000&
// RRN=134610002916&
// responseHash=5d51d468398e1ef7358889139bc6422c684b3be079eba1a4e4ecc4582d8d3bc7
// &amount=10.00&cardBrand=VISA&UserField1=1234&UserField3=en&UserField4=123
// 4&UserField5=1234&maskedPAN=
// &cardToken=&SubscriptionId=null&email=null&payFor=null

// http://localhost:8100/?PaymentId=2134613928944056351
// &TranId=2134613928944056351&ECI=05&Result=Successful
// &TrackId=619e52d51a060ffdf4a903352021
// &AuthCode=002916&ResponseCode=000
// &RRN=134610002916&responseHash=5d51d468398e1ef7358889139bc6422c684b3be079eba1a4e4ecc4582d8d3bc7
// &amount=10.00&cardBrand=VISA&UserField1=1234&
// UserField3=en&UserField4=1234
// &UserField5=1234&
// maskedPAN=450875XXXXXX1019&
// cardToken=&SubscriptionId=null
// &email=null&payFor=null

// http://localhost:8100/?PaymentId=2134613928944056351&TranId=2134613928944056351&ECI=05&Result=Successful&TrackId=619e52d51a060ffdf4a903352021&AuthCode=002916&ResponseCode=000&RRN=134610002916&responseHash=5d51d468398e1ef7358889139bc6422c684b3be079eba1a4e4ecc4582d8d3bc7&amount=10.00&cardBrand=VISA&UserField1=1234&UserField3=en&UserField4=1234&UserField5=1234&maskedPAN=450875XXXXXX1019&cardToken=&SubscriptionId=null&email=null&payFor=null
