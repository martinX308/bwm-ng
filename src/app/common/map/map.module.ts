import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgmCoreModule } from '@agm/core';

//import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import {MapComponent} from './map.component';
import {MapService} from './map.service';
import {CamelizePipe} from 'ngx-pipes';

@NgModule({
  declarations: [
    MapComponent
    
    ],
  exports: [
    MapComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCH1uGmfCQeOclESXTDyptPajjrJTMBG2s'
    }),
    // NgxMapboxGLModule.withConfig({
    //   accessToken: '', // Optionnal, can also be set per map (accessToken input of mgl-map)
    //   geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    // }),
    CommonModule
  ],
  providers: [MapService,CamelizePipe],
})

export class MapModule { }
