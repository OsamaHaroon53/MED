import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { HttpClientModule, HttpClient }    from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    HttpClientModule,
    AngularFireAuthModule
  ],
  providers:[
    HttpClient
  ]
})
export class LoginPageModule {}
