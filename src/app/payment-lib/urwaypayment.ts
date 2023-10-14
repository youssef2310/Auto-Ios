/* URWAY Payment Library */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import CryptoJS from 'crypto-js';
import QueryString from 'queryString';

//const publicIp = require('public-ip');
import { RespCode } from './response-code';
import * as publicIp from 'public-ip';

import { config } from './config';
import { Network } from '@ionic-native/network/ngx';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { SharedMethodsService } from '../services/shared-methods.service';

export class URWAYPayment {
  resp_payid: any;
  resp_targeturl: any;
  resp_result: any;
  resp_respcode: any;
  private sharedMethods : SharedMethodsService
  constructor(private http: HTTP, private network: Network, ) {}

  // ProcessPayment(requestData) {
  //   return new Promise((resolve, reject) => {
  //     let fields = {};
  //     let ip = '110.227.75.28';
  //     let hash = '';

  //     //validate
  //     if (
  //       requestData.trackid == '' ||
  //       requestData.customerEmail == '' ||
  //       requestData.customerName == '' ||
  //       requestData.country == '' ||
  //       requestData.amount == ''
  //     ) {
  //       reject('Invalid parameters');
  //     }

  //     const txnDetails =
  //       '' +
  //       requestData.trackid +
  //       '|' +
  //       config.terminalId +
  //       '|' +
  //       config.password +
  //       '|' +
  //       config.key +
  //       '|' +
  //       requestData.amount +
  //       '|' +
  //       config.currency +
  //       '';
  //     hash = CryptoJS.SHA256(txnDetails).toString();

  //     publicIp
  //       .v4()
  //       .then((address) => {
  //         ip = address;
  //         if (
  //           requestData.action == '1' ||
  //           requestData.action == '4' ||
  //           requestData.action == '13'
  //         ) {
  //           if (requestData.cardToken != '' || requestData.cardToken != null) {
  //             fields = {
  //               trackid: requestData.trackid,
  //               transid: requestData.trackid,
  //               terminalId: config.terminalId,
  //               customerEmail: requestData.customerEmail,
  //               customerName: requestData.customerName,
  //               action: requestData.action,
  //               instrumentType: 'DEFAULT',
  //               merchantIp: ip,
  //               password: config.password,
  //               currency: config.currency,
  //               country: requestData.country,
  //               amount: requestData.amount,
  //               udf2: requestData.udf2,
  //               udf3: requestData.udf3,

  //               udf1: '1234',
  //               udf5: '1234',
  //               udf4: '1234',
  //               tokenizationType: 0,
  //               cardToken: requestData.cardToken,
  //               requestHash: hash,
  //             };
  //           } else {
  //             fields = {
  //               trackid: requestData.trackid,
  //               transid: requestData.trackid,
  //               terminalId: config.terminalId,
  //               customerEmail: requestData.customerEmail,
  //               customerName: requestData.customerName,
  //               action: requestData.action,
  //               instrumentType: 'DEFAULT',
  //               merchantIp: ip,
  //               password: config.password,
  //               currency: config.currency,
  //               country: requestData.country,
  //               amount: requestData.amount,
  //               udf2: requestData.udf2,
  //               udf3: requestData.udf3,
  //               udf1: '1234',
  //               udf5: '1234',
  //               udf4: '1234',
  //               requestHash: hash,
  //             };
  //           }
  //         } else if (requestData.action == '12') {
  //           if (requestData.tokenOperation == 'A') {
  //             fields = {
  //               trackid: requestData.trackid,
  //               transid: requestData.trackid,
  //               terminalId: config.terminalId,
  //               instrumentType: 'DEFAULT',
  //               customerEmail: requestData.customerEmail,
  //               customerName: requestData.customerName,
  //               action: requestData.action,
  //               merchantIp: ip,
  //               password: config.password,
  //               currency: config.currency,
  //               country: requestData.country,
  //               amount: requestData.amount,
  //               udf2: requestData.udf2,
  //               udf3: requestData.udf3,

