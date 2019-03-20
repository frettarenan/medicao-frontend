import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ServicoService {

  servicosUrl: string;

  constructor(private http: MoneyHttp) {
    this.servicosUrl = `${environment.apiUrl}/servicos`;
  }

  listarServicosPorMedicao(idMedicao: number): Promise<any> {
    let params = new HttpParams();
    params = params.append('idMedicao', idMedicao.toString());

    return this.http.get<any>(`${this.servicosUrl}`, { params })
      .toPromise()
      .then(response => {
        return response;
      })
  }

}