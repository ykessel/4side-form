import { Component, OnInit, AfterViewInit, ViewChild, Directive, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NG_VALIDATORS, Validator, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { WeatherService } from './services/weather.service';
import { publicIpv4 } from 'public-ip';
import { Weather } from './types/Weather';
import { CountryService } from './services/country.service';
import Modal from 'bootstrap/js/dist/modal'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = '4SidesForm';
  temp: number = 0;
  countries: any;
  states: any[] = [];
  time: string = '';
  @ViewChild('modal') modal: any;
  @ViewChild('finmodal') finmodal: any;

  myForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(4)]],
    birthDate: ['', [Validators.required, correctAgeValidator ]],
    country: ['', Validators.required],
    state: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    temp: this.temp
  });

  constructor(private fb: FormBuilder, private weatherService: WeatherService, private countryService: CountryService) { }

  async getIP() {
    return await publicIpv4();
  }

  ngOnInit() {
    this.getIP().then(ip => {
      this.weatherService.getWeatherByIp(ip).subscribe((x: any) => { this.temp = x.current.temp_c })
    });
    this.countryService.getCountries().subscribe(x => { this.countries = x });
  }

  ngAfterViewInit(): void {
    this.countdown(60*2);
  }

  getStates() {
    let countryName: string | undefined | null = this.myForm.value.country;
    if (typeof (countryName) === 'string') {
      this.countryService.getStatesByCountry(countryName).subscribe((x) => { this.states = x });
    }
  }

  countdown(duration: any) {
    let timer = duration, minutes, seconds;

    let timerInterval = setInterval(() => {

      minutes = parseInt(String(timer / 60), 10);
      seconds = parseInt(String(timer % 60), 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.time = minutes + ":" + seconds;

      if (--timer < 0) {
        clearInterval(timerInterval);
        let myModal = new Modal(this.modal.nativeElement)
        myModal.show()
      }
    }, 1000)
  }

  resetForm(){
    this.myForm.reset();
  }

  onSubmit() {
    let modal = new Modal(this.finmodal.nativeElement)
    modal.show()
  }
}

export const correctAgeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let birthDate = new Date(control.value).getFullYear();
  let now = new Date().getFullYear();

  let age = now - birthDate;
  return 18 <= age && age <= 63 ? null : { correctAge: true };
};