  //               udf1: '1234',
  //               udf5: '1234',
  //               udf4: '1234',
  //               tokenizationType: 0,
  //               tokenOperation: requestData.tokenOperation,
  //               requestHash: hash,
  //             };
  //           } else {
  //             if (requestData.cardToken == '') {
  //               reject('Required data for tokenization missing.');
  //             } else {
  //               fields = {
  //                 trackid: requestData.trackid,
  //                 transid: requestData.trackid,
  //                 terminalId: config.terminalId,
  //                 customerEmail: requestData.customerEmail,
  //                 customerName: requestData.customerName,
  //                 action: requestData.action,
  //                 instrumentType: 'DEFAULT',
  //                 merchantIp: ip,
  //                 password: config.password,
  //                 currency: config.currency,
  //                 country: requestData.country,
  //                 amount: requestData.amount,
  //                 udf2: requestData.udf2,
  //                 udf3: requestData.udf3,
  //                 udf1: '1234',
  //                 udf5: '1234',
  //                 udf4: '1234',
  //                 cardToken: requestData.cardToken,
  //                 tokenizationType: 0,
  //                 tokenOperation: requestData.tokenOperation,
  //                 requestHash: hash,
  //               };
  //             }
  //           }
  //         } else {
  //           if (requestData.cardToken != '' || requestData.cardToken != null) {
  //             fields = {
  //               trackid: requestData.trackid,
  //               transid: requestData.tranid,
  //               terminalId: config.terminalId,
  //               instrumentType: 'DEFAULT',
  //               customerEmail: requestData.customerEmail,
  //               customerName: requestData.customerName,
  //               action: requestData.action,
  //               merchantIp: ip,
  //               password: config.password,
  //               currency: config.currency,
  //               country: requestData.country,
  //               amount: requestData.amount,
  //               udf2: requestData.udf2,
  //               udf3: requestData.udf3,
  //               udf1: '1234',
  //               udf5: '1234',
  //               udf4: '1234',
  //               tokenizationType: 0,
  //               cardToken: requestData.cardToken,
  //               requestHash: hash,
  //             };
  //           } else {
  //             fields = {
  //               trackid: requestData.trackid,
  //               transid: requestData.tranid,
  //               terminalId: config.terminalId,
  //               instrumentType: 'DEFAULT',
  //               customerEmail: requestData.customerEmail,
  //               customerName: requestData.customerName,
  //               action: requestData.action,
  //               merchantIp: ip,
  //               password: config.password,
  //               currency: config.currency,
  //               country: requestData.country,
  //               amount: requestData.amount,
  //               udf2: requestData.udf2,
  //               udf3: requestData.udf3,
  //               udf1: '1234',
  //               udf5: '1234',
  //               udf4: '1234',
  //               requestHash: hash,
  //             };
  //           }
  //         }

  //         const fieldData = JSON.stringify(fields);

  //         const headers = new HttpHeaders()
  //           .set('Content-Type', 'application/json')
  //           .set('Access-Control-Allow-Origin', '*')
  //           .set(
  //             'Access-Control-Allow-Methods',
  //             'GET, POST, PATCH, PUT, DELETE, OPTIONS, READ'
  //           )
  //           .set(
  //             'Access-Control-Allow-Headers',
  //             'Origin, Content-Type, X-Auth-Token,authorization,XMLHttpRequest, user-agent, accept'
  //           );

  //         const promise = this.http
  //           .post<any>(config.requestUrl, fieldData, { headers })
  //           .toPromise();

