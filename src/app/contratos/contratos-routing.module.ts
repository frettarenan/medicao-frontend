import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';
import { ContratosPesquisaComponent } from './contratos-pesquisa/contratos-pesquisa.component';
import { ContratoCadastroComponent } from './contrato-cadastro/contrato-cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: ContratosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_CONTRATO'] }
  },
  {
    path: 'novo',
    component: ContratoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CONTRATO'] }
  },
  {
    path: ':id',
    component: ContratoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CONTRATO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
