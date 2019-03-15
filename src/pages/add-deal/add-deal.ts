import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { map } from 'rxjs/operators';

import { User } from '../../datamodel/user';
import { Deal } from '../deal/deal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage/storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

/**
 * Generated class for the AddDealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-deal',
  templateUrl: 'add-deal.html',
})
export class AddDealPage {

 selectedDate: Date;
  upcomingDates: any[];

 galleryType = 'Form';


    public buttonClicked: boolean = false; //Whatever you want to initialise it as
    public buttonClicked2: boolean = false; //Whatever you want to initialise it as

onButtonClick(ev) {
    if(ev === 'discount') {
    this.buttonClicked = true;
        this.buttonClicked2 = false;

    }
    else if(ev === 'reduction') {
    this.buttonClicked2 = true;
        this.buttonClicked = false;

    }

}


  photo
  title: string = "Add child";
  buttonText: string = "Submit";
  user: User;
  categories;
  dealType = [
    { id: 'online', value: 'Online' },
    { id: 'instore', value: 'In-Store' },
  ]

  couponType = [
    { id: 'barcode', value: 'Bar Code' },
    { id: 'qrcode', value: 'QR Code' },
    { id: 'online', value: 'Online' }
  ]

  deal: Deal;
  dealForm: FormGroup;
 // minDate: string = "2018";
  //maxDate: string = "2030";

  constructor(private camera: Camera,
    public navCtrl: NavController, private helper: HelperProvider, private api: ApiProvider, private navParams: NavParams, private actionSheet: ActionSheetController,
    private imagePicker: ImagePicker, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.api.getProfile(localStorage.getItem('uid')).subscribe((r: User) => {
      this.user = r;
    }, err => {
      this.helper.presentAlert('critical error', 'unable to get user session info', 'ok');
    });


    if (this.navParams.data.deal) {
      this.title = "EDIT DEAL";
      this.buttonText = "Update";
      this.deal = this.navParams.data.deal;
      this.dealForm = fb.group({
        'name': [this.deal.name, [Validators.required]],
        'city': [this.deal.city],
        'number': [this.deal.number],
        'gender': [this.deal.gender],
        'birthday': [this.deal.birthday],
                'userId': [''],
        'userName': [''],


 
        'isInvite':this.deal.isInvite|| false
      })

    } else {
      this.deal = {
        approved: 'pending'
      }

      this.dealForm = fb.group({
        'name': ['', Validators.required],
        'city': ['', [Validators.required]],
        'number': ['', Validators.required],
        'gender': ['', Validators.required],
        'userName': [''],
        'userId': [''],
        'birthday': ['', [Validators.required]],

  
      })
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDealPage');
    this.getCategories();
  }

  goBack() {
    this.navCtrl.pop();
  }

   gotoDate(){
    this.galleryType = 'Date'; 
  }

   GotoGender(){
    this.galleryType = 'Gender'; 
  }
  

    onDateChange() {
    
    let upcomingIteration = ['First', 'Second', 'Third'];
    this.upcomingDates = [];

    for (let i = 1; i < upcomingIteration.length + 1; i++) {
        let tempDate = new Date(this.selectedDate);
        let upcomingDate = tempDate.setDate(tempDate.getDate() + i * 2);
        this.upcomingDates.push({ time: upcomingIteration[i -1], date: new Date(upcomingDate)}); 
    }
    console.log(JSON.stringify(this.upcomingDates, null, 2));
  }


  submit() {
    if (!this.dealForm.valid) {
      this.helper.presentAlert('Error', 'please correct the data and retry again', 'ok');
      return;
    }

    let deal: Deal = {
      approved: 'pending',
      name: this.dealForm.get('name').value,
      city: this.dealForm.get('city').value,
      birthday: this.dealForm.get('birthday').value,
      number: this.dealForm.get('number').value,
      gender: this.dealForm.get('gender').value,
           userId: this.user.uid,
      userName: this.user.name,

 
      photo: this.deal.photo || '',
    
      isInvite:false
    }

    debugger;
    this.helper.load();
    if (this.navParams.data.deal) {
      deal.id = this.deal.id;
      
      this.api.updateDeal(deal.id, deal).then(r => {
        console.log('deal id' + this.deal.id + ' updated successfully');
        this.helper.toast(`Updated Deal sent for approval from admin!`);
        this.navCtrl.pop().then(() => this.helper.dismiss());
      })
    } else {

      this.api.addDeal(deal).then(resp => {
        console.log(resp);

        this.helper.toast(`Child Added ! . Thanks for using Medrec`);
        this.navCtrl.pop().then(() => this.helper.dismiss());
      });

    }

  }

  setImage() {
    let sheet = this.actionSheet.create({
      buttons: [
        {
          text: 'Select From Gallery',
          icon: 'images',
          handler: () => {
            console.log('select images form gallery');
            this.pickImageFromGallery();
          }
        },
        {
          text: 'Select from Camera',
          icon: 'camera',
          handler: () => {
            console.log('select from camera');
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
          debugger;
          this.helper.load();
          const image = `data:image/jpeg;base64,${res}`;
          let id=Date.now();
          const pictures = this.storage.ref('deal/' + id);
          pictures.putString(image, 'data_url').then(r => {
            r.ref.getDownloadURL().then(r => {
              this.deal.photo = r
              this.helper.dismiss();
            });
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

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.helper.load();

      let id=Date.now();
      const image = `data:image/jpeg;base64,${imageData}`;
      const pictures = this.storage.ref('deal/'+id);
      pictures.putString(image, 'data_url').then((r: UploadTaskSnapshot) => {
          r.ref.getDownloadURL().then(res=>{
           this.deal.photo=res; 
           this.helper.dismiss();
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


  getCategories() {
    this.api.getAllCategories().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(resp => {
      this.categories = resp;
    })
  }

  submitData(data, e) {
    e.preventDefault();
    console.log(data);
    //    return this.api.addDeal(data)
  }


  selectedCategory = {};
  selectChange(e) {
    let obj = JSON.parse(e);
    this.selectedCategory = obj;
  }

  deleteDeal() {
    if (this.deal) {
      this.helper.presentConfirm('Warning', `This will permenantly delete the Deal name ${this.deal.title}. Are you Sure  to proceed?`, 'yes', () => {
        this.api.deleteDeal(this.deal.id).then(r => {
          this.navCtrl.pop();
        })
      }, 'No', () => {
        return;
      })
    }
  }
}
