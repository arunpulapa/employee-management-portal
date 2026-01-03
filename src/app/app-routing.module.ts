import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './dashboard/layout/layout.component';

const routes: Routes = [

  // Public
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth/auth.module').then(m => m.AuthModule)
  },

  // Protected layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./employees/employees/employees.module')
            .then(m => m.EmployeesModule)
      }
    ]
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
