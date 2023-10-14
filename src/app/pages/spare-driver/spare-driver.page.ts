import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SharedMethodsService } from '../../services/shared-methods.service';
import { TranslateConfigService } from '../../services/translate-config.service';

@Component({
  selector: 'app-spare-driver',
  templateUrl: './spare-driver.page.html',
  styleUrls: ['./spare-driver.page.scss'],
})
export class SpareDriverPage implements OnInit {
  lang: string = '';
  nameOne: string = 'Delegate 1';
  mobileOne: number;
  nameTwo: string = 'Delegate 2';
  mobileTwo: number;
  countryPhoneCode: string = '966';
  parent: any = {};
  nameOneTemp: string = '';
  mobileOneTemp: number;
  nameTwoTemp: string = '';
  mobileTwoTemp: number;
  parentList;
  studentsList: any[] = [];
  isLoading: boolean = false;
  constructor(
    private translateConfig: TranslateConfigService,
    private sharedMethods: SharedMethodsService,
    private detectChange: ChangeDetectorRef,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log(this.lang);
  }

  ionViewWillEnter() {
    this.lang = this.translateConfig.getCurrentLang();
    this.detectChange.detectChanges();
    // if (this.lang == 'en') document.documentElement.dir = 'ltr';
    // else document.documentElement.dir = 'rtl';
    let parent = JSON.parse(localStorage.getItem('parent'));
    this.nameOneTemp = parent.driver1N;
    this.nameTwoTemp = parent.driver2N;
    if (parent.driver1M) this.mobileOneTemp = Number(parent.driver1M);
    if (parent.driver2M) this.mobileTwoTemp = Number(parent.driver2M);

    this.getParentDelegates();

    console.log(this.studentsList);
  }

  save() {
    let phoneOne: number;
    phoneOne = this.mobileOne;
    let msg: string = '';
    let phoneTwo: number;
    phoneTwo = this.mobileTwo;

    if (this.nameOne || this.mobileOne) {
      if (!phoneOne || !this.countryPhoneCode) {
        if (this.lang == 'en') {
          msg = 'Please fill the required fields';
        } else {
          msg = 'يرجى ملء الحقول المطلوبة';
        }
        this.sharedMethods.presentToast(msg, 'danger');

        return;
      }

      if (String(phoneOne).length !== 9 && this.nameOne) {
        if (this.lang == 'en') msg = 'Mobile Number must be at least 8 digits';
        else msg = 'يجب أن يتكون رقم الجوال من ٩ ارقام';

        this.sharedMethods.presentToast(msg, 'danger');

        return;
      }

      phoneOne = (this.countryPhoneCode + String(phoneOne)) as any;
      // console.log(this.mobile);
      if (!String(phoneOne).match(/^\d+$/)) {
        if (this.lang == 'en') msg = 'Please enter the numbers in english';
        else msg = 'يرجي ادخال الارقام باللغه الانجليزيه';
        this.sharedMethods.presentToast(msg, 'danger');

        return;
      }

      if (!this.nameOne) {
        if (this.lang == 'en') {
          msg = 'Please fill the required fields';
        } else {
          msg = 'يرجى إدخال أسم المفوض الأول';
        }
        this.sharedMethods.presentToast(msg, 'danger');
        return;
      } else if (String(this.nameOne).length > 30) {
        if (this.lang == 'en')
          msg = 'Driver Name must be less than or equal 30 characters';
        else msg = 'يجب أن يكون اسم السائق أقل من أو يساوي 30 حرفًا';

        this.sharedMethods.presentToast(msg, 'danger');
        return;
      }
    }

    if (this.nameTwo || this.mobileTwo) {
      let msg: string = '';

      if (String(this.nameOne).length > 30) {
        if (this.lang == 'en')
          msg = 'Driver Name must be less than or equal 30 characters';
        else msg = 'يجب أن يكون اسم السائق أقل من أو يساوي 30 حرفًا';

        this.sharedMethods.presentToast(msg, 'danger');
        return;
      }

      if (!phoneTwo || !this.countryPhoneCode) {
        if (this.lang == 'en') {
          msg = 'Please fill the required fields';
        } else {
          msg = 'يرجى ملء الحقول المطلوبة';
        }
        this.sharedMethods.presentToast(msg, 'danger');

        return;
      }

      if (String(phoneTwo).length !== 9) {
        if (this.lang == 'en') msg = 'Mobile Number must be at least 8 digits';
        else msg = 'يجب أن يتكون رقم الجوال من ٩ ارقام';

        this.sharedMethods.presentToast(msg, 'danger');

        return;
      }

      phoneTwo = (this.countryPhoneCode + String(phoneTwo)) as any;
      // console.log(this.mobile);
      if (!String(phoneTwo).match(/^\d+$/)) {
        if (this.lang == 'en') msg = 'Please enter the numbers in english';
        else msg = 'يرجي ادخال الارقام باللغه الانجليزيه';
        this.sharedMethods.presentToast(msg, 'danger');
        return;
      }

      if (!this.nameTwo) {
        if (this.lang == 'en') {
          msg = 'Please fill the required fields';
        } else {
          msg = 'يرجى إدخال أسم المفوض الثانى';
        }
        this.sharedMethods.presentToast(msg, 'danger');
        return;
      }
    }
    let parentMob = String(this.parent['mob']);

    if (
      this.mobileOne == Number(parentMob.slice(3)) ||
      this.mobileTwo == Number(parentMob.slice(3))
    ) {
      msg = this.translateConfig.translate.instant(
        'You can not delegate yourself'
      );
      this.sharedMethods.presentToast(msg, 'danger');
      return;
    }

    if (this.mobileOne == this.mobileTwo && this.mobileOne) {
      msg = this.translateConfig.translate.instant(
        'You can not repeat the same delegate number'
      );
      this.sharedMethods.presentToast(msg, 'danger');
      return;
    }
    this.isLoading = true;
    this.apiService
      .saveSpareDriver(
        this.parent.code,
        this.nameOne,
        this.mobileOne,
        this.mobileTwo,
        this.nameTwo
      )
      .subscribe((res) => {
        this.isLoading = false;
        if (this.mobileOneTemp && !this.mobileOne) {
          this.studentsList = this.setDelegateStudents(this.mobileOneTemp, '1');
          this.deleteDelegateStudents(this.studentsList);
        } else if (!this.mobileOneTemp && this.mobileOne) {
          console.log('delete loop on students code;');
          this.postDelegate(this.nameOne, this.mobileOne, '1');
        } else if (
          this.mobileOneTemp &&
          this.mobileOne !== this.mobileOneTemp
        ) {
          this.postDelegate(this.nameOne, this.mobileOne, '1');
          //postNewDelegate
        }

        setTimeout(() => {
          if (this.mobileTwoTemp && !this.mobileTwo) {
            this.studentsList = this.setDelegateStudents(
              this.mobileTwoTemp,
              '2'
            );
            this.deleteDelegateStudents(this.studentsList);
            //delete loop on students code;
          } else if (!this.mobileTwoTemp && this.mobileTwo) {
            this.postDelegate(this.nameTwo, this.mobileTwo, '2');
          } else if (
            this.mobileTwoTemp &&
            this.mobileTwo !== this.mobileTwoTemp
          ) {
            this.postDelegate(this.nameTwo, this.mobileTwo, '2');
            //postNewDelegate
          }
          this.getParentDelegates();
        }, 4000);

        if (this.lang == 'en') {
          msg = 'Delegate saved successfully';
        } else {
          msg = 'تم حفظ المفوض بنجاح';
        }
        this.sharedMethods.presentToast(msg, 'primary');

        return;
      });
  }

