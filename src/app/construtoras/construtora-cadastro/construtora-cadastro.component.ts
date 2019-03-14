import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConstrutoraService } from './../construtora.service';
import { Construtora } from './../../core/model';

@Component({
  selector: 'app-construtora-cadastro',
  templateUrl: './construtora-cadastro.component.html',
  styleUrls: ['./construtora-cadastro.component.css']
})
export class ConstrutoraCadastroComponent implements OnInit {

  construtora = new Construtora();

  constructor(
    private construtoraService: ConstrutoraService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const codigoConstrutora = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Construtora');

    if (codigoConstrutora) {
      this.carregarConstrutora(codigoConstrutora);
    }
  }

  get editando() {
    return Boolean(this.construtora.codigo);
  }

  carregarConstrutora(codigo: number) {
    this.construtoraService.buscarPorCodigo(codigo)
      .then(construtora => {
        this.construtora = construtora;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarConstrutora(form);
    } else {
      this.adicionarConstrutora(form);
    }
  }

  adicionarConstrutora(form: FormControl) {
    this.construtoraService.adicionar(this.construtora)
      .then(construtoraAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!!' });
        this.router.navigate(['/construtoras', construtoraAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarConstrutora(form: FormControl) {
    this.construtoraService.atualizar(this.construtora)
      .then(construtora => {
        this.construtora = construtora;

        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.construtora = new Construtora();
    }.bind(this), 1);

    this.router.navigate(['/construtoras/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle('Edição de Construtora');
  }

}