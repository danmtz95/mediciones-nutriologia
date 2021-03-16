import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import {ListUserComponent} from './pages/list-user/list-user.component'
// import {AddUserComponent} from './pages/add-user/add-user.component'
import {ListPatientComponent} from './pages/list-patient/list-patient.component'
import {AddPatientComponent} from './pages/add-patient/add-patient.component'
import {ListMeasurementComponent} from './pages/list-measurement/list-measurement.component'
import {AddMeasurementComponent} from './pages/add-measurement/add-measurement.component'
import {HomeComponent} from './pages/home/home.component'

const routes: Routes = [
  {
		path: '',  component: HomeComponent,
		children:
		[
			{ path: '', redirectTo: 'pacientes', pathMatch: "full"},
			{ path: 'pacientes', component:ListPatientComponent,pathMatch:"full"},
			{ path: 'agregar-paciente', component:AddPatientComponent,pathMatch:"full"},
      { path: 'medidas', component: ListMeasurementComponent,pathMatch:"full"},
      { path: 'agregar-medida', component: AddMeasurementComponent,pathMatch:"full"},
			

		]
	}

];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash:true})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
