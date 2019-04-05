
import { SearchPipe } from './../pipes/search/search';
import { ImagePicker } from '@ionic-native/image-picker';


import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, NavParams } from 'ionic-angular';
import { MyApp } from './app.component';
import { SocialSharing } from '@ionic-native/social-sharing';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { HelperProvider } from '../providers/helper/helper';
import { AuthProvider } from '../providers/auth/auth';
// import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';

import { GooglePlus } from '@ionic-native/google-plus';

import { GoogleMaps } from '@ionic-native/google-maps';



//firestore
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
// import { DirectivesModule } from '../directives/directives.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { FCM } from '@ionic-native/fcm';

import { Clipboard } from '@ionic-native/clipboard';



import { CategoryPage } from '../pages/category/category';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MomentModule } from 'angular2-moment';
import { SortPipe } from '../pipes/sort/sort';
import { SimpleDealsPage } from '../pages/simple-deals/simple-deals';
import { UserProfileProvider } from '../providers/user-profile/user-profile';

import { AddDealPageModule } from '../pages/add-deal/add-deal.module';
import { InvitesPageModule } from '../pages/invites/invites.module';

import { InvitedetailsPageModule } from '../pages/invitedetails/invitedetails.module';
import { RegisterinfluencerPageModule } from '../pages/registerinfluencer/registerinfluencer.module';
import { ReqinfPageModule } from '../pages/reqinf/reqinf.module';
import { Menu2PageModule } from '../pages/menu2/menu2.module';
import { FetchdataPageModule } from '../pages/fetchdata/fetchdata.module';
import { ShowmapPage } from '../pages/showmap/showmap';
import { LoginPageModule } from '../pages/login/login.module'
import { DetailDealPage } from '../pages/detail-deal/detail-deal';
import { InjectionPage } from '../pages/injection/injection';
import { HistoryPage } from '../pages/history/history';
import { VaccineListPageModule } from '../pages/vaccine-list/vaccine-list.module';
import { VaccineDetailPageModule } from '../pages/vaccine-detail/vaccine-detail.module';
import { CalendarPageModule } from '../pages/calendar/calendar.module';
import { CalendarPage } from '../pages/calendar/calendar';




@NgModule({
  declarations: [
    MyApp,
    CategoryPage,
    SearchPipe,
    SimpleDealsPage,
    ShowmapPage,
    SortPipe,
    DetailDealPage,
    InjectionPage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    AddDealPageModule,
    InvitesPageModule,
    ReqinfPageModule,
    NgxQRCodeModule,
    HttpClientModule,
    LoginPageModule,
    InvitedetailsPageModule,
    VaccineListPageModule,
    VaccineDetailPageModule,
    FetchdataPageModule,
    // DirectivesModule,
    RegisterinfluencerPageModule,
    Menu2PageModule,
    MomentModule,
    CalendarPageModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBPtX95-pW1_Q8JjQCuZRxGdsnEutUt9Us",
      authDomain: "meddec-11408.firebaseapp.com",
      databaseURL: "https://meddec-11408.firebaseio.com",
      projectId: "meddec-11408",
      storageBucket: "meddec-11408.appspot.com",
      messagingSenderId: "522878343942"
    }),
    // AngularFireModule.initializeApp({
    //   apiKey: "AIzaSyAnCvBpgYkw9VEk5imjWuQNv0HNyHRKcMQ",
    //   authDomain: "gummee-dfa2e.firebaseapp.com",
    //   databaseURL: "https://gummee-dfa2e.firebaseio.com",
    //   projectId: "gummee-dfa2e",
    //   storageBucket: "gs://gummee-dfa2e.appspot.com/",
    //   messagingSenderId: "925797755692"
    // }),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CategoryPage,
    SimpleDealsPage,
    ShowmapPage,
    DetailDealPage,
    InjectionPage,
    HistoryPage,
    CalendarPage
  ],
  providers: [
    StatusBar,
    // Facebook,
    File,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    HelperProvider,
    AuthProvider,
    Clipboard,
    GoogleMaps,

    InAppBrowser,
    AndroidPermissions,
    Camera,
    HttpClient,
    AngularFireStorage,
    ImagePicker,
    InAppBrowser,
    SocialSharing,
    UserProfileProvider,
    FCM,
    GooglePlus,
    LaunchNavigator,
    Geolocation
  ]
})
export class AppModule { }
