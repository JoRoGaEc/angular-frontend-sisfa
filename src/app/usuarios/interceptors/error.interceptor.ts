
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable , throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService, private router: Router){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      /*AQUI LLEVAMOS A CABO NUESTRA TAREA*/
       return next.handle(req).pipe(
          catchError( e => {
            if(e.status == 401){ /**NO AUTENTICADO*/
              if(this.authService.isAuthenticated()){ /*Esto para cuando eel token expira lo manejamos por el lado de angular*/
                this.authService.logout();
              }
              this.router.navigate(['/login'])
            }
            if(e.status == 403){ /*Forbiden Acceso restringido a ese recurso*/
              swal('Acceso denegado', `Hola ${this.authService.usuario.username}, no tienes permisos suficientes` ,'warning');
              this.router.navigate(['/clientes'])
            }
            return throwError(e);
          })
       );
  }
}
