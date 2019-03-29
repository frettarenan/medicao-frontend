import { Component, OnInit, Input } from '@angular/core';
import { Obra, Grupo } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TipoGrupoEnum } from 'app/core/enum';

@Component({
  selector: 'app-obra-cadastro-aba-grupos',
  templateUrl: './obra-cadastro-aba-grupos.component.html',
  styleUrls: ['./obra-cadastro-aba-grupos.component.scss']
})
export class ObraCadastroAbaGruposComponent implements OnInit {

  _obra : Obra;

  grupos: any[];

  constructor(
    private grupoService: GrupoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService
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
    if (this.obra.id) {
      this.grupoService.listarTodosPorObra(this.obra.id)
        .then(resultado => {
          this.grupos = resultado;
        })
        .catch(erro => this.errorHandler.handle(erro));
    }
  }
  
  salvarGrupos(nomes: FormControl) {
    let gruposCadastro: Array<Grupo> = new Array<Grupo>();
    
    let linhas = nomes.value.split('\n');
    let linha: string;
    
    for(var i = 0;i < linhas.length;i++){
      linha = linhas[i].trim();
      if (linha.length > 0) {
        let grupo: Grupo = new Grupo();
        grupo.nome = linha;
        grupo.obra = this.obra;
        grupo.tipoGrupo = null;
        gruposCadastro.push(grupo);
      }
    }
    this.adicionarGrupos(gruposCadastro);
  }

  adicionarGrupos(grupos: Array<Grupo>) {
    this.grupoService.adicionarGrupos(grupos)
      .then(gruposAdicionados => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.listarGruposPorObra();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  isGrupoSistema(grupo): Boolean {
    return grupo.tipoGrupo.id == TipoGrupoEnum.TOTAL || grupo.tipoGrupo.id == TipoGrupoEnum.SUBTOTAL;
  }

}