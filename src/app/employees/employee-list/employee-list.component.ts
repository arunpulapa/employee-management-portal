import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  page = 1;
  total = 0;
  search = '';

  constructor(
    private employeeService: EmployeesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /* ================= LOAD DATA ================= */

  loadEmployees() {
    this.employeeService
      .getEmployees(this.page, 5, this.search)
      .subscribe(res => {
        this.employees = res.data;
        this.total = res.total;
      });
  }

  /* ================= PAGINATION ================= */

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1; // paginator is 0-based
    this.loadEmployees();
  }

  /* ================= SEARCH ================= */

  // Called when clicking search icon OR pressing Enter
  onSearch() {
    this.page = 1;
    this.loadEmployees();
  }

  // Auto search after 3 characters
  onSearchKeyup() {
    if (this.search.length >= 3 || this.search.length === 0) {
      this.page = 1;
      this.loadEmployees();
    }
  }

  /* ================= NAVIGATION ================= */

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  /* ================= DELETE ================= */

  deleteEmployee(id: number) {
    if (!confirm('Delete employee?')) return;

    this.employeeService
      .deleteEmployee(id)
      .subscribe(() => this.loadEmployees());
  }
}
