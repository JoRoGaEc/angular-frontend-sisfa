import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {

  listaCurso: string[]  = ['TypeScript', 'Javascript','C-Sharp', 'PHP'];
  habilitado:boolean = true;
  constructor() { }

  setHabilitar(): void{
    this.habilitado=  (this.habilitado==true)?false:true;
  }

}
