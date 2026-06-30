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
  isEditing = false;
  editingId: string | undefined = undefined;
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
      next: (res) => {
        this.carLogs = res;
      },
      error: (err) => {
        console.error('Greška pri učitavanju:', err);
      }
    });
  }

  // --- NOVA METODA: Pokreće režim izmene kada se klikne "Izmeni" ---
  onEdit(log: CarLog) {
    this.isEditing = true;
    this.editingId = log.id;
    // Kopiramo vrednosti u formu (koristimo ... da ne bismo menjali direktno u listi dok kucamo)
    this.newLog = { ...log };
  }

  // --- NOVA METODA: Resetuje formu i prekida režim izmene ---
  cancelEdit() {
    this.isEditing = false;
    this.editingId = undefined;
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

  // --- MODIFIKOVANA ONSUBMIT METODA ---
  onSubmit() {
    if (!this.newLog.brand || !this.newLog.model) {
      alert('Molimo unesite marku i model automobila!');
      return;
    }

    if (this.isEditing && this.editingId) {
      // Ako smo u režimu izmene, šaljemo PUT zahtev kroz servis
      this.carLogService.updateLog(this.editingId, this.newLog).subscribe({
        next: () => {
          alert('Zapis uspešno ažuriran!');
          this.cancelEdit(); // Resetuj formu i izađi iz edit režima
          this.loadLogs();   // Osveži listu sa novim podacima
        },
        error: (err) => console.error(err)
      });
    } else {
      // Ako nismo u režimu izmene, radimo stari klasični POST (dodavanje novog)
      this.carLogService.createLog(this.newLog).subscribe({
        next: () => {
          this.cancelEdit();
          alert('Zapis uspešno sačuvan preko REST API-ja!');
          this.loadLogs();
        },
        error: (err) => console.error(err)
      });
    }
  }

  onDelete(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovaj zapis?')) {
      this.carLogService.deleteLog(id).subscribe({
        next: () => {
          alert('Zapis obrisan!');
          this.loadLogs(); // Osvežavamo listu
        },
        error: (err) => console.error(err)
      });
    }
  }
}