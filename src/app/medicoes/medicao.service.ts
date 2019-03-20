import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { Medicao } from 'app/core/model';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class MedicaoService {

  medicoesUrl: string;

  constructor(private http: MoneyHttp) {
    this.medicoesUrl = `${environment.apiUrl}/medicoes`;
  }

  listarMedicoesAtivasPorContrato(idContrato): Promise<Medicao[]> {
    const params = new HttpParams()
      .append('idContrato', idContrato);

    return this.http.get<Medicao[]>(`${this.medicoesUrl}/status/ativo`, {
      params
    }).toPromise();
  }

}
