import { Component, OnInit, Input } from '@angular/core';
import { Contrato, Servico, UnidadeMedida } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { ServicoService } from 'app/servicos/servico.service';
import { UnidadeMedidaService } from 'app/unidades-medidas/unidade-medida.service';

@Component({
  selector: 'app-contrato-cadastro-aba-servicos',
  templateUrl: './contrato-cadastro-aba-servicos.component.html',
  styleUrls: ['./contrato-cadastro-aba-servicos.component.scss']
})
export class ContratoCadastroAbaServicosComponent implements OnInit {

  _contrato : Contrato;

  servicos: any[];

  unidadesMedidas: any[];
  idUnidadeMedidaSelecionada: number;
  
  constructor(
    private servicoService: ServicoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService
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
  
  salvarServicos(nomes: FormControl) {
    let servicosCadastro: Array<Servico> = new Array<Servico>();
    
    let linhas = nomes.value.split('\n');
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
        this.listarServicosPorContrato();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
