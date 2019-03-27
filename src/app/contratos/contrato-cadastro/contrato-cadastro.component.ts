import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contrato-cadastro',
  templateUrl: './contrato-cadastro.component.html',
  styleUrls: ['./contrato-cadastro.component.scss']
})
export class ContratoCadastroComponent implements OnInit {

  constructor(
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Novo Contrato');
  }

}
