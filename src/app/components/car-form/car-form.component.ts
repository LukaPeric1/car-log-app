import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeCircleOutline } from 'ionicons/icons';
import { CarLogService, CarLog } from '../../services/car-log.service';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
    IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonIcon
  ],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.css'
})
export class CarFormComponent implements OnInit {
  newLog: CarLog = {
    brand: '',
    model: '',
    vin: '',
    serviceType: 'Mali servis',
    description: '',
    mileage: 0,
    date: new Date().toISOString().split('T')[0]
  };

  isEditing = false;
  editingId: string | undefined = undefined;

  constructor(private carLogService: CarLogService, private router: Router) {
    addIcons({ saveOutline, closeCircleOutline });
  }

  ngOnInit() {
    // Proveravamo da li u servisu postoji spreman auto za izmenu
    const logToEdit = this.carLogService.getLogToEdit();
    if (logToEdit) {
      this.newLog = { ...logToEdit };
      this.editingId = logToEdit.id;
      this.isEditing = true;
    }
  }

  onSubmit() {
    if (!this.newLog.brand || !this.newLog.model) {
      alert('Molimo unesite marku i model automobila!');
      return;
    }

    if (this.isEditing && this.editingId) {
      this.carLogService.updateLog(this.editingId, this.newLog).subscribe({
        next: () => {
          alert('Zapis uspešno ažuriran!');
          this.carLogService.setLogToEdit(null);
          this.router.navigate(['/istorija']); // Kad se ažurira, prebaci nas na istoriju
        },
        error: (err) => console.error(err)
      });
    } else {
      this.carLogService.createLog(this.newLog).subscribe({
        next: () => {
          alert('Zapis uspešno sačuvan!');
          this.resetForm();
          this.router.navigate(['/istorija']); // Kad se sačuva, prebaci nas na istoriju
        },
        error: (err) => console.error(err)
      });
    }
  }

  cancelEdit() {
    this.carLogService.setLogToEdit(null);
    this.router.navigate(['/istorija']);
  }

  private resetForm() {
    this.newLog = {
      brand: '',
      model: '',
      vin: '',
      serviceType: 'Mali servis',
      description: '',
      mileage: 0,
      date: new Date().toISOString().split('T')[0]
    };
  }
}