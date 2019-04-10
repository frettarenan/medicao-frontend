import { Component, OnInit } from '@angular/core';
import { Servico } from 'app/core/model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-contrato-dialog-edicao-servico',
  templateUrl: './contrato-dialog-edicao-servico.component.html',
  styleUrls: ['./contrato-dialog-edicao-servico.component.scss']
})
export class ContratoDialogEdicaoServicoComponent implements OnInit {

  servico : Servico;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.servico = this.config.data.servico;
  }

  salvar() {
    this.ref.close();
  }

}
