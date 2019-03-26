import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'app/seguranca/auth.service';
import { ContratoService, ContratoFiltro } from '../contrato.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { ObraService } from 'app/obras/obra.service';
import { ConstrutoraService } from 'app/construtoras/construtora.service';

@Component({
  selector: 'app-contratos-pesquisa',
  templateUrl: './contratos-pesquisa.component.html',
  styleUrls: ['./contratos-pesquisa.component.scss']
})
export class ContratosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new ContratoFiltro();
  contratos = [];
  construtoras: any[];
  idConstrutoraSelecionada: number;
  obras: any[];
  idObraSelecionada: number;
  @ViewChild('tabela') grid;

  constructor(
    public auth: AuthService,
    private contratoService: ContratoService,
    private construtoraService: ConstrutoraService,
    private obraService: ObraService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Contratos');
    this.carregarConstrutoras();
  }

  carregarConstrutoras() {
    if (this.auth.jwtPayload.usuario.administrador) {
      this.construtoraService.listarTodas().then(lista => {
        this.construtoras = lista.map(construtora => ({ label: construtora.razaoSocial, value: construtora.id }));
      })
      .catch(erro => this.errorHandler.handle(erro));
    } else {
      this.carregarObras();
    }
  }

  carregarObras() {
    if (!this.auth.jwtPayload.usuario.administrador) {
      this.idConstrutoraSelecionada = this.auth.jwtPayload.usuario.construtora.id;
    }
    this.obraService.listarTodasPorConstrutora(this.idConstrutoraSelecionada).then(lista => {
      this.obras = lista.map(obra => ({ label: obra.nome, value: obra.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  pesquisar(pagina = 0) {
    this.filtro.idConstrutora = this.idConstrutoraSelecionada;
    this.filtro.idObra = this.idObraSelecionada;
    this.filtro.pagina = pagina;

    this.contratoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.contratos = resultado.contratos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(contrato: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(contrato);
      }
    });
  }

  excluir(contrato: any) {
    this.contratoService.excluir(contrato.id)
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

  alternarStatus(contrato: any): void {
    const novoStatus = !contrato.ativo;

    this.contratoService.mudarStatus(contrato.id, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        contrato.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Registro ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