  ngOnInit() {}

  postDelegate(name, number, delegateNumber: string) {
    let obj: any = {};
    obj['code'] = '966' + number;
    obj['name'] = name;
    obj['mob'] = '966' + number;
    obj['pw'] = String(number).substring(0, 6);
    let studentList = [];
    studentList = this.setDelegateStudents(number, delegateNumber);
    console.log(this.studentsList);
    this.saveDelegate(obj, studentList);
  }
  splitStudentsList(list: any[]) {
    let studentsList: any[] = [];
    list.forEach((item: any) => {
      item.students.forEach((element) => {
        studentsList.push(element);
      });
    });
    return studentsList;
  }

  saveDelegate(obj: any = {}, students: any[] = []) {
    //this.apiService.
    this.isLoading = true;
    this.apiService
      .registerDelegate(obj['code'], obj['mob'], obj['name'], obj['pw'])
      .subscribe((res) => {
        this.isLoading = false;
        this.apiService.registerDelegateStudents(students).subscribe();
      });
  }

  setDelegateStudents(number, delegateNumber) {
    console.log(delegateNumber);
    let studentList = this.studentsList;
    studentList.forEach((student: any) => {
      let code: any = '';
      code = student['code'];
      code = code.split('');
      code.splice(4, 1, delegateNumber);
      code = code.join('');
      console.log(code);
      student['code'] = code;
      student['parent'] = '966' + number;
      delete student['_id'];
      delete student['call_student'];
      delete student['button'];
    });
    console.log(studentList);
    return studentList;
  }

  deleteDelegateStudents(list: any[] = []) {
    list.forEach((item: any) => {
      this.isLoading = true;
      this.apiService.deleteDelegateStudent(item['code']).subscribe((res) => {
        this.isLoading = false;
      });
    });
  }

  getParentDelegates() {
    this.apiService.getParentChildren().subscribe(
      (res: any) => {
        this.parent = res?.parent;

        this.parentList = [];
        Object.keys(res?.result).forEach((key) =>
          this.parentList.push(res?.result[key])
        );
        this.studentsList = [];
        this.studentsList = this.splitStudentsList(this.parentList);
        this.nameOne = this.parent.driver1N;
        this.nameTwo = this.parent.driver2N;
        if (this.parent.driver1M) this.mobileOne = Number(this.parent.driver1M);
        if (this.parent.driver2M) this.mobileTwo = Number(this.parent.driver2M);
        this.nameOneTemp = this.nameOne;
        this.nameTwoTemp = this.nameTwo;
        this.mobileOneTemp = this.mobileOne;
        this.mobileTwoTemp = this.mobileTwo;
      },
      (error) => {}
    );
  }
}
