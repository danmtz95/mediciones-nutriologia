import { Usuario,Paciente,Medicion, Sesion

} from './Modelos';



export interface Respuesta<T>{
	total:number;
	datos:T[];
}

export interface CsvArray{
	 [key: string]: any[];
}

/*
 * From perl operators except lk = LIKE
 * Several comparison operators impose string contexts upon their operands.
 * These are string equality (eq),
 * string inequality (ne),
 * greater than (gt),
 * less than (lt),
 * greater than or equal to (ge),
 * less than or equal to (le),
 */

export interface SearchObject<T>
{
	pagina?:number;
	limite?:number;

	eq?:T; //Equals to
	gt?:T; //Great than
	lt?:T; //Less than
	ge?:T; //Great or equal than
	le?:T; //less or equal than
	lk?:T; //like
	start?:T;
	csv?:CsvArray;
}

export interface ErrorMensaje{
	mensaje:string;
	tipo:string;
}


export interface LoginResponse{
	usuario:Usuario;
	sesion:Sesion;
};