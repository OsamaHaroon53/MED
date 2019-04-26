import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  deal;
  option = 'about';
  birthDate = 0;
  selected;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    this.deal = this.navParams.data;
    this.birthDate = new Date(this.deal.child.birthday).valueOf();
    if(this.deal.child.injection){
      this.selected =this.deal.child.injection.filter(element => element.id == this.deal.id)[0];
    }
  }
  
  ionViewDidLoad() {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  getVaccineDate({from,format}):number{
    let date = new Date(this.birthDate)
    if(format == 'week'){
      return date.setDate(date.getDate()+(from*7))
    }
    else if(format == 'month'){
      return date.setMonth(date.getMonth()+from)
    }
    else{
      return date.setFullYear(date.getFullYear()+from)
    }
  }

}
