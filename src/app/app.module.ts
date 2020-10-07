import { BrowserModule } from '@angular/platform-browser';
import { NgModule , LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
// SERVICIOS
import { ClienteService } from './clientes/cliente.service';
//Para el Ruteo
import { RouterModule , Routes } from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormComponent } from './clientes/form.component';

/*Este es para el buscador*/
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';

import localeES from '@angular/common/locales/es-SV';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import {TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import {ErrorInterceptor } from './usuarios/interceptors/Error.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

/*Esto es para el buscador*/
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

registerLocaleData(localeES, 'es-SV')

const routes: Routes = [ //Aca definimos cada ruta de cada componente de nuestra aplicacion
  {path:'', redirectTo:'/clientes', pathMatch:'full'}, //Este sería nuestro Home, full porque debe coicidir completamente
  {path:'directivas', component:DirectivaComponent},
  {path:'clientes', component:ClientesComponent},  //ClientesComponen esta mapeado a la ruta clientes
  {path: 'clientes/form', component: FormComponent , canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'login', component: LoginComponent},
  {path:'facturas/:id', component: DetalleFacturaComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_USER'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent ,canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}}
];//Luego registrarlo el RouteModule, en el import

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDatepickerModule,
    ReactiveFormsModule, MatAutocompleteModule,MatInputModule, MatFormFieldModule
  ],
  providers: [
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es-SV' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
