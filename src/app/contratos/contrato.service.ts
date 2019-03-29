import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { MoneyHttp } from 'app/seguranca/money-http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Contrato } from 'app/core/model';

export class ContratoFiltro {
  numero: string;
  descricao: string;
  idConstrutora : number;
  idObra : number;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class ContratoService {

  contratosUrl: string;

  constructor(private http: MoneyHttp) {
    this.contratosUrl = `${environment.apiUrl}/contratos`;
  }

  listarContratosAtivosPorObra(idObra): Promise<Contrato[]> {
    const params = new HttpParams()
      .append('idObra', idObra);

    return this.http.get<Contrato[]>(`${this.contratosUrl}/status/ativo`, {
      params
    }).toPromise();
  }

  pesquisar(filtro: ContratoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.numero) {
      params = params.append('numero', filtro.numero);
    }

    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }

    if (filtro.idConstrutora) {
      params = params.append('idConstrutora', filtro.idConstrutora.toString());
    }

    if (filtro.idObra) {
      params = params.append('idObra', filtro.idObra.toString());
    }

    return this.http.get<any>(`${this.contratosUrl}`, { params })
      .toPromise()
      .then(response => {
        const contratos = response.content;

        const resultado = {
          contratos,
          total: response.totalElements
        };

        return resultado;
      })
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.contratosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.contratosUrl}/${id}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  buscarPorId(id: number): Promise<Contrato> {
    return this.http.get<Contrato>(`${this.contratosUrl}/${id}`)
      .toPromise();
  }
  
}
