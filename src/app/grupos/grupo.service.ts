import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class GrupoService {

  gruposUrl: string;

  constructor(private http: MoneyHttp) {
    this.gruposUrl = `${environment.apiUrl}/grupos`;
  }

  listarGruposPorMedicao(idMedicao: number): Promise<any> {
    let params = new HttpParams();
    params = params.append('idMedicao', idMedicao.toString());

    return this.http.get<any>(`${this.gruposUrl}`, { params })
      .toPromise()
      .then(response => {
        return response;
      })
  }

}