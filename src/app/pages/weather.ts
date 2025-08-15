import { Component, inject, OnInit } from '@angular/core';
import { WeatherApi } from './services/weather-api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import SunCalc from 'suncalc';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div
        class="max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen relative bg-cover bg-center"
        style="background-image:url('bg-home.jpg');"
      >
        <!-- Enhanced Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70 backdrop-blur-sm"
        ></div>

        <div class="relative z-10 h-full flex flex-col">
          <div class="mb-6 sm:mb-8">
            <form [formGroup]="searchForm" class="w-full">
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  formControlName="city"
                  placeholder="Enter city name..."
                  class="flex-1 p-3 sm:p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 placeholder-white/70 text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/25 transition-all duration-300"
                />
                <button
                  (click)="getWeather()"
                  type="button"
                  class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-semibold px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <span class="hidden sm:inline">Search</span>
                  <span class="sm:hidden">🔍</span>
                </button>
              </div>
            </form>
          </div>

          @if (myWeather) {
          <div class="flex-1 space-y-6 sm:space-y-8 animate-fade-in-up">
            <div class="glass rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div class="space-y-2 sm:space-y-3">
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {{ myWeather.name }}
                  </h2>
                  <p class="text-lg sm:text-xl text-yellow-300 font-medium">
                    {{ country }}
                  </p>
                  <p class="text-sm sm:text-base text-white/80 mb-2">{{ localdate }}</p>
                  <p class="text-base sm:text-lg text-white/90 capitalize font-medium">
                    {{ myWeather.weather[0].description }}
                  </p>
                  <div class="flex gap-4 text-sm sm:text-base">
                    <span class="text-white/80">
                      H: <span class="text-orange-300 font-semibold">{{ h | number : '1.0-0' }}°</span>
                    </span>
                    <span class="text-white/80">
                      L: <span class="text-blue-300 font-semibold">{{ l | number : '1.0-0' }}°</span>
                    </span>
                  </div>
                </div>

                <div class="flex flex-col items-center lg:items-end justify-center space-y-2">
                  <div class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white animate-pulse-subtle">
                    {{ temperature | number : '1.0-0' }}<span class="text-3xl sm:text-4xl lg:text-5xl text-yellow-300">°F</span>
                  </div>
                  <img
                    class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-lg hover:scale-110 transition-transform duration-300"
                    [src]="
                      'https://openweathermap.org/img/wn/' +
                      myWeather.weather[0].icon +
                      '@2x.png'
                    "
                    alt="Weather icon"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div class="glass rounded-xl p-4 sm:p-5 hover:bg-white/20 transition-all duration-300 text-center transform hover:scale-105">
                <div class="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {{ feelsLikeTemp | number : '1.0-0' }}°
                </div>
                <p class="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-wide">Feels Like</p>
              </div>

              <div class="glass rounded-xl p-4 sm:p-5 hover:bg-white/20 transition-all duration-300 text-center transform hover:scale-105">
                <div class="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">{{ humidity }}%</div>
                <p class="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-wide">Humidity</p>
              </div>

              <div class="glass rounded-xl p-4 sm:p-5 hover:bg-white/20 transition-all duration-300 text-center transform hover:scale-105">
                <div class="text-xl sm:text-2xl font-bold text-green-300 mb-2">
                  {{ wind | number : '1.0-0' }}
                  <span class="text-sm sm:text-base">mph</span>
                </div>
                <p class="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-wide">Wind Speed</p>
              </div>
            </div>
            <!-- Sunrise & Sunset -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <!-- Sunrise -->
              <div class="bg-gradient-to-br from-orange-400/20 to-yellow-500/20 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-orange-300/30 hover:from-orange-400/30 hover:to-yellow-500/30 transition-all duration-300">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="bg-orange-100 rounded-full p-2 sm:p-3">
                    <img
                      class="w-6 h-6 sm:w-8 sm:h-8"
                      src="sunrise.png"
                      alt="sunrise"
                    />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm text-orange-200 font-medium uppercase tracking-wide mb-1">Sunrise</p>
                    <p class="text-lg sm:text-xl font-bold text-white">{{ sunrise }}</p>
                  </div>
                </div>
              </div>

              <!-- Sunset -->
              <div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-purple-300/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="bg-purple-100 rounded-full p-2 sm:p-3">
                    <img
                      class="w-6 h-6 sm:w-8 sm:h-8"
                      src="sunset.png"
                      alt="sunset"
                    />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm text-purple-200 font-medium uppercase tracking-wide mb-1">Sunset</p>
                    <p class="text-lg sm:text-xl font-bold text-white">{{ sunset }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class Weather implements OnInit {
  fb = inject(FormBuilder);
  weatherApi = inject(WeatherApi);
  myWeather: any;
  temperature = 0;
  units = 'imperial';
  feelsLikeTemp: number = 0;
  summary: string = '';
  pressure: number = 0;
  humidity: number = 0;
  h: number = 0;
  l: number = 0;
  country: string = '';
  dt: number = 0;
  timezone: number = 0;
  localdate: string = '';

  lat: number = 0;
  long: number = 0;
  sunrise: string = '';
  sunset: string = '';
  wind: number = 0;

  searchForm = this.fb.group({
    city: ['', Validators.required],
  });

  async ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          this.weatherApi.getCity(this.lat, this.long).subscribe({
            next: (res: any) => {
              this.searchForm.controls['city'].setValue(res[0].name);
              this.getWeather();
            },
            error: (err) => {
              console.error('Error getting weather data', err);
            },
          });
        },
        (err) => {
          console.error('Error getting location', err);
        }
      );
    }
  }

  getWeather() {
    const { city } = this.searchForm.value;
    if (city) {
      this.weatherApi.getWeather(city, this.units).subscribe({
        next: (res: any) => {
          this.myWeather = res;
          console.log('my weather ', this.myWeather);

          this.dt = this.myWeather.dt;
          this.timezone = this.myWeather.timezone;
          const date = new Date((this.dt + this.timezone) * 1000);
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
          this.feelsLikeTemp = this.myWeather.main.feels_like;
          this.h = this.myWeather.main.temp_max;
          this.l = this.myWeather.main.temp_min;
          this.summary = this.myWeather.weather[0].main;
          this.humidity = this.myWeather.main.humidity;
          this.country = this.myWeather.sys.country;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Update failed:', error.message);
        },
      });
    }
  }
}
