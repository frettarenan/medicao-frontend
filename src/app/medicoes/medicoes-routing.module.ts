import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';
import { MedicaoCadastroComponent } from './medicao-cadastro/medicao-cadastro.component';
import { MedicoesPesquisaComponent } from './medicoes-pesquisa/medicoes-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: MedicoesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_MEDICAO'] }
  },
  {
    path: ':id',
    component: MedicaoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MEDICAO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MedicoesRoutingModule { }
