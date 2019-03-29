import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaccineListPage } from './vaccine-list';

@NgModule({
  declarations: [
    VaccineListPage,
  ],
  imports: [
    IonicPageModule.forChild(VaccineListPage),
  ],
})
export class VaccineListPageModule {}
