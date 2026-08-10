import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login-menu/login-menu.component').then(
        (m) => m.LoginMenuComponent,
      ),
  },
  {
    path: 'industrial-customer',
    loadComponent: () =>
      import('./modules/industrial-customer/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'connection-status',
        loadComponent: () =>
          import('./modules/industrial-customer/connection-status/connection-status.component').then(
            (m) => m.ConnectionStatusComponent,
          ),
      },
      {
        path: 'contracts',
        loadComponent: () =>
          import('./modules/industrial-customer/contracts/contracts.component').then(
            (m) => m.ContractsComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./modules/industrial-customer/reports/report-container/report-container.component').then(
            (m) => m.ReportContainerComponent,
          ),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./modules/industrial-customer/register-complaint/register-complaint.component').then(
            (m) => m.RegisterComplaintComponent,
          ),
      },
      {
        path: 'tariff',
        loadComponent: () =>
          import('./modules/industrial-customer/tariff-management/tariff-management.component').then(
            (m) => m.TariffManagementComponent,
          ),
      },
      {
        path: 'billing-payments',
        loadComponent: () =>
          import('./modules/industrial-customer/billing-payments/billing-payments.component').then(
            (m) => m.BillingPaymentsComponent,
          ),
      }
    ],
  },
  {
    path: 'marketing',
    loadComponent: () =>
      import('./modules/marketing/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'feasibility-check',
        loadComponent: () =>
          import('./modules/marketing/pipeline-planning/pipeline-planning.component').then(
            (m) => m.PipelinePlanningComponent,
          ),
      },
      {
        path: 'existing-customers',
        loadComponent: () =>
          import('./modules/marketing/existing-customers/existing-customers.component').then(
            (m) => m.ExistingCustomersComponent,
          ),
      },
      {
        path: 'existing-customers/:id',
        loadComponent: () =>
          import('./modules/marketing/customer-details/customer-details.component').then(
            (m) => m.CustomerDetailsComponent,
          ),
      },
      {
        path: 'existing-customers/:id/reports',
        loadComponent: () =>
          import('./modules/marketing/customer-reports/customer-reports.component').then(
            (m) => m.CustomerReportsComponent,
          ),
      },
     
      {
        path: 'complaints',
        loadComponent: () =>
          import('./modules/marketing/corporate-complaints/corporate-complaints.component').then(
            (m) => m.CorporateComplaintsComponent,
          ),
      },
      {
        path: 'tariff',
        loadComponent: () =>
          import('./modules/marketing/master-tariffs/master-tariffs.component').then(
            (m) => m.MasterTariffsComponent,
          ),
      },
      {
        path: 'billing-payments',
        loadComponent: () =>
          import('./modules/marketing/corporate-billing-list/corporate-billing-list.component').then(
            (m) => m.CorporateBillingListComponent,
          ),
      }
    ],
  },
];
