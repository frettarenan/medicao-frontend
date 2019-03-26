import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';
import { ObrasPesquisaComponent } from './obras-pesquisa/obras-pesquisa.component';
import { ObraCadastroComponent } from './obra-cadastro/obra-cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: ObrasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_OBRA'] }
  },
  {
    path: 'novo',
    component: ObraCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_OBRA'] }
  },
  {
    path: ':id',
    component: ObraCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_OBRA'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ObrasRoutingModule { }
