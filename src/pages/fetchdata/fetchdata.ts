import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { AddDealPage } from '../add-deal/add-deal';
import { Deal } from '../deal/deal';
import { HelperProvider } from '../../providers/helper/helper';
import { InvitedetailsPage } from '../invitedetails/invitedetails';
import { SimpleDealsPage } from '../simple-deals/simple-deals';


@IonicPage()
@Component({
  selector: 'page-fetchdata',
  templateUrl: 'fetchdata.html',
})
export class FetchdataPage { goBack(){ this.navCtrl.setRoot(SimpleDealsPage,null,{animate:true,direction:'back'}) }

  constructor(private _cdRef: ChangeDetectorRef,public navCtrl: NavController, private api:ApiProvider,
    public navParams: NavParams,private helper:HelperProvider,private platform: Platform) {
      let backAction =  platform.registerBackButtonAction(() => {
        console.log("back native");
        this.goBack();
        backAction();
      },2)
  }

  ionViewDidLoad() {
    this.getMyDeals();
  }



  deals;

  getMyDeals(){
    let id = localStorage.getItem('uid')
    return this.api.getUserDeals(id).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(resp=>{
      this.deals = resp;
      this._cdRef.detectChanges();
    })
  }

  deleteChild(id){
    this.helper.load()
    this.api.deleteChild(id).then(res=>{
      this.helper.dismiss();
      this.helper.toast("Child Delete Successfully");
    }).catch(err=>{
      this.helper.dismiss();
      this.helper.toast("Child Delete Fail")
    });
  }

  editDeal(x:Deal){
  this.navCtrl.push(AddDealPage,{'deal':x});
  }

  addDeal(){
    this.navCtrl.push(AddDealPage,null,{animate:true,direction:'forward'});
  }

    deleteDeal(x:Deal){
      this.api.deleteDeal(x.id).then(res=>{
        this.helper.toast('deal deleted');
      })
    }

 tour1(event ,x) {
  this.navCtrl.push(InvitedetailsPage,{x:x});
  }


}
