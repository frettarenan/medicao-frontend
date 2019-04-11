import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, MessageService } from 'primeng/api';
import { Grupo } from 'app/core/model';
import { GrupoService } from 'app/grupos/grupo.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-obra-dialog-edicao-grupo',
  templateUrl: './obra-dialog-edicao-grupo.component.html',
  styleUrls: ['./obra-dialog-edicao-grupo.component.scss']
})
export class ObraDialogEdicaoGrupoComponent implements OnInit {

  @ViewChild("nomeField") nomeField: ElementRef;

  grupo : Grupo;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private grupoService: GrupoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.nomeField.nativeElement.focus();
    this.grupo = this.config.data.grupo;
  }

  salvar() {
    if (this.grupo.nome.trim() != '') {
      this.grupoService.atualizar(this.grupo)
      .then(grupoSalvo => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.ref.close();
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
    }
  }

}