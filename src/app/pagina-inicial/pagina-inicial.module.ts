import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { PaginaInicialRoutingModule } from './pagina-inicial-routing.module';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';

@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    PaginaInicialRoutingModule
  ],
  declarations: [PaginaInicialComponent],
  providers: [ ]
})
export class PaginaInicialModule { }
