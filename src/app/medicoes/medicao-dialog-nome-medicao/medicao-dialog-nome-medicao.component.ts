import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-medicao-dialog-nome-medicao',
  templateUrl: './medicao-dialog-nome-medicao.component.html',
  styleUrls: ['./medicao-dialog-nome-medicao.component.scss']
})
export class MedicaoDialogNomeMedicaoComponent implements OnInit {

  @ViewChild("nomeField") nomeField: ElementRef;

  mensagem = "";
  nome = "";

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.nomeField.nativeElement.focus();
    // console.log(this.config.data);
    this.mensagem = this.config.data.mensagem;
    this.nome = this.config.data.nome;
  }

  salvar() {
    this.ref.close(this.nome.trim());
  }

}
