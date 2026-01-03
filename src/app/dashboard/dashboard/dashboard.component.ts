import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
stats: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
   this.http.get<any[]>('http://localhost:5000/api/dashboard')
  .subscribe(data => {
    data.forEach(item => {
      this.stats[item.title] = item.value;
    });
  });

  }
}