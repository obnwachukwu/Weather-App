import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon]
})
export class SettingsPage implements OnInit {

  isDarkMode = false;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('dark-mode') === 'true';
    this.isDarkMode = savedTheme;
    if (savedTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
    localStorage.setItem('dark-mode', String(this.isDarkMode));
  }

  openSettings() {
    this.router.navigate(['/Settings']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
  

}
