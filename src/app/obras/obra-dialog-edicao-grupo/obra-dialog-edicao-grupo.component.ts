import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { Grupo } from 'app/core/model';

@Component({
  selector: 'app-obra-dialog-edicao-grupo',
  templateUrl: './obra-dialog-edicao-grupo.component.html',
  styleUrls: ['./obra-dialog-edicao-grupo.component.scss']
})
export class ObraDialogEdicaoGrupoComponent implements OnInit {

  grupo : Grupo;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.grupo = this.config.data.grupo;
  }

  salvar() {
    this.ref.close();
  }

}