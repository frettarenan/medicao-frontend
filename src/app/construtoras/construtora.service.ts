import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Construtora } from './../core/model';
import { MoneyHttp } from '../seguranca/money-http';

export class ConstrutoraFiltro {
  razaoSocial: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class ConstrutoraService {

  construtorasUrl: string;

  constructor(private http: MoneyHttp) {
    this.construtorasUrl = `${environment.apiUrl}/construtoras`;
  }

  pesquisar(filtro: ConstrutoraFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.razaoSocial) {
      params = params.append('razaoSocial', filtro.razaoSocial);
    }

    return this.http.get<any>(`${this.construtorasUrl}`, { params })
      .toPromise()
      .then(response => {
        const construtoras = response.content;

        const resultado = {
          construtoras,
          total: response.totalElements
        };

        return resultado;
      })
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(this.construtorasUrl)
      .toPromise()
      .then(response => response.content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.construtorasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.construtorasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(construtora: Construtora): Promise<Construtora> {
    return this.http.post<Construtora>(this.construtorasUrl, construtora)
      .toPromise();
  }

  atualizar(construtora: Construtora): Promise<Construtora> {
    return this.http.put<Construtora>(`${this.construtorasUrl}/${construtora.codigo}`, construtora)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Construtora> {
    return this.http.get<Construtora>(`${this.construtorasUrl}/${codigo}`)
      .toPromise();
  }

}
