import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_KEY, API_URLS } from '../../shared/constants/api-url-constants';

@Injectable({
  providedIn: 'root',
})
export class WeatherApi {
  http = inject(HttpClient);

  getWeather(city: string, units: string) {
    return this.http.get(
      `${API_URLS.weatherApi}${city}&appid=${API_KEY}&units=${units}`
    );
  }

  getCity(lat: number, long: number, limit: number = 1) {
    return this.http.get(
      API_URLS.weatherApiReverse +
        `lat=${lat}&lon=${long}&limit=${limit}&appid=${API_KEY}`
    );
  }
}
