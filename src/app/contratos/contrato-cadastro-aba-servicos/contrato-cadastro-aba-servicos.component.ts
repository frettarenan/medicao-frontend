import { Component, OnInit, Input } from '@angular/core';
import { Contrato } from 'app/core/model';

@Component({
  selector: 'app-contrato-cadastro-aba-servicos',
  templateUrl: './contrato-cadastro-aba-servicos.component.html',
  styleUrls: ['./contrato-cadastro-aba-servicos.component.scss']
})
export class ContratoCadastroAbaServicosComponent implements OnInit {

  _contrato : Contrato;

  constructor() { }

  ngOnInit() {
  }

  get contrato(): Contrato {
    return this._contrato;
  }
  
  @Input()
  set contrato(contrato: Contrato) {
    this._contrato = contrato;
    // this.listarGruposPorObra();
  }

}