  //         promise
  //           .then((data) => {
  //             console.log('Received');
  //             console.log(data);
  //             if (data.payid != undefined) {
  //               let url = '';
  //               if (data.targetUrl.includes('?')) {
  //                 url = data.targetUrl + 'paymentid=' + data.payid;
  //               } else {
  //                 url = data.targetUrl + '?paymentid=' + data.payid;
  //               }
  //               resolve({ status: 'redirect', redirectUrl: url });
  //             } else {
  //               if (data.result != undefined) {
  //                 if (data.result == 'Successful') {
  //                   resolve({ status: 'success' });
  //                 } else {
  //                   let responsecode = '';
  //                   if (data.responsecode != undefined) {
  //                     responsecode = data.responsecode;
  //                   } else {
  //                     responsecode = data.responseCode;
  //                   }

  //                   const json = {
  //                     result: '1',
  //                     responsecode: responsecode,
  //                     description: responsecode,
  //                   };

  //                   const json_data = JSON.stringify(json);
  //                   console.log(json_data);
  //                   reject(
  //                     'Something went wrong! Response Code - ' + responsecode
  //                   );
  //                 }
  //               }
  //             }
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //             reject('Something went wrong!');
  //           });
  //       })
  //       .catch((error) => console.error(`Unable to get IP: ${error}`));
  //   });
  // }

