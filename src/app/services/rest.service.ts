import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams,HttpErrorResponse,HttpResponse} from '@angular/common/http';
import { Observable, BehaviorSubject,forkJoin, fromEvent,of} from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError,flatMap } from 'rxjs/operators';
import {
	Usuario,Paciente,Medicion, Imagen
} from '../models/Modelos'
import { Respuesta, ErrorMensaje, LoginResponse} from '../models/Respuestas';
import {ObjRest} from './ObjRest';
import {SearchRest} from './SearchRest';




// export interface InventarioInfo
// {
// 	lote_inventario	: Lote_Inventario;
// 	merma: Merma;
// }

@Injectable({
	providedIn: 'root'
})

export class RestService {
	public currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<any>;
	public errorBehaviorSubject: BehaviorSubject<ErrorMensaje>;
	public errorObservable:Observable<ErrorMensaje>;
	public keyUpObserver:Observable<KeyboardEvent>;
	urlBase:string = '';
	public  usuario: ObjRest<Usuario>;
	public  paciente: ObjRest<Paciente>;
	public  medicion: ObjRest<Medicion>;

	//End vars


	// usuario_centro_medico:ObjRest<Usuario_Centro_Medico>;

	constructor(private http: HttpClient)
	{
		//Produccion por cambiarx`x
		// this.urlBase = 'https://expediente.centromedico.life/api';
		this.urlBase = 'http://127.0.0.1/Mediciones';
		if( window.location.hostname.indexOf('localhost') == 0 )
			this.urlBase = 'http://127.0.0.1/Mediciones';

		this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usuario')));
		this.currentUser = this.currentUserSubject.asObservable();
		this.keyUpObserver = fromEvent<KeyboardEvent>( window.document.body, 'keyup' );
		this.errorBehaviorSubject = new BehaviorSubject<ErrorMensaje>(null);
		this.errorObservable = this.errorBehaviorSubject.asObservable();
		//this.doctor = new DoctorRest(http,this.urlBase);
		this.usuario = new ObjRest<Usuario> (`${this.urlBase}/usuario.php`,http);
		this.paciente = new ObjRest<Paciente> (`${this.urlBase}/paciente.php`,http);
		this.medicion = new ObjRest<Medicion> (`${this.urlBase}/medicion.php`,http);
	
		
	}

	// getCurrentCentroMedico():Centro_Medico
	// {
	// 	let c_id = localStorage.getItem('centro_medico');
	// 	if( c_id !== null && c_id !== undefined )
	// 		return JSON.parse( c_id );

	// 	return null;
	// }

	logout() {
		// remove user from local storage and set current user to null
		localStorage.clear();
		// localStorage.removeItem('usuario');
		// localStorage.removeItem('session_token');
		// localStorage.removeItem('id_organizacion');
		this.currentUserSubject.next(null)
	}

	doLogin(usuario:string,contrasena:string):Observable<LoginResponse>
	{
		let result = this.http.post<any>( `${this.urlBase}/login.php`,{usuario,contrasena}, { withCredentials: true })
			.pipe( map(response=>{
				if(response && response.sesion.id) {
					localStorage.setItem("usuario", JSON.stringify( response ) );
					localStorage.setItem('session_token', response.sesion.id );
					this.currentUserSubject.next(response);	
				}
				return response;
			}));
		return result;
	}
	 
	statusMenu():boolean{
		if(this.isLoggedIn){
			if(localStorage.getItem("activate_menu")=='true'){
				return true
			}else{
				return false
			}
		}

	}

