import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
  IonApp, IonContent, IonTabBar, IonTabButton, IonIcon, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    IonApp, IonContent, IonTabBar, IonTabButton, IonIcon, IonLabel
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    // Registrujemo ikonice koje se koriste u donjem meniju (tabovima)
    addIcons({ addCircleOutline, listOutline });
  }
}