  ProcessPayment(requestData) {
    return new Promise((resolve, reject) => {
      console.log(this.network.type);

      let ip = '10.10.10.10';
      let hash = '';
      let fields = {};
      let upperCurrency = '';
      upperCurrency = requestData.currency;
      var resCurr = upperCurrency.toUpperCase();
      var resCountry = requestData.country.toUpperCase();
      // //validate

      console.log('In Urway Payments CURRENCY ' + resCurr + resCountry);
      const txnDetails =
        '' +
        requestData.trackid +
        '|' +
        config.terminalId +
        '|' +
        config.password +
        '|' +
        config.key +
        '|' +
        requestData.amount +
        '|' +
        resCurr +
        '';
      hash = CryptoJS.SHA256(txnDetails).toString();
      publicIp.v4().then((address) => {
        ip = address;
        console.log('In Urway Payments public IP ' + ip);
        if (
          requestData.action == '1' ||
          requestData.action == '4' ||
          requestData.action == '13'
        ) {
          fields = {
            terminalId: config.terminalId,
            password: config.password,
            action: requestData.action,
            currency: resCurr,
            customerEmail: requestData.customerEmail,
            country: requestData.country,
            amount: requestData.amount,
            merchantIp: ip,
            customerIp: ip,
            trackid: requestData.trackid,
            udf2: requestData.udf2,
            udf3: requestData.udf3,
            udf1: requestData.udf1,
            udf5: requestData.udf5,
            udf4: requestData.udf4,
            address: requestData.address,
            city: requestData.city,
            zipCode: requestData.zip,
            state: requestData.state,
            cardToken: requestData.cardToken,
            tokenizationType: requestData.tokentype,
            requestHash: hash,
          };
        } else if (
          requestData.action == '2' ||
          requestData.action == '3' ||
          requestData.action == '5' ||
          requestData.action == '9' ||
          requestData.action == '6'
        ) {
          console.log('In relative');
          fields = {
            terminalId: config.terminalId,
            password: config.password,
            action: requestData.action,
            currency: requestData.currency,
            customerEmail: requestData.customerEmail,
            country: requestData.country,
            amount: requestData.amount,
            merchantIp: ip,
            customerIp: ip,
            udf2: requestData.udf2,
            udf3: requestData.udf3,
            udf1: requestData.udf1,
            udf5: requestData.udf5,
            udf4: requestData.udf4,
            trackid: requestData.trackid,
            requestHash: hash,
            transid: requestData.trxnID,
            instrumentType: 'DEFAULT',
          };
        } else if (requestData.action == '12') {
          if (
            requestData.tokenOperation == 'U' ||
            requestData.tokenOperation == 'D'
          ) {
            if (requestData.cardToken == '') {
              reject('Required data for tokenization missing.');
            } else {
              fields = {
                terminalId: config.terminalId,
                password: config.password,
                action: requestData.action,
                currency: requestData.currency,
                customerEmail: requestData.customerEmail,
                country: requestData.country,
                amount: requestData.amount,
                merchantIp: ip,
                customerIp: ip,
                trackid: requestData.trackid,
                udf2: requestData.udf2,
                udf3: requestData.udf3,
                udf1: requestData.udf1,
                udf5: requestData.udf5,
                udf4: requestData.udf4,

                tokenOperation: requestData.tokenOperation,
                cardToken: requestData.cardToken,
                tokenizationType: requestData.tokentype,
                requestHash: hash,
              };
            }
          } else {
            console.log('In Action code 12 and oper A');
            fields = {
              terminalId: config.terminalId,
              password: config.password,
              action: requestData.action,
              currency: requestData.currency,
              customerEmail: requestData.customerEmail,
              country: requestData.country,
              amount: requestData.amount,
              merchantIp: ip,
              customerIp: ip,
              trackid: requestData.trackid,
              udf2: requestData.udf2,
              udf3: requestData.udf3,
              udf1: requestData.udf1,
              udf5: requestData.udf5,
              udf4: requestData.udf4,

              tokenOperation: requestData.tokenOperation,
              cardToken: requestData.cardToken,
              tokenizationType: requestData.tokentype,
              requestHash: hash,
            };
          }
        } else {
          fields = {
            terminalId: config.terminalId,
            password: config.password,
            action: requestData.action,
            currency: requestData.currency,
            customerEmail: requestData.customerEmail,
            country: requestData.country,
            amount: requestData.amount,
            merchantIp: ip,
            customerIp: ip,
            trackid: requestData.trackid,
            udf2: requestData.udf2,
            udf3: requestData.udf3,
            udf1: requestData.udf1,
            udf5: requestData.udf5,
            udf4: requestData.udf4,

            tokenOperation: '',
            tokenizationType: requestData.tokentype,
            cardToken: requestData.cardToken,
            requestHash: hash,
          };
        }

        //   console.log("API Request without"+ JSON.stringify(JSON.parse(fields)));
        // debugger
        const fieldData = JSON.stringify(fields);
        //  const headers = new HttpHeaders()
        //     .set('Content-Type', 'application/json')
        //     .set("Access-Control-Allow-Origin", "*")
        //     .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS, READ')
        //   .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token,authorization,XMLHttpRequest, user-agent, accept')

        //this.http.post(`${this.Url}`, operator, {});

        console.log('API Request' + fieldData);

        let headers = {
          'Content-Type': 'application/json',
          Accept: '*/*',
        };

        //let headers = { 'Accept': 'application/json;charset=UTF-8' };
        console.log('API Request without' + fields);
        this.http.setDataSerializer('json');
        this.http
          .post(config.requestUrl, fields, headers)
          .then((data) => {
            const apiresponseData = data.data;
            console.log('RESPONS DATA JSON ' + apiresponseData);
            //  {"tranid":"","result":"UnSuccessful","reason":"","authCode":"","trackid":"","terminalid":"","udf1":"","cardBrand":"","udf2":"","responseCode":"659","rrn":""}

            this.resp_result = JSON.parse(apiresponseData);
            this.resp_payid = this.resp_result['payid'];
            this.resp_targeturl = this.resp_result['targetUrl'];
            this.resp_respcode = this.resp_result['responseCode'];
            console.log(
              'RESPONS RUNALI ' + this.resp_targeturl + this.resp_respcode
            );
            if (
              this.resp_targeturl != '' &&
              (this.resp_targeturl + '').toString() != 'null' &&
              this.resp_targeturl != undefined
            ) {
              let url = '';
              url =
                (this.resp_targeturl + '').replace('?', '') +
                '?paymentid=' +
                this.resp_payid;

              resolve({ status: 'redirect', redirectUrl: url });
            } else if (
              this.resp_respcode == '000' &&
              this.resp_targeturl == null
            ) {
              let responsecode = '';
              let respMsg = '';

              responsecode = this.resp_result['responsecode'];
              if (responsecode == undefined) {
                responsecode = this.resp_result['responseCode'];
              }

              console.log('RESPONS responsecode **** ' + responsecode);

              respMsg = RespCode[responsecode];
              console.log('RESPONS MSG1 ' + respMsg);
              // {"tranid":"","result":"UnSuccessful","responsecode":"659","reason":"","authCode":"","trackid":"","terminalid":"","udf1":"","cardBrand":"","udf2":"","rrn":""}
              const json = {
                result: this.resp_result['result'],
                responsecode: responsecode,
                amount: this.resp_result['amount'],
                tranid: this.resp_result['tranid'],
                cardToken: this.resp_result['cardToken'],
                maskedpan: this.resp_result['maskedPAN'],
                cardBrand: this.resp_result['cardBrand'],
                description: respMsg,
              };

              const json_data = JSON.stringify(json);
              console.log('RESPONS DATA payid ' + this.resp_payid);
              resolve({ status: 'standaloneRefund', redirectUrl: json_data });
              /****************  ENQUIRY ******** */
              //                         this.ProcessTransactEnqPayment(requestData,this.resp_result["tranid"])
              //   .then((response: any) =>
              //   {
              //                            let responsecode = "";
              //                            let respMsg="";

              //                            responsecode = response['responsecode'];

              //  console.log("RESPONS responsecode **** "+responsecode);

              //                             respMsg=RespCode[responsecode]

              //       console.log("IN TRANSACT RELA "+JSON.stringify(response))
              //       let transResponse="";
              //         transResponse=JSON.parse(response['redirectUrl'])
              //               console.log("IN TRANSACT RELA  AMOUNT"+JSON.stringify(transResponse) )
              //                 console.log("IN TRANSACT RELATIVE  AMOUNT"+transResponse['amount'] )
              //          const json = {
              //                                     result: transResponse['result'],
              //                                     responsecode: transResponse['responsecode'],
              //                                     amount: transResponse['amount'],
              //                                     tranid: transResponse['tranid'],
              //                                     cardToken: transResponse['cardToken'],
              //                                     maskedpan: transResponse['maskedpan'],
              //                                     cardBrand: transResponse['cardBrand'],
              //                                     description: respMsg,

              //                                  };

              //                             const json_data = JSON.stringify(json);
              //                             console.log("RESPONS DATA payid "+this.resp_payid);
              //                             resolve({ status: "standaloneRefund", redirectUrl: json_data });
              //   })
              //   .catch((error) => {
              //     //dismiss
              //     // // this.loading.dismiss();
              //     //  this.paymentStatus = 2;    //error
              //       //this.paymentMessage = error;
              //      // reject("Hash mismatch!");
              //       //responseMsgConfig.startTrxn = false;
              //   });
              /************************ */
            } else {
              //FAIL Transactions HEre
              console.log('RESPONS DATA In ELSE **** ' + apiresponseData);
              if (this.resp_result['result'] != undefined) {
                if (this.resp_result['result'] == 'Successful') {
                  this.ProcessTransactEnqPayment(
                    requestData,
                    this.resp_result['tranid']
                  )
                    .then((response: any) => {
                      let responsecode = '';
                      let respMsg = '';

                      let transResponse = '';
                      console.log(
                        'IN TRANSACT RELA  else ' + JSON.stringify(response)
                      );
                      transResponse = JSON.parse(response['redirectUrl']);
                      console.log(
                        'IN TRANSACT RELA  RESULT ' + transResponse['result']
                      );
                      responsecode = transResponse['responsecode'];
                      if (responsecode == undefined) {
                        responsecode = transResponse['responseCode'];
                      }
                      console.log('RESPONS responsecode **** ' + responsecode);

                      respMsg = RespCode[responsecode];
                      console.log('Respon code Msg' + respMsg);
                      this.sharedMethods.presentToast(respMsg, 'primary')
                      const json = {
                        result: transResponse['result'],
                        responsecode: transResponse['responsecode'],
                        amount: transResponse['amount'],
                        tranid: transResponse['tranid'],
                        cardToken: transResponse['cardToken'],
                        maskedpan: transResponse['maskedpan'],
                        cardBrand: transResponse['cardBrand'],
                        description: respMsg,
                      };
                      const json_data = JSON.stringify(json);
                      resolve({ status: 'otherResp', redirectUrl: json_data });
                    })
                    .catch((error) => {
                      //dismiss
                      // // this.loading.dismiss();
                      //  this.paymentStatus = 2;    //error
                      //this.paymentMessage = error;
                      reject('Hash mismatch!');
                      //responseMsgConfig.startTrxn = false;
                    });
                  //ProcessTransactEnqPayment()
                } else {
                  let responsecode = '';
                  let respMsg = '';
                  responsecode = this.resp_result['responseCode'];

                  console.log('RESPONS responsecode **** ' + responsecode);

                  respMsg = RespCode[responsecode];
                  console.log('Respon code Msg' + respMsg);

                  if (this.resp_result['tranid'] == '') {
                    console.log('Respon code RUNALIIII' + respMsg);
                    const json = {
                      result: this.resp_result['result'],
                      responsecode: responsecode,
                      description: respMsg,
                    };
                    const json_data = JSON.stringify(json);

                    resolve({ status: 'otherResp', redirectUrl: json_data });
                  } else {
                    console.log(
                      'RESPONSE responsecode else **** ' +
                        this.resp_result['result']
                    );
                    //                  this.ProcessTransactEnqPayment(requestData,this.resp_result["tranid"])
                    //   .then((response: any) =>
                    //   {
                    //       let transResponse="";
                    //            console.log("IN TRANSACT RELA  else "+JSON.stringify(response))
                    //             transResponse=JSON.parse(response['redirectUrl'])
                    //               console.log("IN TRANSACT RELA  AMOUNT"+JSON.stringify(transResponse) )
                    //                 console.log("IN TRANSACT RELATIVE  AMOUNT"+transResponse['amount'] )
                    ///***********get values from  */
                    let responsecode = '';
                    let respMsg = '';
                    responsecode = this.resp_result['responseCode'];

                    console.log('RESPONS responsecode **** ' + responsecode);

                    respMsg = RespCode[responsecode];
                    console.log('Respon code Msg' + respMsg);

                    const json = {
                      result: this.resp_result['result'],
                      responsecode: responsecode,
                      amount: this.resp_result['amount'],
                      tranid: this.resp_result['tranid'],
                      cardToken: this.resp_result['cardToken'],
                      maskedpan: this.resp_result['maskedPAN'],
                      cardBrand: this.resp_result['cardBrand'],
                      description: respMsg,
                    };
                    const json_data = JSON.stringify(json);
                    resolve({ status: 'otherResp', redirectUrl: json_data });
                    //       })
                    //   .catch((error) => {
                    //     //dismiss
                    //     // // this.loading.dismiss();
                    //     //  this.paymentStatus = 2;    //error
                    //       //this.paymentMessage = error;
                    //      // reject("Hash mismatch!");
                    //       //responseMsgConfig.startTrxn = false;
                    //   });

                    //*******************ADD HERE PAYTRXN

                    //call transactionid
                  }
                }
              }
            }

            // console.log("RESPONS DATA payid "+this.resp_payid);
            // console.log("RESPONS DATA JSON2 "+data.data); // data received by server
            // console.log("RESPONS Target URL "+this.resp_targeturl);
          })
          .catch((error) => {
            const fieldDataerr = JSON.stringify(error.error);
            console.log('RESPONS ERROR JSON1 ' + JSON.stringify(error.status));
            console.log('RESPONS ERROR JSON3 ' + fieldDataerr); // error message as string
            console.log('RESPONS ERROR JSON2' + error.headers);
          });
      });
    });
  }

