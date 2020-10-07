
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      /*AQUI LLEVAMOS A CABO NUESTRA TAREA*/
      let token  =  this.authService.token;
      if(token != null){
        const authReq = req.clone({ //Es inmutabkle por  es clonamos una nueva instancia del request
        headers: req.headers.set('Authorization','Bearer ' + token)
      });
       console.log('TokenInterceptor => Bearer ' + token);
       return next.handle(authReq); //Este lo que hace es ir al proximo interceptor, dentro del stack o conjunto de interceptores que tengamos
      }
       return next.handle(req);
  }
}
