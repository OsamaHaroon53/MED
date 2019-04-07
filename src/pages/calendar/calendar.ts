import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarModalOptions, DayConfig } from 'ion2-calendar';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  date: string;
  type: 'string';
  options: CalendarModalOptions;
  _daysConfig: DayConfig[] = [];
  allChild = [];
  allDeal: Array<any> = [
    { name: ['BCG', 'OPV (o)', 'HBV'], category: 'BCG and Oral Polio Vaccine', format: 'week', from: 0, to: 2 },
    { name: ['OPV/IPV(1)', 'HBV(1)', 'Hib(1)', 'Rotavirus(1)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (1st Shot)', format: 'week', from: 6, to: 8 },
    { name: ['Pneumococcal(1) Conjugate Vaccine'], category: 'pneumococcal conjugate vaccine PCV13 (1st shot)', format: 'week', from: 8, to: 10 },
    { name: ['OPV/IPV(2)', 'HBV(2)', 'Hib(2)', 'Rotavirus(2)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (2nd Shot) + pneumococcal conjugate vaccine PCV13 (2nd shot)', format: 'week', from: 10, to: 12 },
    { name: ['DTP/DTPa(3)', 'OPV/IPV(3)', 'HBV(3)', 'Hib(3)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (3rd Shot) + pneumococcal conjugate vaccine PCV13 (3rd shot)', format: 'week', from: 14, to: 16 },
    { name: ['Measles'], category: 'Measles', format: 'month', from: 9, to: 9 },
    { name: ['Chicken Pox '], category: 'Chicken Pox ', format: 'month', from: 9, to: 9 },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.allChild = navParams.data.childs;
    for (const iterator of this.allChild) {
      this.allDeal.map((el,i)=>{
        this._daysConfig.push({
          date: new Date(this.getVaccineDate(el,iterator.birthday)),
          subTitle: i==5?`V6-V7`:`V${i+1}`,
          marked: true
        })
      })
    }
    this.options = {
      daysConfig: this._daysConfig
    };
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CalendarPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  getVaccineDate(item,birthday): number {
    let date = new Date(birthday);
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

  onChange($event) {
    // console.log($event);
  }

}
