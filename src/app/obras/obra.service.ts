import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Obra } from 'app/core/model';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from './../../environments/environment';

@Injectable()
export class ObraService {

  obrasUrl: string;

  constructor(private http: MoneyHttp) {
    this.obrasUrl = `${environment.apiUrl}/obras`;
  }

  listarObrasAtivasPorConstrutora(idConstrutora): Promise<Obra[]> {
    const params = new HttpParams()
      .append('idConstrutora', idConstrutora);

    return this.http.get<Obra[]>(`${this.obrasUrl}/status/ativo`, {
      params
    }).toPromise();
  }

}
