import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { vaccineList } from "./vaccine";
import { VaccineDetailPage } from '../vaccine-detail/vaccine-detail';

@IonicPage()
@Component({
  selector: 'page-vaccine-list',
  templateUrl: 'vaccine-list.html',
})
export class VaccineListPage {
  public vaccines = vaccineList
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VaccineListPage');
  }

  openVacinne(vaccine: object): void{
    this.navCtrl.push(VaccineDetailPage, vaccine);
  }

  goBack(): void{
    this.navCtrl.setRoot(SimpleDealsPage);
  }

}
