import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL, Thumbnail, Events } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { User } from '../../datamodel/user';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { SimpleDealsPage } from '../simple-deals/simple-deals';

@IonicPage()
@Component({
  selector: 'page-updateprofile',
  templateUrl: 'updateprofile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateprofilePage {
  goBack() {
    this.navCtrl.setPages([{ 'page': 'ProfilePage' }])
  }

  constructor(private _cdRef: ChangeDetectorRef, private api: ApiProvider, private helper: HelperProvider, private auth: AuthProvider, private camera: Camera,
    public navCtrl: NavController, public navParams: NavParams, private actionSheet: ActionSheetController,
    private imagePicker: ImagePicker, private storage: AngularFireStorage, private events: Events
  ) {
  }


  user: User;
  // _currentUserSubscription;
  ionViewDidLoad() {
    this.api.getProfile(localStorage.getItem('uid')).subscribe((resp: User) => {
      this.user = resp;
      this._cdRef.detectChanges();
    })
  }




  updateProfile() {
    this.api.updateProfile(this.user.uid, this.user).then(resp => {
      this.events.publish('user:loggedIn', this.user);
      this.helper.toast(`Profile updated successfully.`)
      this._cdRef.detectChanges();
      // this.navCtrl.setRoot(SimpleDealsPage)
    }, err => this.helper.toast(`Error Upating Profile.`))
  }

  ngOnDestroy() {
    // this._currentUserSubscription.unsubscribe();
    this._cdRef.detach();
  }


  options: CameraOptions = {
    quality: 100,
    targetHeight: 400,
    targetWidth: 400,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: false
  }

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.helper.load();
      const image = `data:image/jpeg;base64,${imageData}`;
      const pictures = this.storage.ref('profile/' + this.user.uid);
      pictures.putString(image, 'data_url').then((r: UploadTaskSnapshot) => {
        // debugger;
        r.ref.getDownloadURL().then(re => {
          this.user.photo = re;
          this.helper.dismiss();
        }, err => {
          this.helper.presentAlert('error', err, 'ok');
        })
      }, err => {
        console.log(err);
        this.helper.toast(err);
        this.helper.dismiss();
      });

    }, (err) => {
      console.log(err);

    });
  }

  ngAfterViewInit() {
    this._cdRef.detectChanges()
  }

  changeProfilePic() {
    let sheet = this.actionSheet.create({
      buttons: [
        {
          text: 'Get Picture From Phone',
          icon: 'images',
          handler: () => {
            // this.pickImageFromGallery();
            this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.takePicture();
          }
        },
        {
          text: 'Select from Camera',
          icon: 'camera',
          handler: () => {
            this.options.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePicture();
          }
        },
        {
          text: 'Cancel',
          icon: 'close-circle',
          role: 'destructive',
          handler: () => {
            console.log('cancel clicked');
          }
        },
      ]
    })

    sheet.present();
  }

  pickImageFromGallery() {

    this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 1 }).then((res) => {
      if (res) {
        if (res.length > 0) {
          this.helper.load();
          const image = `data:image/jpeg;base64,${res}`;
          const pictures = this.storage.ref('profile/' + this.user.uid);
          pictures.putString(image, 'data_url').then(r => {
            r.ref.getDownloadURL().then(res => {
              this.user.photo = res;
              this.helper.dismiss();
            })
          }, err => {
            this.helper.dismiss();
            console.log(err);
          });
        } else {
          this.helper.toast('you didnt selected any image from the gallary');
          this.helper.dismiss();
        }

      } else {
        this.helper.toast('you didnt selected any image from the gallary');
        this.helper.dismiss();
      }
      //this.user.photo='data:image/jpeg;base64,'+res;


    }, (err) => {
      console.log('failed to get images from gallery');

    });
  }

}

