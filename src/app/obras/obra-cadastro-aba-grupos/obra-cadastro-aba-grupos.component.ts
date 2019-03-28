import { Component, OnInit, Input } from '@angular/core';
import { Obra } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { GrupoService } from 'app/grupos/grupo.service';

@Component({
  selector: 'app-obra-cadastro-aba-grupos',
  templateUrl: './obra-cadastro-aba-grupos.component.html',
  styleUrls: ['./obra-cadastro-aba-grupos.component.scss']
})
export class ObraCadastroAbaGruposComponent implements OnInit {

  _obra : Obra;

  totalRegistros = 0;
  grupos: any[];

  constructor(
    private grupoService: GrupoService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
  }

  get obra(): Obra {
    return this._obra;
  }

  @Input()
  set obra(obra: Obra) {
    this._obra = obra;
    this.listarGruposPorObra();
  }

  listarGruposPorObra() {
    if (this._obra.id) {
      this.grupoService.listarTodosPorObra(this._obra.id)
        .then(resultado => {
          this.grupos = resultado;
        })
        .catch(erro => this.errorHandler.handle(erro));
    }
  }

}