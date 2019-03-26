import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObrasPesquisaComponent } from './obras-pesquisa/obras-pesquisa.component';
import { ObraCadastroComponent } from './obra-cadastro/obra-cadastro.component';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'angular-bootstrap-md';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ObrasRoutingModule } from './obras-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    PanelModule,
    DialogModule,
    DropdownModule,

    SharedModule,
    ObrasRoutingModule
  ],
  declarations: [
    ObrasPesquisaComponent,
    ObraCadastroComponent
  ],
  exports: []
})
export class ObrasModule { }
