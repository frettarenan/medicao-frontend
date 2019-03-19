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

import { SharedModule } from './../shared/shared.module';
import { MatrizesMedicoesRoutingModule } from './matrizes-medicoes-routing.module';
import { MatrizMedicaoCadastroComponent } from './matriz-medicao-cadastro/matriz-medicao-cadastro.component';
import { MatrizesMedicoesPesquisaComponent } from './matrizes-medicoes-pesquisa/matrizes-medicoes-pesquisa.component';

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
    MatrizesMedicoesRoutingModule
  ],
  declarations: [
    MatrizMedicaoCadastroComponent,
     MatrizesMedicoesPesquisaComponent
  ]
})
export class MatrizesMedicoesModule { }
