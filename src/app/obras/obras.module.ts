import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObrasPesquisaComponent } from './obras-pesquisa/obras-pesquisa.component';
import { ObraCadastroComponent } from './obra-cadastro/obra-cadastro.component';
import { SharedModule } from 'app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ObrasRoutingModule } from './obras-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { ObraCadastroAbaObraComponent } from './obra-cadastro-aba-obra/obra-cadastro-aba-obra.component';
import { ObraCadastroAbaGruposComponent } from './obra-cadastro-aba-grupos/obra-cadastro-aba-grupos.component';

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
    ObrasRoutingModule
  ],
  declarations: [
    ObrasPesquisaComponent,
    ObraCadastroComponent,
    ObraCadastroAbaObraComponent,
    ObraCadastroAbaGruposComponent
  ],
  exports: []
})
export class ObrasModule { }
