import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { UsuarioFiltro, UsuarioService } from './../usuario.service';
import { ConstrutoraService } from 'app/construtoras/construtora.service';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.scss']
})
export class UsuariosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new UsuarioFiltro();
  usuarios = [];
  construtoras: any[];
  idConstrutoraSelecionada: number;
  @ViewChild('tabela') grid;

  constructor(
    private usuarioService: UsuarioService,
    private construtoraService: ConstrutoraService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Usuários');
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

    this.usuarioService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.usuarios = resultado.usuarios;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(usuario: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(usuario);
      }
    });
  }

  excluir(usuario: any) {
    this.usuarioService.excluir(usuario.id)
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

  alternarStatus(usuario: any): void {
    const novoStatus = !usuario.ativo;

    this.usuarioService.mudarStatus(usuario.id, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        usuario.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Registro ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
