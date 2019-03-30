import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { InjectionPage } from '../injection/injection';
import { HelperProvider } from '../../providers/helper/helper';
import { HistoryPage } from '../history/history';

@Component({
  selector: 'page-detail-deal',
  templateUrl: 'detail-deal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailDealPage {

  child;
  selectedIndex = 0;
  @ViewChild('mySlider') slider: Slides;
  today = new Date().setHours(0,0,0,0);
  birthDate;
  allDeal: Array<any> = [
    { name: ['BCG', 'OPV (o)' ,'HBV'], category: 'BCG and Oral Polio Vaccine', format: 'week', from: 0, to: 2 },
    { name: ['OPV/IPV(1)', 'HBV(1)', 'Hib(1)', 'Rotavirus(1)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (1st Shot)', format: 'week', from: 6, to: 8 },
    { name: ['Pneumococcal(1) Conjugate Vaccine'], category: 'pneumococcal conjugate vaccine PCV13 (1st shot)', format: 'week', from: 8, to: 10 },
    { name: ['OPV/IPV(2)', 'HBV(2)', 'Hib(2)', 'Rotavirus(2)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (2nd Shot) + pneumococcal conjugate vaccine PCV13 (2nd shot)', format: 'week', from: 10, to: 12 },
    { name: ['DTP/DTPa(3)', 'OPV/IPV(3)', 'HBV(3)', 'Hib(3)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (3rd Shot) + pneumococcal conjugate vaccine PCV13 (3rd shot)', format: 'week', from: 14, to: 16 },
    { name: ['Measles'], category: 'Measles', format: 'month', from: 9, to: 9 },
    { name: ['Chicken Pox '], category: 'Chicken Pox ', format: 'month', from: 9, to: 9 },
  ];

  selectedDeal = []

  constructor(public navCtrl: NavController, public navParams: NavParams, private helper: HelperProvider, public modalCtrl: ModalController) {
    console.log(this.navParams.data);
    this.child = this.navParams.data;
    this.birthDate = new Date(new Date(this.child.birthday).setHours(0,0,0,0));
  }

  ionViewDidLoad() {
    this.slider.slidesPerView = 1.3;
    this.slider.spaceBetween = 15;
    this.slider.centeredSlides = true;
    this.checkInjected();
  }
  checkInjected() {
    if(!this.child.injection)
      return;
    this.child.injection.forEach(element => {
      this.allDeal[element.id-1].injected = element;
    });
  }
  checkInjection(index) {
    if(!this.child.injection)
      return false;
    let check = this.child.injection.filter(element => index == element.id-1);
    if(check.length)
      return true;
    return false;
  }

  getVaccineDate({from,format}):number{
    let date = new Date(this.birthDate)
    if(format == 'week'){
      return date.setDate(date.getDate()+(from*7))
    }
    else if(format == 'month'){
      return date.setMonth(date.getMonth()+from)
    }
    else{
      return date.setFullYear(date.getFullYear()+from)
    }
  }

  getColor(item,i){
    let ms = this.getVaccineDate(item);
    if(this.selectedIndex == i)
      return 'active-theme'
    if(ms<this.today){
      return 'orange';
    }
    else if(ms == this.today){
      return 'blue';
    }
    else 
      return 'gray';
  }
  getColorSlider(item,i){
    let ms = this.getVaccineDate(item);
    let css = 'list list-md'
    // if(this.selectedIndex == i)
    //   return css+' active-slide'
    if(ms<this.today){
      return css+' orange-slide';
    }
    else if(ms == this.today){
      return css+' blue-slide';
    }
    else 
      return 'gray-slide';
  }

  goBack(){
    this.navCtrl.pop({animate:true,direction:"back"});
  }

  goProfile(){

  }

  slideChange(){
    this.selectedIndex = this.slider.getActiveIndex();
  }

  selectVaccine(index,j){
    let el:any = document.getElementById('my-slide'+index).getElementsByTagName('input');
    for (let i=0;i<el.length;i++){
      if(i==j)
        continue;
      el[i].checked = !el[i].checked;
    };
  }

  goToHistory(index){
    let profileModal = this.modalCtrl.create(HistoryPage, {...this.allDeal[index], child: this.child, id: index+1});
    profileModal.present();
  }

  inject(category){
    if(this.allDeal[category-1].injected){
      this.goToHistory(category-1)
      return;
    }
    this.helper.load();
    let temp = {... this.child};
    if(!temp.injection)
      temp.injection = [];
    

    temp.injection.push({id:category, msg: '', date: this.getVaccineDate(this.allDeal[category-1])});
    setTimeout(()=>{
      this.navCtrl.push(InjectionPage,{child: temp, injection: this.allDeal[category-1]});
      this.helper.dismiss()
    },10);
  }
}
