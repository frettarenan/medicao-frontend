import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConstrutoraFiltro, ConstrutoraService } from './../construtora.service';

@Component({
  selector: 'app-construtoras-pesquisa',
  templateUrl: './construtoras-pesquisa.component.html',
  styleUrls: ['./construtoras-pesquisa.component.css']
})
export class ConstrutorasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new ConstrutoraFiltro();
  construtoras = [];
  @ViewChild('tabela') grid;

  constructor(
    private construtoraService: ConstrutoraService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Construtoras');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.construtoraService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.construtoras = resultado.construtoras;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(construtora: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(construtora);
      }
    });
  }

  excluir(construtora: any) {
    this.construtoraService.excluir(construtora.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Registro excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(construtora: any): void {
    const novoStatus = !construtora.ativo;

    this.construtoraService.mudarStatus(construtora.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        construtora.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Registro ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
