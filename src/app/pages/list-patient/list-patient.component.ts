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
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrls: ['./list-patient.component.css']
})
export class ListPatientComponent extends BaseComponent implements OnInit {

    constructor( public rest:RestService, public router:Router, public route:ActivatedRoute, public location: Location, public titleService:Title)
    {
      super( rest,router,route,location,titleService);
    }
  
    pacientes:Paciente[]=[];
    paciente_search:SearchObject<Paciente>;
    public statusmenu: boolean;
    ngOnInit()
    {

      this.titleService.setTitle('pacientes');
      this.is_loading = true;
      // this.rest.especialidad.getAll({}).subscribe((respuesta)=>
      // this.rest.especialidad.getAll({}).subscribe((respuesta)=>
  
      this.route.queryParams.subscribe( params =>
      {
        console.log("params",params);
        this.paciente_search = {
          eq: {id:params.id},
          gt: {},
          ge: {},
          le: {},
          lt: {},
          lk: {},
          csv: {},
        };
  
        // this.especialidad_search.lk.codigo	= "lk.codigo" in params ?params["lk.codigo"]:null;
        this.paciente_search.eq.id	= "id" in params ?params["id"]:null;
        this.paciente_search.limite			= this.pageSize;
        this.paciente_search.pagina			= 'pagina' in params ? parseInt( params.pagina ):0;
        // this.currentPage = params['pagina'] == null ? 0 : parseInt(params['pagina'] );
        this.is_loading = true;
        this.rest.paciente.search(this.paciente_search).subscribe((respuesta) =>
        {
          this.pacientes = respuesta.datos;
          console.log('pacientes',respuesta.datos);
          this.setPages( this.paciente_search.pagina, respuesta.total );
          this.is_loading = false;
        },error=>this.showError(error));
      });
    }

    changeSearch(nombre:string)
    {
    }
  
    search()
    {
      this.is_loading = true;
      this.paciente_search.pagina = 0;
          let search = {};
          let array = ['eq','le','lt','ge','gt','csv','lk'];
          for(let i in this.paciente_search )
          {
              console.log( 'i',i,array.indexOf( i ) );
              if(array.indexOf( i ) > -1 )
              {
                  for(let j in this.paciente_search[i])
                      search[i+'.'+j] = this.paciente_search[i][j];
              }
          }
      console.log('search',this.paciente_search );
      console.log('Busqueda', search );
      this.router.navigate(['pacientes'],{queryParams: search});
    }
  
  
  

}
