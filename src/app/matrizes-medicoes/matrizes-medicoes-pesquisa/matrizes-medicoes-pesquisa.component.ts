import { Component, OnInit } from '@angular/core';
import { MatrizMedicaoFiltro, MatrizMedicaoService } from '../matriz-medicao.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

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

  contratros: any[];
  idContratoSelecionado: number;

  medicoes: any[];
  idMedicaoSelecionada: number;

  constructor(
    private matrizMedicaoService: MatrizMedicaoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Matriz de Medição');
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
