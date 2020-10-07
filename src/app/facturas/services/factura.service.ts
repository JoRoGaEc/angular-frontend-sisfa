import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable}  from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

import {URL_BACKEND} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

/*HttpCliente para poder acceder al backend*/
/*Error que puede dar si la ruta no esta bien debido a el puerto o algo mas
blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.*/
private urlEndPoint: string  = URL_BACKEND+'/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id:number): Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }


  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }


  /*Primer paso crear metodo para poder hacer la consulta al backend*/
  filtrarProductos(term:string): Observable<Producto[]>{
     return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }


  create(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }


}
