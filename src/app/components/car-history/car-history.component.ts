import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { CarLogService, CarLog } from '../../services/car-log.service';

@Component({
  selector: 'app-car-history',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon
  ],
  templateUrl: './car-history.component.html',
  styleUrl: './car-history.component.css'
})
export class CarHistoryComponent implements OnInit {
  carLogs: CarLog[] = [];

  constructor(private carLogService: CarLogService, private router: Router) {
    addIcons({ createOutline, trashOutline });
  }

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.carLogService.getLogs().subscribe({
      next: (res) => {
        this.carLogs = res;
      },
      error: (err) => console.error('Greška pri učitavanju:', err)
    });
  }

  onEdit(log: CarLog) {
    this.carLogService.setLogToEdit(log);
    this.router.navigate(['/nova-forma']); // Kad klikne na Izmeni, šalje nas na tab forme
  }

  onDelete(id: string | undefined) {
    if (!id) return;
    if (confirm('Da li ste sigurni da želite da obrišete ovaj zapis?')) {
      this.carLogService.deleteLog(id).subscribe({
        next: () => {
          alert('Zapis uspešno obrisan!');
          this.loadLogs();
        },
        error: (err) => console.error(err)
      });
    }
  }
}