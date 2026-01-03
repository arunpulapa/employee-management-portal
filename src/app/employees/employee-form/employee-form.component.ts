import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  form!: FormGroup;
  id!: number | null;

  constructor(
    private fb: FormBuilder,
    private service: EmployeesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.service.getEmployee(this.id)
        .subscribe(emp => this.form.patchValue(emp));
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.updateEmployee(this.id, this.form.value)
        .subscribe(() => this.router.navigate(['/employees']));
    } else {
      this.service.addEmployee(this.form.value)
        .subscribe(() => this.router.navigate(['/employees']));
    }
  }

    goBack() {
    this.router.navigate(['/employees']);
  }
}
