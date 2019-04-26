import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ViewChild } from '@angular/core'

import { SimpleDealsPage } from '../simple-deals/simple-deals';

import { GoogleMaps } from '@ionic-native/google-maps';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

declare var google;

@Component({
  selector: 'page-showmap',
  templateUrl: 'showmap.html',
})
export class ShowmapPage {

  @ViewChild('map') mapElement: ElementRef;
  // private map: any;
  google;
  map: any;
  infowindow: any;
  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  isGpsOn = false;
  image = {
    url: 'assets/imgs/marker.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };
  allDeal: Array<any> = [
    { name: ['BCG', 'OPV (o)', 'HBV'], category: 'BCG and Oral Polio Vaccine', format: 'week', from: 0, to: 2 },
    { name: ['OPV/IPV(1)', 'HBV(1)', 'Hib(1)', 'Rotavirus(1)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (1st Shot)', format: 'week', from: 6, to: 8 },
    { name: ['Pneumococcal(1) Conjugate Vaccine'], category: 'pneumococcal conjugate vaccine PCV13 (1st shot)', format: 'week', from: 8, to: 10 },
    { name: ['OPV/IPV(2)', 'HBV(2)', 'Hib(2)', 'Rotavirus(2)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (2nd Shot) + pneumococcal conjugate vaccine PCV13 (2nd shot)', format: 'week', from: 10, to: 12 },
    { name: ['DTP/DTPa(3)', 'OPV/IPV(3)', 'HBV(3)', 'Hib(3)'], category: 'Pentavalent (DPT, Hep-B, Hi B) & OPV (3rd Shot) + pneumococcal conjugate vaccine PCV13 (3rd shot)', format: 'week', from: 14, to: 16 },
    { name: ['Measles'], category: 'Measles', format: 'month', from: 9, to: 9 },
    { name: ['Chicken Pox '], category: 'Chicken Pox ', format: 'month', from: 9, to: 9 },
  ];
  constructor(private locationAccuracy: LocationAccuracy,private geolocation: Geolocation, public navCtrl: NavController, private googleMaps: GoogleMaps, private navigator: LaunchNavigator) {
    // console.log(this.getVaccineInfo())
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.isGpsOn = true;
          },
          error => console.log('Error requesting location permissions', error)
        );
      }
    
    });
  }


  loadMap() {
    // let latLng = new google.maps.LatLng(24.926295, 67.130499);

    // let mapOptions = {
    //   center: latLng,
    //   zoom: 20,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }

    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // var locations = [
    //   ['Darul-sehat Hospital', 24.861624, 67.006629],
    //   ['Memon Hospital ', 24.9456, 67.146],
    //   ['Combine CNG', 24.918293, 67.132669],
    //   ['Brodway Pizaa', 24.917286, 67.131457],
    //   ['Rado Bakery', 24.916352, 67.130769],
    //   ['Delicacy Bakery ', 24.913676, 67.127793],
    //   ['Sardar Cng', 24.923523, 67.130362],
    //   ['Zakai Dental hospital', 24.929142, 67.128541],
    //   ['Madina Medical & General store ', 24.928606, 67.134303]


    // ];

    // var infowindow = new google.maps.InfoWindow();

    // var marker, i;

    // for (i = 0; i < locations.length; i++) {
    //   marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    //     map: this.map,
    //     icon: {
    //       url: 'assets/imgs/marker.png',
    //       scaledSize: new google.maps.Size(40, 55)

    //     }
    //   });

    //   google.maps.event.addListener(marker, 'click', (function (marker, i) {
    //     return function () {
    //       infowindow.setContent(locations[i][0]);
    //       infowindow.open(Map, marker);
    //     }
    //   })(marker, i));
    // }


    this.geolocation.getCurrentPosition(this.options).then(location => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: location.coords.latitude, lng: location.coords.longitude },
        zoom: 15
      });
      this.infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: { lat: location.coords.latitude, lng: location.coords.longitude },
        radius: 1000,
        type: ['hospital']
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }
        }
      });
    }).catch(error => {
      console.log(error);
      
    });
    var myplace = { lat: -33.8665, lng: 151.1956 };
  }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: placeLoc,
      icon: this.image
    });
    
    var self = this
    google.maps.event.addListener(marker, 'click', function() {
      // infowindow.setContent(place.name);
      self.infowindow.setContent('<div><strong id="place" style="font-size:20px" text-center>' + place.name + '</strong><br><strong style="font-size:15px">Available Vaccines:</strong><ul style="padding-left: 18px;">' +
        self.getVaccineInfo() +"</ul><button ion-button id='tap' style='background-color: #B7A3DC;padding: 5px;margin: 0 auto;display: block;color:white;box-shadow: 0px 0px 5px grey;'>Direction</button>"+'</div>');
      self.infowindow.open(this.map, this);
      google.maps.event.addListenerOnce(self.infowindow, 'domready', () => {
        document.getElementById('tap').addEventListener('click', () => {
          //alert('Clicked');
          self.getMapaa(document.getElementById('place').innerText);
          // this.infowindow.close()
          // this.closeInfoViewWindow(this.infowindow);
          // this.openEventDetailModal(event);
        });
      });
      
    });
  }

  getMapaa(name){
    this.navigator.navigate(name).then(res=>{
      console.log(res);
    }).catch(err=> console.log(err));
  }

  getVaccineInfo(): string {
    let st = ''
    this.allDeal.map((el,i) => {
      // st += el.category + ': <strong>' + Math.floor(Math.random() * 70)+ '</strong><br>'
      if(Math.floor(Math.random() * 7) != i)
        st += '<li style="margin-bottom: 5px;">' + el.category+ '</li>'
    });
    return st;
  }

  goBack() {
    this.navCtrl.setRoot(SimpleDealsPage)
  }

}
