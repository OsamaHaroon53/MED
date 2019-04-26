import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-view-pdf',
  templateUrl: 'view-pdf.html',
})
export class ViewPdfPage {

  deals = [];
  child: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    this.deals = this.navParams.data.deals;
    this.child = this.navParams.data.child;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ViewPdfPage');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  getVaccineDate({ from, format }): number {
    let date = new Date(this.child.bd)
    if (format == 'week') {
      return date.setDate(date.getDate() + (from * 7))
    }
    else if (format == 'month') {
      return date.setMonth(date.getMonth() + from)
    }
    else {
      return date.setFullYear(date.getFullYear() + from)
    }
  }

}
