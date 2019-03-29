import { Component, OnInit, Input } from '@angular/core';
import { Contrato, Servico } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { ServicoService } from 'app/servicos/servico.service';

@Component({
  selector: 'app-contrato-cadastro-aba-servicos',
  templateUrl: './contrato-cadastro-aba-servicos.component.html',
  styleUrls: ['./contrato-cadastro-aba-servicos.component.scss']
})
export class ContratoCadastroAbaServicosComponent implements OnInit {

  _contrato : Contrato;

  servicos: any[];

  constructor(
    private servicoService: ServicoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
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
        let servico: Servico = new Servico();
        servico.nome = linha;
        servico.contrato = this.contrato;
        servico.unidadeMedida = null; // FIXME: colocar uma combo
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
