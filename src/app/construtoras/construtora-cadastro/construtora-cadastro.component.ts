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
  styleUrls: ['./construtora-cadastro.component.scss']
})
export class ConstrutoraCadastroComponent implements OnInit {

  construtora = new Construtora();

  constructor(
    private construtoraService: ConstrutoraService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title
  ) { }

  ngOnInit() {
    const idConstrutora = this.route.snapshot.params['id'];
    if (idConstrutora) {
      this.title.setTitle('Edição de Construtora');
      this.carregarConstrutora(idConstrutora);
    } else {
      this.title.setTitle('Nova Construtora');
    }
  }
  
  get isCadastro(): Boolean {
    return !this.isEdicao;
  }

  get isEdicao(): Boolean {
    return Boolean(this.construtora.id);
  }

  carregarConstrutora(id: number) {
    this.construtoraService.buscarPorId(id)
      .then(construtora => {
        this.construtora = construtora;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.isEdicao) {
      this.atualizarConstrutora(form);
    } else {
      this.adicionarConstrutora(form);
    }
  }

  private adicionarConstrutora(form: FormControl) {
    this.construtora.ativo = true;
    this.construtoraService.adicionar(this.construtora)
      .then(construtoraAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.router.navigate(['/construtoras', construtoraAdicionada.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  private atualizarConstrutora(form: FormControl) {
    this.construtoraService.atualizar(this.construtora)
      .then(construtora => {
        this.construtora = construtora;
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.construtora = new Construtora();
    }.bind(this), 1);

    this.router.navigate(['/construtoras/novo']);
  }

}