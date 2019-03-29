import { Component, OnInit, Input } from '@angular/core';
import { Contrato } from 'app/core/model';

@Component({
  selector: 'app-contrato-cadastro-aba-contrato',
  templateUrl: './contrato-cadastro-aba-contrato.component.html',
  styleUrls: ['./contrato-cadastro-aba-contrato.component.scss']
})
export class ContratoCadastroAbaContratoComponent implements OnInit {

  _contrato : Contrato;

  constructor() { }

  ngOnInit() {
  }

  get contrato(): Contrato {
    return this._contrato;
  }
  
  @Input()
  set contrato(contrato: Contrato) {
    // console.log('prev value: ', this._obra.nome);
    // console.log('got name: ', obra.nome);
    this._contrato = contrato;
    if (this._contrato.id) {
      // this.idConstrutoraSelecionada = this._obra.construtora.id;
      // this.idUsuarioSelecionado = this._obra.usuarioResponsavel.id;
      // this.carregarUsuarios();
    }
  }

}
