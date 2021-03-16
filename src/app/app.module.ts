import { BrowserModule } from '@angular/platform-browser';
import { AngularDateHttpInterceptor } from './services/AngularDateHttpInterceptor'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ListPatientComponent } from './pages/list-patient/list-patient.component';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { ListMeasurementComponent } from './pages/list-measurement/list-measurement.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { AddMeasurementComponent } from './pages/add-measurement/add-measurement.component';
import { HomeComponent } from './pages/home/home.component';
import { BaseComponent } from './pages/base/base.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ListPatientComponent,
    ListUserComponent,
    ListMeasurementComponent,
    AddPatientComponent,
    AddMeasurementComponent,
    HomeComponent,
    BaseComponent,
    HeaderComponent,
    MenuComponent
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
	  FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AngularDateHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
