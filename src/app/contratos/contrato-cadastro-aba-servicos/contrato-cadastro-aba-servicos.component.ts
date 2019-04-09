import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Contrato, Servico, UnidadeMedida } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { ServicoService } from 'app/servicos/servico.service';
import { UnidadeMedidaService } from 'app/unidades-medidas/unidade-medida.service';
import { Util } from 'app/core/util';

@Component({
  selector: 'app-contrato-cadastro-aba-servicos',
  templateUrl: './contrato-cadastro-aba-servicos.component.html',
  styleUrls: ['./contrato-cadastro-aba-servicos.component.scss']
})
export class ContratoCadastroAbaServicosComponent implements OnInit {

  changeArrayOrder = Util.changeArrayOrder;
  moveArrayIndex = Util.moveArrayIndex;

  @ViewChild("nomesField") nomesField: ElementRef;

  _contrato : Contrato;

  servicos: any[];

  unidadesMedidas: any[];
  idUnidadeMedidaSelecionada: number;
  
  constructor(
    private servicoService: ServicoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
    this.carregarUnidadesMedidas();
  }

  carregarUnidadesMedidas() {
    this.unidadeMedidaService.listarUnidadesMedidasAtivas().then(lista => {
      this.unidadesMedidas = lista.map(unidadeMedida => ({ label: unidadeMedida.nome, value: unidadeMedida.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get contrato(): Contrato {
    return this._contrato;
  }

  @Input()
  set contrato(contrato: Contrato) {
    this._contrato = contrato;
    this.listarServicosPorContrato();
  }

  listarServicosPorContrato() {
    if (this.contrato.id) {
      this.servicoService.listarTodosPorContrato(this.contrato.id)
        .then(resultado => {
          this.servicos = resultado;
        })
        .catch(erro => this.errorHandler.handle(erro));
    }
  }
  
  salvarServicos() {
    let servicosCadastro: Array<Servico> = new Array<Servico>();
    
    let linhas = this.nomesField.nativeElement.value.split('\n');
    let linha: string;
    
    for(var i = 0;i < linhas.length;i++){
      linha = linhas[i].trim();
      if (linha.length > 0) {
        let unidadeMedida: UnidadeMedida = new UnidadeMedida();
        unidadeMedida.id = this.idUnidadeMedidaSelecionada;

        let servico: Servico = new Servico();
        servico.nome = linha;
        servico.contrato = this.contrato;
        servico.unidadeMedida = unidadeMedida;
        servicosCadastro.push(servico);
      }
    }
    this.adicionarServicos(servicosCadastro);
  }

  adicionarServicos(servicos: Array<Servico>) {
    this.servicoService.adicionarServicos(servicos)
      .then(servicosAdicionados => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.nomesField.nativeElement.value = "";
        this.listarServicosPorContrato();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvarOrdenacao() {
    this.servicoService.salvarOrdenacao(this.servicos)
      .then(servicosSalvos => {
        this.messageService.add({ severity: 'success', detail: 'Ordenação salva com sucesso!' });
        this.listarServicosPorContrato();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(servico: Servico) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(servico);
      }
    });
  }

  excluir(servico: Servico) {
    this.servicoService.excluir(servico.id)
      .then(() => {
        this.listarServicosPorContrato();
        this.messageService.add({ severity: 'success', detail: 'Registro excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  editar(servico: Servico) {
    console.log(servico.id);
  }

}
