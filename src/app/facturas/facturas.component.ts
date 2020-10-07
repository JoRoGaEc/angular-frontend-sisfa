import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import {FormControl} from '@angular/forms';
import { ClienteService}  from '../clientes/cliente.service';
import { ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import swal  from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit{

  public titulo:string = 'Nueva Factura';
  factura : Factura =  new Factura();

  /*Relacionado el buscador*/
  autoCompleteControl= new FormControl();
//  productos: string[] = ['Tortillas', 'Queso fresco', 'Baterias'];
  productosFiltrados: Observable<Producto[]>; /*En la vista vamos a utilizar un pipe asyc debido a este observable*/

  constructor(private clienteService:ClienteService,
              private activatedRouter: ActivatedRoute,
              private facturaService: FacturaService,
              private router: Router) { }


  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe( params =>{
        let clienteId =  +params.get('clienteId');
        this.clienteService.getCliente(clienteId).subscribe( cliente =>{
          this.factura.cliente = cliente;
        });
    });


    /*buscador*/
    console.log('Dentro del OnInit');
    this.productosFiltrados= this.autoCompleteControl.valueChanges /*Value changes retorna un observable con los elementos que se estan
      emitiendo, ese valor es el value*/
      .pipe(
        //startWith(''),
        //map(value => this._filter(value))
        map(value => typeof value==='string' ? value: value.nombre),
        flatMap(value => value ? this._filter(value):[]) /*Esto por si viene vacio*/
      );
  }
/*  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(producto => producto.toLowerCase().includes(filterValue));
  }*/

  private  _filter(value:string): Observable<Producto[]>{
    console.log('Dentro del filter');
    const filterValue =  value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }


  mostrarNombre(producto?: Producto): string |undefined{
     return producto? producto.nombre : undefined;
  }


  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
      let producto = event.option.value as Producto;
      console.log(producto);

      if(this.existeItem(producto.id)){
        this.incrementarCantidad(producto.id);
      }else{
        let nuevoItem =  new ItemFactura();
        nuevoItem.producto =  producto;
        this.factura.items.push(nuevoItem);

        this.autoCompleteControl.setValue(''); //Esto es donde escribimos lo vamos a resetear
        event.option.focus(); //para resetear el elemento en la vista
        event.option.deselect();
      }

    }


    actualizarCantidad(id: number ,event :any):void{
      let cantidad =  event.target.value as number;

      if(cantidad == 0 ){
        return this.eliminarItemFactura(id);
      }

      this.factura.items = this.factura.items.map( (item:ItemFactura) =>{
        if(id === item.producto.id){
           item.cantidad  = cantidad;
        }
        return  item;
      });
    }

    existeItem(id:number):boolean{
      let existe = false;
      this.factura.items.forEach((item :ItemFactura) =>{
        if(id === item.producto.id){
          existe = true;
        }
      });
       return existe;
    }

    incrementarCantidad(id: number): void{
      this.factura.items = this.factura.items.map( (item:ItemFactura) =>{
        if(id === item.producto.id){
           ++item.cantidad;
        }
        return  item;
      });
    }

    eliminarItemFactura(id:number): void{
      this.factura.items = this.factura.items.filter((item:ItemFactura) => id !== item.producto.id);
    }


    create(facturaForm): void{

      if(this.factura.items.length  == 0 ){
        this.autoCompleteControl.setErrors({'invalid':true});
      }
      if(facturaForm.form.valid && this.factura.items.length > 0){

      this.facturaService.create(this.factura).subscribe(factura =>{
        swal(this.titulo, `Factura ${factura.descripcion}, creada con éxito`);
        this.router.navigate(['/facturas', factura.id]);
      });
      }
    }
}
