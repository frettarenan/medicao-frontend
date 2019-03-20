import { Component, OnInit } from '@angular/core';
import { MatrizMedicaoFiltro, MatrizMedicaoService } from '../matriz-medicao.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { ConstrutoraService } from 'app/construtoras/construtora.service';
import { ObraService } from 'app/obras/obra.service';
import { ContratoService } from 'app/contratos/contrato.service';
import { MedicaoService } from 'app/medicoes/medicao.service';

@Component({
  selector: 'app-matrizes-medicoes-pesquisa',
  templateUrl: './matrizes-medicoes-pesquisa.component.html',
  styleUrls: ['./matrizes-medicoes-pesquisa.component.css']
})
export class MatrizesMedicoesPesquisaComponent implements OnInit {

  filtro = new MatrizMedicaoFiltro();
  
  construtoras: any[];
  idConstrutoraSelecionada: number;

  obras: any[];
  idObraSelecionada: number;

  contratos: any[];
  idContratoSelecionado: number;

  medicoes: any[];
  idMedicaoSelecionada: number;

  constructor(
    private matrizMedicaoService: MatrizMedicaoService,
    private construtoraService: ConstrutoraService,
    private obraService: ObraService,
    private contratoService: ContratoService,
    private medicaoService: MedicaoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Matriz de Medição');
    this.carregarConstrutoras();
  }

  carregarConstrutoras() {
    this.construtoraService.listarConstrutorasAtivas().then(lista => {
      this.construtoras = lista.map(construtora => ({ label: construtora.razaoSocial, value: construtora.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarObras() {
    this.obraService.listarObrasAtivasPorConstrutora(this.idConstrutoraSelecionada).then(lista => {
      this.obras = lista.map(obra => ({ label: obra.nome, value: obra.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarContratos() {
    this.contratoService.listarContratosAtivosPorObra(this.idObraSelecionada).then(lista => {
      this.contratos = lista.map(contrato => ({ label: contrato.descricao, value: contrato.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarMedicoes() {
    this.medicaoService.listarMedicoesAtivasPorContrato(this.idContratoSelecionado).then(lista => {
      this.medicoes = lista.map(medicao => ({ label: medicao.nome, value: medicao.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {
    /*this.filtro.pagina = pagina;

    this.construtoraService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.construtoras = resultado.construtoras;
      })
      .catch(erro => this.errorHandler.handle(erro));*/
  }

}
