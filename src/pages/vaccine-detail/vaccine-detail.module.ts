import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaccineDetailPage } from './vaccine-detail';

@NgModule({
  declarations: [
    VaccineDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(VaccineDetailPage),
  ],
})
export class VaccineDetailPageModule {}
