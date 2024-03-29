import { Injectable } from '@angular/core';
import { Servico } from 'app/core/model';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';

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

  salvarOrdenacao(servicos: Array<Servico>): Promise<any> {
    return this.http.post<any>(`${this.servicosUrl}/ordenar`, servicos).toPromise();
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.servicosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  atualizar(servico: Servico): Promise<Servico> {
    return this.http.put<Servico>(`${this.servicosUrl}/${servico.id}`, servico)
      .toPromise();
  }

}