import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonMenu,IonContent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})
export class AppComponent {
  constructor() {}
}
