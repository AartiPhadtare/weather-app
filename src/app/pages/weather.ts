import { Component, inject } from "@angular/core";
import { WeatherApi } from "./services/weather-api";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import SunCalc from 'suncalc';

@Component({
    selector:'app-weather',
    imports:[CommonModule,FormsModule, ReactiveFormsModule],
    template:` 
    <div class="min-h-screen w-full ">
<div class="max-w-md mx-auto p-6 bg-blue-800 rounded-2xl min-h-screen backdrop-blur-md text-white bg-cover bg-center " style="background-image:url('bg-home.jpg');">
   <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div> <!-- Gradient Overlay -->
    <div class="absolute inset-0 top-5 p-7 text-white font-bold text-lg">
     
   <form action="" [formGroup]="searchForm">
  <div class="flex gap-2 mb-4">
    <input
      formControlName="city"
      placeholder="Enter city..."
      class="flex-1 p-3 rounded-lg bg-white/30 placeholder-white/70 text-white"
    />
    <button
      (click)="getWeather()"
      class="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg"
    >
      Search
    </button>
  </div>
   </form>

   @if (myWeather) {
<div class="mt-8">
  <div class="flex">
    <div class="flex-1/2">
    <div>
       <h2 class="text-3xl font-bold ">{{ myWeather.name }}, {{country}}</h2>
        <p class="text-sm py-2.5">{{localdate}}</p>
        <p class="">{{ myWeather.weather[0].description }}</p>
          <div class="flex justify-start">
      <p class="text-md font-semibold mr-4">H:{{h |  number:'1.0-0'}}</p>
      <p class="text-md font-semibold">L:{{l |  number:'1.0-0'}}</p>
     </div>
    </div>
    
  </div>
  <div class="flex-1/2">
      <p class="text-5xl font-semibold mb-3">{{ temperature | number:'1.0-0'}}°F</p>
       <img class=""
      [src]="'https://openweathermap.org/img/wn/' + myWeather.weather[0].icon + '@2x.png'"
      alt="Weather icon"
    />
    </div>
  </div>
    <!-- <h2 class="text-4xl font-bold mb-5">{{ myWeather.name }}, {{country}}</h2> -->
     <!-- <p class="text-6xl font-semibold mb-3">{{ temperature }}°F</p>
     <p class="">{{ myWeather.weather[0].description }}</p> -->
        <!-- <img class=""
      [src]="'https://openweathermap.org/img/wn/' + myWeather.weather[0].icon + '@2x.png'"
      alt="Weather icon"
    /> -->
   
      <!-- <p class=" font-semibold mb-3 capitalize" >{{ myWeather.weather[0].description }}</p> -->
  
    <div class="flex gap-2 justify-center mt-5">
    <div class="flex-1/3 text-center">
      <div class="p-3 bg-white text-blue-900 rounded-md">
        <p class="text-2xl mb-3">{{feelsLikeTemp | number:'1.0-0'}}</p>
          <p class="text-sm ">Feels Like </p>
          
      </div>
    </div>
    <div class="flex-1/3 text-center">
      <div class="p-3 bg-white text-blue-900 rounded-md">
        <p class="text-2xl mb-3">{{humidity}}%</p>
          <p class="text-sm ">Humidity </p>
          
      </div>
    </div>
    <div class="flex-1/3 text-center">
      <div class="p-3 bg-white text-blue-900 rounded-md">
         <p class="text-2xl mb-3">{{wind | number:'1.0-0'}} <span class="text-sm">mph</span></p>
          <p class="text-sm ">wind speed </p>
         
      </div>
    </div>
    
    </div>
    <div class="flex gap-2 justify-center mt-5">
     <div class="flex-1/2 gap-2 justify-center">
  
    <div class="p-3 bg-white text-blue-900 rounded-md">
      <div class="flex items-center gap-2">
        <img class="w-[30px] h-[30px]" src="sunrise.png" alt="sunrise">
        <div class="text-left">
          <p class="text-sm">Sunrise</p>
          <p>{{sunrise}} AM</p>
        </div>
      </div>
    </div>
  
</div>

     <div class="flex-1/2 text-center">
        <div class="p-3 bg-white text-blue-900 rounded-md">
           <div class="flex items-center gap-2">
        <img class="w-[30px] h-[30px]" src="sunset.png" alt="sunrise">
        <div class="text-left">
          <p class="text-sm">Sunset</p>
          <p>{{sunset}} PM</p>
        </div>
      </div>
           
           
        </div>
    </div>
    </div>
   
   
   
  </div>
   }
    </div>
  
  
</div>
</div>


  `
})
export class weather{
fb = inject(FormBuilder);
weatherApi = inject(WeatherApi);
  myWeather: any;
  temperature = 0;
  units ='imperial';
  feelsLikeTemp:number=0;
  summary: string='';
  pressure:number=0;
  humidity:number=0;
  h: number =0;
  l: number = 0;
  country: string ='';
  dt:number =0;
  timezone: number=0;
  localdate : string ='';


lat : number=0;
long: number=0;
sunrise: string = '';
  sunset: string = '';
  wind:number=0;


   searchForm = this.fb.group({
      city: ['', Validators.required]
  });
 
getWeather() {
  const {city} = this.searchForm.value;
  if(city){
      this.weatherApi.getWeather(city, this.units).subscribe({
      next: (res: any) => {
       
        this.myWeather = res;
        console.log('my weather ',this.myWeather)
    

    this.dt = this.myWeather.dt;          
    this.timezone = this.myWeather.timezone;
   const date = new Date((this.dt + this.timezone)* 1000);
   this.localdate = date.toLocaleDateString();
   
       
      this.lat = this.myWeather.coord.lat;
      this.long = this.myWeather.coord.lon;
       const now = new Date();
    const times = SunCalc.getTimes(now, this.lat, this.long);
    this.sunrise = times.sunrise.toLocaleTimeString();
    this.sunset = times.sunset.toLocaleTimeString();


        console.log('timezone', this.timezone);
        this.wind = this.myWeather.wind.speed;
        this.temperature = this.myWeather.main.temp;
        this.feelsLikeTemp=this.myWeather.main.feels_like;
        this.h = this.myWeather.main.temp_max;
        this.l = this.myWeather.main.temp_min;
        this.summary=this.myWeather.weather[0].main;
        this.humidity = this.myWeather.main.humidity;
        this.country = this.myWeather.sys.country;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Update failed:', error.message);
      }
    });
  }
    
  }

 
}