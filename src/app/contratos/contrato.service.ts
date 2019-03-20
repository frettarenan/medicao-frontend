import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { MoneyHttp } from 'app/seguranca/money-http';
import { HttpParams } from '@angular/common/http';
import { Contrato } from 'app/core/model';

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
  
}
