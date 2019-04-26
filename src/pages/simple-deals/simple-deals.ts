import { LoginPage } from './../login/login';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, HostBinding } from '@angular/core';
import { NavController, NavParams, Slides, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';

import { User } from '../../datamodel/user';
import { ReqinfPage } from '../reqinf/reqinf';

import { AddDealPage } from '../add-deal/add-deal';
import { FetchdataPage } from '../fetchdata/fetchdata';
import { ShowmapPage } from '../showmap/showmap';
import { DetailDealPage } from '../detail-deal/detail-deal';
import { map } from 'rxjs/operators';
import { vaccineList } from "../vaccine-list/vaccine";
import { VaccineDetailPage } from '../vaccine-detail/vaccine-detail';
import { VaccineListPage } from '../vaccine-list/vaccine-list';
import { CalendarPage } from '../calendar/calendar';
import { style, animate, group, transition, trigger, query, keyframes } from '@angular/animations';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-simple-deals',
  templateUrl: 'simple-deals.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('profileAnimation', [
      transition(':enter', group([
        query('circle', style({ transform: 'translateX(-110%)' })),
        query('circle', group([
          animate('2000ms ease-in', keyframes([
            style({ transform: 'translateX(-100%)', offset: 0.15 }),
            style({ transform: 'translateX(-80%)', offset: 0.2 }),
            style({ transform: 'translateX(-60%)', offset: 0.3 }),
            style({ transform: 'translateX(-40%)', offset: 0.4 }),
            style({ transform: 'translateX(-20%)', offset: 0.5 }),
            style({ transform: 'translateX(0)', offset: 0.6 }),
            style({ transform: 'translateX(20%)', offset: 0.7 }),
            style({ transform: 'translateX(40%)', offset: 0.8 }),
            style({ transform: 'translateX(20%)', offset: 0.9 }),
            style({ transform: 'translateX(0)', offset: 1 }),
          ]))
        ])),
      ]))
    ])
  ],
})