  // ProcessResponse(response) {
  //   const responseObject = QueryString.parse(response);
  //   console.log('responseObject')
  //   console.log(responseObject)
  //   return new Promise((resolve, reject) => {
  //     const requestHash =
  //       '' +
  //       responseObject.TranId +
  //       '|' +
  //       config.key +
  //       '|' +
  //       responseObject.ResponseCode +
  //       '|' +
  //       responseObject.amount +
  //       '';
  //     const txn_details1 =
  //       '' +
  //       responseObject.TrackId +
  //       '|' +
  //       config.terminalId +
  //       '|' +
  //       config.password +
  //       '|' +
  //       config.key +
  //       '|' +
  //       responseObject.amount +
  //       '|' +
  //       config.currency +
  //       '';

  //     const hashRet = CryptoJS.SHA256(requestHash).toString();
  //     const hashCal = CryptoJS.SHA256(txn_details1).toString();

  //     if (hashRet == responseObject['responseHash']) {
  //       const fields = {
  //         trackid: responseObject.TrackId,
  //         terminalId: config.terminalId,
  //         action: '10',
  //         merchantIp: '',
  //         password: config.password,
  //         currency: config.currency,
  //         transid: responseObject.TranId,
  //         amount: responseObject.amount,
  //         udf5: 'Test5',
  //         udf3: 'Test3',
  //         udf4: 'Test4',
  //         udf1: 'Test1',
  //         udf2: 'Test2',
  //         requestHash: hashCal,
  //       };

