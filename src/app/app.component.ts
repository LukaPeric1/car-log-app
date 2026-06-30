import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarLogService, CarLog } from './services/car-log.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})export class AppComponent implements OnInit {
  // Objekat koji je povezan sa input poljima u formi
  newLog: CarLog = {
    brand: '',
    model: '',
    vin: '',
    serviceType: 'Mali servis',
    description: '',
    mileage: 0,
    date: new Date().toISOString().split('T')[0] // Danasnji datum kao default
  };

  // Niz u koji cemo smestiti sve automobile iz baze
  carLogs: CarLog[] = [];

  constructor(private carLogService: CarLogService) {}

  ngOnInit() {
    this.loadLogs();
  }

  // Ucitavanje podataka iz Firebase-a
  loadLogs() {
    this.carLogService.getLogs().subscribe({
      next: (snapshot) => {
        if (snapshot && snapshot.value) {
          // Firebase vraca podatke kao objekat objekata, pa ih konvertujemo u niz
          const data = snapshot.value;
          this.carLogs = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        } else {
          this.carLogs = [];
        }
      },
      error: (err) => {
        console.error('Greska pri ucitavanju podataka:', err);
      }
    });
  }

  // Snimanje novog zapisa
  onSubmit() {
    if (!this.newLog.brand || !this.newLog.model) {
      alert('Molimo unesite marku i model automobila!');
      return;
    }

    this.carLogService.createLog(this.newLog).then(() => {
      // Resetujemo formu nakon uspesnog slanja
      this.newLog = {
        brand: '',
        model: '',
        vin: '',
        serviceType: 'Mali servis',
        description: '',
        mileage: 0,
        date: new Date().toISOString().split('T')[0]
      };
      alert('Zapis o servisu uspešno sačuvan u Firebase!');
    }).catch(err => {
      console.error('Greska pri cuvanju:', err);
    });
  }

  // Brisanje zapisa
  onDelete(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovaj zapis?')) {
      this.carLogService.deleteLog(id).then(() => {
        alert('Zapis obrisan!');
      }).catch(err => {
        console.error('Greska pri brisanju:', err);
      });
    }
  }
}