import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';  //formatDate, DatePipe,
//import { CLIENTES } from  './clientes.json';
import { Cliente } from './Cliente';
import {Observable, of, throwError} from 'rxjs';
/*Por lo de la API esto que viene a continuacion*/
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map, catchError , tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

import {URL_BACKEND} from '../config/config';

/*@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class ClienteService {
  private urlEndPoint:string = URL_BACKEND +'/api/clientes';
  /*Los headers son inmutables*/
  /*Podemos quitar esto porque ahora por defecto se va enciar en este content type, gracias al interceptor*/
  //  private httpHeaders =  new HttpHeaders({'Content-Type': 'application/json'})


  constructor(private http: HttpClient, private router: Router) {

  }

    /**Ejemplo  de como pasabamos las cabeceras anteriormente*/
  /*Para manejar lo relacionado con las peticiones enviando el token*/
    /*private agregarAuthorizationHeader(){
      let token = this.authService.token;
      if(token != null){
        return this.httpHeaders.append('Authorization','Bearer ' + token);
      }
      return this.httpHeaders;
    }
  getRegiones(): Observable<Region[]>{
      return this.http.get<Region[]>(this.urlEndPoint + '/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
        catchError(e =>{
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
    }*/


  /*Esta parte se va pasar a un interceptor que maneje los errores*/
/*  private isNoAutorizado(e): boolean{
      if(e.status == 401){ //
        if(this.authService.isAuthenticated()){ //Esto para cuando eel token expira lo manejamos por el lado de angular
          this.authService.logout();
        }
        this.router.navigate(['/login'])
        return true;
      }
      if(e.status == 403){ //Forbiden Acceso restringido a ese recurso
        swal('Acceso denegado', `Hola ${this.authService.usuario.username}, no tienes permisos suficientes` ,'warning');
        this.router.navigate(['/clientes'])
        return true;
      }
      return false;
      getRegiones(): Observable<Region[]>{
        return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
          catchError(e =>{
            this.isNoAutorizado(e);
            return throwError(e);
          })
        );
      }
  }*/
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }


  getClientes(page:  number): Observable<any> {
      return this.http.get(this.urlEndPoint + '/page/' +page).pipe(
        map(( response: any)=> {
          ((response.content as Cliente[])).map( cliente => {
            cliente.nombre =  cliente.nombre.toUpperCase();
            let datePipe  = new DatePipe('es-SV')
            return cliente;
          });
          return response;
        }),
        tap(response =>{ //En el tab no modificamos el tipo de dato
          console.log("clienteService:  tap 2");
          (response.content as Cliente[]).forEach(cliente =>{
            //console.log(cliente.nombre);
          })
        })
      );
  }

  create(cliente: Cliente ): Observable<Cliente>{
      return this.http.post(this.urlEndPoint, cliente).pipe(
          map( (response: any) => response.cliente as Cliente),
          catchError(e => {
            if(e.status == 400){ /*Errores de la validacion del formulario, status 404*/
              return throwError(e);
            }
            if(e.error.mensaje){
              console.error(e.error.mensaje);
            }
          //  swal(e.error.mensaje, e.error.error, 'error');
            return throwError(e); /*Esto es lo que hace es retornar un observable entonces esta funcion nos pemite convertirlo*/
          })
      );
  }

  update(cliente:Cliente): Observable<any>{
      //segundo argumento el cliente que vamos a modificar
      return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
        catchError( e =>{
          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
    }

  getCliente(id): Observable<any>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e =>{
          if(e.status != 401 && e.error.mensaje){
            this.router.navigate(['/clientes']);
            console.error(e.error.mensaje);
          }

          //redirijir en caso de error
          return throwError(e);
        })
    );
  }

  delete(id:number): Observable<Cliente>{
    console.log("Se eliminara el cliente con id : " + id)
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData =  new FormData();
    formData.append("archivo", archivo); //mismo nombrw  que en wl backend
    formData.append("id",id);

  /*  let httpHeaders =  new HttpHeaders();
    let token = this.authService.token;
    if(token !=  null){
        httpHeaders =   httpHeaders.append('Authorization', 'Bearer ' + token);
    }*/

    const req =  new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      //headers: httpHeaders
    });


    return this.http.request(req);
    }

}
