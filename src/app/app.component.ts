import { LoginPage } from './../pages/login/login';
import { Component, ViewChild, NgZone, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Platform, Nav, MenuController, NavParams, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SimpleDealsPage } from '../pages/simple-deals/simple-deals';
import { FavoritePage } from '../pages/favorite/favorite';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { HelperProvider } from '../providers/helper/helper';
import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { User } from '../datamodel/user';
import { FCM } from '@ionic-native/fcm';
import { File } from "@ionic-native/file";

import { FetchdataPage } from '../pages/fetchdata/fetchdata';
import { Geolocation } from '@ionic-native/geolocation';


interface Page {
  name: string;
  url: string;
  icon: string;
  isVisible: boolean
}
@Component({
  templateUrl: 'app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyApp {

  loginPages: Page[] = [
    { name: 'Home', icon: 'home', url: 'home', isVisible: true },
    { name: 'My Child', icon: 'star', url: 'FetchdataPage', isVisible: true },
    { name: 'Settings', icon: 'settings', url: 'SettingsPage', isVisible: true },
    { name: 'My Profile', icon: 'person', url: 'ProfilePage', isVisible: true },
    { name: 'Vaccine Info', icon: 'person', url: 'VaccineListPage', isVisible: true },
    // { name: 'Vaccine Detail', icon: 'person', url: 'VaccineDetailPage', isVisible: true },
    { name: 'Logout', icon: 'power', url: 'logout', isVisible: true },

  ]
  logoutPages: Page[] = [
    { name: 'Home', icon: 'home', url: 'home', isVisible: true },
    { name: 'Login', icon: 'log-in', url: 'LoginPage', isVisible: true },
    { name: 'Register', icon: 'person', url: 'RegisterPage', isVisible: true },
  ]

  rootPage: any = LoginPage;
  @ViewChild(Nav) nav: Nav;

  user: User = {

    email: '',
    influencer: false,
    name: '',
    phone: '',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
    savedDeals: [],
    uid: ''
  }
  // loadedAll: Boolean = false;

  constructor(
    private _cdRef: ChangeDetectorRef,
    platform: Platform,
    private fcm: FCM,
    statusBar: StatusBar,
    private helper: HelperProvider,
    private splashScreen: SplashScreen,
    androidPermissions: AndroidPermissions,
    private auth: AuthProvider,
    private events: Events,
    private menuCtrl: MenuController, private api: ApiProvider,
    private geolocation: Geolocation,
    private file: File) {
    splashScreen.show();

    platform.ready().then(() => {
        // console.log('app.component loaded');
        androidPermissions.checkPermission(androidPermissions.PERMISSION.CAMERA).then(
          result => 
          {
            // console.log('Has permission?', result.hasPermission)
          },
          err => androidPermissions.requestPermission(androidPermissions.PERMISSION.CAMERA)).catch(err => console.log(`android permission error`))
        androidPermissions.checkPermission(androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => {
            // console.log('Has permission?', result.hasPermission)
          },
          err => androidPermissions.requestPermission(androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)).catch(err => console.log(`android permission error`))

          androidPermissions.requestPermissions([androidPermissions.PERMISSION.CAMERA, androidPermissions.PERMISSION.GET_ACCOUNTS])
          .catch(err => console.log(`Cordova error!`));
          androidPermissions.requestPermissions([androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, androidPermissions.PERMISSION.GET_ACCOUNTS]).then(res=>{
            // console.log(res)
          })
          .catch(err => console.log(`Cordova error!`));


          if(platform.is('android')) {
            this.file.checkDir(this.file.externalRootDirectory, 'Medrec').then(response => {
              console.log('Directory exists'+response);
            }).catch(err => {
              // console.log('Directory doesn\'t exist'+JSON.stringify(err));
              this.file.createDir(this.file.externalRootDirectory, 'Medrec', false).then(response => {
                console.log('Directory create'+response);
              }).catch(err => {
                console.log('Directory no create'+JSON.stringify(err));
              }); 
            });

            geolocation.getCurrentPosition({
              // enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 0
            }).then(location=>{
              // console.log('loc',location)
            }).catch(err=> console.log('loc',err))
          }


      this.auth.isAuthenticated().subscribe(r => {
        console.log(r)
        if (r) {
          this.rootPage = SimpleDealsPage;
          // this.loadedAll = true;
          this.setLoggedInView();
        } else {
          // this.loadedAll = true;
          this.setLoggedOutView();
        }
        statusBar.styleDefault();
        this.splashScreen.hide();
        // this.check();
      })

      // this.rootPage = LoginPage;
    });

    this.events.subscribe('user:loggedIn', (data) => {

      console.log('login event recieved', data);
      this.setLoggedInView();
    })


  }

  check(){
    if(localStorage.getItem('check')!='true'){
      localStorage.setItem('check','true');
      console.log('stop')
      window.location.reload();
    }
    else{
      this.splashScreen.hide();
      // this.loadedAll = true;
    }
  }



  setLoggedInView() {
    this.getuserProfile().then((data) => {
      console.log('ok',data)
      this.user = data;
      this.menuCtrl.enable(true, 'loginmenu');
      this.menuCtrl.enable(false, 'logoutmenu');
      this._cdRef.detectChanges();
      // this.fcm.getToken().then(token => {
      // this.user.token=token;
      // this.api.updateProfile(this.user.uid,this.user).then(r=>{
      //   console.log('token update with user device id');
      // })
      // });

      // this.fcm.onNotification().subscribe(data => {
      //   if(data.wasTapped){
      //     console.log("Received in background");
      //     //code to open the ui and display the recieved deal
      //     this.navigateTo('FetchdataPage');
      //   } else {
      //     console.log("Received in foreground");
      //   };
      // });

      // this.fcm.onTokenRefresh().subscribe(token => {
      //   this.user.token=token;
      //   this.api.updateProfile(this.user.uid,this.user).then(r=>{
      //   console.log('token update with user device id');
      // })
      // });
    });
  }


  setLoggedOutView() {
    this.menuCtrl.enable(true, 'logoutmenu');
    this.user = {

      email: '',
      influencer: false,
      name: '',
      phone: '',
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
      savedDeals: [],
      uid: ''
    }
    this.menuCtrl.enable(false, 'loginmenu');

  }



  getuserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.api.getProfile(localStorage.getItem('uid')).subscribe((r: User) => {
        if (r) {
          let user: User = {
            email: r.email || '',
            influencer: r.influencer || false,
            name: r.name || '',
            photo: r.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
            phone: r.phone || '',
            savedDeals: r.savedDeals || [],
            uid: localStorage.getItem('uid')
          }
          resolve(user);
        } else {
          reject(r);
        }
      })
    });
  }

  navigateTo(url: string) {
    if (url == 'logout') {
      this.auth.logout().then(r => {
        this.setLoggedOutView();
        this.nav.setRoot(LoginPage);
      });
    }
    else if (url == 'home') {
      this.rootPage = SimpleDealsPage;
    } else {
      this.nav.push(url, null, {
        animate: true,
        direction: 'forward'
      });
    }
    this.menuCtrl.close();
  }

  ngAfterViewInit() {
    this._cdRef.detectChanges()
  }

  goLogin() {
    this.nav.setRoot('LoginPage');

  }


  getNewInvites() {
    this.api.getUserDeals(this.user.uid).subscribe(r => {
      console.log('all new deals recieved' + r);

    })
  }

}
