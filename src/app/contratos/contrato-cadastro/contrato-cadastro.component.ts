import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Contrato } from 'app/core/model';
import { AuthService } from 'app/seguranca/auth.service';
import { ContratoService } from '../contrato.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contrato-cadastro',
  templateUrl: './contrato-cadastro.component.html',
  styleUrls: ['./contrato-cadastro.component.scss']
})
export class ContratoCadastroComponent implements OnInit {

  contrato = new Contrato();

  constructor(
    public auth: AuthService,
    private contratoService: ContratoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title
  ) { }

  ngOnInit() {
    const idContrato = this.route.snapshot.params['id'];
    if (idContrato) {
      this.title.setTitle('Edição de Contrato');
      this.carregarContrato(idContrato);
    } else {
      this.title.setTitle('Novo Contrato');
    }
  }

  carregarContrato(id: number) {
    this.contratoService.buscarPorId(id)
      .then(contrato => {
        this.contrato = contrato;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get isCadastro(): Boolean {
    return !this.isEdicao;
  }

  get isEdicao(): Boolean {
    return Boolean(this.contrato.id);
  }

}
