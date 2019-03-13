import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';
import { ConstrutoraCadastroComponent } from './construtora-cadastro/construtora-cadastro.component';
import { ConstrutorasPesquisaComponent } from './construtoras-pesquisa/construtoras-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: ConstrutorasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_CONSTRUTORA'] }
  },
  {
    path: 'novo',
    component: ConstrutoraCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CONSTRUTORA'] }
  },
  {
    path: ':codigo',
    component: ConstrutoraCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_CONSTRUTORA'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConstrutorasRoutingModule { }
