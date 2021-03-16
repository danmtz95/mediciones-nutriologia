
export interface Usuario{
	id?:number;
    usuario?:string;
    contrasena?:string;
	nombre?:string;
	tipo?:string;
	apellido?:string;
	fecha_creacion?:Date;
	fecha_actualizacion?:Date;
}

export interface Paciente{
	id?:number;
	nombre?:string;
    apellido?:string;
    correo_electronico?:string;
    telefono?:number;
	fecha_creacion?:Date;
	fecha_actualizacion?:Date;
}

export interface Medicion{
    id?:number;
    id_paciente?:number;
	peso?:string;
    cintura?:string;
    abdomen?:string;
    cadera?:string;
    antebrazo?:string;
    fecha?:Date;
    nota?:string;
	fecha_creacion?:Date;
	fecha_actualizacion?:Date;
}


export interface Imagen{
	id?:number;
	uploader_user_id?:number;
	es_privada?:number;
	filename?:string;
	original_filename?:string;
	content_type?:string;
	size?:number;
	width?:number;
	height?:number;
	tiempo_creacion?:Date;
	tiempo_actualizacion?:Date;

}


export interface Sesion{
	id?:string;
	id_usuario?:number;
	estatus?:string;
	tiempo_creacion?:Date;
	tiempo_actualizacion?:Date;

}