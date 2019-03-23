import { Injectable } from '@angular/core';
import { Lancamento } from 'app/core/model';
import { environment } from 'environments/environment';
import { MoneyHttp } from 'app/seguranca/money-http';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LancamentoService {

  lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  listarLancamentosPorMedicao(idMedicao: number): Promise<any> {
    let params = new HttpParams();
    params = params.append('idMedicao', idMedicao.toString());

    return this.http.get<any>(`${this.lancamentosUrl}`, { params })
      .toPromise()
      .then(response => {
        return response;
      })
  }

  salvar(lancamentos: any): Promise<any> {
    return this.http.post<any>(this.lancamentosUrl, lancamentos).toPromise();
  }

}
