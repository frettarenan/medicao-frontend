import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { Medicao } from 'app/core/model';
import { HttpParams } from '@angular/common/http';

export class MedicaoFiltro {
  idMedicao: Number;
}

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

  buscarPorId(id: number): Promise<Medicao> {
    return this.http.get<Medicao>(`${this.medicoesUrl}/${id}`)
      .toPromise();
  }

  renomear(medicao: Medicao): Promise<Medicao> {
    return this.http.put<Medicao>(`${this.medicoesUrl}/${medicao.id}`, medicao.nome)
      .toPromise();
  }

  salvarComo(medicao: Medicao, novoNome: string): Promise<Medicao> {
    return this.http.post<Medicao>(`${this.medicoesUrl}/${medicao.id}`, novoNome)
      .toPromise();
  }

  adicionar(medicao: Medicao): Promise<Medicao> {
    return this.http.post<Medicao>(this.medicoesUrl, medicao)
      .toPromise();
  }

  relatorioMedicao(idMedicao: number) {
    return this.http.get(`${this.medicoesUrl}/${idMedicao}/relatorio`,
      { responseType: 'blob' })
      .toPromise();
  }

}
