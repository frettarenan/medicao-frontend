import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GrowlModule } from 'primeng/growl';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ConstrutoraService } from './../construtoras/construtora.service';
import { UsuarioService } from './../usuarios/usuario.service';
import { ObraService } from './../obras/obra.service';
import { ContratoService } from './../contratos/contrato.service';
import { GrupoService } from './../grupos/grupo.service';
import { ServicoService } from './../servicos/servico.service';
import { MedicaoService } from './../medicoes/medicao.service';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { MatrizMedicaoService } from './../matrizes-medicoes/matriz-medicao.service';
import { PaginaInicialService } from './../pagina-inicial/pagina-inicial.service';

import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { MoneyHttp } from '../seguranca/money-http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UnidadeMedidaService } from 'app/unidades-medidas/unidade-medida.service';

registerLocaleData(localePt);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MDBBootstrapModule.forRoot(),
    GrowlModule,
    ConfirmDialogModule,
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  exports: [
    NavbarComponent,
    GrowlModule,
    ConfirmDialogModule
  ],
  providers: [
    ConstrutoraService,
    UsuarioService,
    ObraService,
    ContratoService,
    MedicaoService,
    GrupoService,
    ServicoService,
    UnidadeMedidaService,
    LancamentoService,
    MatrizMedicaoService,
    PaginaInicialService,
    ErrorHandlerService,
    AuthService,
    MoneyHttp,

    ConfirmationService,
    MessageService,
    JwtHelperService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
})
export class CoreModule { }
