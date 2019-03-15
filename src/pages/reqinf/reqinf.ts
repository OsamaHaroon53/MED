import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { ProfilePage } from '../profile/profile';


/**
 * Generated class for the ReqinfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reqinf',
  templateUrl: 'reqinf.html',
})
export class ReqinfPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReqinfPage');
  }


  skip(){
  this.navCtrl.setRoot(ProfilePage)
  }

  register(){
  this.navCtrl.setRoot(ProfilePage)
  }

  goback(){
  this.navCtrl.setRoot(ProfilePage)
  }

}
