import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoCadastroComponent } from './contrato-cadastro/contrato-cadastro.component';
import { ContratosPesquisaComponent } from './contratos-pesquisa/contratos-pesquisa.component';
import { SharedModule } from 'app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ContratosRoutingModule } from './contratos-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import { ContratoCadastroAbaContratoComponent } from './contrato-cadastro-aba-contrato/contrato-cadastro-aba-contrato.component';
import { ContratoCadastroAbaServicosComponent } from './contrato-cadastro-aba-servicos/contrato-cadastro-aba-servicos.component';

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
    TabViewModule,

    SharedModule,
    ContratosRoutingModule
  ],
  declarations: [
    ContratoCadastroComponent,
    ContratosPesquisaComponent,
    ContratoCadastroAbaContratoComponent,
    ContratoCadastroAbaServicosComponent
  ],
  exports: []
})
export class ContratosModule { }
