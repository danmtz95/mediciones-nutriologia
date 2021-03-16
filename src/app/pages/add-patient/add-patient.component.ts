import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Usuario, Paciente} from '../../models/Modelos';
import {Router,ActivatedRoute} from "@angular/router"
import { BaseComponent } from '../base/base.component';
// import { HeaderComponent } from "../../components/header/header.component";
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchObject } from 'src/app/models/Respuestas';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent extends BaseComponent implements OnInit {

  constructor( public rest:RestService, public router:Router, public route:ActivatedRoute, public location: Location, public titleService:Title)
    {
      super( rest,router,route,location,titleService);
    }

  is_loading:boolean	= false;

	paciente:Paciente = {
    nombre: '',
    apellido:'',
    correo_electronico:'',
    telefono:null
	};
	ngOnInit() {
		this.paciente = {
			id: null,
			nombre:'',
      apellido:'',
      correo_electronico:'',
      telefono:null
		};

		this.route.paramMap.subscribe( params =>
		{
			let id = params.get('id') ==null ? null : parseInt(params.get('id') );
			if( id != null )
			{
				this.is_loading = true;
				//this.rest.getCentroMedico( id ).subscribe((centro_medico)=>
				this.rest.paciente.get( id ).subscribe((paciente)=>
				{
					this.is_loading = false;
					this.paciente = paciente;
				}, error=>this.showError(error));
			}
		});
	}

	agregar()
	{
		this.is_loading = true;

		if( this.paciente.id)
		{
			//this.rest.actualizarCentroMedico( this.centro_medico ).subscribe((centro_medico)=>{
			this.rest.paciente.update( this.paciente ).subscribe((paciente)=>{
				this.is_loading = false;
				this.router.navigate(['/pacientes']);
			},error=>this.showError(error));
		}
		else
		{
			//this.rest.agregarCentroMedico( this.centro_medico ).subscribe((centro_medico)=>{
			this.rest.paciente.create( this.paciente ).subscribe((paciente)=>{
				this.is_loading = false;
				this.router.navigate(['/pacientes']);
			},error=>this.showError(error));
		
		}
	}

}
