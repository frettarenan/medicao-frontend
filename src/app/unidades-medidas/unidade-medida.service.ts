import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { UnidadeMedida } from 'app/core/model';

@Injectable()
export class UnidadeMedidaService {

  unidadesMedidasUrl: string;

  constructor(private http: MoneyHttp) {
    this.unidadesMedidasUrl = `${environment.apiUrl}/unidades-medidas`;
  }

  listarUnidadesMedidasAtivas(): Promise<UnidadeMedida[]> {
    return this.http.get<UnidadeMedida[]>(`${this.unidadesMedidasUrl}/status/ativo`).toPromise();
  }

}