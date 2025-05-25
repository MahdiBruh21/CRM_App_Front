import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer/customer.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';
import { ProspectComponent } from './prospect/prospect.component';
import { ProspectionComponent } from './prospection/prospection.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerComponent },
  { path: 'complaints', component: ComplaintComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'profiles', component: ProfileComponent },
  { path: 'prospects', component: ProspectComponent },
  { path: 'prospections', component: ProspectionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'auth-callback', component: LoginComponent }, // For OAuth callback
  { path: '**', redirectTo: '/customers' }, // Catch-all route
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
