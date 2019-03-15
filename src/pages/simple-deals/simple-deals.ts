import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';

import { User } from '../../datamodel/user';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';
import { ReqinfPage } from '../reqinf/reqinf';

import { AddDealPage } from '../add-deal/add-deal';
import { FetchdataPage } from '../fetchdata/fetchdata';
import { ShowmapPage } from '../showmap/showmap';



@Component({
  selector: 'page-simple-deals',
  templateUrl: 'simple-deals.html',
})


export class SimpleDealsPage  {  

   home = AddDealPage;
   user:User;
  showPhoto:boolean=false;
  constructor(public navCtrl: NavController, private helper: HelperProvider,
    private api: ApiProvider, private auth: AuthProvider,
    public navParams: NavParams) {

      this.api.getProfile(localStorage.getItem('uid')).subscribe((resp:User) => {
        console.log(resp);
        this.user = resp;
        
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  map(){
  this.navCtrl.setRoot(ShowmapPage)
  }

  req(){
  this.navCtrl.push(ReqinfPage);
  }


  goEdit() {
    this.navCtrl.push('UpdateprofilePage', this.user,{animate:true,direction:'forward'});
  }

  go(page: any) {
    if (page == 'FetchdataPage') {
      if(this.user)
      if (this.user.influencer) {
        this.navCtrl.push(page, this.user,{animate:true,direction:'back'});
      }else{
        this.helper.presentAlert('Influencer Required','You must be an influencer ','ok');
      }
    } else {
      this.navCtrl.push(page, this.user,{animate:true,direction:'forward'});
    }
  }


  
  goBack(){
    this.navCtrl.setRoot(SimpleDealsPage,null,{animate:true,direction:'back'});
  }

    addDeal(){
    console.log(`adding this deal`);
    this.navCtrl.push(AddDealPage,null,{animate:true,direction:'forward'});
  }

  go2(){
  this.navCtrl.push(FetchdataPage, this.user,{animate:true,direction:'back'});
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
}