  //       const fieldData = JSON.stringify(fields);

  //       const headers = new HttpHeaders()
  //         .set('Content-Type', 'application/json')
  //         .set('Access-Control-Allow-Origin', '*')
  //         .set(
  //           'Access-Control-Allow-Methods',
  //           'GET, POST, PATCH, PUT, DELETE, OPTIONS, READ'
  //         )
  //         .set(
  //           'Access-Control-Allow-Headers',
  //           'Origin, Content-Type, X-Auth-Token,authorization,XMLHttpRequest, user-agent, accept'
  //         );

  //       this.http
  //         .post<any>(config.requestUrl, fieldData, { headers })
  //         .subscribe({
  //           next: (data) => {
  //             console.log('data')
  //             console.log(data)
  //             const urldecodeapi = data;
  //             let inquiryResponsecode = '';

  //             if (urldecodeapi.responseCode != undefined) {
  //               inquiryResponsecode = urldecodeapi.responseCode;
  //             } else {
  //               inquiryResponsecode = urldecodeapi.responsecode;
  //             }

  //             const inquirystatus = urldecodeapi.result;

  //             if (
  //               inquirystatus === 'Approved' ||
  //               responseObject['ResponseCode'] === inquiryResponsecode
  //             ) {
  //               if (
  //                 responseObject['cardToken'] != undefined &&
  //                 responseObject['maskedPAN'] != undefined &&
  //                 responseObject['maskedPAN'] != '' &&
  //                 responseObject['cardToken'] != '' &&
  //                 responseObject['cardToken'] != null &&
  //                 responseObject['cardToken'] != 'null'
  //               ) {
  //                 console.log('resolve 1')
  //                 resolve({
  //                   type: 'receiptToken',
  //                   amount: responseObject['amount'],
  //                   tranid: responseObject['TranId'],
  //                   status: 'Successful',
  //                   cardtoken: responseObject['cardToken'],
  //                   maskedno: responseObject['maskedPAN'],
  //                 });
  //               } else {
  //                 console.log('resolve 2')
  //                 resolve({
  //                   type: 'receipt',
  //                   amount: responseObject['amount'],
  //                   tranid: responseObject['TranId'],
  //                   status: responseObject['Result'],
  //                 });
  //               }
  //             } else {
  //               reject('Something went wrong! Data has been tampered with!');
  //             }
  //           },
  //           error: (error) => {
  //             console.error('There was an error!', error);
  //           },
  //         });
  //     } else {
  //       reject('Hash mismatch!');
  //     }
  //   });
  // }