export class SimpleDealsPage {
  // @HostBinding('@profileAnimation')
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('mySlider1') slider1: Slides;
  home = AddDealPage;
  user: User;
  showPhoto: boolean = false;
  allDeal: Array<any> = [
    { name: ['BCG', 'OPV (o)', 'HBV'], category: 'BCG and Oral Polio Vaccine', format: 'week', from: 0, to: 2 },
    { name: ['OPV/IPV(1)', 'HBV(1)', 'Hib(1)', 'Rotavirus(1)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (1st Shot)', format: 'week', from: 6, to: 8 },
    { name: ['Pneumococcal(1) Conjugate Vaccine'], category: 'pneumococcal conjugate vaccine PCV13 (1st shot)', format: 'week', from: 8, to: 10 },
    { name: ['OPV/IPV(2)', 'HBV(2)', 'Hib(2)', 'Rotavirus(2)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (2nd Shot) + pneumococcal conjugate vaccine PCV13 (2nd shot)', format: 'week', from: 10, to: 12 },
    { name: ['DTP/DTPa(3)', 'OPV/IPV(3)', 'HBV(3)', 'Hib(3)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (3rd Shot) + pneumococcal conjugate vaccine PCV13 (3rd shot)', format: 'week', from: 14, to: 16 },
    { name: ['Measles'], category: 'Measles', format: 'month', from: 9, to: 9 },
    { name: ['Chicken Pox '], category: 'Chicken Pox ', format: 'month', from: 9, to: 9 },
  ];
  childLength;
  addCSS = false;
  showAll: boolean = false;
  showSlide = [];
  vaccines = vaccineList;
  selectOption = 'Age'
  maleLength = 0;
  femaleLength = 0;
  allChild = [];
  notification = [];
  constructor(public navCtrl: NavController, private helper: HelperProvider,
    private localNotifications: LocalNotifications,
    private callNumber: CallNumber,
    private api: ApiProvider, private auth: AuthProvider, private cdRef: ChangeDetectorRef,
    public navParams: NavParams, public platform: Platform) {
    this.helper.load();
    this.ready();
    this.api.getProfile(localStorage.getItem('uid')).subscribe((resp: User) => {
      if (!resp) return;
      this.user = resp;
      this.getMyChilds();
    }, err => {
      this.helper.presentAlert('critical error', err.msg, 'ok');
    });
  }

  ready() {
    this.platform.ready().then(rdy => {
      this.localNotifications.on("click").subscribe(notification => {
        this.navCtrl.push(DetailDealPage, notification.data.child);
      })
    })
  }


  getMyChilds() {
    return this.api.getUserDeals(this.user.uid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(resp => {
      this.allChild = resp;
      this.childLength = resp.length;
      this.setNotification();
      this.maleLength = resp.filter(r => r['gender'] == 'male').length
      this.femaleLength = resp.filter(r => r['gender'] == 'female').length
      if (this.childLength == 1) {
        this.allDeal.forEach(el => {
          this.showSlide.push({ ...el, child: resp[0] });
        })
      }
      else if (this.childLength <= 4) {
        this.createChildDealSlides(resp, 0);
      }
      else {
        this.createChildDealSlides(resp, 1);
      }
      this.showAll = true;
      this.selectOption = 'Gender'
      this.cdRef.detectChanges();
      if (this.showSlide.length) {
        this.slider.slidesPerView = 1.3;
        this.slider.spaceBetween = 15;
        this.slider.centeredSlides = true;
        this.slider1.slidesPerView = 1.3;
        this.slider1.spaceBetween = 15;
        this.slider1.centeredSlides = true;
      }
      this.helper.dismiss();
      this.cdRef.detectChanges();
    })
  }

  createChildDealSlides(res, num) {
    if (!num) {
      res.forEach(el => {
        this.showSlide.push({ ...this.allDeal[0], child: el }, { ...this.allDeal[1], child: el })
      });
    }
    else {
      res.forEach(el => {
        this.showSlide.push({ ...this.allDeal[0], child: el })
      });
    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getVaccineDate(item): number {
    let date = new Date(item.child.birthday);
    if (item.format == 'week') {
      return date.setDate(date.getDate() + (item.from * 7))
    }
    else if (item.format == 'month') {
      return date.setMonth(date.getMonth() + item.from)
    }
    else {
      return date.setFullYear(date.getFullYear() + item.from)
    }
  }

  map() {
    this.navCtrl.push(ShowmapPage)
  }

  req() {
    this.navCtrl.push(ReqinfPage);
  }


  goEdit() {
    this.navCtrl.push('UpdateprofilePage', this.user, { animate: true, direction: 'forward' });
  }

  go(page: any) {
    if (page == 'FetchdataPage') {
      if (this.user)
        if (this.user.influencer) {
          this.navCtrl.push(page, this.user, { animate: true, direction: 'back' });
        } else {
          this.helper.presentAlert('Influencer Required', 'You must be an influencer ', 'ok');
        }
    } else {
      this.navCtrl.push(page, this.user, { animate: true, direction: 'forward' });
    }
  }

  addDeal() {
    this.addCSS = false;
    this.navCtrl.push(AddDealPage, null, { animate: true, direction: 'forward' });
  }

  go2() {
    this.navCtrl.push(FetchdataPage, this.user, { animate: true, direction: 'back' });
  }



  showLogout() {
    // items check
    this.helper.presentConfirm('LOGOUT', 'Are you sure you want to logout?', 'LOGOUT', () => {
      //logout

      this.auth.logout();
      this.navCtrl.setRoot(LoginPage);
    }, 'CANCEL', () => {
      //cancel

    })
  }

  descriptionPage(child) {
    this.navCtrl.push(DetailDealPage, child).then(res => {
      this.addCSS = false;
      this.cdRef.detectChanges();
    });
  }

  openVacinne(vaccine: object): void {
    this.navCtrl.push(VaccineDetailPage, vaccine);
  }
  openVacinneList(): void {
    this.navCtrl.push(VaccineListPage);
  }

  openCalendar() {
    this.navCtrl.push(CalendarPage, { childs: this.allChild })
  }

  call() {
    this.callNumber.callNumber("0800-82222", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  clearandCreateNotification() {
    this.localNotifications.cancelAll().then(() => {
      this.localNotifications.schedule(this.notification);
    });
  }
  setNotification() {
    let today = new Date();
    let bd;
    this.allChild.forEach(child => {
      for (let i = 0; i < this.allDeal.length; i++) {
        if(child.injection && child.injection.filter(el=>el.id == i+1).length){
          continue;
        }
        bd = new Date(new Date(child.birthday).setHours(today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds()));
        if (this.allDeal[i].format == 'week') {
          if (!this.allDeal[i].from)
            bd.setTime(bd.getTime() + (60000*5))
          else
            bd.setDate(bd.getDate() + (this.allDeal[i].from * 7))
        }
        else if (this.allDeal[i].format == 'month') {
          bd.setMonth(bd.getMonth() + this.allDeal[i].from)
        }
        if (bd.valueOf() < today.valueOf()) {
          continue;
        }
        else {
          this.notification.push({
            id: i + 1,
            text: child.name + "'s Vaccination Date Remainder",
            data: { child: child },
            trigger: { at: new Date(bd) }
          })
        }
      }
    });
    // console.log(this.notification)
    // this.notification = [
    //   {
    //     id: 1,
    //     text: 'Child-Take Vaccine Remainder',
    //     data: { child: 'key' },
    //     trigger: { at: new Date(new Date().getTime() + 1000) }
    //   }
    // ];
    this.clearandCreateNotification();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad notfication');
  }
}
