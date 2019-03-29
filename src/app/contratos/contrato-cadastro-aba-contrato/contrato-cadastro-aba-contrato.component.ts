import { Component, OnInit, Input } from '@angular/core';
import { Contrato, Obra } from 'app/core/model';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/seguranca/auth.service';
import { ConstrutoraService } from 'app/construtoras/construtora.service';
import { ObraService } from 'app/obras/obra.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoService } from '../contrato.service';

@Component({
  selector: 'app-contrato-cadastro-aba-contrato',
  templateUrl: './contrato-cadastro-aba-contrato.component.html',
  styleUrls: ['./contrato-cadastro-aba-contrato.component.scss']
})
export class ContratoCadastroAbaContratoComponent implements OnInit {

  _contrato : Contrato;

  construtoras: any[];
  idConstrutoraSelecionada: number;

  obras: any[];
  idObraSelecionada: number;

  constructor(
    public auth: AuthService,
    private construtoraService: ConstrutoraService,
    private obraService: ObraService,
    private contratoService: ContratoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarConstrutoras();
  }

  get contrato(): Contrato {
    return this._contrato;
  }
  
  @Input()
  set contrato(contrato: Contrato) {
    this._contrato = contrato;
    if (this.isEdicao) {
      this.idConstrutoraSelecionada = this.contrato.obra.construtora.id;
      this.idObraSelecionada = this.contrato.obra.id;
      this.carregarObras();
    }
  }

  get isCadastro(): Boolean {
    return !this.isEdicao;
  }

  get isEdicao(): Boolean {
    return Boolean(this.contrato.id);
  }

  carregarConstrutoras() {
    if (this.auth.jwtPayload.usuario.administrador) {
      this.construtoraService.listarConstrutorasAtivas().then(lista => {
        this.construtoras = lista.map(construtora => ({ label: construtora.razaoSocial, value: construtora.id }));
      })
      .catch(erro => this.errorHandler.handle(erro));
    } else if (this.isCadastro) {
      this.carregarObras();
    }
  }

  carregarObras() {
    if (!this.auth.jwtPayload.usuario.administrador) {
      this.idConstrutoraSelecionada = this.auth.jwtPayload.usuario.construtora.id;
    }
    this.obraService.listarObrasAtivasPorConstrutora(this.idConstrutoraSelecionada).then(lista => {
      this.obras = lista.map(obra => ({ label: obra.nome, value: obra.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.contrato = new Contrato();
    }.bind(this), 1);

    this.router.navigate(['/contratos/novo']);
  }

  salvarContrato(form: FormControl) {
    let obra = new Obra();
    obra.id = this.idObraSelecionada;
    this.contrato.obra = obra;
    
    if (this.isEdicao) {
      this.atualizarContrato(form);
    } else {
      this.adicionarContrato(form);
    }
  }

  private adicionarContrato(form: FormControl) {
    this.contrato.ativo = true;
    this.contratoService.adicionar(this.contrato)
      .then(contratoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.router.navigate(['/contratos', contratoAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  private atualizarContrato(form: FormControl) {
    this.contratoService.atualizar(this.contrato)
      .then(contrato => {
        this.contrato = contrato;
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
