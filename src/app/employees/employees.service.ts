import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
private API = 'http://localhost:5000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(page = 1, limit = 5, search = ''): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);

    return this.http.get(this.API, { params });
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

}
