import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';
import { Servico } from 'app/core/model';

@Injectable()
export class ServicoService {

  servicosUrl: string;

  constructor(private http: MoneyHttp) {
    this.servicosUrl = `${environment.apiUrl}/servicos`;
  }

  listarServicosPorMedicao(idMedicao: number): Promise<any> {
    return this.http.get<any>(`${this.servicosUrl}/medicao/${idMedicao}`)
      .toPromise()
      .then(response => {
        return response;
      })
  }

  listarTodosPorContrato(idContrato: number): Promise<any> {
    return this.http.get<any>(`${this.servicosUrl}/contrato/${idContrato}`)
      .toPromise()
      .then(response => {
        return response;
      })
  }

  adicionarServicos(servicos: Array<Servico>): Promise<any> {
    return this.http.post<any>(`${this.servicosUrl}/cadastro-rapido`, servicos).toPromise();
  }

}