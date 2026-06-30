import { Injectable } from '@angular/core';
import { Database, ref, set, push, object, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';

// Definišemo interfejs kako bi TypeScript znao strukturu našeg automobila/loga
export interface CarLog {
  id?: string;
  brand: string;
  model: string;
  vin?: string;
  serviceType: string; // npr. Mali servis, Veliki servis, Trap, Dijagnostika...
  description: string;
  mileage: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarLogService {

  constructor(private db: Database) { }

  // 1. CREATE - Dodavanje novog loga u bazu
  createLog(log: CarLog): Promise<void> {
    const dbRef = ref(this.db, 'car-logs');
    const newLogRef = push(dbRef); // Generiše jedinstveni Firebase ID (kluč)
    log.id = newLogRef.key || undefined;
    return set(newLogRef, log);
  }

  // 2. READ - Preuzimanje svih logova iz baze (vraća Observable)
  getLogs(): Observable<any> {
    const dbRef = ref(this.db, 'car-logs');
    return object(dbRef); // Prati izmene u realnom vremenu
  }

  // 3. UPDATE - Izmena postojećeg loga
  updateLog(id: string, log: Partial<CarLog>): Promise<void> {
    const dbRef = ref(this.db, `car-logs/${id}`);
    return update(dbRef, log);
  }

  // 4. DELETE - Brisanje loga iz baze
  deleteLog(id: string): Promise<void> {
    const dbRef = ref(this.db, `car-logs/${id}`);
    return remove(dbRef);
  }
}