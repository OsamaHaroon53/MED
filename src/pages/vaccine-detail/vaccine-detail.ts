import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VaccineDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vaccine-detail',
  templateUrl: 'vaccine-detail.html',
})
export class VaccineDetailPage {

  current;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.current = this.navParams.data;
    console.log(this.current);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VaccineDetailPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

}
