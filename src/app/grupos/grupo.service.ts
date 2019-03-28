import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';

@Injectable()
export class GrupoService {

  gruposUrl: string;

  constructor(private http: MoneyHttp) {
    this.gruposUrl = `${environment.apiUrl}/grupos`;
  }

  listarGruposPorMedicao(idMedicao: number): Promise<any> {
    return this.http.get<any>(`${this.gruposUrl}/medicao/${idMedicao}`)
      .toPromise()
      .then(response => {
        return response;
      })
  }

  listarTodosPorObra(idObra: number): Promise<any> {
    return this.http.get<any>(`${this.gruposUrl}/obra/${idObra}`)
      .toPromise()
      .then(response => {
        return response;
      })
  }

}