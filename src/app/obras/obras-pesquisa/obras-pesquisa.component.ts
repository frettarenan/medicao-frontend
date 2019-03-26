import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { ConstrutoraService } from 'app/construtoras/construtora.service';
import { ObraService, ObraFiltro } from '../obra.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-obras-pesquisa',
  templateUrl: './obras-pesquisa.component.html',
  styleUrls: ['./obras-pesquisa.component.scss']
})
export class ObrasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new ObraFiltro();
  obras = [];
  construtoras: any[];
  idConstrutoraSelecionada: number;
  @ViewChild('tabela') grid;

  constructor(
    private obraService: ObraService,
    private construtoraService: ConstrutoraService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Obras');
    this.carregarConstrutoras();
  }

  carregarConstrutoras() {
    this.construtoraService.listarTodas().then(lista => {
      this.construtoras = lista.map(construtora => ({ label: construtora.razaoSocial, value: construtora.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {
    this.filtro.idConstrutora = this.idConstrutoraSelecionada;
    this.filtro.pagina = pagina;

    this.obraService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.obras = resultado.obras;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(obra: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(obra);
      }
    });
  }

  excluir(obra: any) {
    this.obraService.excluir(obra.id)
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

  alternarStatus(obra: any): void {
    const novoStatus = !obra.ativo;

    this.obraService.mudarStatus(obra.id, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        obra.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Registro ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
