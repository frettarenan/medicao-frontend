import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { Medicao } from 'app/core/model';

@Component({
  selector: 'app-medicao-dialog-nome-medicao',
  templateUrl: './medicao-dialog-nome-medicao.component.html',
  styleUrls: ['./medicao-dialog-nome-medicao.component.scss']
})
export class MedicaoDialogNomeMedicaoComponent implements OnInit {

  @ViewChild("nomeField") nomeField: ElementRef;

  mensagem = "";
  medicao: Medicao;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.nomeField.nativeElement.focus();
    // console.log(this.config.data);
    this.mensagem = this.config.data.mensagem;
    this.medicao = this.config.data.medicao;
  }

  salvar() {
    if (this.medicao.nome.trim() != '') {
      this.medicao.nome = this.medicao.nome.trim();
      this.ref.close(this.medicao);
    }
  }

}
