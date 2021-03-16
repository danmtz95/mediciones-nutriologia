import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Usuario, Paciente, Medicion} from '../../models/Modelos';
import {Router,ActivatedRoute} from "@angular/router"
import { BaseComponent } from '../base/base.component';
// import { HeaderComponent } from "../../components/header/header.component";
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchObject } from 'src/app/models/Respuestas';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-list-measurement',
  templateUrl: './list-measurement.component.html',
  styleUrls: ['./list-measurement.component.css']
})
export class ListMeasurementComponent extends BaseComponent implements OnInit {

  constructor( public rest:RestService, public router:Router, public route:ActivatedRoute, public location: Location, public titleService:Title)
  {
    super( rest,router,route,location,titleService);
  }

  mediciones:Medicion[]=[];
  medicion_search:SearchObject<Medicion>;
  paciente: Paciente;
  public statusmenu: boolean;
  ngOnInit()
  {

    this.titleService.setTitle('mediciones');
    this.is_loading = true;
    // this.rest.especialidad.getAll({}).subscribe((respuesta)=>
    // this.rest.especialidad.getAll({}).subscribe((respuesta)=>

    this.route.queryParams.subscribe( params =>
    {
      let id_paciente = params.id;
        console.log("params",params);
        this.medicion_search = {
          eq: {id_paciente: params.id},
          gt: {},
          ge: {},
          le: {},
          lt: {},
          lk: {},
          csv: {},
        };
        if(id_paciente){
        // this.especialidad_search.lk.codigo	= "lk.codigo" in params ?params["lk.codigo"]:null;
        this.medicion_search.eq.id_paciente	= "id" in params ? params["id"]:null;
        this.medicion_search.limite			= this.pageSize;
        this.medicion_search.pagina			= 'pagina' in params ? parseInt( params.pagina ):0;
        console.log('aki',this.medicion_search);
        // this.currentPage = params['pagina'] == null ? 0 : parseInt(params['pagina'] );
        this.is_loading = true;
        forkJoin([
          this.rest.medicion.search(this.medicion_search),
          this.rest.paciente.get(id_paciente)
        ]).subscribe((respuesta) => {
          this.mediciones = respuesta[0].datos;
          this.paciente = respuesta[1];
          console.log('mediciones',respuesta[0].datos);
          this.setPages( this.medicion_search.pagina, respuesta[0].total );
          this.is_loading = false;
            }, error => this.showError(error));

          }},(error) =>this.showError(error));

  }

  changeSearch(nombre:string)
  {
  }

  search()
  {
    this.is_loading = true;
    this.medicion_search.pagina = 0;
        let search = {};
        let array = ['eq','le','lt','ge','gt','csv','lk'];
        for(let i in this.medicion_search )
        {
            console.log( 'i',i,array.indexOf( i ) );
            if(array.indexOf( i ) > -1 )
            {
                for(let j in this.medicion_search[i])
                    search[i+'.'+j] = this.medicion_search[i][j];
            }
        }
    console.log('search',this.medicion_search );
    console.log('Busqueda', search );
    this.router.navigate(['mediciones'],{queryParams: search});
  }



}