  ProcessTransactEnqPayment(requestData, transactionid) {
    return new Promise((resolve, reject) => {
      let ip = '';
      let hash = '';
      let fields = {};
      let upperCurrency = '';
      upperCurrency = requestData.currency;
      var resCurr = upperCurrency.toUpperCase();
      var resCountry = requestData.country.toUpperCase();
      // //validate

      console.log(
        'In Urway Payments CURRENCY TRANSACT ' + resCurr + resCountry
      );

      const txnDetails =
        '' +
        requestData.trackid +
        '|' +
        config.terminalId +
        '|' +
        config.password +
        '|' +
        config.key +
        '|' +
        requestData.amount +
        '|' +
        resCurr +
        '';
      hash = CryptoJS.SHA256(txnDetails).toString();

      publicIp.v4().then((address) => {
        ip = address;
        if (
          requestData.action == '2' ||
          requestData.action == '3' ||
          requestData.action == '5' ||
          requestData.action == '9' ||
          requestData.action == '6'
        ) {
          fields = {
            terminalId: config.terminalId,
            password: config.password,
            action: '10',
            currency: resCurr,
            country: requestData.country,
            amount: requestData.amount,
            merchantIp: ip,
            customerIp: ip,
            transid: requestData.trxnID,
            trackid: requestData.trackid,
            udf2: requestData.udf2,
            udf3: requestData.udf3,
            udf1: requestData.action,
            udf5: requestData.udf5,
            udf4: requestData.udf4,
            requestHash: hash,
          };
        } else {
          fields = {
            terminalId: config.terminalId,
            password: config.password,
            action: '10',
            currency: resCurr,
            country: requestData.country,
            amount: requestData.amount,
            merchantIp: ip,
            customerIp: ip,
            transid: transactionid,
            trackid: requestData.trackid,
            udf2: requestData.udf2,
            udf3: requestData.udf3,
            udf1: requestData.udf1,
            udf5: requestData.udf5,
            udf4: requestData.udf4,
            requestHash: hash,
          };
        }
        const fieldData = JSON.stringify(fields);
        console.log('API Request enquiry' + fieldData);

        let headers = {
          'Content-Type': 'application/json',
          Accept: '*/*',
        };

        //let headers = { 'Accept': 'application/json;charset=UTF-8' };
        console.log('API Request without' + fields);
        this.http.setDataSerializer('json');
        this.http
          .post(config.requestUrl, fields, headers)
          .then((data) => {
            const apiresponseData = data.data;
            console.log(
              'RESPONSE DATA JSON  TRANCTION ENQUIRY ' + apiresponseData
            );

            let respMsg = '';
            let responsecode = '';
            this.resp_result = JSON.parse(apiresponseData);
            responsecode = this.resp_result['responseCode'];
            console.log('RESPONS responsecode **** ' + responsecode);

            respMsg = RespCode[responsecode];
            console.log('Respon code Msg' + respMsg);
            const json = {
              result: this.resp_result['result'],
              responsecode: responsecode,
              amount: this.resp_result['amount'],
              tranid: this.resp_result['udf2'],
              cardToken: this.resp_result['cardToken'],
              maskedpan: this.resp_result['maskedPAN'],
              cardBrand: this.resp_result['cardBrand'],
              description: respMsg,
            };
            const json_data = JSON.stringify(json);
            resolve({ status: 'otherResp', redirectUrl: json_data });

            console.log('RESPONS ProcessTransactEnqPayment ' + this.resp_payid);
            console.log('RESPONS ProcessTransactEnqPayment ' + data.data); // data received by server
            //   console.log("RESPONS ProcessTransactEnqPayment"+this.resp_targeturl);
          })
          .catch((error) => {
            const fieldDataerr = JSON.stringify(error.error);
            console.log('RESPONS ERROR JSON1 ' + JSON.stringify(error.status));
            console.log('RESPONS ERROR JSON3 ' + fieldDataerr); // error message as string
            console.log('RESPONS ERROR JSON2' + error.headers);
          });
      });
    });
  }
}
