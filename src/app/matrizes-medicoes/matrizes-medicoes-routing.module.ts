import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';
import { MatrizMedicaoCadastroComponent } from './matriz-medicao-cadastro/matriz-medicao-cadastro.component';
import { MatrizesMedicoesPesquisaComponent } from './matrizes-medicoes-pesquisa/matrizes-medicoes-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: MatrizesMedicoesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_MATRIZ_MEDICAO'] }
  },
  {
    path: ':id',
    component: MatrizMedicaoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_MATRIZ_MEDICAO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MatrizesMedicoesRoutingModule { }
