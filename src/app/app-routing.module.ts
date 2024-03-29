import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const routes: Routes = [
  { path: 'pagina-inicial', loadChildren: 'app/pagina-inicial/pagina-inicial.module#PaginaInicialModule'},
  { path: 'construtoras', loadChildren: 'app/construtoras/construtoras.module#ConstrutorasModule' },
  { path: 'usuarios', loadChildren: 'app/usuarios/usuarios.module#UsuariosModule' },
  { path: 'obras', loadChildren: 'app/obras/obras.module#ObrasModule' },
  { path: 'contratos', loadChildren: 'app/contratos/contratos.module#ContratosModule' },
  { path: 'medicoes', loadChildren: 'app/medicoes/medicoes.module#MedicoesModule' },
  
  { path: '', redirectTo: 'pagina-inicial', pathMatch: 'full' },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
