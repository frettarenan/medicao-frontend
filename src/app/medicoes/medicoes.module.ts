import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { SharedModule } from '../shared/shared.module';
import { MedicoesRoutingModule } from './medicoes-routing.module';
import { MedicaoCadastroComponent } from './medicao-cadastro/medicao-cadastro.component';
import { MedicoesPesquisaComponent } from './medicoes-pesquisa/medicoes-pesquisa.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),

    TextMaskModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    PanelModule,
    DialogModule,
    DropdownModule,

    SharedModule,
    MedicoesRoutingModule
  ],
  declarations: [
    MedicaoCadastroComponent,
    MedicoesPesquisaComponent
  ]
})
export class MedicoesModule { }
