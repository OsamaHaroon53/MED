import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from '../../app/app.component';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';

import { AngularFirestore } from '@angular/fire/firestore';

import { GooglePlus } from '@ionic-native/google-plus';

import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  err: any;
  token: string;
  influencer: boolean;
  constructor(private googlePlus: GooglePlus, private events: Events, private iab: InAppBrowser, private navCtrl: NavController, private auth: AuthProvider, private api: ApiProvider, private helper: HelperProvider
    // , public fb: Facebook
    , private afs: AngularFirestore, public menuCtrl: MenuController,
    private navParams: NavParams, private fire: AngularFireAuth) {

    this.menuCtrl.enable(false, 'logoutmenu');
    // if(this.auth.isAuthenticated())
    //   this.navCtrl.setRoot(SimpleDealsPage);

  }
  goBack() {
    this.navCtrl.setRoot(SimpleDealsPage)
  }
  facebookLogin(){
    this.helper.load();
    // this.spl
    this.fire.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res=>{
        this.helper.load();
        console.log(res);
        // const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.credential['accessToken']);
        // console.log(facebookCredential);
              firebase.auth().signInAndRetrieveDataWithCredential(res.credential)
          .then(credential => {

            this.user = credential.user;


            localStorage.setItem('uid', this.user.uid);
            this.events.publish('user:loggedIn', this.user);

            console.log(this.user);
            console.log('UID = ', this.user.uid);
            console.log('email = ', this.user.email);
            console.log('name = ', this.user.displayName);

            const userr = { uid: this.user.uid, email: this.user.email, name: this.user.displayName, influencer: false, phone: '', savedDeals: '', photo: '' }
            this.afs.doc(`users/${this.user.uid}`).set(userr);
            this.navCtrl.setRoot(SimpleDealsPage);
            this.helper.dismiss();

          }).catch(err=>{
            this.helper.dismiss();
            console.log("inner firebase error fb login",err);
          })
      }).catch(err=> {
        console.log(err);
        if (err.code === 'auth/account-exists-with-different-credential'){
          this.helper.presentAlert('Account exist with Different Credential','you may have login with google or register you Account with same Email','OK')
        }
        else{
          this.helper.toast('Error');
        }
      });
      this.helper.dismiss();
      
  }
  // facebookLogin() {
  //   console.log('click ok')
  //   this.fb.login(['public_profile', 'email'])
  //     .then((retorno: FacebookLoginResponse) => {
  //       const facebookCredential = firebase.auth.FacebookAuthProvider.credential(retorno.authResponse.accessToken);
  //       console.log('first-step completed')
  //       firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
  //         .then(credential => {

  //           this.user = credential.user;


  //           localStorage.setItem('uid', this.user.uid);
  //           this.events.publish('user:loggedIn', this.user);

  //           this.navCtrl.setRoot(SimpleDealsPage);

  //           console.log(this.user);
  //           console.log('UID = ', this.user.uid);
  //           console.log('email = ', this.user.email);
  //           console.log('name = ', this.user.displayName);

  //           const userr = { uid: this.user.uid, email: this.user.email, name: this.user.displayName, influencer: false, phone: '', savedDeals: '', photo: '' }
  //           this.afs.doc(`users/${this.user.uid}`).set(userr);


  //         }).catch(err=>{
  //           console.log("inner firebase error fb login",err);
  //         })
  //     }).catch(err=>{
  //       console.log("error fb login",err);
  //     })

  // }

  user: any = {
    email: '',
    password: ''
  }

  ionViewDidLoad() {



  }

  loginUser() {
    this.helper.load();
    this.googlePlus.login({
      'webClientId': '522878343942-can42t1pc99lp05mlgpvvr87aci3c7g8.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(res => {
        // this.helper.load();
        console.log(res)
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        console.log('gC',googleCredential)
        firebase.auth().signInAndRetrieveDataWithCredential(googleCredential)
          .then(credential => {
            console.log(credential);
            this.user = credential.user;


            localStorage.setItem('uid', this.user.uid);
            this.events.publish('user:loggedIn', this.user);
            console.log(this.user);
            console.log('UID = ', this.user.uid);
            console.log('email = ', this.user.email);
            console.log('name = ', this.user.displayName);

            const userr = { uid: this.user.uid, email: this.user.email, name: this.user.displayName, influencer: false, phone: '', savedDeals: '', photo: '' }
            this.afs.doc(`users/${this.user.uid}`).set(userr);
            this.navCtrl.setRoot(SimpleDealsPage);
            this.helper.dismiss();
          }).catch(err=>{
            console.log("inner firebase error google login",err);
            this.helper.dismiss();
            this.helper.toast('LogIn Failed')
          })
      })
      .catch(err => {
        this.helper.dismiss();
        console.log(err);
      });
  }

  login() {
    this.helper.load();
    this.auth.login(this.user.email, this.user.password).then((resp: any) => {
      this.auth.saveToken(resp.user.uid);

      //this.navCtrl.setRoot(MyApp);
      this.navCtrl.setRoot(SimpleDealsPage);
      //this.navCtrl.pop();
      this.helper.dismiss();
      this.helper.toast(`Welcome!`)
      // this.navCtrl.setRoot(TabsPage).then(()=> {

      // })
    }, err => {
      this.err = err.message;
      this.helper.dismiss();
    })
  }
  goRegister() {
    this.navCtrl.push('RegisterPage');
  }
}
