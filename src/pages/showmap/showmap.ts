import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ViewChild } from '@angular/core'

import { SimpleDealsPage } from '../simple-deals/simple-deals';

import { GoogleMaps } from '@ionic-native/google-maps';

declare var google;



@Component({
  selector: 'page-showmap',
  templateUrl: 'showmap.html',
})
export class ShowmapPage {
 @ViewChild('map') mapElement;
private map: any;


  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps) {

  }


loadMap() {
let latLng = new google.maps.LatLng(24.926295, 67.130499);

let mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}

this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);    

var locations = [
  ['Darul-sehat Hospital', 24.861624, 67.006629],
  ['Memon Hospital ', 24.9456, 67.146],
  ['Combine CNG', 24.918293,67.132669],
  ['Brodway Pizaa', 24.917286,67.131457],
  ['Rado Bakery', 24.916352,67.130769],
  ['Delicacy Bakery ',24.913676,67.127793 ],
  ['Sardar Cng', 24.923523,67.130362],
  ['Zakai Dental hospital', 24.929142,67.128541],
  ['Madina Medical & General store ',24.928606,67.134303 ]

 
];

var infowindow = new google.maps.InfoWindow();

var marker, i;

for (i = 0; i < locations.length; i++) {  
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    map: this.map,
    icon: {
       url: 'assets/imgs/marker.png',
       scaledSize: new google.maps.Size(40, 55)    

}
  });

  google.maps.event.addListener(marker, 'click', (function(marker, i) {
    return function() {
      infowindow.setContent(locations[i][0]);
      infowindow.open(Map, marker);
    }
  })(marker, i));
}
}

goBack(){
  this.navCtrl.setRoot(SimpleDealsPage)
}

}
