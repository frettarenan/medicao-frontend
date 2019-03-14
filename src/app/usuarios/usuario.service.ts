import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Usuario } from './../core/model';
import { MoneyHttp } from '../seguranca/money-http';

export class UsuarioFiltro {
  nome: string;
  email: string;
  idConstrutora : number;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class UsuarioService {

  usuariosUrl: string;

  constructor(private http: MoneyHttp) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
  }

  pesquisar(filtro: UsuarioFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.email) {
      params = params.append('email', filtro.email);
    }

    if (filtro.idConstrutora) {
      params = params.append('idConstrutora', filtro.idConstrutora.toString());
    }

    return this.http.get<any>(`${this.usuariosUrl}`, { params })
      .toPromise()
      .then(response => {
        const usuarios = response.content;

        const resultado = {
          usuarios,
          total: response.totalElements
        };

        return resultado;
      })
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(this.usuariosUrl)
      .toPromise()
      .then(response => response.content);
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.usuariosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.usuariosUrl}/${id}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(usuario: Usuario): Promise<Usuario> {
    return this.http.post<Usuario>(this.usuariosUrl, usuario)
      .toPromise();
  }

  atualizar(usuario: Usuario): Promise<Usuario> {
    return this.http.put<Usuario>(`${this.usuariosUrl}/${usuario.id}`, usuario)
      .toPromise();
  }

  buscarPorId(id: number): Promise<Usuario> {
    return this.http.get<Usuario>(`${this.usuariosUrl}/${id}`)
      .toPromise();
  }

}
