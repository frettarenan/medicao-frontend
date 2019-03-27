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
import {FieldsetModule} from 'primeng/fieldset';

import { SharedModule } from './../shared/shared.module';
import { ConstrutorasRoutingModule } from './construtoras-routing.module';
import { ConstrutorasPesquisaComponent } from './construtoras-pesquisa/construtoras-pesquisa.component';
import { ConstrutoraCadastroComponent } from './construtora-cadastro/construtora-cadastro.component';

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
    FieldsetModule,

    SharedModule,
    ConstrutorasRoutingModule
  ],
  declarations: [
    ConstrutoraCadastroComponent,
    ConstrutorasPesquisaComponent
  ],
  exports: []
})
export class ConstrutorasModule { }
