import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService,
              private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.isAuthenticated()){
      /*Con esta opcion no es necesario ir al backend para saber si ha expirado el token*/
      if(this.isTokenExpirado()){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;

    }
    this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado(): boolean{
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now  = new Date().getTime()/1000; //fecha actual en segundos
    if(payload.exp < now ){
      return true; //expiró
    }
    return false;

  }

}
