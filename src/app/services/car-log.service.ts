import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface CarLog {
  id?: string;
  brand: string;
  model: string;
  vin?: string;
  serviceType: string;
  description: string;
  mileage: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarLogService {
  private baseUrl = environment.databaseUrl;

  constructor(private http: HttpClient) { }

  // 1. CREATE (POST) - Firebase pri POST zahtevu sam generiše ID i vraća objekat { name: "ID" }
  createLog(log: CarLog): Observable<any> {
    return this.http.post(`${this.baseUrl}/car-logs.json`, log);
  }

  // 2. READ (GET) - Povlači sve zapise
  getLogs(): Observable<CarLog[]> {
    return this.http.get<{ [key: string]: CarLog }>(`${this.baseUrl}/car-logs.json`).pipe(
      map(responseData => {
        const logsArray: CarLog[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            logsArray.push({ id: key, ...responseData[key] });
          }
        }
        return logsArray;
      })
    );
  }

  // 3. UPDATE (PUT)
  updateLog(id: string, log: Partial<CarLog>): Observable<any> {
    return this.http.put(`${this.baseUrl}/car-logs/${id}.json`, log);
  }

  // 4. DELETE (DELETE)
  deleteLog(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/car-logs/${id}.json`);
  }
}