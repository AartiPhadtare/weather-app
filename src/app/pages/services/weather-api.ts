import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_KEY, API_URL } from "../../shared/constants/api-url-constants";

@Injectable({
    providedIn:'root'
})
export class WeatherApi{
    http = inject(HttpClient);

  getWeather(city: string, units: string) {
  return this.http.get(
    `${API_URL}${city}&appid=${API_KEY}&units=${units}`
  );
}


}