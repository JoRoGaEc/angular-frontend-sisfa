import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente'
import {ClienteService} from './cliente.service'
import {Router, ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2'
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public regiones: Region[];
  public cliente:Cliente =  new Cliente()
  public titulo:string ="Crear cliente"
  public errors: string [];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe( regiones => this.regiones = regiones );

  }

  cargarCliente(): void{
    //Vamos a suscribir un observador que estara observando cuando se recibe un id por parametro
    this.activatedRoute.params.subscribe(params =>{
       let id = params['id']
       if(id){
         this.clienteService.getCliente(id).subscribe( (cliente) =>this.cliente = cliente)
       }
      }
    )

  }

  create(): void{
    this.clienteService.create(this.cliente).subscribe(
        cliente => {
        this.router.navigate(['/clientes'])
        swal('Cliente guardado', `El cliente: ${cliente.nombre} ha sido creado con éxito.`, 'success')
      },
      err => {
        this.errors  =  err.error.errors as string[];
        console.error('Código de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );

  }

/*se da un problema de recursion si nosotros por ejemplo ya tenemos facturas asignadas a cun cliente y luego queremos acrualizar al cliente */
  update(): void{
    console.log(this.cliente);
    /*ya que al modificar el cliente no vamos a modificar sus facturas lo que haremos es poner sus facturas a null (las del cliente)*/
    this.cliente.facturas = null;
    /*Solo con eso basta, mas lo del backend en allowSetter*/
    this.clienteService.update(this.cliente).subscribe(
      json =>{
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `${json.mensaje}:  ${json.cliente.nombre} `)
      },
      err => {
        this.errors  =  err.error.errors as string[];
        console.error('Código de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1:Region, o2: Region): boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 === null || o2 === null  || o1 === undefined || o2 === undefined ?false:o1.id=== o2.id;
  }

}
