import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Obra } from 'app/core/model';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from './../../environments/environment';

export class ObraFiltro {
  nome: string;
  idConstrutora : number;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class ObraService {

  obrasUrl: string;

  constructor(private http: MoneyHttp) {
    this.obrasUrl = `${environment.apiUrl}/obras`;
  }

  listarTodasPorConstrutora(idConstrutora): Promise<Obra[]> {
    const params = new HttpParams()
      .append('idConstrutora', idConstrutora);

    return this.http.get<Obra[]>(`${this.obrasUrl}/status/ativo`, {
      params
    }).toPromise();
  }

  listarObrasAtivasPorConstrutora(idConstrutora): Promise<Obra[]> {
    const params = new HttpParams()
      .append('idConstrutora', idConstrutora);

    return this.http.get<Obra[]>(`${this.obrasUrl}/status/ativo`, {
      params
    }).toPromise();
  }

  pesquisar(filtro: ObraFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.idConstrutora) {
      params = params.append('idConstrutora', filtro.idConstrutora.toString());
    }

    return this.http.get<any>(`${this.obrasUrl}`, { params })
      .toPromise()
      .then(response => {
        const obras = response.content;

        const resultado = {
          obras,
          total: response.totalElements
        };

        return resultado;
      })
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.obrasUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.obrasUrl}/${id}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(obra: Obra): Promise<Obra> {
    return this.http.post<Obra>(this.obrasUrl, obra)
      .toPromise();
  }

  atualizar(obra: Obra): Promise<Obra> {
    return this.http.put<Obra>(`${this.obrasUrl}/${obra.id}`, obra)
      .toPromise();
  }

  buscarPorId(id: number): Promise<Obra> {
    return this.http.get<Obra>(`${this.obrasUrl}/${id}`)
      .toPromise();
  }

}