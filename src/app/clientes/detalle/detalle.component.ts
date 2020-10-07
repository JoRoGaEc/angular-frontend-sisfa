import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from '../../facturas/models/factura';
import {FacturaService}  from '../../facturas/services/factura.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente; /*Este sera un componente Hijo el cual sera Seteado desde el componente padre clientes.component
  a traves de la notacion corchetes [atr_comp_hijo] = dato_del_padre*/
  public titulo:string;
  public fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(private clienteService: ClienteService,
              public modalService: ModalService,
              public  authService:AuthService,
              private facturaService: FacturaService) { }

  ngOnInit(): void {
    }

    seleccionarFoto(event){
      this.fotoSeleccionada = event.target.files[0];
      this.progreso = 0;
      console.log(this.fotoSeleccionada);
      if(this.fotoSeleccionada.type.indexOf('image') < 0){
        Swal('Error seleccionar imagen: ','El archivo debe ser del tipo imagen','error');
        this.fotoSeleccionada =  null;
      }
    }

    subirFoto():void{
      if(!this.fotoSeleccionada){
        Swal('Error Upload: ','Debe seleccionar una foto','error');
      }else{
        this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe( event =>{
         if(event.type === HttpEventType.UploadProgress){
           console.log('Progeso :'  + this.progreso);
           this.progreso = Math.round((event.loaded/event.total)*100);
         }else if(event.type === HttpEventType.Response){
           let  response: any  =  event.body;
           this.cliente = response.cliente as Cliente;

           //PASO 1. emitir utilizando emit
           this.modalService.notificarUpload.emit(this.cliente);

           Swal('La foto se ha subido completamente', response.mensaje, 'success');
         }
        });
      }
    }

    cerrarModal(){
      this.modalService.cerrarModal();
      this.fotoSeleccionada = null;
      this.progreso =  0;
    }

    delete(factura: Factura): void{
      Swal.fire({
        title: `Estas seguro de eliminar la factura ${factura.descripcion}?`,
        text: "No podrás revertir esto!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminarlo!',
        cancelButtonText:'Cancelar'
      }).then((result) => {
           console.log("Se eliminara el id: " + factura.descripcion)
           console.log("IS CONFIRMED " + result.isConfirmed + " RESULT VALUE : " + result.value)
            if (result.value) {
              console.log("Aqui se ha confirmado")
              this.facturaService.delete(factura.id).subscribe(
                response => {
                  this.cliente.facturas  = this.cliente.facturas.filter(f => f !== factura)
                }
              )
              Swal.fire(
                'Eliminado!',
                `Se ha eliminado la factura ${factura.descripcion}`,
                'success'
              )
            }
      })
    }



}
