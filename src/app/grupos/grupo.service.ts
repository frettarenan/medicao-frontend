import { Injectable } from '@angular/core';
import { MoneyHttp } from 'app/seguranca/money-http';
import { environment } from 'environments/environment';
import { Grupo } from 'app/core/model';

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

  adicionarGrupos(grupos: Array<Grupo>): Promise<any> {
    return this.http.post<any>(`${this.gruposUrl}/cadastro-rapido`, grupos).toPromise();
  }

  salvarOrdenacao(grupos: Array<Grupo>): Promise<any> {
    return this.http.post<any>(`${this.gruposUrl}/ordenar`, grupos).toPromise();
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.gruposUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  atualizar(grupo: Grupo): Promise<Grupo> {
    return this.http.put<Grupo>(`${this.gruposUrl}/${grupo.id}`, grupo)
      .toPromise();
  }

}