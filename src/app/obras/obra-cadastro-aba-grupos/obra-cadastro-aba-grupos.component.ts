import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Obra, Grupo } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { GrupoService } from 'app/grupos/grupo.service';
import { MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { TipoGrupoEnum } from 'app/core/enum';
import { Util } from 'app/core/util';
import { ObraDialogEdicaoGrupoComponent } from '../obra-dialog-edicao-grupo/obra-dialog-edicao-grupo.component';

@Component({
  selector: 'app-obra-cadastro-aba-grupos',
  templateUrl: './obra-cadastro-aba-grupos.component.html',
  styleUrls: ['./obra-cadastro-aba-grupos.component.scss'],
  providers: [DialogService]
})
export class ObraCadastroAbaGruposComponent implements OnInit {

  changeArrayOrder = Util.changeArrayOrder;
  moveArrayIndex = Util.moveArrayIndex;

  @ViewChild("nomesField") nomesField: ElementRef;

  _obra : Obra;

  grupos: any[];

  constructor(
    private grupoService: GrupoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private dialogService: DialogService
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
  
  salvarGrupos() {
    let gruposCadastro: Array<Grupo> = new Array<Grupo>();
    
    let linhas = this.nomesField.nativeElement.value.split('\n');
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
        this.nomesField.nativeElement.value = "";
        this.listarGruposPorObra();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  isGrupoSistema(grupo): Boolean {
    return grupo.tipoGrupo.id == TipoGrupoEnum.TOTAL || grupo.tipoGrupo.id == TipoGrupoEnum.SUBTOTAL;
  }

  salvarOrdenacao() {
    this.grupoService.salvarOrdenacao(this.grupos)
      .then(gruposSalvos => {
        this.messageService.add({ severity: 'success', detail: 'Ordenação salva com sucesso!' });
        this.listarGruposPorObra();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(grupo: Grupo) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(grupo);
      }
    });
  }

  excluir(grupo: Grupo) {
    this.grupoService.excluir(grupo.id)
      .then(() => {
        this.listarGruposPorObra();
        this.messageService.add({ severity: 'success', detail: 'Registro excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  editar(grupo: Grupo) {
    this.dialogService.open(ObraDialogEdicaoGrupoComponent, {
      data: {
          grupo: grupo
      },
      header: 'Edição de Grupo',
      width: '60%'
    });
  }

}