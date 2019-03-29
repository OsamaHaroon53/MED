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

  child;
  criteria = '1';
  injection;
  injectionDate: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private helper: HelperProvider,private api: ApiProvider) {
    this.child =this.navParams.data.child;
    this.injection = this.navParams.data.injection;
    this.injectionDate = this.child.injection[this.child.injection.length-1].date;
    this.criteria = '1';
  }

  segmentChanged(value,input){
    if(value==3)
      input.open();
      // value?0:''
    else if(value == 2)
      this.child.injection[this.child.injection.length-1].date = Date.now()
    else
      this.child.injection[this.child.injection.length-1].date = this.injectionDate;
  }

  goBack(){
    this.navCtrl.pop({animate:true,direction:"back"});
  }

  save(){
    this.helper.load()
    this.helper.toast("Take Vaccine Successfully");
    // delete this.child.injection;
    this.api.updateDeal(this.child.id,this.child).then(res=>{
      this.helper.dismiss();
      this.navCtrl.setRoot(SimpleDealsPage);
    });
  }

  onDateChange(date){
    this.child.injection[this.child.injection.length-1].date = new Date(date.month+'-'+date.day+'-'+date.year).setHours(0,0,0,0);
  }

}
