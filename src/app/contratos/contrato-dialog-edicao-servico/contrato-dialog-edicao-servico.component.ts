import { Component, OnInit } from '@angular/core';
import { Servico } from 'app/core/model';
import { DynamicDialogRef, DynamicDialogConfig, MessageService } from 'primeng/api';
import { UnidadeMedidaService } from 'app/unidades-medidas/unidade-medida.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ServicoService } from 'app/servicos/servico.service';

@Component({
  selector: 'app-contrato-dialog-edicao-servico',
  templateUrl: './contrato-dialog-edicao-servico.component.html',
  styleUrls: ['./contrato-dialog-edicao-servico.component.scss']
})
export class ContratoDialogEdicaoServicoComponent implements OnInit {

  servico : Servico;

  unidadesMedidas: any[];
  idUnidadeMedidaSelecionada: number;

  constructor(
    private servicoService: ServicoService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private unidadeMedidaService: UnidadeMedidaService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.servico = this.config.data.servico;
    this.idUnidadeMedidaSelecionada = this.servico.unidadeMedida.id;
    this.carregarUnidadesMedidas();
  }

  carregarUnidadesMedidas() {
    this.unidadeMedidaService.listarUnidadesMedidasAtivas().then(lista => {
      this.unidadesMedidas = lista.map(unidadeMedida => ({ label: unidadeMedida.nome, value: unidadeMedida.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.servico.nome.trim() != '' && this.idUnidadeMedidaSelecionada) {
      this.servico.nome = this.servico.nome.trim();
      this.servico.unidadeMedida.id = this.idUnidadeMedidaSelecionada;
      this.servicoService.atualizar(this.servico)
      .then(servicoSalvo => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.ref.close();
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
    }
  }

}
