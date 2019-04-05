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
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for (let i = 0; i < 7; i++) {
      this._daysConfig.push({
        date: new Date(2019, 3, i + 2),
        subTitle: `V${i+1}`,
        marked: true
      })
    }
    this.options = {
      daysConfig: this._daysConfig
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  onChange($event) {
    console.log($event);
  }

}
