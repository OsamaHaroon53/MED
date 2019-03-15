import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from '../../app/app.component';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';

import { AngularFirestore } from '@angular/fire/firestore';

import { GooglePlus } from '@ionic-native/google-plus/ngx';


import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 err:any;
 token:string;
 influencer:boolean;
  constructor(private googlePlus: GooglePlus, private events:Events,private iab:InAppBrowser,private navCtrl: NavController, private auth:AuthProvider,private api:ApiProvider,private helper:HelperProvider, public fb: Facebook, private afs: AngularFirestore, public menuCtrl: MenuController, 
    private navParams: NavParams) {

        this.menuCtrl.enable(false, 'logoutmenu');


  }
  goBack(){
  this.navCtrl.setRoot(SimpleDealsPage)
  }

  facebookLogin() {
 
 this.fb.login(['public_profile', 'email'])
  .then((retorno: FacebookLoginResponse) => {
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(retorno.authResponse.accessToken);

    firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
                        .then(credential => {

                          this.user = credential.user;
                          
        
                          localStorage.setItem('uid',this.user.uid);
                          this.events.publish('user:loggedIn',this.user);

                                this.navCtrl.setRoot(SimpleDealsPage);
                           
                           console.log(this.user);
                           console.log('UID = ', this.user.uid);
                           console.log('email = ', this.user.email);
                           console.log('name = ', this.user.displayName);

             const userr = { uid: this.user.uid, email:this.user.email, name:this.user.displayName,influencer: false,phone: '',savedDeals:'',photo:'' }
                          this.afs.doc(`users/${this.user.uid}`).set(userr);


                         })
   })

}

  user: any = {
    email:'',
    password:''
  }

  ionViewDidLoad() {
     
 
    
  }

  loginUser() {
  this.googlePlus.login({})
  .then(res => console.log(res))
  .catch(err => console.error(err));
  }
  
  login(){
    this.helper.load();
    this.auth.login(this.user.email, this.user.password).then((resp:any)=>{
      this.auth.saveToken(resp.user.uid);
        
        //this.navCtrl.setRoot(MyApp);
        this.navCtrl.setRoot(SimpleDealsPage);
        //this.navCtrl.pop();
        this.helper.dismiss();
        this.helper.toast(`Welcome!`)
      // this.navCtrl.setRoot(TabsPage).then(()=> {
      
      // })
    },err=>{
      this.err = err.message;
      this.helper.dismiss();
    })
  }
  goRegister(){
    this.navCtrl.push('RegisterPage');
  }
}
