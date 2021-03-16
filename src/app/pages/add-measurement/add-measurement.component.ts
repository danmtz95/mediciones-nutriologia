import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Usuario, Paciente, Medicion} from '../../models/Modelos';
import {Router,ActivatedRoute} from "@angular/router"
import { BaseComponent } from '../base/base.component';
// import { HeaderComponent } from "../../components/header/header.component";
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchObject } from 'src/app/models/Respuestas';
@Component({
  selector: 'app-add-measurement',
  templateUrl: './add-measurement.component.html',
  styleUrls: ['./add-measurement.component.css']
})
export class AddMeasurementComponent extends BaseComponent implements OnInit {

  constructor( public rest:RestService, public router:Router, public route:ActivatedRoute, public location: Location, public titleService:Title)
    {
      super( rest,router,route,location,titleService);
    }

  is_loading:boolean	= false;

	medida:Medicion = {
    id_paciente:null,
	  peso:'',
    cintura:'',
    abdomen:'',
    cadera:'',
    antebrazo:'',
    fecha:null,
    nota:'',
  };
  
	ngOnInit() {
		this.medida = {
			id_paciente:null,
			peso:'',
			cintura:'',
			abdomen:'',
			cadera:'',
			antebrazo:'',
			fecha:null,
			nota:'',
		  };

		this.route.queryParams.subscribe( params =>
		{
			
      let id = params.id;
      
			if( id != null )
			{
				this.is_loading = true;
				this.medida.id_paciente = id;
				console.log('medida',this.medida.id_paciente);
        //this.rest.getCentroMedico( id ).subscribe((centro_medico)=>
   
				// this.rest.medicion.get( id ).subscribe((medida)=>
				// {
				// 	this.is_loading = false;
				// 	this.medida = medida;
				// }, error=>this.showError(error));
			}
		});
	}

	agregar()
	{
		this.is_loading = true;

		if( this.medida.id)
		{
			//this.rest.actualizarCentroMedico( this.centro_medico ).subscribe((centro_medico)=>{
			this.rest.medicion.update( this.medida ).subscribe((medida)=>{
				this.is_loading = false;
				this.router.navigate(['/pacientes']);
			},error=>this.showError(error));
		}
		else
		{
			//this.rest.agregarCentroMedico( this.centro_medico ).subscribe((centro_medico)=>{
			this.rest.medicion.create( this.medida ).subscribe((medida)=>{
				this.is_loading = false;
				this.router.navigate(['/pacientes']);
			},error=>this.showError(error));
		
		}
	}

}
