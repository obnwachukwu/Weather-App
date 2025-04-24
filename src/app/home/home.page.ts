import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonLabel, 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ 
    IonContent,
    IonButton,
    CommonModule,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    HttpClientModule,
    IonItem,
    IonInput,
    IonLabel,
    FormsModule 
  ]
})
export class HomePage implements OnInit {
  city!: string; // Default city
  temperature!: number;
  weatherCondition!: string;
  humidity!: number;
  windSpeed!: number;
  iconUrl!: string;

  weatherTips: string[] = [
    "Carry an umbrella if the chance of rain is above 50%. ☔",
    "Stay hydrated on hot days! 💧",
    "Layer up for cold mornings and warmer afternoons. 🧥",
    "UV index high? Don't forget sunscreen! 🌞",
    "Check wind speed before biking or sailing. 🚴‍♂️"
  ];

  currentTipIndex = 0;
  currentTip = this.weatherTips[0];

  constructor(public router: Router, private http: HttpClient) {}

  // Navigation functions
  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  // Fetch Weather Data from API
  getWeather() {
    const apiKey = 'a40bba027d00faaeddba478f3de5a477'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`;
    localStorage.setItem('last-location', this.city);

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.temperature = data.main.temp;
        this.weatherCondition = data.weather[0].description;
        this.humidity = data.main.humidity;
        this.windSpeed = data.wind.speed;
        this.iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Dynamically set the weather tip based on the current weather condition
        this.currentTip = this.getWeatherTip(this.weatherCondition);
      },
      error: (err) => {
        console.error('City not found or API error', err);
        alert('City not found! Please try another.');
      }
    });
  }

  async getCurrentLocationWeather() {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not available in your browser');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        const apiKey = 'a40bba027d00faaeddba478f3de5a477';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
        this.http.get<any>(url).subscribe({
          next: (data) => {
            this.city = data.name;
            this.temperature = Math.round(data.main.temp);
            this.weatherCondition = data.weather[0].description;
            this.humidity = data.main.humidity;
            this.windSpeed = data.wind.speed;
            this.iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            this.currentTip = this.getWeatherTip(this.weatherCondition);
            localStorage.setItem('last-location', this.city);
          },
          error: (err) => {
            console.error('Failed to fetch weather from coordinates.', err);
            alert('Could not fetch weather for your current location.');
          }
        });
      },
      (error) => {
        console.error('Geolocation error', error);
        alert('Could not get your location.');
      }
    );
  }
  

  ngOnInit() {
    const lastCity = localStorage.getItem('last-location');
    if (lastCity) {
      this.city = lastCity;
      this.getWeather();
    }

    // Tip rotation every 15 seconds
    setInterval(() => {
      this.currentTipIndex = (this.currentTipIndex + 1) % this.weatherTips.length;
      this.currentTip = this.weatherTips[this.currentTipIndex];
    }, 15000);
  }

  // Helper function to get a tip based on weather condition
  getWeatherTip(condition: string): string {
    if (condition.toLowerCase().includes('rain')) {
      return "Don't forget your umbrella! ☔";
    } else if (condition.toLowerCase().includes('clear')) {
      return "Perfect day for a walk outside! 🌞";
    } else if (condition.toLowerCase().includes('snow')) {
      return "Drive carefully, roads may be slippery. ❄️";
    } else if (condition.toLowerCase().includes('cloud')) {
      return "Could be gloomy, but it’s a great day to chill indoors. ☁️";
    } else {
      return "Stay safe and check the sky! 🌤️";
    }
  }
}
