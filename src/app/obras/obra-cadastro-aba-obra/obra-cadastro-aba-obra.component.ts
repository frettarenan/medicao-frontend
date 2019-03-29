import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'app/seguranca/auth.service';
import { ConstrutoraService } from 'app/construtoras/construtora.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'app/usuarios/usuario.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Obra, Construtora, Usuario } from 'app/core/model';
import { FormControl } from '@angular/forms';
import { ObraService } from '../obra.service';

@Component({
  selector: 'app-obra-cadastro-aba-obra',
  templateUrl: './obra-cadastro-aba-obra.component.html',
  styleUrls: ['./obra-cadastro-aba-obra.component.scss']
})
export class ObraCadastroAbaObraComponent implements OnInit {

  _obra : Obra;

  construtoras: any[];
  idConstrutoraSelecionada: number;

  usuarios: any[];
  idUsuarioSelecionado: number;

  constructor(
    public auth: AuthService,
    private construtoraService: ConstrutoraService,
    private usuarioService: UsuarioService,
    private obraService: ObraService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarConstrutoras();
  }

  get obra(): Obra {
    return this._obra;
  }
  
  @Input()
  set obra(obra: Obra) {
    // console.log('prev value: ', this.obra.nome);
    // console.log('got name: ', obra.nome);
    this._obra = obra;
    if (this.isEdicao) {
      this.idConstrutoraSelecionada = this.obra.construtora.id;
      this.idUsuarioSelecionado = this.obra.usuarioResponsavel.id;
      this.carregarUsuarios();
    }
  }

  carregarConstrutoras() {
    if (this.auth.jwtPayload.usuario.administrador) {
      this.construtoraService.listarConstrutorasAtivas().then(lista => {
        this.construtoras = lista.map(construtora => ({ label: construtora.razaoSocial, value: construtora.id }));
      })
      .catch(erro => this.errorHandler.handle(erro));
    } else if (this.isCadastro) {
      this.carregarUsuarios();
    }
  }

  carregarUsuarios() {
    if (!this.auth.jwtPayload.usuario.administrador) {
      this.idConstrutoraSelecionada = this.auth.jwtPayload.usuario.construtora.id;
    }
    this.usuarioService.listarUsuariosAtivosPorConstrutora(this.idConstrutoraSelecionada).then(lista => {
      this.usuarios = lista.map(usuario => ({ label: usuario.nome, value: usuario.id }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.obra = new Obra();
    }.bind(this), 1);

    this.router.navigate(['/obras/novo']);
  }

  get isCadastro(): Boolean {
    return !this.isEdicao;
  }

  get isEdicao(): Boolean {
    return Boolean(this.obra.id);
  }

  salvarObra(form: FormControl) {
    let construtora = new Construtora();
    construtora.id = this.idConstrutoraSelecionada;
    this.obra.construtora = construtora;

    let usuario = new Usuario();
    usuario.id = this.idUsuarioSelecionado;
    this.obra.usuarioResponsavel = usuario;
    
    if (this.isEdicao) {
      this.atualizarObra(form);
    } else {
      this.adicionarObra(form);
    }
  }

  private adicionarObra(form: FormControl) {
    this.obra.ativo = true;
    this.obraService.adicionar(this.obra)
      .then(obraAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
        this.router.navigate(['/obras', obraAdicionada.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  private atualizarObra(form: FormControl) {
    this.obraService.atualizar(this.obra)
      .then(obra => {
        this.obra = obra;
        this.messageService.add({ severity: 'success', detail: 'Cadastro salvo com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
