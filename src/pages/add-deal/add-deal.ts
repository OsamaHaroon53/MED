import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
import { SimpleDealsPage } from '../simple-deals/simple-deals';

@IonicPage()
@Component({
  selector: 'page-add-deal',
  templateUrl: 'add-deal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDealPage {

  selectedDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  upcomingDates: any[];
  today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

  galleryType = 'Form';


  public buttonClicked: boolean = false; //Whatever you want to initialise it as
  public buttonClicked2: boolean = false; //Whatever you want to initialise it as

  onButtonClick(ev) {
    if (ev === 'discount') {
      this.buttonClicked = true;
      this.buttonClicked2 = false;

    }
    else if (ev === 'reduction') {
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
    public navCtrl: NavController, private cdRef: ChangeDetectorRef, private helper: HelperProvider, private api: ApiProvider, private navParams: NavParams, private actionSheet: ActionSheetController,
    private imagePicker: ImagePicker, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.api.getProfile(localStorage.getItem('uid')).subscribe((r: User) => {
      this.user = r;
    }, err => {
      this.helper.presentAlert('critical error', 'unable to get user session info', 'ok');
    });

    console.log(this.navParams.data.deal)
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



        'isInvite': this.deal.isInvite || false
      })

    } else {
      this.deal = {
        approved: 'pending'
      }

      this.dealForm = fb.group({
        'name': ['', Validators.required],
        'city': ['', Validators.required],
        'number': ['', Validators.required],
        'gender': ['', Validators.required],
        'userName': [''],
        'userId': [''],
        'birthday': [this.today, Validators.required],


      })
    }
  }

  ionViewDidLoad() {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  clickOption(event) {
    console.log('ok', event)
  }

  goBack() {
    this.navCtrl.pop();
  }

  gotoDate() {
    this.galleryType = 'Date';
  }

  GotoGender() {
    this.galleryType = 'Gender';
  }


  onDateChange() {
    // let upcomingIteration = ['First', 'Second', 'Third'];
    this.upcomingDates = [];
    // for (let i = 6; i < 15; i=i+2) {
    let tempDate = new Date(this.selectedDate);
    this.upcomingDates.push({ time: 'First', date: new Date(this.selectedDate) });
    let upcomingDate = tempDate.setDate(tempDate.getDate() + 6 * 7);
    this.upcomingDates.push({ time: 'Second', date: new Date(upcomingDate) });
    upcomingDate = tempDate.setDate(tempDate.getDate() + 8 * 7);
    this.upcomingDates.push({ time: 'Third', date: new Date(upcomingDate) });
    upcomingDate = tempDate.setDate(tempDate.getDate() + 10 * 7);
    this.upcomingDates.push({ time: 'Fourth', date: new Date(upcomingDate) });
    upcomingDate = tempDate.setDate(tempDate.getDate() + 14 * 7);
    this.upcomingDates.push({ time: 'Fifth', date: new Date(upcomingDate) });
    upcomingDate = tempDate.setDate(tempDate.getMonth() + 9);
    this.upcomingDates.push({ time: 'Sixth', date: new Date(upcomingDate) });
    this.upcomingDates.push({ time: 'Seventh', date: new Date(upcomingDate) });
    // }
    // console.log(JSON.stringify(this.upcomingDates, null, 2));
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

      isInvite: false
    }
    this.helper.load();
    if (this.navParams.data.deal) {
      deal.id = this.deal.id;

      this.api.updateDeal(deal.id, deal).then(r => {
        this.helper.toast(`Child Updated! Thanks for using Medrec`);
        this.navCtrl.pop().then(() => this.helper.dismiss());
      })
    } else {

      this.api.addDeal(deal).then(resp => {

        this.helper.toast(`Child Added! Thanks for using Medrec`);
        this.navCtrl.setRoot(SimpleDealsPage).then(() => this.helper.dismiss());
      });

    }

  }

  setImage() {
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
          let id = Date.now();
          const pictures = this.storage.ref('deal/' + id);
          pictures.putString(image, 'data_url').then(r => {
            r.ref.getDownloadURL().then(r => {
              this.deal.photo = r;
              this.cdRef.detectChanges();
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

      let id = Date.now();
      const image = `data:image/jpeg;base64,${imageData}`;
      const pictures = this.storage.ref('deal/' + id);
      pictures.putString(image, 'data_url').then((r: UploadTaskSnapshot) => {
        r.ref.getDownloadURL().then(res => {
          this.deal.photo = res;
          this.cdRef.detectChanges();
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
