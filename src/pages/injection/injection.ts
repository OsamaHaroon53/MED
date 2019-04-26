import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { SimpleDealsPage } from '../simple-deals/simple-deals';

@Component({
  selector: 'page-injection',
  templateUrl: 'injection.html',
})
export class InjectionPage {

  todayDate = new Date(new Date().setHours(0,0,0,0) - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  child;
  criteria;
  injection;
  injectionDate: number;
  injectedDate;
  constructor(public navCtrl: NavController, public navParams: NavParams, private helper: HelperProvider,private api: ApiProvider) {
    this.child =this.navParams.data.child;
    this.injection = this.navParams.data.injection;
    this.injectionDate = this.child.injection[this.child.injection.length-1].date;
    this.injectedDate = new Date(new Date(this.injectionDate).setHours(0,0,0,0) - new Date(this.injectionDate).getTimezoneOffset() * 60000).toISOString().split("T")[0];
  }

  ionViewDidLoad() {
    this.criteria = 'a';
  }

  segmentChanged(value,input){
    if(value=='c'){
      if(new Date(this.injectedDate)>new Date(this.todayDate)){
        this.helper.toast('You can not take Vaccine.')
        return;
      }
      input.open();
    }
    else if(value == 'b')
      this.child.injection[this.child.injection.length-1].date = Date.now()
    else
      this.child.injection[this.child.injection.length-1].date = this.injectionDate;
  }

  goBack(){
    this.navCtrl.pop({animate:true,direction:"back"});
  }

  save(){
    if(new Date(this.injectedDate)>new Date(this.todayDate)){
      this.helper.toast('You can not take Vaccine.')
      return;
    }
    this.helper.load()
    this.helper.toast("Take Vaccine Successfully");
    // delete this.child.injection;
    this.api.updateDeal(this.child.id,this.child).then(res=>{
      this.helper.dismiss();
      this.navCtrl.setRoot(SimpleDealsPage,{animate:true,direction:"back"});
    });
  }

  onDateChange(date){
    this.child.injection[this.child.injection.length-1].date = new Date(date.month+'-'+date.day+'-'+date.year).setHours(0,0,0,0);
  }

}
