import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-obra-cadastro',
  templateUrl: './obra-cadastro.component.html',
  styleUrls: ['./obra-cadastro.component.scss']
})
export class ObraCadastroComponent implements OnInit {

  constructor(
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Nova Obra');
  }

}
