import {Component} from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import {Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'

})
export class HeaderComponent{
  title:string  = 'App Ajs-Spring';

  constructor(public authService: AuthService,
              private router: Router){
  }

  logout(): void{
    let username = this.authService.usuario.username;
    Swal('Sign out' ,`${username} ha cerrado sesión correctamente` , 'success');
    this.authService.logout();
    this.router.navigate(['/login']);

  }

}
