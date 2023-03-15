import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { publicIpv4 } from 'public-ip';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private KEY = "beb0d55cac87488590702708231403";
  private IP = async() => {
    await publicIpv4()
  };
  constructor(private httpClient: HttpClient) { }

  getWeatherByIp(ip: string) {
    return this.httpClient.get(`https://api.weatherapi.com/v1/current.json?key=${this.KEY}&q=${ip}&aqi=no`)
  }
}
