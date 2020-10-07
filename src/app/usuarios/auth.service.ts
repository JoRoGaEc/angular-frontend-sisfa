import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario : Usuario;
  private _token : string;

  constructor(private  http: HttpClient) { }
  public get usuario(): Usuario{
    if(this._usuario  != null){
      return this._usuario;
    }else if(this._usuario  == null && sessionStorage.getItem('usuario') != null){
       this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
       return this._usuario;
    } /*SI NO SE DA NINGUNO DE LOS CASOS ANTERIORES RETORNAMOS EL USUARIO VACIO*/
    return new Usuario;
  }
  public get token(): string{
    if(this._token  != null){
      return this._token;
    }else if(this._token  == null && sessionStorage.getItem('token') != null){
       this._token = sessionStorage.getItem('token');
       return this._token;
    } /*SI NO SE DA NINGUNO DE LOS CASOS ANTERIORES RETORNAMOS EL USUARIO VACIO*/
    return null;
  }


  login(usuario: Usuario):Observable<any>{
    const urlEndPoint = URL_BACKEND +'/oauth/token';
    const credenciales = btoa('angularapp'+ ':'+'12345'); //pasarlo a base 64
    const httpHeaders =  new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
                          'Authorization':'Basic '+ credenciales});
    let params =  new URLSearchParams();
    params.set('grant_type', 'password'); /*OJO AQUI SI USAMOS Guion medio puede dar error 400*/
    params.set('username',usuario.username);
    params.set('password', usuario.password);
    //console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), {headers:httpHeaders});
  }

  guardarUsuario(accessToken: String): void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario =  new Usuario();
    this._usuario.nombre =  payload.nombre;
    this._usuario.apellido =  payload.apellido;
    this._usuario.email =  payload.email;
    this._usuario.username =  payload.user_name; //Estos son los roles asi les pone oauth2
    this._usuario.roles =  payload.authorities;

    /*vamos a usar una variable global que nos deja almacenar informacion en la session del navegador
    parte de la api  HTML5*/
    /*Stringify tranforma un Objeto JSON en texto plano, parse es al reves*/
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: String): any{
    if(accessToken != null){
        return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean{
    let payload =  this.obtenerDatosToken(this.token); //desde el metodo getter
    if(payload != null && payload.user_name && payload.user_name.length  > 0){
      return true;
    }
    return false;
  }

  hasRole(role:string): boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }


  logout(): void{
    this._token = null;
    this._usuario =  null;
    sessionStorage.clear();

    //sessionStorage.removeItem('token');
  }
}