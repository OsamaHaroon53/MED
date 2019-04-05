import { LoginPage } from './../login/login';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';

import { User } from '../../datamodel/user';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';
import { ReqinfPage } from '../reqinf/reqinf';

import { AddDealPage } from '../add-deal/add-deal';
import { FetchdataPage } from '../fetchdata/fetchdata';
import { ShowmapPage } from '../showmap/showmap';
import { deal } from './deal'
import { DetailDealPage } from '../detail-deal/detail-deal';
import { map } from 'rxjs/operators';
import { vaccineList } from "../vaccine-list/vaccine";
import { VaccineDetailPage } from '../vaccine-detail/vaccine-detail';
import { VaccineListPage } from '../vaccine-list/vaccine-list';
import { CalendarPage } from '../calendar/calendar';

@Component({
  selector: 'page-simple-deals',
  templateUrl: 'simple-deals.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class SimpleDealsPage {

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

  constructor(public navCtrl: NavController, private helper: HelperProvider,
    private api: ApiProvider, private auth: AuthProvider, private cdRef: ChangeDetectorRef,
    public navParams: NavParams) {
    this.helper.load();
    this.api.getProfile(localStorage.getItem('uid')).subscribe((resp: User) => {
      if (!resp) return;
      this.user = resp;
      this.getMyChilds();
      // this.api.getUserDeals(this.user.uid).subscribe(snapshot => {
      // console.log('all new deals recieved', snapshot);
      // let temp;
      // snapshot.forEach((childSnapshot)=> {
      // temp = this.allDeal.map(el=>{
      //   el['child'] = childSnapshot['payload'].doc.data();
      //   return el;
      // }
      // this.child1 = snapshot[0]['payload'].doc.data();
      // });
      // console.log(this.child1);
      // setTimeout(()=>{
      //   el.setAttribute('class','swiper-container swiper-container-horizontal swiper-container-android');
      //   this.slider.update();
      // },10);
      // },err=>{
      //     this.helper.presentAlert('critical error', err.msg, 'ok');
      //   });
    }, err => {
      this.helper.presentAlert('critical error', err.msg, 'ok');
    });
  }

  getMyChilds() {
    return this.api.getUserDeals(this.user.uid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(resp => {
      this.childLength = resp.length;
      if (this.childLength == 1) {
        this.allDeal.forEach(el => {
          this.showSlide.push({...el, child: resp[0]});
        })
      }
      else if (this.childLength <= 4) {
        this.createChildDealSlides(resp,0);
      }
      else{
        this.createChildDealSlides(resp,1);
      }
      this.showAll = true;
      this.cdRef.detectChanges();
      if(this.showSlide.length){
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
        this.showSlide.push({...this.allDeal[0],child: el}, {...this.allDeal[1],child: el})
      });
    }
    else{
      res.forEach(el => {
        this.showSlide.push({...this.allDeal[0],child: el})
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
    this.navCtrl.setRoot(ShowmapPage)
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

  openVacinne(vaccine: object): void{
    this.navCtrl.push(VaccineDetailPage, vaccine);
  }
  openVacinneList(): void{
    this.navCtrl.setRoot(VaccineListPage);
  }

  openCalendar(){
    this.navCtrl.push(CalendarPage)
  }
}