	uploadImage(file:File,es_privada:boolean=false):Observable<Imagen>
	{
		let fd = new FormData();
		fd.append('image',file, file.name);
		fd.append('is_privada', es_privada?'1':'0' );
		return this.http.post(`${this.urlBase}/imagen.php`,fd,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	public get currentUserValue() {
		return this.currentUserSubject.value;
	}

	hasRoles(roles:string[]): boolean{
		for(const oneRole of roles){
			if(!this.currentUser ||!this.currentUserValue.tipo.includes(oneRole)){
				return false
			}
		}
		return true;
	}
	getSessionHeaders():HttpHeaders
	{
		if( localStorage.getItem('session_token') == null )
		{
			console.log("THer is no session token");
			return new HttpHeaders();
		}

		let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('session_token'));
		return headers;
	}

	isLoggedIn():boolean
	{
		let token = localStorage.getItem('session_token');
		if( token )
			return true;

		return false;
	}

	// getUsuarioOrganizacion():Organizacion{
	// 	let user_org = localStorage.getItem('id_organizacion')
	// 	if( user_org == null)
	// 		return null

	// 	let user_data = this.transformJson(user_org);
	// }

	getUsuarioSesion():Usuario
	{
		let user_str = localStorage.getItem('usuario');
		if( user_str == null )
			return null;

		let user_data = this.transformJson( user_str );

		return user_data.usuario;
	}

	transformJson(response)
	{
		return JSON.parse( response, (key,value)=>{
			if( typeof value === "string" )
			{
				if( /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test( value ) )
				{
					let components = value.split(/-|:|\s/g);

					let utcTime = Date.UTC(
						parseInt( components[0] ),
									parseInt( components[1] )-1,
									parseInt( components[2] ),
									parseInt( components[3] ),
									parseInt( components[5] )
								);
					let localTime = new Date();
					localTime.setTime( utcTime );
					return localTime;
				}
			}

			return value;
		});
	}

	getLocalDateFromMysqlString(str:string):Date
	{
		let components = str.split(/-|:|\s/g);
		let d = new Date(parseInt( components[0] ), //Year
				parseInt(components[1])-1, //Month
				parseInt(components[2]), //Day
				parseInt(components[3]), //Hour
				parseInt(components[4])) //Minutes
		return d;
	}

	getDateFromMysqlString(str:string):Date
	{
		let components = str.split(/-|:|\s/g);

				let utcTime = Date.UTC(
						parseInt(components[0]),
						parseInt(components[1])-1,
						parseInt(components[2]),
						parseInt(components[3]),
						parseInt(components[4])
				);

		let d = new Date();
		d.setTime( utcTime );

		return d;
	}

	getMysqlStringFromLocaDate(d:Date):string
	{
		let zero = (a)=>
		{
			if( a<10 )
				return '0'+a;
			return a;
		};
		 let event_string = d.getFullYear()
								+'-'+zero(d.getMonth()+1)
								+'-'+zero(d.getDate())
								+' '+zero(d.getHours())
								+':'+zero(d.getMinutes())
								+':'+zero(d.getSeconds());

		return event_string;

	}

	getMysqlStringFromDate(d:Date):string
	{
		let zero = (a)=>
		{
			if( a<10 )
				return '0'+a;
			return a;
		};

		let event_string = d.getUTCFullYear()
								+'-'+zero(d.getUTCMonth()+1)
								+'-'+zero(d.getUTCDate())
								+' '+zero( d.getUTCHours() )
								+':'+zero( d.getUTCMinutes() )
								+':'+zero( d.getUTCSeconds() );

		return event_string;
	}

	getErrorMessage( error ):string
	{
		if( error == null || error === undefined)
			return 'Error desconocido';

		if( typeof( error.error ) === "string" )
			return error.error;

		console.log( error );

		if( 'error' in error &&  typeof(error.error) !== "string" && 'error' in error.error )
		{
			 return error.error.error;
		}
		else if( error instanceof HttpErrorResponse )
		{
			return error.statusText;
		}
	}

	// getSesion():SesionInfo{
	// 	const user_str = localStorage.getItem('usuario');
	// 	if(user_str){
	// 		return this.transformJson( user_str );
	// 		//return JSON.parse(user_str);
	// 	}
	// 	return null;
	// }

	// agregarUsuario(usuario:Usuario):Observable<AgregarUsuarioResponse>
	// {
	// 	console.log( "HEADERS",this.getSessionHeaders() );
	// 	return this.http.post<AgregarUsuarioResponse>(`${this.urlBase}/usuario.php`,{usuario},{ headers: this.getSessionHeaders(),withCredentials:true});
	// }




	registrarUsuarioPaciente(usuario,paciente):Observable<any>
	{
		if(paciente.fecha_nacimiento){
			paciente.fecha_nacimiento = paciente.fecha_nacimiento.substring(0,10);
		}
		return this.http.post<any>(`${this.urlBase}/usuario_paciente.php`,{usuario,paciente},{ headers: this.getSessionHeaders(),withCredentials:true});
	}


	isMobile():boolean
	{
		window.navigator.userAgent
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
	}

	showError(error:ErrorMensaje)
	{
		this.errorBehaviorSubject.next( error);
	}



	// getOrganizacionInfo():Promise<Organizacion>
	// {
	// 	return this.http.get<Organizacion>(`${this.urlBase}/Organizacion.php?domain=foo`)
    //     .pipe
	// 	(
	// 		map(response=>{
    //             localStorage.setItem("organizacion", JSON.stringify( response ) );
    //            return response;
	// 		})
	// 	).toPromise();
	// }
	getCompanyFromSession():Usuario
	{
		let organizacion = localStorage.getItem('usuario');
		if( organizacion )
			return JSON.parse( organizacion );

		return null;
	}

	downloadFile(path): Observable<any>{
		return this.http.get(`${this.urlBase}/files/${path}`,{headers:this.getSessionHeaders(),withCredentials:true});
  }

}
