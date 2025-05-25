// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomerComponent } from './customer/customer.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';
import { ProspectComponent } from './prospect/prospect.component';
import { ProspectionComponent } from './prospection/prospection.component';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ComplaintDialogComponent } from './complaint-dialog/complaint-dialog.component';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { ProspectDialogComponent } from './prospect-dialog/prospect-dialog.component';
import { ProspectionDialogComponent } from './prospection-dialog/prospection-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    CustomerComponent,
    ComplaintComponent,
    OrderComponent,
    ProfileComponent,
    ProspectComponent,
    ProspectionComponent,
    CustomerDialogComponent,
    ComplaintDialogComponent,
    OrderDialogComponent,
    ProfileDialogComponent,
    ProspectDialogComponent,
    ProspectionDialogComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
