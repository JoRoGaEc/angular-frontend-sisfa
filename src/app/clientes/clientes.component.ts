import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  public urlBackend:string =  URL_BACKEND;
  clientes: Cliente[];
  public paginador: any; //Ojo ponerle publico si se va usar en el HTML porque si no, no lo reconocerá
  clienteSeleccionado: Cliente;

  constructor(private clienteService : ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    public authService: AuthService) { }
  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params =>{
         let page:number = +params.get('page');
         if(!page){
           page =0;
         }
         console.log('ID DEL PAGE ' + page);
         this.clienteService.getClientes(page).pipe(
           tap(response =>{ //En el tab no modificamos el tipo de dato
             console.log("clienteComponent:  tap 3");
             (response.content as Cliente[]).forEach(cliente =>{
               //console.log(cliente.nombre);
             })
           })

         ).subscribe( //funcion anonima
           response => {
             this.clientes = response.content as Cliente[]
             this.paginador =  response;

           });
      }

     );


     this.modalService.notificarUpload.subscribe( cliente  => {
       this.clientes =  this.clientes.map(clienteOriginal => {
         if(cliente.id == clienteOriginal.id){
           clienteOriginal.foto = cliente.foto;
         }
         return clienteOriginal;
       })
     })
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: `Estas seguro de eliminar al cliente ${cliente.nombre}?`,
      text: "No podrás revertir esto!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText:'Cancelar'
    }).then((result) => {
         console.log("Se eliminara el id: " + cliente.id)
         console.log("IS CONFIRMED " + result.isConfirmed + " RESULT VALUE : " + result.value)
          if (result.value) {
            console.log("Aqui se ha confirmado")
            this.clienteService.delete(cliente.id).subscribe(
              response => {
                this.clientes  = this.clientes.filter(cli => cli !== cliente)
              }
            )
            Swal.fire(
              'Eliminado!',
              `Se ha elimiinado el cliente  ${cliente.nombre} ${cliente.apellido}`,
              'success'
            )
          }
    })
  }//fin metodo

  abrirModal(cliente: Cliente): void{
    this.clienteSeleccionado =  cliente;
    this.modalService.abrirModal();
  }

}
